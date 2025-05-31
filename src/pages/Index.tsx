
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wrench, Clock, Briefcase, CheckCircle } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { WhyCrafted } from "@/components/WhyCrafted";
import { FeaturedPros } from "@/components/FeaturedPros";
import { PopularCategories } from "@/components/PopularCategories";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      {/* Header with Join as Professional button */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-stone-900">Crafted</span>
            </div>
            <Link to="/worker-auth">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Join as Professional
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <HeroSection />
      <WhyCrafted />
      <FeaturedPros />
      <PopularCategories />
      <Footer />
    </div>
  );
};

export default Index;
