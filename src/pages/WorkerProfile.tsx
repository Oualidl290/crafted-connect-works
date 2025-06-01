
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LanguageToggle, LanguageProvider, useLanguage } from "@/components/LanguageToggle";
import { Link, useParams } from "react-router-dom";
import { Wrench, MapPin, Star, Calendar, Camera, Message } from "lucide-react";

const WorkerProfileContent = () => {
  const { isArabic } = useLanguage();
  const { id } = useParams();

  const content = {
    ar: {
      experience: "الخبرة",
      skills: "المهارات",
      reviews: "التقييمات",
      gallery: "معرض الأعمال",
      bookNow: "احجز الآن",
      sendMessage: "إرسال رسالة",
      yearsExp: "سنوات خبرة",
      completedJobs: "عمل مكتمل",
      responseTime: "وقت الاستجابة",
      availability: "التوفر",
      available: "متاح",
      description: "كهربائي محترف مع خبرة 8 سنوات في جميع أنواع الأعمال الكهربائية. متخصص في التركيبات المنزلية والصناعية.",
      skillsList: ["تركيب كهربائي", "صيانة", "كاميرات مراقبة", "إضاءة LED"],
      reviews: [
        {
          name: "محمد الأمين",
          rating: 5,
          comment: "عمل ممتاز وسريع. أنصح به بشدة!",
          date: "منذ أسبوع"
        },
        {
          name: "سعاد بنعلي",
          rating: 4,
          comment: "خدمة جيدة وأسعار معقولة.",
          date: "منذ أسبوعين"
        }
      ]
    },
    fr: {
      experience: "Expérience",
      skills: "Compétences",
      reviews: "Avis",
      gallery: "Galerie",
      bookNow: "Réserver",
      sendMessage: "Envoyer message",
      yearsExp: "années d'expérience",
      completedJobs: "travaux terminés",
      responseTime: "temps de réponse",
      availability: "Disponibilité",
      available: "Disponible",
      description: "Électricien professionnel avec 8 ans d'expérience dans tous types de travaux électriques. Spécialisé dans les installations résidentielles et industrielles.",
      skillsList: ["Installation électrique", "Maintenance", "Caméras de surveillance", "Éclairage LED"],
      reviews: [
        {
          name: "Mohamed Amine",
          rating: 5,
          comment: "Excellent travail et rapide. Je le recommande vivement!",
          date: "il y a 1 semaine"
        },
        {
          name: "Souad Benali",
          rating: 4,
          comment: "Bon service et prix raisonnables.",
          date: "il y a 2 semaines"
        }
      ]
    }
  };

  const text = content[isArabic ? 'ar' : 'fr'];

  const workerData = {
    name: isArabic ? "أحمد المهدي" : "Ahmed Mehdi",
    trade: isArabic ? "كهربائي" : "Électricien",
    city: isArabic ? "الرباط" : "Rabat",
    rating: 4.8,
    totalReviews: 47,
    yearsExp: 8,
    completedJobs: 156,
    responseTime: isArabic ? "خلال ساعة" : "dans l'heure",
    price: "150 MAD/h"
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Worker Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl">{workerData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-stone-900 mb-2">{workerData.name}</h1>
                    <p className="text-xl text-orange-600 mb-3">{workerData.trade}</p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{workerData.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{workerData.rating}</span>
                        <span className="text-gray-500">({workerData.totalReviews} {text.reviews})</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{text.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600">{workerData.yearsExp}</div>
                  <div className="text-sm text-gray-600">{text.yearsExp}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{workerData.completedJobs}</div>
                  <div className="text-sm text-gray-600">{text.completedJobs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{workerData.responseTime}</div>
                  <div className="text-sm text-gray-600">{text.responseTime}</div>
                </CardContent>
              </Card>
            </div>

            {/* Skills */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{text.skills}</h3>
                <div className="flex flex-wrap gap-2">
                  {text.skillsList.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{text.reviews}</h3>
                <div className="space-y-4">
                  {text.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="font-medium">{review.name}</div>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{text.gallery}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">{workerData.price}</div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {text.available}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <Link to="/booking" className="block">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      {text.bookNow}
                    </Button>
                  </Link>
                  
                  <Link to="/chat" className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      <Message className="h-4 w-4 mr-2" />
                      {text.sendMessage}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkerProfile = () => {
  return (
    <LanguageProvider>
      <WorkerProfileContent />
    </LanguageProvider>
  );
};

export default WorkerProfile;
