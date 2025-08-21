import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  LayoutDashboard, 
  Upload, 
  Package, 
  BarChart3, 
  Coins, 
  Leaf, 
  User, 
  LogIn, 
  LogOut,
  Menu,
  X,
  Recycle,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submit', label: 'Submit E-Waste', icon: Upload },
    { id: 'items', label: 'My Items', icon: Package },
    { id: 'tracking', label: 'E-Waste Tracking', icon: Recycle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'credits', label: 'Carbon Credits', icon: Coins },
    { id: 'campaigns', label: 'Green Campaigns', icon: Leaf },
    { id: 'profile', label: 'User Profile', icon: User },
  ];

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-cyber-blue/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-cyber rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-background" />
              </div>
              <div className="absolute inset-0 bg-gradient-cyber rounded-lg blur-lg opacity-50 animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-cyber">EcoTrace</h1>
              <p className="text-xs text-muted-foreground">E-Waste Management</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "relative overflow-hidden transition-all duration-300",
                      isActive 
                        ? "bg-gradient-cyber text-background shadow-cyber" 
                        : "hover:bg-surface-tertiary hover:text-cyber-blue-light"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Hover effect for advanced features */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-eco opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      initial={false}
                    />
                  </Button>

                  {/* Tooltip for advanced features */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-cyber rotate-45"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Auth Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden sm:flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {profile?.display_name || user.email}
                </span>
                {profile?.role === 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/admin'}
                    className="items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = '/auth'}
                className="hidden sm:flex items-center space-x-2 bg-gradient-cyber text-background hover:shadow-cyber"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-cyber-blue/20">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "w-full justify-start",
                        isActive 
                          ? "bg-gradient-cyber text-background" 
                          : "hover:bg-surface-tertiary"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
                
                <div className="pt-2 border-t border-cyber-blue/20">
                  {user ? (
                    <>
                      {profile?.role === 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = '/admin'}
                          className="w-full justify-start mb-2"
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={signOut}
                        className="w-full justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.location.href = '/auth'}
                      className="w-full justify-start"
                    >
                      <LogIn className="w-4 h-4 mr-3" />
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;