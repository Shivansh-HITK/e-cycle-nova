import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Award, 
  Coins, 
  TrendingUp, 
  Gift, 
  ShoppingCart,
  Zap,
  Leaf,
  Target,
  CheckCircle,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

interface CarbonCreditsProps {
  onPageChange: (page: string) => void;
}

const CarbonCredits = ({ onPageChange }: CarbonCreditsProps) => {
  const { toast } = useToast();
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const userCredits = {
    total: 2143,
    available: 1847,
    pending: 296,
    redeemed: 1205
  };

  const recentEarnings = [
    {
      device: 'iPhone 12 Pro',
      credits: 25,
      date: '2024-01-24',
      status: 'completed'
    },
    {
      device: 'Dell XPS 13',
      credits: 45,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      device: 'Samsung TV 55"',
      credits: 35,
      date: '2024-01-18',
      status: 'pending'
    },
    {
      device: 'MacBook Air M1',
      credits: 40,
      date: '2024-01-15',
      status: 'completed'
    }
  ];

  const rewardTiers = [
    {
      name: 'Eco Warrior',
      requirement: 1000,
      benefits: ['5% Bonus Credits', 'Priority Processing', 'Eco Badge'],
      color: 'eco',
      achieved: true
    },
    {
      name: 'Green Champion',
      requirement: 2500,
      benefits: ['10% Bonus Credits', 'VIP Support', 'Champion Badge', 'Free Pickup'],
      color: 'cyber',
      achieved: false
    },
    {
      name: 'Planet Protector',
      requirement: 5000,
      benefits: ['15% Bonus Credits', 'Premium Features', 'Protector Badge', 'Carbon Certificate'],
      color: 'electric',
      achieved: false
    }
  ];

  const marketplaceItems = [
    {
      id: 1,
      name: 'Amazon Gift Card',
      cost: 500,
      value: '$25',
      category: 'gift-card',
      image: '🎁',
      popular: true
    },
    {
      id: 2,
      name: 'Plant a Tree',
      cost: 100,
      value: '1 Tree',
      category: 'environmental',
      image: '🌳',
      popular: false
    },
    {
      id: 3,
      name: 'Green Energy Offset',
      cost: 200,
      value: '50 kWh',
      category: 'environmental',
      image: '⚡',
      popular: true
    },
    {
      id: 4,
      name: 'Eco-Friendly Products',
      cost: 300,
      value: '$15 Credit',
      category: 'products',
      image: '♻️',
      popular: false
    },
    {
      id: 5,
      name: 'Carbon Offset Certificate',
      cost: 750,
      value: '1 Ton CO₂',
      category: 'certificate',
      image: '📜',
      popular: true
    },
    {
      id: 6,
      name: 'EcoTrace Premium',
      cost: 1000,
      value: '6 Months',
      category: 'premium',
      image: '👑',
      popular: false
    }
  ];

  const handleRedemption = async (item: any) => {
    if (userCredits.available < item.cost) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${item.cost - userCredits.available} more credits to redeem this item.`,
        variant: "destructive"
      });
      return;
    }

    setIsRedeeming(true);
    setSelectedReward(item);

    // Simulate redemption process
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Redemption Successful!",
      description: `${item.name} has been redeemed. Check your email for details.`,
    });

    setIsRedeeming(false);
    setSelectedReward(null);
  };

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-cyber mb-2">Carbon Credits Hub</h1>
        <p className="text-muted-foreground text-lg">Earn, track, and redeem credits for your environmental impact</p>
      </motion.div>

      {/* Credit Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="glass-card border-eco-green/30">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-eco-green mx-auto mb-2" />
            <div className="text-3xl font-orbitron font-bold text-eco-green">{userCredits.total.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Earned</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-cyber-blue/30">
          <CardContent className="p-6 text-center">
            <Coins className="w-8 h-8 text-cyber-blue mx-auto mb-2" />
            <div className="text-3xl font-orbitron font-bold text-cyber-blue">{userCredits.available.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-orbitron font-bold text-yellow-500">{userCredits.pending.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-electric-purple/30">
          <CardContent className="p-6 text-center">
            <Gift className="w-8 h-8 text-electric-purple mx-auto mb-2" />
            <div className="text-3xl font-orbitron font-bold text-electric-purple">{userCredits.redeemed.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Redeemed</div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reward Tiers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <Star className="w-5 h-5" />
                Reward Tiers
              </CardTitle>
              <CardDescription>Unlock exclusive benefits as you earn more credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {rewardTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    tier.achieved 
                      ? 'border-eco-green bg-eco-green/10' 
                      : 'border-border bg-surface-tertiary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-orbitron font-semibold ${
                      tier.achieved ? 'text-eco-green' : 'text-cyber-blue-light'
                    }`}>
                      {tier.name}
                    </h4>
                    {tier.achieved && <CheckCircle className="w-5 h-5 text-eco-green" />}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {tier.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  {!tier.achieved && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-cyber-blue">
                          {Math.round((userCredits.total / tier.requirement) * 100)}%
                        </span>
                      </div>
                      <Progress value={(userCredits.total / tier.requirement) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {tier.requirement - userCredits.total} credits to unlock
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Marketplace */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <ShoppingCart className="w-5 h-5" />
                Credit Marketplace
              </CardTitle>
              <CardDescription>Redeem your credits for rewards and environmental actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketplaceItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="relative group"
                  >
                    <Card className="glass hover-lift transition-all duration-300 border-border group-hover:border-cyber-blue/50">
                      {item.popular && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <Badge className="bg-gradient-cyber text-background">Popular</Badge>
                        </div>
                      )}
                      
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">{item.image}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{item.name}</h4>
                            <p className="text-sm text-eco-green font-medium">{item.value}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-cyber-blue" />
                            <span className="font-orbitron font-semibold text-cyber-blue">
                              {item.cost}
                            </span>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                disabled={userCredits.available < item.cost}
                                className={
                                  userCredits.available >= item.cost
                                    ? "bg-gradient-eco text-background hover:shadow-eco"
                                    : "opacity-50 cursor-not-allowed"
                                }
                              >
                                Redeem
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-cyber-blue-light">Confirm Redemption</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to redeem {item.cost} credits for {item.name}?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center justify-center p-8 bg-surface-tertiary/30 rounded-lg">
                                  <div className="text-center">
                                    <div className="text-4xl mb-2">{item.image}</div>
                                    <h3 className="font-semibold text-cyber-blue-light">{item.name}</h3>
                                    <p className="text-eco-green font-medium">{item.value}</p>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center p-4 bg-surface-secondary rounded-lg">
                                  <span className="text-muted-foreground">Cost:</span>
                                  <div className="flex items-center gap-2">
                                    <Coins className="w-4 h-4 text-cyber-blue" />
                                    <span className="font-orbitron font-bold text-cyber-blue">{item.cost}</span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center p-4 bg-surface-secondary rounded-lg">
                                  <span className="text-muted-foreground">Remaining Credits:</span>
                                  <span className="font-orbitron font-bold text-eco-green">
                                    {userCredits.available - item.cost}
                                  </span>
                                </div>
                                
                                <Button
                                  onClick={() => handleRedemption(item)}
                                  disabled={isRedeeming}
                                  className="w-full bg-gradient-eco text-background hover:shadow-eco"
                                >
                                  {isRedeeming ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Confirm Redemption
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-3"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-cyber-blue-light">
                  <TrendingUp className="w-5 h-5" />
                  Recent Credit Earnings
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onPageChange('analytics')}
                  className="text-eco-green"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
              <CardDescription>Track your latest credit earnings from device submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEarnings.map((earning, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-tertiary/50 hover:bg-surface-tertiary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-cyber rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-background" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{earning.device}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(earning.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-orbitron font-bold text-eco-green">
                          +{earning.credits}
                        </div>
                        <div className="text-xs text-muted-foreground">credits</div>
                      </div>
                      
                      <Badge className={
                        earning.status === 'completed' 
                          ? 'bg-eco-green/20 text-eco-green' 
                          : 'bg-yellow-500/20 text-yellow-500'
                      }>
                        {earning.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CarbonCredits;