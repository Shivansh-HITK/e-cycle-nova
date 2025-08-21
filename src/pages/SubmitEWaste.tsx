import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Camera, 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet,
  Speaker,
  Gamepad2,
  Cpu,
  Battery,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface SubmitEWasteProps {
  onPageChange: (page: string) => void;
}

const SubmitEWaste = ({ onPageChange }: SubmitEWasteProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    condition: '',
    quantity: '1',
    description: '',
    photos: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deviceTypes = [
    { value: 'smartphone', label: 'Smartphone', icon: Smartphone },
    { value: 'laptop', label: 'Laptop', icon: Laptop },
    { value: 'desktop', label: 'Desktop Computer', icon: Monitor },
    { value: 'tablet', label: 'Tablet', icon: Tablet },
    { value: 'speaker', label: 'Audio Equipment', icon: Speaker },
    { value: 'gaming', label: 'Gaming Console', icon: Gamepad2 },
    { value: 'components', label: 'Computer Parts', icon: Cpu },
    { value: 'battery', label: 'Batteries', icon: Battery },
  ];

  const conditions = [
    { value: 'working', label: 'Working', description: 'Device powers on and functions normally' },
    { value: 'minor-issues', label: 'Minor Issues', description: 'Some functionality problems but mostly working' },
    { value: 'major-issues', label: 'Major Issues', description: 'Significant problems, may not power on' },
    { value: 'broken', label: 'Broken/Dead', description: 'Device is completely non-functional' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFormData(prev => ({ 
        ...prev, 
        photos: [...prev.photos, ...newFiles].slice(0, 5) // Max 5 photos
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "E-Waste Submitted Successfully!",
      description: "Your device has been registered and will be processed soon. You'll receive updates via email.",
    });

    setIsSubmitting(false);
    onPageChange('items');
  };

  const selectedDeviceType = deviceTypes.find(type => type.value === formData.deviceType);

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-cyber mb-4">Submit E-Waste</h1>
          <p className="text-lg text-muted-foreground">
            Register your electronic device for responsible disposal and earn carbon credits
          </p>
        </div>

        {/* Smart Categorization Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card border-animated mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-background" />
            </div>
            <div>
              <h3 className="font-orbitron font-semibold text-cyber-blue-light">Smart Categorization Enabled</h3>
              <p className="text-sm text-muted-foreground">
                Our AI will automatically detect device specifications and suggest optimal processing methods
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Device Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-cyber-blue-light">Device Type</CardTitle>
                <CardDescription>Select the type of electronic device you're submitting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {deviceTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.deviceType === type.value;
                    
                    return (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('deviceType', type.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          isSelected 
                            ? 'border-cyber-blue bg-cyber-blue/10 shadow-cyber' 
                            : 'border-border hover:border-cyber-blue/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          isSelected ? 'text-cyber-blue' : 'text-muted-foreground'
                        }`} />
                        <div className={`text-sm font-medium ${
                          isSelected ? 'text-cyber-blue' : 'text-foreground'
                        }`}>
                          {type.label}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Device Details */}
          {formData.deviceType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                    {selectedDeviceType && <selectedDeviceType.icon className="w-5 h-5" />}
                    Device Details
                  </CardTitle>
                  <CardDescription>Provide specific information about your device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        placeholder="e.g., Apple, Samsung, Dell"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        placeholder="e.g., iPhone 12, MacBook Pro"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select onValueChange={(value) => handleInputChange('condition', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select device condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              <div>
                                <div className="font-medium">{condition.label}</div>
                                <div className="text-xs text-muted-foreground">{condition.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="50"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Additional Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Any additional details, accessories included, specific issues, etc."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Photo Upload */}
          {formData.deviceType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                    <Camera className="w-5 h-5" />
                    Device Photos
                  </CardTitle>
                  <CardDescription>Upload photos to help with device assessment (Max 5 photos)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-cyber-blue/30 rounded-lg p-8 text-center hover:border-cyber-blue/50 transition-colors">
                      <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label htmlFor="photos" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-cyber-blue" />
                        <p className="text-lg font-medium text-cyber-blue-light">Upload Device Photos</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Drag and drop or click to select images
                        </p>
                      </label>
                    </div>

                    {/* Photo Preview */}
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Device photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Impact Preview */}
          {formData.deviceType && formData.condition && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-card border-eco-green/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-eco-green">
                    <CheckCircle className="w-5 h-5" />
                    Estimated Environmental Impact
                  </CardTitle>
                  <CardDescription>Predicted benefits from responsible disposal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-eco-green/10 rounded-lg">
                      <div className="text-2xl font-orbitron font-bold text-eco-green mb-1">12-25</div>
                      <div className="text-sm text-muted-foreground">Carbon Credits</div>
                    </div>
                    <div className="text-center p-4 bg-cyber-blue/10 rounded-lg">
                      <div className="text-2xl font-orbitron font-bold text-cyber-blue mb-1">3.2 kg</div>
                      <div className="text-sm text-muted-foreground">CO₂ Prevented</div>
                    </div>
                    <div className="text-center p-4 bg-electric-purple/10 rounded-lg">
                      <div className="text-2xl font-orbitron font-bold text-electric-purple mb-1">85%</div>
                      <div className="text-sm text-muted-foreground">Material Recovery</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Submit Button */}
          {formData.deviceType && formData.brand && formData.model && formData.condition && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-gradient-eco text-background hover:shadow-eco px-12 py-4 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Submit E-Waste
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default SubmitEWaste;