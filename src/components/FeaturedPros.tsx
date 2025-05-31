
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, CheckCircle } from "lucide-react";

export const FeaturedPros = () => {
  const pros = [
    {
      name: "Marcus Rodriguez",
      trade: "Certified Electrician",
      experience: "15+ years",
      rating: 4.9,
      reviewCount: 234,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      tags: ["Licensed", "Insured", "Emergency Service"],
      description: "Specializing in residential and commercial electrical work with a focus on safety and efficiency."
    },
    {
      name: "Sarah Chen",
      trade: "Master Plumber",
      experience: "12+ years",
      rating: 5.0,
      reviewCount: 189,
      image: "https://images.unsplash.com/photo-1494790108755-2616b67d1d88?w=150&h=150&fit=crop&crop=face",
      tags: ["Licensed", "24/7 Available", "Eco-Friendly"],
      description: "Eco-conscious plumbing solutions for homes and businesses. Available for emergencies."
    },
    {
      name: "David Thompson",
      trade: "Finish Carpenter",
      experience: "20+ years",
      rating: 4.8,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      tags: ["Custom Work", "Insured", "Portfolio"],
      description: "Custom cabinetry and fine woodworking. Bringing your vision to life with precision craftsmanship."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-stone-50 to-amber-50/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
            Featured <span className="text-orange-600">Pros</span>
          </h2>
          <p className="text-xl text-stone-600">
            Meet some of our most trusted and experienced professionals
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pros.map((pro, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white rounded-2xl overflow-hidden group">
              <CardContent className="p-0">
                {/* Profile Header */}
                <div className="relative p-6 pb-4">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={pro.image}
                      alt={pro.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-900 mb-1">
                        {pro.name}
                      </h3>
                      <p className="text-orange-600 font-semibold mb-2">
                        {pro.trade}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Clock className="h-4 w-4" />
                        <span>{pro.experience}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(pro.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-stone-900 font-semibold">
                      {pro.rating}
                    </span>
                    <span className="text-stone-500 text-sm">
                      ({pro.reviewCount} reviews)
                    </span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pro.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors flex items-center gap-1 rounded-full px-3 py-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Description */}
                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    {pro.description}
                  </p>
                  
                  {/* Action Button */}
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 font-semibold transition-all duration-300 group-hover:shadow-lg">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Browse All Professionals
          </Button>
        </div>
      </div>
    </section>
  );
};
