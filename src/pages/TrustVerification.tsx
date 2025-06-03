
import React from 'react';
import { TrustDashboard } from '@/components/trust/TrustDashboard';
import { LanguageToggle, LanguageProvider, useLanguage } from "@/components/LanguageToggle";
import { Link } from "react-router-dom";
import { Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrustVerificationContent = () => {
  const { isArabic } = useLanguage();

  const content = {
    ar: {
      title: "نظام الثقة والتحقق",
      subtitle: "بناء ملفك المهني وزيادة مصداقيتك",
      backToDashboard: "العودة إلى لوحة التحكم"
    },
    fr: {
      title: "Système de Confiance et Vérification",
      subtitle: "Construisez votre profil professionnel et augmentez votre crédibilité",
      backToDashboard: "Retour au tableau de bord"
    }
  };

  const text = content[isArabic ? 'ar' : 'fr'];

  // Mock worker ID - in real implementation, get from authentication
  const mockWorkerId = "550e8400-e29b-41d4-a716-446655440000";

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className={`flex items-center space-x-2 ${isArabic ? 'space-x-reverse' : ''}`}>
                <Wrench className="h-8 w-8 text-orange-600" />
                <span className={`text-2xl font-bold text-stone-900 ${isArabic ? 'font-bold' : ''}`}>
                  {isArabic ? 'كرافتد' : 'Crafted'}
                </span>
              </Link>
              <Link to="/worker-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {text.backToDashboard}
                </Button>
              </Link>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">{text.title}</h1>
          <p className="text-gray-600">{text.subtitle}</p>
        </div>

        <TrustDashboard workerId={mockWorkerId} />
      </div>
    </div>
  );
};

const TrustVerification = () => {
  return (
    <LanguageProvider>
      <TrustVerificationContent />
    </LanguageProvider>
  );
};

export default TrustVerification;
