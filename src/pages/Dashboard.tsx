import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Recycle, 
  TrendingUp, 
  Award, 
  Zap, 
  Target, 
  Clock,
  Package,
  Leaf,
  Users,
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard = ({ onPageChange }: DashboardProps) => {
  const quickStats = [
    {
      title: 'Items Submitted',
      value: '24',
      change: '+12%',
      icon: Package,
      color: 'cyber'
    },
    {
      title: 'CO₂ Saved',
      value: '156 kg',
      change: '+18%',
      icon: Leaf,
      color: 'eco'
    },
    {
      title: 'Credits Earned',
      value: '342',
      change: '+25%',
      icon: Award,
      color: 'electric'
    },
    {
      title: 'Compliance Score',
      value: '98.5%',
      change: '+2%',
      icon: Target,
      color: 'cyber'
    }
  ];

  const recentActivity = [
    {
      type: 'Submitted',
      item: 'MacBook Pro 2019',
      time: '2 hours ago',
      status: 'Processing',
      icon: Package
    },
    {
      type: 'Earned',
      item: '15 Carbon Credits',
      time: '1 day ago',
      status: 'Completed',
      icon: Award
    },
    {
      type: 'Joined',
      item: 'Green Tech Campaign',
      time: '3 days ago',
      status: 'Active',
      icon: Users
    },
    {
      type: 'Generated',
      item: 'Monthly Report',
      time: '1 week ago',
      status: 'Downloaded',
      icon: BarChart3
    }
  ];

  const goals = [
    {
      title: 'Monthly Recycling Goal',
      current: 18,
      target: 25,
      unit: 'devices'
    },
    {
      title: 'Carbon Credit Target',
      current: 342,
      target: 500,
      unit: 'credits'
    },
    {
      title: 'Sustainability Score',
      current: 85,
      target: 95,
      unit: '%'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-cyber mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Monitor your e-waste management progress and environmental impact</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card hover-lift group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-orbitron font-bold text-cyber-blue-light">{stat.value}</p>
                  <p className="text-sm text-eco-green">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'cyber' ? 'bg-gradient-cyber' :
                  stat.color === 'eco' ? 'bg-gradient-eco' :
                  'bg-electric-purple'
                }`}>
                  <Icon className="w-6 h-6 text-background" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Goals Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <Target className="w-5 h-5" />
                Progress Towards Goals
              </CardTitle>
              <CardDescription>Track your environmental impact goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">{goal.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2"
                  />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-cyber-blue-light">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => onPageChange('submit')}
                className="w-full bg-gradient-cyber text-background hover:shadow-cyber justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit E-Waste
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onPageChange('items')}
                className="w-full border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10 justify-start"
              >
                <Package className="w-4 h-4 mr-2" />
                View My Items
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onPageChange('analytics')}
                className="w-full border-eco-green text-eco-green hover:bg-eco-green/10 justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onPageChange('campaigns')}
                className="w-full border-electric-purple text-electric-purple hover:bg-electric-purple/10 justify-start"
              >
                <Users className="w-4 h-4 mr-2" />
                Join Campaigns
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-cyber-blue-light">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </span>
                <Button variant="ghost" size="sm" className="text-eco-green">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
              <CardDescription>Your latest actions and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-surface-tertiary/50 hover:bg-surface-tertiary transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center">
                        <Icon className="w-5 h-5 text-background" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{activity.type}</span>
                          <span className="text-cyber-blue-light">{activity.item}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'Completed' ? 'bg-eco-green/20 text-eco-green' :
                        activity.status === 'Processing' ? 'bg-cyber-blue/20 text-cyber-blue' :
                        activity.status === 'Active' ? 'bg-electric-purple/20 text-electric-purple' :
                        'bg-surface-tertiary text-muted-foreground'
                      }`}>
                        {activity.status}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Smart Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card className="glass-card border-animated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyber">
              <Zap className="w-5 h-5" />
              Smart Categorization & AI Insights
            </CardTitle>
            <CardDescription>
              Advanced AI algorithms automatically categorize your e-waste and provide intelligent insights
              for optimal disposal methods and environmental impact prediction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-surface-tertiary/30">
                <div className="w-12 h-12 bg-gradient-cyber rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-background" />
                </div>
                <h4 className="font-medium text-cyber-blue-light mb-2">Auto-Categorization</h4>
                <p className="text-sm text-muted-foreground">
                  AI identifies device types and suggests optimal processing methods
                </p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-surface-tertiary/30">
                <div className="w-12 h-12 bg-gradient-eco rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-background" />
                </div>
                <h4 className="font-medium text-eco-green mb-2">Impact Prediction</h4>
                <p className="text-sm text-muted-foreground">
                  Predict environmental benefits before disposal
                </p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-surface-tertiary/30">
                <div className="w-12 h-12 bg-electric-purple rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Target className="w-6 h-6 text-background" />
                </div>
                <h4 className="font-medium text-electric-purple mb-2">Smart Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Personalized suggestions for maximizing your impact
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;