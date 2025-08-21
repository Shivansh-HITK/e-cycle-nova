import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Recycle, 
  Leaf, 
  TrendingUp, 
  Shield, 
  Users, 
  Globe,
  ArrowRight,
  Zap,
  Target,
  Award
} from 'lucide-react';

interface HomeProps {
  onPageChange: (page: string) => void;
}

const Home = ({ onPageChange }: HomeProps) => {
  const features = [
    {
      icon: Recycle,
      title: 'Smart E-Waste Processing',
      description: 'AI-powered categorization and processing of electronic waste for maximum efficiency.',
      color: 'cyber'
    },
    {
      icon: Leaf,
      title: 'Carbon Credit System',
      description: 'Earn carbon credits for your eco-friendly disposal choices and track your impact.',
      color: 'eco'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards showing environmental impact and waste processing metrics.',
      color: 'electric'
    },
    {
      icon: Shield,
      title: 'Compliance Reporting',
      description: 'Automated compliance reports meeting all environmental regulations and standards.',
      color: 'cyber'
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'Join green campaigns and connect with environmentally conscious communities.',
      color: 'eco'
    },
    {
      icon: Globe,
      title: 'Global Impact Tracking',
      description: 'Monitor your contribution to global sustainability goals and environmental targets.',
      color: 'electric'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Devices Recycled', icon: Recycle },
    { value: '1.2M kg', label: 'CO₂ Saved', icon: Leaf },
    { value: '25K+', label: 'Active Users', icon: Users },
    { value: '99.8%', label: 'Compliance Rate', icon: Award }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-glow rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-eco rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyber-blue/10 rounded-full animate-pulse" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-orbitron font-black mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-cyber block">EcoTrace</span>
              <span className="text-eco text-4xl md:text-5xl block mt-2">E-Waste Management</span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Revolutionizing electronic waste management with AI-powered solutions, 
              real-time tracking, and sustainable impact measurement for a greener future.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={() => onPageChange('dashboard')}
                className="bg-gradient-cyber text-background hover:shadow-glow hover-lift px-8 py-4 text-lg font-semibold group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => onPageChange('analytics')}
                className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10 hover-lift px-8 py-4 text-lg font-semibold"
              >
                View Impact
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating action indicators */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cyber-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyber-blue rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-surface-secondary/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card text-center hover-lift group"
                >
                  <Icon className="w-8 h-8 text-cyber-blue mx-auto mb-4 group-hover:text-eco-green transition-colors" />
                  <div className="text-3xl font-orbitron font-bold text-cyber mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
              <span className="text-cyber">Advanced Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cutting-edge technology meets environmental responsibility in our comprehensive e-waste management platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card hover-lift group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mb-6",
                      feature.color === 'cyber' && "bg-gradient-cyber",
                      feature.color === 'eco' && "bg-gradient-eco",
                      feature.color === 'electric' && "bg-electric-purple"
                    )}>
                      <Icon className="w-6 h-6 text-background" />
                    </div>
                    
                    <h3 className="text-xl font-orbitron font-semibold mb-4 text-cyber-blue-light">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover effect overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-surface-secondary/50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
              <span className="text-eco">Join the Future</span> <span className="text-cyber">of E-Waste</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Start your journey towards sustainable e-waste management today. 
              Track, analyze, and optimize your environmental impact with our advanced platform.
            </p>

            <Button
              size="lg"
              onClick={() => onPageChange('submit')}
              className="bg-gradient-eco text-background hover:shadow-eco hover-lift px-12 py-4 text-lg font-semibold group"
            >
              <Zap className="mr-2 w-5 h-5" />
              Submit Your First Device
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Team Credits Footer */}
      <footer className="py-12 border-t border-cyber-blue/20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-cyber-blue-light mb-4 font-orbitron">
              Developed by the EcoTrace Team
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['Shivansh', 'Satyam', 'Subhojeet', 'Arpita'].map((name, index) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="px-4 py-2 bg-surface-tertiary rounded-full text-eco-green font-medium hover-lift cursor-default"
                >
                  {name}
                </motion.span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 EcoTrace. All rights reserved. Built with React, TypeScript, and cutting-edge web technologies.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Home;