import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ParticleBackground from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Settings, 
  BarChart3,
  Bell,
  Shield,
  Activity
} from 'lucide-react';

export const AdminPanel = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [ewasteItems, setEwasteItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ewasteRes, usersRes, logsRes] = await Promise.all([
        supabase.from('ewaste_items').select(`
          *,
          profiles!ewaste_items_user_id_fkey(display_name, email)
        `).eq('status', 'pending'),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('admin_logs').select(`
          *,
          profiles!admin_logs_admin_id_fkey(display_name)
        `).order('created_at', { ascending: false }).limit(50)
      ]);

      if (ewasteRes.data) setEwasteItems(ewasteRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (logsRes.data) setAdminLogs(logsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEwasteAction = async (itemId: string, action: 'approve' | 'reject', item: any) => {
    try {
      const response = await supabase.functions.invoke('admin-actions', {
        body: {
          action: action === 'approve' ? 'approve_ewaste' : 'reject_ewaste',
          targetId: itemId,
          data: {
            userId: item.user_id,
            itemName: item.item_name,
            creditAmount: 10,
            reason: action === 'reject' ? 'Quality standards not met' : undefined
          }
        }
      });

      if (response.error) throw response.error;

      toast({
        title: `Item ${action}d`,
        description: `E-waste item has been ${action}d successfully.`,
        variant: "default"
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} item`,
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await supabase.functions.invoke('admin-actions', {
        body: {
          action: 'update_user_role',
          targetId: userId,
          data: { newRole }
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Role Updated",
        description: "User role has been updated successfully.",
        variant: "default"
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>You don't have admin privileges.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-background">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">Manage users, e-waste items, and system settings</p>
          </div>

          <Tabs defaultValue="ewaste" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="ewaste" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                E-waste Items
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity Logs
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ewaste" className="space-y-4">
              <Card className="border-primary/20 bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Pending E-waste Items
                  </CardTitle>
                  <CardDescription>Review and approve e-waste submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ewasteItems.map((item: any) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.item_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {item.profiles?.display_name} ({item.profiles?.email})
                            </p>
                            <p className="text-sm">Category: {item.category}</p>
                            <p className="text-sm">Condition: {item.condition}</p>
                          </div>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEwasteAction(item.id, 'approve', item)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEwasteAction(item.id, 'reject', item)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    {ewasteItems.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No pending e-waste items to review.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="border-primary/20 bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{user.display_name || 'Unknown'}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            <Badge variant={user.is_active ? 'outline' : 'destructive'}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateUserRole(user.user_id, user.role === 'admin' ? 'user' : 'admin')}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card className="border-primary/20 bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Admin actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {adminLogs.map((log: any) => (
                      <div key={log.id} className="border-l-2 border-primary/20 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{log.action.replace('_', ' ').toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">
                              by {log.profiles?.display_name} on {log.target_table}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-primary/20 bg-card/80 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{users.length}</p>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 bg-card/80 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Pending Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-500">{ewasteItems.length}</p>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 bg-card/80 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-500">{adminLogs.length}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};