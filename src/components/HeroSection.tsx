
import { Button } from "@/components/ui/button";
import { Wrench, MapPin } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 pt-20 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(217,126,74,0.05),transparent_50%)] opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(167,196,160,0.05),transparent_50%)] opacity-60"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-6 leading-tight">
            Crafted by <span className="text-orange-600 relative inline-block">
              Hands
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200/40 -rotate-1 rounded-lg"></div>
            </span>
            <br />
            Powered by <span className="text-emerald-700">Trust</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-stone-600 mb-4 font-medium">
            Connect with verified local pros — or become one.
          </p>
          
          {/* Soft inspiring text */}
          <p className="text-lg text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're a local pro or just getting started, this is your space to grow, show, and get chosen — not just found.
            We're here to make skilled work human again.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 min-w-[200px]"
            >
              <Wrench className="h-5 w-5" />
              Become a Pro
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-stone-300 hover:border-orange-300 text-stone-700 hover:text-orange-700 px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 min-w-[200px] bg-white/80 backdrop-blur-sm"
            >
              <MapPin className="h-5 w-5" />
              Find Help Near Me
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-stone-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>5000+ Verified Pros</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>50k+ Jobs Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>4.9★ Average Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
