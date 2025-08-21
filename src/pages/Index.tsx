import { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import SubmitEWaste from '@/pages/SubmitEWaste';
import MyItems from '@/pages/MyItems';
import EWasteTracking from '@/pages/EWasteTracking';
import Analytics from '@/pages/Analytics';
import CarbonCredits from '@/pages/CarbonCredits';
import GreenCampaigns from '@/pages/GreenCampaigns';
import UserProfile from '@/pages/UserProfile';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleAuthToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onPageChange={setCurrentPage} />;
      case 'dashboard': return <Dashboard onPageChange={setCurrentPage} />;
      case 'submit': return <SubmitEWaste onPageChange={setCurrentPage} />;
      case 'items': return <MyItems onPageChange={setCurrentPage} />;
      case 'tracking': return <EWasteTracking />;
      case 'analytics': return <Analytics onPageChange={setCurrentPage} />;
      case 'credits': return <CarbonCredits onPageChange={setCurrentPage} />;
      case 'campaigns': return <GreenCampaigns onPageChange={setCurrentPage} />;
      case 'profile': return <UserProfile onPageChange={setCurrentPage} />;
      default: return <Home onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen dark relative">
      <ParticleBackground />
      <Navigation 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoggedIn={isLoggedIn}
        onAuthToggle={handleAuthToggle}
      />
      {renderPage()}
    </div>
  );
};

export default Index;
