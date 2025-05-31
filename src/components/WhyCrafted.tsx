
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, MapPin, Briefcase } from "lucide-react";

export const WhyCrafted = () => {
  const features = [
    {
      icon: Wrench,
      title: "Skilled by Experience",
      description: "Every pro is verified through experience, not just credentials. Real work, real results.",
      color: "text-orange-600"
    },
    {
      icon: MapPin,
      title: "Locally Trusted",
      description: "Community-built trust through honest reviews and local connections that matter.",
      color: "text-emerald-600"
    },
    {
      icon: Briefcase,
      title: "Work With Dignity",
      description: "Fair pricing, respect for craftsmanship, and tools that put professionals first.",
      color: "text-blue-600"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
            Why <span className="text-orange-600">Crafted</span>?
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            We believe in the dignity of work — especially the kind done with care, precision, and pride.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-stone-50/50 rounded-2xl group">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.color} bg-gradient-to-br from-stone-100 to-stone-200 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
