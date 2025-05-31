
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wrench, Clock, Briefcase, CheckCircle } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { WhyCrafted } from "@/components/WhyCrafted";
import { FeaturedPros } from "@/components/FeaturedPros";
import { PopularCategories } from "@/components/PopularCategories";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      <HeroSection />
      <WhyCrafted />
      <FeaturedPros />
      <PopularCategories />
      <Footer />
    </div>
  );
};

export default Index;
