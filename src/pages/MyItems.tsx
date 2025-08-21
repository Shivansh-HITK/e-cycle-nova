import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QRCode from 'qrcode';
import { 
  Package, 
  QrCode, 
  Clock, 
  CheckCircle, 
  Truck, 
  Recycle,
  Download,
  Share2,
  Eye,
  MapPin,
  Calendar,
  Award,
  Smartphone,
  Laptop,
  Monitor,
  AlertCircle
} from 'lucide-react';

interface MyItemsProps {
  onPageChange: (page: string) => void;
}

interface WasteItem {
  id: string;
  deviceType: string;
  brand: string;
  model: string;
  condition: string;
  status: 'submitted' | 'processing' | 'in-transit' | 'completed';
  submittedDate: string;
  estimatedProcessing: string;
  carbonCredits: number;
  trackingId: string;
  qrCode?: string;
  location?: string;
}

const MyItems = ({ onPageChange }: MyItemsProps) => {
  const [items, setItems] = useState<WasteItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simulate fetching user's items
    const mockItems: WasteItem[] = [
      {
        id: '1',
        deviceType: 'smartphone',
        brand: 'Apple',
        model: 'iPhone 12',
        condition: 'working',
        status: 'completed',
        submittedDate: '2024-01-15',
        estimatedProcessing: '2024-01-22',
        carbonCredits: 25,
        trackingId: 'ECO2024001234',
        location: 'Green Tech Facility, Mumbai'
      },
      {
        id: '2',
        deviceType: 'laptop',
        brand: 'Dell',
        model: 'XPS 13',
        condition: 'minor-issues',
        status: 'in-transit',
        submittedDate: '2024-01-20',
        estimatedProcessing: '2024-01-27',
        carbonCredits: 45,
        trackingId: 'ECO2024001235',
        location: 'Processing Center, Delhi'
      },
      {
        id: '3',
        deviceType: 'desktop',
        brand: 'HP',
        model: 'Pavilion Desktop',
        condition: 'broken',
        status: 'processing',
        submittedDate: '2024-01-22',
        estimatedProcessing: '2024-01-29',
        carbonCredits: 35,
        trackingId: 'ECO2024001236'
      },
      {
        id: '4',
        deviceType: 'smartphone',
        brand: 'Samsung',
        model: 'Galaxy S21',
        condition: 'working',
        status: 'submitted',
        submittedDate: '2024-01-24',
        estimatedProcessing: '2024-01-31',
        carbonCredits: 20,
        trackingId: 'ECO2024001237'
      }
    ];

    setItems(mockItems);

    // Generate QR codes for each item
    const generateQRCodes = async () => {
      const codes: Record<string, string> = {};
      for (const item of mockItems) {
        try {
          const qrData = {
            trackingId: item.trackingId,
            deviceType: item.deviceType,
            brand: item.brand,
            model: item.model,
            submittedDate: item.submittedDate,
            url: `https://ecotrace.app/track/${item.trackingId}`
          };
          const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            width: 256,
            margin: 2,
            color: {
              dark: '#00D4FF',
              light: '#0A0F1C'
            }
          });
          codes[item.id] = qrCodeUrl;
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
      setQrCodes(codes);
    };

    generateQRCodes();
  }, []);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'smartphone': return Smartphone;
      case 'laptop': return Laptop;
      case 'desktop': return Monitor;
      default: return Package;
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return { color: 'bg-cyber-blue/20 text-cyber-blue', label: 'Submitted', icon: Clock };
      case 'processing':
        return { color: 'bg-electric-purple/20 text-electric-purple', label: 'Processing', icon: Recycle };
      case 'in-transit':
        return { color: 'bg-yellow-500/20 text-yellow-500', label: 'In Transit', icon: Truck };
      case 'completed':
        return { color: 'bg-eco-green/20 text-eco-green', label: 'Completed', icon: CheckCircle };
      default:
        return { color: 'bg-muted', label: 'Unknown', icon: AlertCircle };
    }
  };

  const downloadQRCode = (item: WasteItem) => {
    const qrCodeUrl = qrCodes[item.id];
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `QR-${item.trackingId}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const shareItem = async (item: WasteItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `E-Waste Tracking - ${item.brand} ${item.model}`,
          text: `Track my e-waste disposal: ${item.trackingId}`,
          url: `https://ecotrace.app/track/${item.trackingId}`
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`https://ecotrace.app/track/${item.trackingId}`);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold text-cyber mb-2">My E-Waste Items</h1>
        <p className="text-muted-foreground text-lg">Track your submitted devices and their processing status</p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="glass-card text-center">
          <Package className="w-8 h-8 text-cyber-blue mx-auto mb-2" />
          <div className="text-2xl font-orbitron font-bold text-cyber-blue-light">{items.length}</div>
          <div className="text-sm text-muted-foreground">Total Items</div>
        </div>
        
        <div className="glass-card text-center">
          <Award className="w-8 h-8 text-eco-green mx-auto mb-2" />
          <div className="text-2xl font-orbitron font-bold text-eco-green">
            {items.reduce((sum, item) => sum + item.carbonCredits, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Credits Earned</div>
        </div>
        
        <div className="glass-card text-center">
          <CheckCircle className="w-8 h-8 text-electric-purple mx-auto mb-2" />
          <div className="text-2xl font-orbitron font-bold text-electric-purple">
            {items.filter(item => item.status === 'completed').length}
          </div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        
        <div className="glass-card text-center">
          <Recycle className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-orbitron font-bold text-cyan-400">
            {items.filter(item => item.status !== 'completed').length}
          </div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
      </motion.div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const DeviceIcon = getDeviceIcon(item.deviceType);
          const statusInfo = getStatusInfo(item.status);
          const StatusIcon = statusInfo.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="glass-card hover-lift group relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-cyber rounded-lg flex items-center justify-center">
                        <DeviceIcon className="w-5 h-5 text-background" />
                      </div>
                      <div>
                        <CardTitle className="text-cyber-blue-light">{item.brand} {item.model}</CardTitle>
                        <CardDescription className="capitalize">{item.deviceType}</CardDescription>
                      </div>
                    </div>
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Tracking ID</div>
                      <div className="font-mono text-cyber-blue-light">{item.trackingId}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Credits</div>
                      <div className="font-bold text-eco-green">{item.carbonCredits}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Submitted</div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.submittedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Est. Processing</div>
                      <div>{new Date(item.estimatedProcessing).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {item.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-electric-purple" />
                      <span className="text-muted-foreground">{item.location}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-cyber-blue-light">Device QR Code</DialogTitle>
                          <DialogDescription>
                            Scan to track {item.brand} {item.model}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center space-y-4">
                          {qrCodes[item.id] && (
                            <img 
                              src={qrCodes[item.id]} 
                              alt="QR Code"
                              className="w-48 h-48 border border-cyber-blue/20 rounded-lg"
                            />
                          )}
                          <div className="text-center">
                            <div className="font-mono text-sm text-cyber-blue-light">{item.trackingId}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Scan or share this code to track your device
                            </div>
                          </div>
                          <div className="flex gap-2 w-full">
                            <Button 
                              variant="outline" 
                              onClick={() => downloadQRCode(item)}
                              className="flex-1"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => shareItem(item)}
                              className="flex-1"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onPageChange('tracking')}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                  </div>
                </CardContent>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  initial={false}
                />
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-orbitron font-semibold text-cyber-blue-light mb-2">
            No Items Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start by submitting your first e-waste device for responsible disposal.
          </p>
          <Button 
            onClick={() => onPageChange('submit')}
            className="bg-gradient-cyber text-background hover:shadow-cyber"
          >
            Submit E-Waste
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MyItems;