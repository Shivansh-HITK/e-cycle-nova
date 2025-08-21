import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Leaf, 
  Users, 
  Target, 
  Calendar,
  Share2,
  Heart,
  Zap,
  Globe,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
  TreePine,
  Recycle,
  Battery,
  Smartphone
} from 'lucide-react';

interface GreenCampaignsProps {
  onPageChange: (page: string) => void;
}

const GreenCampaigns = ({ onPageChange }: GreenCampaignsProps) => {
  const { toast } = useToast();
  const [joinedCampaigns, setJoinedCampaigns] = useState<string[]>(['1', '3']);

  const activeCampaigns = [
    {
      id: '1',
      title: 'Clean Tech Revolution',
      description: 'Join millions in recycling old smartphones and tablets to reduce electronic waste in landfills.',
      category: 'Device Recycling',
      icon: Smartphone,
      target: 10000,
      current: 7234,
      participants: 2456,
      endDate: '2024-03-15',
      location: 'Global',
      rewards: ['500 Credits', 'Eco Badge', 'Tree Planted'],
      featured: true,
      organizer: 'GreenTech Alliance',
      impact: 'Prevent 15 tons of e-waste from landfills'
    },
    {
      id: '2',
      title: 'Zero Waste Campus',
      description: 'Transform your educational institution into a zero-waste campus through responsible e-waste management.',
      category: 'Education',
      icon: TreePine,
      target: 500,
      current: 342,
      participants: 89,
      endDate: '2024-02-28',
      location: 'Universities Worldwide',
      rewards: ['300 Credits', 'Campus Badge', 'Scholarship Fund'],
      featured: false,
      organizer: 'Eco Education Initiative',
      impact: 'Educate 50,000 students on sustainability'
    },
    {
      id: '3',
      title: 'Battery Recycling Drive',
      description: 'Collect and properly dispose of old batteries to prevent toxic chemicals from contaminating soil.',
      category: 'Battery Disposal',
      icon: Battery,
      target: 5000,
      current: 3567,
      participants: 1234,
      endDate: '2024-04-10',
      location: 'Metropolitan Areas',
      rewards: ['400 Credits', 'Battery Badge', 'Clean Energy Kit'],
      featured: true,
      organizer: 'Clean Energy Coalition',
      impact: 'Safely dispose of 2 tons of batteries'
    },
    {
      id: '4',
      title: 'Corporate Green Challenge',
      description: 'Compete with other companies to achieve the highest e-waste recycling rates and sustainability scores.',
      category: 'Corporate',
      icon: Target,
      target: 1000,
      current: 234,
      participants: 45,
      endDate: '2024-05-20',
      location: 'Corporate Offices',
      rewards: ['1000 Credits', 'Corporate Badge', 'Sustainability Award'],
      featured: false,
      organizer: 'Business for Environment',
      impact: 'Influence corporate sustainability policies'
    },
    {
      id: '5',
      title: 'Ocean Protection Initiative',
      description: 'Prevent electronic waste from reaching our oceans by promoting proper recycling in coastal communities.',
      category: 'Ocean Conservation',
      icon: Globe,
      target: 2500,
      current: 1890,
      participants: 567,
      endDate: '2024-06-05',
      location: 'Coastal Regions',
      rewards: ['600 Credits', 'Ocean Badge', 'Marine Life Adoption'],
      featured: true,
      organizer: 'Ocean Conservation Society',
      impact: 'Protect 100 miles of coastline'
    },
    {
      id: '6',
      title: 'Youth Climate Action',
      description: 'Empower young activists to lead the charge in responsible e-waste management in their communities.',
      category: 'Youth Engagement',
      icon: Zap,
      target: 1500,
      current: 987,
      participants: 298,
      endDate: '2024-07-15',
      location: 'Youth Centers',
      rewards: ['350 Credits', 'Youth Leader Badge', 'Climate Summit Invite'],
      featured: false,
      organizer: 'Youth Climate Network',
      impact: 'Train 500 youth climate leaders'
    }
  ];

  const handleJoinCampaign = (campaignId: string) => {
    if (joinedCampaigns.includes(campaignId)) {
      toast({
        title: "Already Joined!",
        description: "You're already participating in this campaign.",
        variant: "destructive"
      });
      return;
    }

    setJoinedCampaigns(prev => [...prev, campaignId]);
    toast({
      title: "Successfully Joined!",
      description: "Welcome to the campaign! You'll receive updates and can start contributing.",
    });
  };

  const handleShare = async (campaign: any) => {
    const shareData = {
      title: `Join the ${campaign.title} Campaign`,
      text: `Help make a difference! ${campaign.description}`,
      url: `https://ecotrace.app/campaigns/${campaign.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Campaign Shared!",
          description: "Thank you for spreading the word about environmental action.",
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link Copied!",
        description: "Campaign link copied to clipboard.",
      });
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const featuredCampaigns = activeCampaigns.filter(c => c.featured);
  const regularCampaigns = activeCampaigns.filter(c => !c.featured);

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-cyber mb-2">Green Campaigns</h1>
        <p className="text-muted-foreground text-lg">Join global environmental initiatives and make a lasting impact</p>
      </motion.div>

      {/* User Engagement Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-cyber-blue mx-auto mb-2" />
            <div className="text-2xl font-orbitron font-bold text-cyber-blue-light">{joinedCampaigns.length}</div>
            <div className="text-sm text-muted-foreground">Campaigns Joined</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-eco-green mx-auto mb-2" />
            <div className="text-2xl font-orbitron font-bold text-eco-green">1,247</div>
            <div className="text-sm text-muted-foreground">Impact Points</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-electric-purple mx-auto mb-2" />
            <div className="text-2xl font-orbitron font-bold text-electric-purple">87%</div>
            <div className="text-sm text-muted-foreground">Goal Achievement</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-orbitron font-bold text-cyan-400">15</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-orbitron font-semibold text-cyber-blue-light mb-6">Featured Campaigns</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredCampaigns.map((campaign, index) => {
            const Icon = campaign.icon;
            const isJoined = joinedCampaigns.includes(campaign.id);
            const daysRemaining = getDaysRemaining(campaign.endDate);
            const progressPercentage = (campaign.current / campaign.target) * 100;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass-card border-eco-green/30 hover-lift group relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-eco text-background">Featured</Badge>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-background" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-cyber-blue-light mb-2">{campaign.title}</CardTitle>
                        <CardDescription className="text-base">{campaign.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-eco-green font-medium">
                          {campaign.current.toLocaleString()} / {campaign.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                      <div className="text-xs text-center text-muted-foreground">
                        {Math.round(progressPercentage)}% Complete
                      </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyber-blue" />
                        <span className="text-muted-foreground">
                          {campaign.participants.toLocaleString()} participants
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-electric-purple" />
                        <span className="text-muted-foreground">
                          {daysRemaining} days left
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-eco-green" />
                        <span className="text-muted-foreground">{campaign.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">{campaign.category}</span>
                      </div>
                    </div>

                    {/* Impact & Rewards */}
                    <div className="space-y-3">
                      <div className="p-3 bg-eco-green/10 rounded-lg">
                        <div className="text-sm font-medium text-eco-green mb-1">Environmental Impact</div>
                        <div className="text-xs text-muted-foreground">{campaign.impact}</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {campaign.rewards.map((reward, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleJoinCampaign(campaign.id)}
                        disabled={isJoined}
                        className={`flex-1 ${
                          isJoined 
                            ? 'bg-eco-green/20 text-eco-green border border-eco-green cursor-default' 
                            : 'bg-gradient-eco text-background hover:shadow-eco'
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Joined
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 mr-2" />
                            Join Campaign
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => handleShare(campaign)}
                        className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-eco opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    initial={false}
                  />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* All Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-orbitron font-semibold text-cyber-blue-light mb-6">All Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularCampaigns.map((campaign, index) => {
            const Icon = campaign.icon;
            const isJoined = joinedCampaigns.includes(campaign.id);
            const daysRemaining = getDaysRemaining(campaign.endDate);
            const progressPercentage = (campaign.current / campaign.target) * 100;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="glass-card hover-lift group relative overflow-hidden h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-cyber rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-background" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-cyber-blue-light">{campaign.title}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {campaign.category}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm">{campaign.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-eco-green">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-muted-foreground">Participants</div>
                        <div className="font-medium">{campaign.participants.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Days Left</div>
                        <div className="font-medium">{daysRemaining}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleJoinCampaign(campaign.id)}
                        disabled={isJoined}
                        className={`flex-1 ${
                          isJoined 
                            ? 'bg-eco-green/20 text-eco-green border border-eco-green cursor-default' 
                            : 'bg-gradient-cyber text-background hover:shadow-cyber'
                        }`}
                      >
                        {isJoined ? 'Joined' : 'Join'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(campaign)}
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    initial={false}
                  />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default GreenCampaigns;