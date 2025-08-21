import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Calendar,
  Target,
  Award,
  Leaf,
  Recycle,
  Zap,
  Globe,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';

interface AnalyticsProps {
  onPageChange: (page: string) => void;
}

const Analytics = ({ onPageChange }: AnalyticsProps) => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('6months');
  const [isExporting, setIsExporting] = useState(false);

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', devices: 12, credits: 156, co2: 89 },
    { month: 'Feb', devices: 19, credits: 247, co2: 142 },
    { month: 'Mar', devices: 15, credits: 198, co2: 112 },
    { month: 'Apr', devices: 22, credits: 289, co2: 165 },
    { month: 'May', devices: 28, credits: 367, co2: 208 },
    { month: 'Jun', devices: 35, credits: 456, co2: 267 }
  ];

  const deviceTypeData = [
    { name: 'Smartphones', value: 45, color: '#00D4FF' },
    { name: 'Laptops', value: 25, color: '#4ADE80' },
    { name: 'Desktops', value: 15, color: '#A855F7' },
    { name: 'Tablets', value: 10, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#EF4444' }
  ];

  const impactData = [
    { metric: 'CO₂ Saved', current: 1234, target: 2000, unit: 'kg' },
    { metric: 'Devices Recycled', current: 156, target: 250, unit: 'devices' },
    { metric: 'Carbon Credits', current: 2143, target: 3000, unit: 'credits' },
    { metric: 'Material Recovery', current: 892, target: 1200, unit: 'kg' }
  ];

  const complianceData = [
    { category: 'Data Security', score: 98, benchmark: 95 },
    { category: 'Environmental Standards', score: 96, benchmark: 90 },
    { category: 'Regulatory Compliance', score: 99, benchmark: 95 },
    { category: 'Material Tracking', score: 94, benchmark: 85 },
    { category: 'Documentation', score: 97, benchmark: 90 }
  ];

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const element = document.getElementById('analytics-content');
      if (!element) throw new Error('Analytics content not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0A0F1C'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add title page
      pdf.setFillColor(10, 15, 28);
      pdf.rect(0, 0, 210, 297, 'F');
      
      pdf.setTextColor(0, 212, 255);
      pdf.setFontSize(28);
      pdf.text('E-Waste Analytics Report', 105, 50, { align: 'center' });
      
      pdf.setTextColor(74, 222, 128);
      pdf.setFontSize(16);
      pdf.text('EcoTrace Platform', 105, 70, { align: 'center' });
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 90, { align: 'center' });
      pdf.text(`Time Range: ${timeRange}`, 105, 105, { align: 'center' });

      // Add analytics content
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ecotrace-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Report Exported Successfully!",
        description: "Your analytics report has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF report.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-orbitron font-bold text-cyber mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground text-lg">Comprehensive insights into your e-waste management impact</p>
          </div>
          
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={exportToPDF}
              disabled={isExporting}
              className="bg-gradient-eco text-background hover:shadow-eco"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      <div id="analytics-content" className="space-y-8">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-orbitron font-semibold text-cyber-blue-light mb-6">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactData.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="glass-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.metric}</p>
                        <p className="text-2xl font-orbitron font-bold text-cyber-blue-light">
                          {metric.current.toLocaleString()} <span className="text-sm font-normal">{metric.unit}</span>
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-cyber rounded-lg flex items-center justify-center">
                        {index === 0 && <Leaf className="w-5 h-5 text-background" />}
                        {index === 1 && <Recycle className="w-5 h-5 text-background" />}
                        {index === 2 && <Award className="w-5 h-5 text-background" />}
                        {index === 3 && <Target className="w-5 h-5 text-background" />}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-eco-green">{Math.round((metric.current / metric.target) * 100)}%</span>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Target: {metric.target.toLocaleString()} {metric.unit}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Monthly Trends */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <LineChartIcon className="w-5 h-5" />
                Monthly Trends
              </CardTitle>
              <CardDescription>Track your environmental impact over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--surface-elevated))', 
                      border: '1px solid hsl(var(--cyber-blue) / 0.3)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="credits" 
                    stroke="#4ADE80" 
                    fill="#4ADE80" 
                    fillOpacity={0.2}
                    name="Carbon Credits"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="devices" 
                    stroke="#00D4FF" 
                    strokeWidth={3}
                    name="Devices Recycled"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Type Distribution */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <PieChartIcon className="w-5 h-5" />
                Device Type Distribution
              </CardTitle>
              <CardDescription>Breakdown of recycled device categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--surface-elevated))', 
                      border: '1px solid hsl(var(--cyber-blue) / 0.3)',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                {deviceTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium text-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Environmental Impact Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <BarChart3 className="w-5 h-5" />
                Environmental Impact Analysis
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your positive environmental contributions through responsible e-waste disposal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--surface-elevated))', 
                      border: '1px solid hsl(var(--cyber-blue) / 0.3)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="devices" fill="#00D4FF" name="Devices Recycled" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="co2" fill="#4ADE80" name="CO₂ Saved (kg)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Reporting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <Target className="w-5 h-5" />
                Compliance & Quality Metrics
              </CardTitle>
              <CardDescription>
                Comprehensive compliance reporting across all environmental and security standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {complianceData.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{item.category}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          Benchmark: {item.benchmark}%
                        </span>
                        <span className={`font-bold ${
                          item.score >= item.benchmark ? 'text-eco-green' : 'text-yellow-500'
                        }`}>
                          {item.score}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Progress value={item.score} className="h-3" />
                      {/* Benchmark indicator */}
                      <div 
                        className="absolute top-0 h-3 w-0.5 bg-electric-purple rounded-full"
                        style={{ left: `${item.benchmark}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="text-electric-purple">Benchmark: {item.benchmark}%</span>
                      <span>100%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <Users className="w-5 h-5" />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-orbitron font-bold text-eco-green">1,247</div>
                  <div className="text-sm text-muted-foreground">Community Members Influenced</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold text-cyber-blue">15</div>
                  <div className="text-sm text-muted-foreground">Green Campaigns Joined</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <Globe className="w-5 h-5" />
                Global Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-orbitron font-bold text-electric-purple">#127</div>
                  <div className="text-sm text-muted-foreground">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold text-eco-green">#12</div>
                  <div className="text-sm text-muted-foreground">Regional Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyber-blue-light">
                <Zap className="w-5 h-5" />
                Efficiency Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-orbitron font-bold text-cyber-blue">92.5</div>
                  <div className="text-sm text-muted-foreground">Overall Efficiency</div>
                </div>
                <Progress value={92.5} className="h-2" />
                <div className="text-xs text-center text-muted-foreground">
                  Based on disposal speed, compliance, and environmental impact
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;