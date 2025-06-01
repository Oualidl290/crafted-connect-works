
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LanguageToggle, LanguageProvider, useLanguage } from "@/components/LanguageToggle";
import { Link } from "react-router-dom";
import { Wrench, Calendar, Star, Message, DollarSign, CheckCircle, X, Edit, TrendingUp } from "lucide-react";

const WorkerDashboardContent = () => {
  const { isArabic } = useLanguage();
  const [activeTab, setActiveTab] = useState('requests');

  const content = {
    ar: {
      title: "لوحة الحَرَفي",
      tabs: {
        requests: "الطلبات",
        earnings: "الأرباح",
        reviews: "التقييمات",
        profile: "تعديل الملف",
        calendar: "التقويم"
      },
      newRequests: "طلبات جديدة",
      activeJobs: "أعمال نشطة",
      completedJobs: "أعمال مكتملة",
      accept: "قبول",
      decline: "رفض",
      chatWith: "محادثة مع",
      markComplete: "تحديد كمكتمل",
      thisMonth: "هذا الشهر",
      thisWeek: "هذا الأسبوع",
      totalEarnings: "إجمالي الأرباح",
      pendingPayments: "مدفوعات معلقة",
      completedJobs: "أعمال مكتملة",
      avgRating: "متوسط التقييم",
      available: "متاح",
      busy: "مشغول",
      setAvailability: "تحديد التوفر",
      updateProfile: "تحديث الملف",
      requests: [
        {
          id: "1",
          client: "سعاد بنعلي",
          service: "تركيب كهربائي",
          location: "الرباط",
          requestedDate: "2024-02-15",
          requestedTime: "9:00 ص",
          budget: "800 درهم",
          status: "new"
        },
        {
          id: "2",
          client: "محمد الأمين",
          service: "صيانة كهربائية",
          location: "سلا",
          requestedDate: "2024-02-16",
          requestedTime: "2:00 م",
          budget: "400 درهم",
          status: "active"
        }
      ],
      reviews: [
        {
          id: "1",
          client: "فاطمة الزهراء",
          rating: 5,
          comment: "عمل ممتاز وسريع. أنصح به بشدة!",
          date: "منذ أسبوع",
          service: "تركيب إضاءة"
        },
        {
          id: "2",
          client: "أحمد الحسني",
          rating: 4,
          comment: "خدمة جيدة وأسعار معقولة.",
          date: "منذ أسبوعين",
          service: "صيانة كهربائية"
        }
      ]
    },
    fr: {
      title: "Tableau de Bord Artisan",
      tabs: {
        requests: "Demandes",
        earnings: "Revenus",
        reviews: "Avis",
        profile: "Profil",
        calendar: "Calendrier"
      },
      newRequests: "Nouvelles demandes",
      activeJobs: "Travaux actifs",
      completedJobs: "Travaux terminés",
      accept: "Accepter",
      decline: "Refuser",
      chatWith: "Discuter avec",
      markComplete: "Marquer terminé",
      thisMonth: "Ce mois",
      thisWeek: "Cette semaine",
      totalEarnings: "Revenus totaux",
      pendingPayments: "Paiements en attente",
      avgRating: "Note moyenne",
      available: "Disponible",
      busy: "Occupé",
      setAvailability: "Définir disponibilité",
      updateProfile: "Modifier profil",
      requests: [
        {
          id: "1",
          client: "Souad Benali",
          service: "Installation électrique",
          location: "Rabat",
          requestedDate: "2024-02-15",
          requestedTime: "9:00",
          budget: "800 MAD",
          status: "new"
        },
        {
          id: "2",
          client: "Mohamed Amine",
          service: "Maintenance électrique",
          location: "Salé",
          requestedDate: "2024-02-16",
          requestedTime: "14:00",
          budget: "400 MAD",
          status: "active"
        }
      ],
      reviews: [
        {
          id: "1",
          client: "Fatima Zahra",
          rating: 5,
          comment: "Excellent travail et rapide. Je le recommande vivement!",
          date: "il y a 1 semaine",
          service: "Installation éclairage"
        },
        {
          id: "2",
          client: "Ahmed Hassani",
          rating: 4,
          comment: "Bon service et prix raisonnables.",
          date: "il y a 2 semaines",
          service: "Maintenance électrique"
        }
      ]
    }
  };

  const text = content[isArabic ? 'ar' : 'fr'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRequests = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">{text.newRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">{text.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-gray-600">{text.completedJobs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Job Requests */}
      <div className="space-y-4">
        {text.requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{request.client.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{request.client}</h3>
                    <p className="text-gray-600">{request.service}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{request.location}</span>
                      <span>{request.requestedDate} - {request.requestedTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <Badge className={getStatusColor(request.status)}>
                    {request.status === 'new' ? text.newRequests : text.activeJobs}
                  </Badge>
                  <div className="font-semibold text-green-600">{request.budget}</div>
                  
                  <div className="flex space-x-2">
                    {request.status === 'new' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {text.accept}
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="h-3 w-3 mr-1" />
                          {text.decline}
                        </Button>
                      </>
                    )}
                    {request.status === 'active' && (
                      <>
                        <Link to={`/chat/${request.id}`}>
                          <Button size="sm" variant="outline">
                            <Message className="h-3 w-3 mr-1" />
                            {text.chatWith}
                          </Button>
                        </Link>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          {text.markComplete}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">2,400 MAD</div>
            <div className="text-sm text-gray-600">{text.thisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">600 MAD</div>
            <div className="text-sm text-gray-600">{text.thisWeek}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">15,500 MAD</div>
            <div className="text-sm text-gray-600">{text.totalEarnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">800 MAD</div>
            <div className="text-sm text-gray-600">{text.pendingPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>{isArabic ? 'تطور الأرباح' : 'Évolution des revenus'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">{isArabic ? 'رسم بياني للأرباح' : 'Graphique des revenus'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2 fill-current" />
            <div className="text-2xl font-bold text-yellow-600">4.8</div>
            <div className="text-sm text-gray-600">{text.avgRating}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-600">{isArabic ? 'إجمالي التقييمات' : 'Total avis'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {text.reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{review.client.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">{review.client}</h4>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <span className="text-sm text-gray-500">{review.service}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Availability Status */}
      <Card>
        <CardHeader>
          <CardTitle>{text.setAvailability}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-green-50 border-green-200 text-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              {text.available}
            </Button>
            <Button variant="outline">
              {text.busy}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle>{isArabic ? 'اكتمال الملف الشخصي' : 'Complétude du profil'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>{isArabic ? 'المعلومات الأساسية' : 'Informations de base'}</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex justify-between items-center">
              <span>{isArabic ? 'صور الأعمال' : 'Photos de travaux'}</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex justify-between items-center">
              <span>{isArabic ? 'التحقق من الهوية' : 'Vérification identité'}</span>
              <span className="text-orange-600">{isArabic ? 'في الانتظار' : 'En attente'}</span>
            </div>
          </div>
          
          <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
            <Edit className="h-4 w-4 mr-2" />
            {text.updateProfile}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderCalendar = () => (
    <Card>
      <CardHeader>
        <CardTitle>{isArabic ? 'تقويم المواعيد' : 'Calendrier des rendez-vous'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">{isArabic ? 'تقويم تفاعلي' : 'Calendrier interactif'}</span>
        </div>
      </CardContent>
    </Card>
  );

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

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {Object.entries(text.tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'earnings' && renderEarnings()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'calendar' && renderCalendar()}
        </div>
      </div>
    </div>
  );
};

const WorkerDashboard = () => {
  return (
    <LanguageProvider>
      <WorkerDashboardContent />
    </LanguageProvider>
  );
};

export default WorkerDashboard;
