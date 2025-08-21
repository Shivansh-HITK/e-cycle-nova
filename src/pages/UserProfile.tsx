import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  Bell, 
  Shield, 
  Award,
  TrendingUp,
  Leaf,
  Target,
  Camera,
  Edit,
  Save,
  Calendar,
  Zap,
  Globe,
  Star
} from 'lucide-react';

interface UserProfileProps {
  onPageChange: (page: string) => void;
}

const UserProfile = ({ onPageChange }: UserProfileProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    bio: 'Environmental enthusiast passionate about sustainable technology and e-waste management.',
    joinDate: '2023-06-15',
    avatar: null as File | null
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    campaignUpdates: true,
    weeklyReports: true,
    privacyMode: false,
    dataSharing: true
  });

  const userStats = {
    totalDevices: 24,
    carbonCredits: 2143,
    co2Saved: 156.7,
    rank: 127,
    streakDays: 45,
    campaignsJoined: 8,
    impactScore: 892,
    level: 'Eco Champion'
  };

  const achievements = [
    {
      id: 1,
      title: 'First Submission',
      description: 'Submitted your first e-waste device',
      icon: '🎯',
      earned: true,
      earnedDate: '2023-06-20'
    },
    {
      id: 2,
      title: 'Eco Warrior',
      description: 'Earned 1000+ carbon credits',
      icon: '🌟',
      earned: true,
      earnedDate: '2023-08-15'
    },
    {
      id: 3,
      title: 'Campaign Leader',
      description: 'Joined 5+ environmental campaigns',
      icon: '🏆',
      earned: true,
      earnedDate: '2023-10-12'
    },
    {
      id: 4,
      title: 'Green Streak',
      description: 'Maintain 30-day activity streak',
      icon: '🔥',
      earned: true,
      earnedDate: '2023-11-05'
    },
    {
      id: 5,
      title: 'Planet Protector',
      description: 'Save 100kg+ CO₂ emissions',
      icon: '🌍',
      earned: true,
      earnedDate: '2024-01-10'
    },
    {
      id: 6,
      title: 'Tech Recycler',
      description: 'Recycle 50+ devices',
      icon: '♻️',
      earned: false,
      progress: 48
    }
  ];

  const monthlyActivity = [
    { month: 'Aug', devices: 4, credits: 89 },
    { month: 'Sep', devices: 6, credits: 156 },
    { month: 'Oct', devices: 3, credits: 78 },
    { month: 'Nov', devices: 5, credits: 134 },
    { month: 'Dec', devices: 4, credits: 98 },
    { month: 'Jan', devices: 2, credits: 56 }
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsEditing(false);
    setIsSaving(false);
    
    toast({
      title: "Profile Updated!",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfile(prev => ({ ...prev, avatar: event.target.files![0] }));
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-cyber mb-2">User Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your profile and track your environmental impact</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-background">
            Profile
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-background">
            Statistics
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-background">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-background">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-cyber-blue-light">Profile Information</CardTitle>
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      disabled={isSaving}
                      className={isEditing ? "border-eco-green text-eco-green hover:bg-eco-green/10" : "bg-gradient-cyber text-background hover:shadow-cyber"}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-cyber rounded-full flex items-center justify-center text-background text-2xl font-orbitron font-bold">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {isEditing && (
                        <div className="absolute -bottom-2 -right-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label htmlFor="avatar-upload">
                            <Button size="sm" className="w-8 h-8 p-0 rounded-full bg-eco-green text-background hover:bg-eco-green/80" asChild>
                              <div>
                                <Camera className="w-4 h-4" />
                              </div>
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-orbitron font-semibold text-cyber-blue-light">{profile.name}</h3>
                      <p className="text-muted-foreground">{userStats.level}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-eco-green/20 text-eco-green">Level {Math.floor(userStats.impactScore / 200) + 1}</Badge>
                        <Badge className="bg-electric-purple/20 text-electric-purple">Rank #{userStats.rank}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-cyber-blue-light">Quick Stats</CardTitle>
                  <CardDescription>Your environmental impact at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-cyber-blue/10 rounded-lg">
                      <div className="text-2xl font-orbitron font-bold text-cyber-blue">{userStats.totalDevices}</div>
                      <div className="text-xs text-muted-foreground">Devices</div>
                    </div>
                    <div className="text-center p-3 bg-eco-green/10 rounded-lg">
                      <div className="text-2xl font-orbitron font-bold text-eco-green">{userStats.carbonCredits}</div>
                      <div className="text-xs text-muted-foreground">Credits</div>
                    </div>
                    <div className="text-center p-3 bg-electric-purple/10 rounded-lg">
                      <div className="text-2xl font-orbitron font-bold text-electric-purple">{userStats.co2Saved}kg</div>
                      <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                    </div>
                    <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                      <div className="text-2xl font-orbitron font-bold text-orange-500">{userStats.streakDays}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Impact Score</span>
                        <span className="text-eco-green font-medium">{userStats.impactScore}/1000</span>
                      </div>
                      <Progress value={(userStats.impactScore / 1000) * 100} className="h-2" />
                    </div>
                    
                    <div className="text-center pt-2">
                      <div className="text-xs text-muted-foreground">Member since</div>
                      <div className="font-medium">{new Date(profile.joinDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                    <TrendingUp className="w-5 h-5" />
                    Monthly Activity
                  </CardTitle>
                  <CardDescription>Your recycling activity over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyActivity.map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between p-3 bg-surface-tertiary/30 rounded-lg">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-cyber-blue">{month.devices} devices</div>
                          <div className="text-eco-green">{month.credits} credits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                    <Target className="w-5 h-5" />
                    Impact Breakdown
                  </CardTitle>
                  <CardDescription>Detailed view of your environmental contributions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-eco-green/10 rounded-lg">
                      <Leaf className="w-6 h-6 text-eco-green mx-auto mb-2" />
                      <div className="text-lg font-orbitron font-bold text-eco-green">{userStats.co2Saved}kg</div>
                      <div className="text-xs text-muted-foreground">Total CO₂ Saved</div>
                    </div>
                    <div className="text-center p-4 bg-cyber-blue/10 rounded-lg">
                      <Zap className="w-6 h-6 text-cyber-blue mx-auto mb-2" />
                      <div className="text-lg font-orbitron font-bold text-cyber-blue">342 kWh</div>
                      <div className="text-xs text-muted-foreground">Energy Saved</div>
                    </div>
                    <div className="text-center p-4 bg-electric-purple/10 rounded-lg">
                      <Globe className="w-6 h-6 text-electric-purple mx-auto mb-2" />
                      <div className="text-lg font-orbitron font-bold text-electric-purple">87%</div>
                      <div className="text-xs text-muted-foreground">Material Recovery</div>
                    </div>
                    <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                      <Award className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <div className="text-lg font-orbitron font-bold text-orange-500">{userStats.campaignsJoined}</div>
                      <div className="text-xs text-muted-foreground">Campaigns Joined</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Global Rankings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Overall Rank</span>
                        <span className="font-bold text-electric-purple">#{userStats.rank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Regional Rank</span>
                        <span className="font-bold text-eco-green">#12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category Rank</span>
                        <span className="font-bold text-cyber-blue">#8</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                  <Award className="w-5 h-5" />
                  Achievements & Badges
                </CardTitle>
                <CardDescription>Your accomplishments and milestones in e-waste management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`p-6 rounded-lg border-2 text-center ${
                        achievement.earned 
                          ? 'border-eco-green bg-eco-green/10' 
                          : 'border-border bg-surface-tertiary/30'
                      }`}
                    >
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h4 className={`font-orbitron font-semibold mb-2 ${
                        achievement.earned ? 'text-eco-green' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {achievement.description}
                      </p>
                      
                      {achievement.earned ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-eco-green">
                          <Star className="w-3 h-3" />
                          Earned {new Date(achievement.earnedDate!).toLocaleDateString()}
                        </div>
                      ) : achievement.progress ? (
                        <div className="space-y-2">
                          <Progress value={(achievement.progress / 50) * 100} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {achievement.progress}/50 Progress
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">Not yet earned</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Control how you receive updates and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive updates via email</div>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">Get text message alerts</div>
                    </div>
                    <Switch
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Campaign Updates</div>
                      <div className="text-sm text-muted-foreground">Updates on joined campaigns</div>
                    </div>
                    <Switch
                      checked={preferences.campaignUpdates}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, campaignUpdates: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Reports</div>
                      <div className="text-sm text-muted-foreground">Weekly impact summaries</div>
                    </div>
                    <Switch
                      checked={preferences.weeklyReports}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                    <Shield className="w-5 h-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Manage your privacy and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Privacy Mode</div>
                      <div className="text-sm text-muted-foreground">Hide profile from public rankings</div>
                    </div>
                    <Switch
                      checked={preferences.privacyMode}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, privacyMode: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Data Sharing</div>
                      <div className="text-sm text-muted-foreground">Share anonymized impact data</div>
                    </div>
                    <Switch
                      checked={preferences.dataSharing}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, dataSharing: checked }))}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="font-medium">Account Actions</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10">
                        <Settings className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
                        <Shield className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;