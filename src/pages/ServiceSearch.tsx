
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LanguageToggle, LanguageProvider, useLanguage } from "@/components/LanguageToggle";
import { Link } from "react-router-dom";
import { Wrench, MapPin, Star, Search } from "lucide-react";

const ServiceSearchContent = () => {
  const { isArabic } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const content = {
    ar: {
      title: "البحث عن خدمة",
      searchPlaceholder: "ابحث عن خدمة...",
      categoryLabel: "الفئة",
      cityLabel: "المدينة",
      ratingLabel: "التقييم",
      availabilityLabel: "التوفر",
      today: "اليوم",
      tomorrow: "الغد",
      bookButton: "أحجز",
      categories: ["الكل", "كهربائي", "سباك", "نجار", "دهان", "تنظيف"],
      cities: ["الكل", "الرباط", "الدار البيضاء", "فاس", "مراكش"],
      workers: [
        {
          id: "1",
          name: "أحمد المهدي",
          trade: "كهربائي",
          city: "الرباط",
          rating: 4.8,
          price: "150 درهم/ساعة",
          image: "/placeholder.svg"
        },
        {
          id: "2", 
          name: "فاطمة الزهراء",
          trade: "تنظيف منازل",
          city: "الدار البيضاء",
          rating: 4.9,
          price: "120 درهم/ساعة",
          image: "/placeholder.svg"
        }
      ]
    },
    fr: {
      title: "Recherche de Service",
      searchPlaceholder: "Rechercher un service...",
      categoryLabel: "Catégorie",
      cityLabel: "Ville",
      ratingLabel: "Note",
      availabilityLabel: "Disponibilité",
      today: "Aujourd'hui",
      tomorrow: "Demain",
      bookButton: "Réserver",
      categories: ["Tous", "Électricien", "Plombier", "Menuisier", "Peintre", "Nettoyage"],
      cities: ["Toutes", "Rabat", "Casablanca", "Fès", "Marrakech"],
      workers: [
        {
          id: "1",
          name: "Ahmed Mehdi",
          trade: "Électricien",
          city: "Rabat",
          rating: 4.8,
          price: "150 MAD/heure",
          image: "/placeholder.svg"
        },
        {
          id: "2",
          name: "Fatima Zahra",
          trade: "Nettoyage",
          city: "Casablanca", 
          rating: 4.9,
          price: "120 MAD/heure",
          image: "/placeholder.svg"
        }
      ]
    }
  };

  const text = content[isArabic ? 'ar' : 'fr'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className={`flex items-center space-x-2 ${isArabic ? 'space-x-reverse' : ''}`}>
              <Wrench className="h-8 w-8 text-orange-600" />
              <span className={`text-2xl font-bold text-stone-900 ${isArabic ? 'font-bold' : ''}`}>
                {isArabic ? 'كرافتد' : 'Crafted'}
              </span>
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold text-stone-900 mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
          {text.title}
        </h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={text.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">{text.categoryLabel}</option>
              {text.categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>

            <select 
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">{text.cityLabel}</option>
              {text.cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>

            <Button className="bg-orange-600 hover:bg-orange-700">
              <Search className="h-4 w-4 mr-2" />
              {isArabic ? 'بحث' : 'Rechercher'}
            </Button>
          </div>
        </div>

        {/* Worker Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {text.workers.map((worker) => (
            <Card key={worker.id} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={worker.image} />
                    <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-stone-900">{worker.name}</h3>
                    <p className="text-stone-600 text-sm">{worker.trade}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{worker.city}</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{worker.rating}</span>
                  <span className="text-sm text-gray-500">({Math.floor(Math.random() * 50) + 10} تقييم)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {worker.price}
                  </Badge>
                  <Link to={`/worker/${worker.id}`}>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      {text.bookButton}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceSearch = () => {
  return (
    <LanguageProvider>
      <ServiceSearchContent />
    </LanguageProvider>
  );
};

export default ServiceSearch;
