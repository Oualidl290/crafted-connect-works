
import { Button } from "@/components/ui/button";

export const PopularCategories = () => {
  const categories = [
    { name: "Plumber", icon: "🔧", count: "500+ pros" },
    { name: "Electrician", icon: "⚡", count: "450+ pros" },
    { name: "Carpenter", icon: "🔨", count: "380+ pros" },
    { name: "HVAC Specialist", icon: "❄️", count: "320+ pros" },
    { name: "Painter", icon: "🎨", count: "290+ pros" },
    { name: "Roofer", icon: "🏠", count: "240+ pros" },
    { name: "Landscaper", icon: "🌱", count: "350+ pros" },
    { name: "Handyman", icon: "🛠️", count: "600+ pros" }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
            Popular <span className="text-orange-600">Categories</span>
          </h2>
          <p className="text-xl text-stone-600">
            Find the right professional for your project
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-6 border-2 border-stone-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-2xl group bg-gradient-to-br from-white to-stone-50/50"
            >
              <div className="text-center">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <div className="text-stone-900 font-semibold text-lg mb-1">
                  {category.name}
                </div>
                <div className="text-stone-500 text-sm">
                  {category.count}
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};
