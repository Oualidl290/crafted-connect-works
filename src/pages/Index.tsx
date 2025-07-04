
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { BilingualHeroSection } from "@/components/BilingualHeroSection";
import { BilingualWhyCrafted } from "@/components/BilingualWhyCrafted";
import { FeaturedPros } from "@/components/FeaturedPros";
import { PopularCategories } from "@/components/PopularCategories";
import { Footer } from "@/components/Footer";
import { LanguageToggle, LanguageProvider, useLanguage } from "@/components/LanguageToggle";
import { Link } from "react-router-dom";

const IndexContent = () => {
  const { isArabic } = useLanguage();

  const headerText = {
    ar: {
      brandName: "كرافتد",
      joinButton: "انضم كحَرَفي",
      searchServices: "البحث عن خدمة",
      jobs: "الوظائف",
      workers: "الحرفيين", 
      messages: "الرسائل",
      login: "تسجيل الدخول",
      clientDashboard: "لوحة الزبون",
      workerDashboard: "لوحة الحَرَفي"
    },
    fr: {
      brandName: "Crafted", 
      joinButton: "Rejoindre comme Pro",
      searchServices: "Rechercher Services",
      jobs: "Emplois",
      workers: "Artisans",
      messages: "Messages", 
      login: "Se connecter",
      clientDashboard: "Tableau Client",
      workerDashboard: "Tableau Artisan"
    }
  };

  const text = headerText[isArabic ? 'ar' : 'fr'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      {/* Header with bilingual support */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${isArabic ? 'space-x-reverse' : ''}`}>
              <Wrench className="h-8 w-8 text-orange-600" />
              <span className={`text-2xl font-bold text-stone-900 ${isArabic ? 'font-bold' : ''}`}>
                {text.brandName}
              </span>
            </div>
            <div className={`flex items-center gap-4 ${isArabic ? 'space-x-reverse' : ''}`}>
              <LanguageToggle />
              
              {/* Navigation Links */}
              <Link to="/jobs">
                <Button variant="outline" size="sm">
                  {text.jobs}
                </Button>
              </Link>
              
              <Link to="/workers">
                <Button variant="outline" size="sm">
                  {text.workers}
                </Button>
              </Link>
              
              <Link to="/messages">
                <Button variant="outline" size="sm">
                  {text.messages}
                </Button>
              </Link>
              
              <Link to="/auth">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  {text.login}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <BilingualHeroSection />
      <BilingualWhyCrafted />
      <FeaturedPros />
      <PopularCategories />
      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
