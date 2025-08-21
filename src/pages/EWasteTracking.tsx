import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Package, 
  Truck, 
  Factory, 
  CheckCircle, 
  MapPin, 
  Clock,
  Eye,
  Download,
  Share2,
  Recycle,
  AlertTriangle,
  Route,
  Calendar,
  User,
  Building,
  Zap
} from 'lucide-react';

const EWasteTracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockTrackingData = {
    'ECO2024001234': {
      device: {
        type: 'Smartphone',
        brand: 'Apple',
        model: 'iPhone 12',
        serialNumber: 'F2LXE3J0P3H9',
        condition: 'Working'
      },
      submissionInfo: {
        submittedBy: 'John Doe',
        submissionDate: '2024-01-15T10:30:00Z',
        location: 'Mumbai, Maharashtra',
        estimatedValue: '$120',
        carbonCredits: 25
      },
      currentStatus: 'completed',
      timeline: [
        {
          status: 'submitted',
          title: 'Device Submitted',
          description: 'Your device has been registered in our system',
          timestamp: '2024-01-15T10:30:00Z',
          location: 'Mumbai Collection Center',
          agent: 'Collection Team Alpha',
          completed: true
        },
        {
          status: 'collected',
          title: 'Device Collected',
          description: 'Device picked up from submission location',
          timestamp: '2024-01-16T14:15:00Z',
          location: 'Mumbai Collection Center',
          agent: 'Pickup Service',
          completed: true
        },
        {
          status: 'processing',
          title: 'Initial Processing',
          description: 'Device categorized and prepared for recycling',
          timestamp: '2024-01-18T09:45:00Z',
          location: 'Green Tech Facility, Mumbai',
          agent: 'Processing Team Beta',
          completed: true
        },
        {
          status: 'disassembly',
          title: 'Safe Disassembly',
          description: 'Components separated and materials extracted',
          timestamp: '2024-01-19T11:20:00Z',
          location: 'Green Tech Facility, Mumbai',
          agent: 'Technical Team Gamma',
          completed: true
        },
        {
          status: 'recycling',
          title: 'Material Recycling',
          description: 'Materials processed for reuse in new products',
          timestamp: '2024-01-21T16:00:00Z',
          location: 'Recycling Plant, Pune',
          agent: 'Recycling Specialists',
          completed: true
        },
        {
          status: 'completed',
          title: 'Process Complete',
          description: 'Recycling completed, carbon credits awarded',
          timestamp: '2024-01-22T12:00:00Z',
          location: 'Final Processing',
          agent: 'Quality Assurance',
          completed: true
        }
      ],
      environmentalImpact: {
        co2Saved: '3.2 kg',
        materialRecovered: '85%',
        energySaved: '45 kWh',
        waterSaved: '120 L'
      },
      recyclingDetails: {
        facility: 'Green Tech Recycling Facility',
        certification: 'ISO 14001:2015',
        complianceScore: 98.5,
        dataDestruction: 'DoD 5220.22-M Standard'
      }
    },
    'ECO2024001235': {
      device: {
        type: 'Laptop',
        brand: 'Dell',
        model: 'XPS 13',
        serialNumber: 'DL2024XPS789',
        condition: 'Minor Issues'
      },
      submissionInfo: {
        submittedBy: 'Sarah Johnson',
        submissionDate: '2024-01-20T15:45:00Z',
        location: 'Delhi, NCR',
        estimatedValue: '$200',
        carbonCredits: 45
      },
      currentStatus: 'in-transit',
      timeline: [
        {
          status: 'submitted',
          title: 'Device Submitted',
          description: 'Your device has been registered in our system',
          timestamp: '2024-01-20T15:45:00Z',
          location: 'Delhi Collection Point',
          agent: 'Collection Team Delta',
          completed: true
        },
        {
          status: 'collected',
          title: 'Device Collected',
          description: 'Device picked up from submission location',
          timestamp: '2024-01-21T12:30:00Z',
          location: 'Delhi Collection Point',
          agent: 'Express Pickup Service',
          completed: true
        },
        {
          status: 'in-transit',
          title: 'In Transit to Facility',
          description: 'Device being transported to processing facility',
          timestamp: '2024-01-22T08:00:00Z',
          location: 'En route to Processing Center',
          agent: 'Transport Team',
          completed: false,
          estimated: '2024-01-24T10:00:00Z'
        },
        {
          status: 'processing',
          title: 'Processing',
          description: 'Device will be processed and recycled',
          timestamp: null,
          location: 'Processing Center, Delhi',
          agent: 'Processing Team',
          completed: false,
          estimated: '2024-01-25T14:00:00Z'
        }
      ],
      environmentalImpact: {
        co2Saved: '5.8 kg (estimated)',
        materialRecovered: '90% (estimated)',
        energySaved: '78 kWh (estimated)',
        waterSaved: '210 L (estimated)'
      },
      recyclingDetails: {
        facility: 'EcoTech Processing Center',
        certification: 'R2 Certified',
        complianceScore: 96.2,
        dataDestruction: 'NIST SP 800-88 Standard'
      }
    }
  };

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = mockTrackingData[trackingId as keyof typeof mockTrackingData];
    setTrackingData(data || null);
    setIsLoading(false);
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-eco-green" />;
    }
    
    switch (status) {
      case 'submitted': return <Package className="w-5 h-5 text-cyber-blue" />;
      case 'collected': return <Truck className="w-5 h-5 text-electric-purple" />;
      case 'in-transit': return <Route className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Factory className="w-5 h-5 text-cyan-400" />;
      case 'disassembly': return <Zap className="w-5 h-5 text-orange-500" />;
      case 'recycling': return <Recycle className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string, completed: boolean) => {
    if (completed) return 'text-eco-green';
    
    switch (status) {
      case 'submitted': return 'text-cyber-blue';
      case 'collected': return 'text-electric-purple';
      case 'in-transit': return 'text-yellow-500';
      case 'processing': return 'text-cyan-400';
      case 'disassembly': return 'text-orange-500';
      case 'recycling': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-cyber mb-2">E-Waste Tracking</h1>
        <p className="text-muted-foreground text-lg">Track your device's journey through our recycling process</p>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
              <Search className="w-5 h-5" />
              Track Your Device
            </CardTitle>
            <CardDescription>Enter your tracking ID to see real-time updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="tracking-id">Tracking ID</Label>
                <Input
                  id="tracking-id"
                  placeholder="e.g., ECO2024001234"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleTrack}
                  disabled={isLoading || !trackingId.trim()}
                  className="bg-gradient-cyber text-background hover:shadow-cyber"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Track Device
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Sample IDs for testing */}
            <div className="mt-4 p-3 bg-surface-tertiary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Try these sample tracking IDs:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTrackingId('ECO2024001234')}
                  className="text-xs"
                >
                  ECO2024001234
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTrackingId('ECO2024001235')}
                  className="text-xs"
                >
                  ECO2024001235
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tracking Results */}
      {trackingData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Device Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-cyber-blue-light">
                  <Package className="w-5 h-5" />
                  Device Information
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Device Type</div>
                  <div className="font-medium text-cyber-blue-light">{trackingData.device.type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Brand & Model</div>
                  <div className="font-medium">{trackingData.device.brand} {trackingData.device.model}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Condition</div>
                  <Badge variant="outline">{trackingData.device.condition}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Status</div>
                  <Badge className={
                    trackingData.currentStatus === 'completed' ? 'bg-eco-green/20 text-eco-green' :
                    trackingData.currentStatus === 'in-transit' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-cyber-blue/20 text-cyber-blue'
                  }>
                    {trackingData.currentStatus === 'completed' ? 'Completed' :
                     trackingData.currentStatus === 'in-transit' ? 'In Transit' :
                     'Processing'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <Route className="w-5 h-5" />
                Processing Timeline
              </CardTitle>
              <CardDescription>Real-time tracking of your device's recycling journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trackingData.timeline.map((step: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Line */}
                    {index < trackingData.timeline.length - 1 && (
                      <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                        step.completed ? 'bg-eco-green' : 'bg-border'
                      }`} />
                    )}
                    
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                        step.completed 
                          ? 'border-eco-green bg-eco-green/10' 
                          : 'border-border bg-surface-tertiary'
                      }`}>
                        {getStatusIcon(step.status, step.completed)}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-semibold ${getStatusColor(step.status, step.completed)}`}>
                            {step.title}
                          </h4>
                          {step.completed && step.timestamp && (
                            <div className="text-sm text-muted-foreground">
                              {new Date(step.timestamp).toLocaleDateString()} {new Date(step.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                          {!step.completed && step.estimated && (
                            <div className="text-sm text-yellow-500">
                              ETA: {new Date(step.estimated).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-electric-purple" />
                            <span className="text-muted-foreground">{step.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-cyber-blue" />
                            <span className="text-muted-foreground">{step.agent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact & Recycling Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Environmental Impact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-card border-eco-green/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-eco-green">
                    <Recycle className="w-5 h-5" />
                    Environmental Impact
                  </CardTitle>
                  <CardDescription>Positive environmental contributions from your device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-eco-green/10 rounded-lg">
                      <div className="text-lg font-orbitron font-bold text-eco-green">
                        {trackingData.environmentalImpact.co2Saved}
                      </div>
                      <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                    </div>
                    <div className="text-center p-3 bg-cyber-blue/10 rounded-lg">
                      <div className="text-lg font-orbitron font-bold text-cyber-blue">
                        {trackingData.environmentalImpact.materialRecovered}
                      </div>
                      <div className="text-xs text-muted-foreground">Material Recovery</div>
                    </div>
                    <div className="text-center p-3 bg-electric-purple/10 rounded-lg">
                      <div className="text-lg font-orbitron font-bold text-electric-purple">
                        {trackingData.environmentalImpact.energySaved}
                      </div>
                      <div className="text-xs text-muted-foreground">Energy Saved</div>
                    </div>
                    <div className="text-center p-3 bg-cyan-400/10 rounded-lg">
                      <div className="text-lg font-orbitron font-bold text-cyan-400">
                        {trackingData.environmentalImpact.waterSaved}
                      </div>
                      <div className="text-xs text-muted-foreground">Water Saved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recycling Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                    <Building className="w-5 h-5" />
                    Recycling Details
                  </CardTitle>
                  <CardDescription>Facility information and compliance standards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Processing Facility</div>
                    <div className="font-medium">{trackingData.recyclingDetails.facility}</div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Certification</div>
                    <Badge variant="outline" className="bg-eco-green/10 text-eco-green border-eco-green">
                      {trackingData.recyclingDetails.certification}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Compliance Score</div>
                    <div className="flex items-center gap-3">
                      <Progress value={trackingData.recyclingDetails.complianceScore} className="flex-1" />
                      <span className="font-orbitron font-bold text-eco-green">
                        {trackingData.recyclingDetails.complianceScore}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Data Destruction Standard</div>
                    <div className="text-sm font-medium">{trackingData.recyclingDetails.dataDestruction}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {trackingData === null && trackingId && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-orbitron font-semibold text-cyber-blue-light mb-2">
            Tracking ID Not Found
          </h3>
          <p className="text-muted-foreground mb-6">
            The tracking ID "{trackingId}" was not found in our system. Please check and try again.
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setTrackingId('');
              setTrackingData(null);
            }}
            className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10"
          >
            Try Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default EWasteTracking;