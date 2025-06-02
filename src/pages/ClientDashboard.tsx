import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LanguageToggle, LanguageProvider, useLanguage } from "@/components/LanguageToggle";
import { Link } from "react-router-dom";
import { Wrench, Calendar, Star, MessageCircle, Heart, Bell, User, MapPin } from "lucide-react";

const ClientDashboardContent = () => {
  const { isArabic } = useLanguage();
  const [activeTab, setActiveTab] = useState('bookings');

  const content = {
    ar: {
      title: "لوحة الزبون",
      tabs: {
        bookings: "حجوزاتي",
        favorites: "المفضلين",
        notifications: "الإشعارات",
        profile: "تحديث المعلومات"
      },
      upcoming: "القادمة",
      completed: "المكتملة",
      cancelled: "الملغية",
      chatWith: "محادثة مع",
      viewProfile: "عرض الملف",
      reschedule: "إعادة جدولة",
      cancel: "إلغاء",
      rate: "تقييم",
      noBookings: "لا توجد حجوزات",
      noFavorites: "لا توجد مفضلين",
      noNotifications: "لا توجد إشعارات",
      bookings: [
        {
          id: "1",
          worker: "أحمد المهدي",
          service: "تركيب كهربائي",
          date: "2024-02-15",
          time: "9:00 ص",
          status: "upcoming",
          price: "800 درهم"
        },
        {
          id: "2",
          worker: "فاطمة الزهراء",
          service: "تنظيف منزل",
          date: "2024-02-10",
          time: "2:00 م",
          status: "completed",
          price: "300 درهم"
        }
      ],
      favorites: [
        {
          id: "1",
          name: "أحمد المهدي",
          trade: "كهربائي",
          rating: 4.8,
          city: "الرباط"
        },
        {
          id: "2",
          name: "محمد الأمين",
          trade: "سباك",
          rating: 4.9,
          city: "الدار البيضاء"
        }
      ],
      notifications: [
        {
          id: "1",
          title: "تأكيد الحجز",
          message: "تم تأكيد حجزك مع أحمد المهدي",
          time: "منذ ساعة",
          read: false
        },
        {
          id: "2",
          title: "تذكير",
          message: "موعدك غداً في 9:00 صباحاً",
          time: "منذ 3 ساعات",
          read: true
        }
      ]
    },
    fr: {
      title: "Tableau de Bord Client",
      tabs: {
        bookings: "Mes Réservations",
        favorites: "Favoris",
        notifications: "Notifications",
        profile: "Profil"
      },
      upcoming: "À venir",
      completed: "Terminées",
      cancelled: "Annulées",
      chatWith: "Discuter avec",
      viewProfile: "Voir profil",
      reschedule: "Reprogrammer",
      cancel: "Annuler",
      rate: "Noter",
      noBookings: "Aucune réservation",
      noFavorites: "Aucun favori",
      noNotifications: "Aucune notification",
      bookings: [
        {
          id: "1",
          worker: "Ahmed Mehdi",
          service: "Installation électrique",
          date: "2024-02-15",
          time: "9:00",
          status: "upcoming",
          price: "800 MAD"
        },
        {
          id: "2",
          worker: "Fatima Zahra",
          service: "Nettoyage maison",
          date: "2024-02-10",
          time: "14:00",
          status: "completed",
          price: "300 MAD"
        }
      ],
      favorites: [
        {
          id: "1",
          name: "Ahmed Mehdi",
          trade: "Électricien",
          rating: 4.8,
          city: "Rabat"
        },
        {
          id: "2",
          name: "Mohamed Amine",
          trade: "Plombier",
          rating: 4.9,
          city: "Casablanca"
        }
      ],
      notifications: [
        {
          id: "1",
          title: "Confirmation de réservation",
          message: "Votre réservation avec Ahmed Mehdi est confirmée",
          time: "il y a 1h",
          read: false
        },
        {
          id: "2",
          title: "Rappel",
          message: "Votre rendez-vous demain à 9:00",
          time: "il y a 3h",
          read: true
        }
      ]
    }
  };

  const text = content[isArabic ? 'ar' : 'fr'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderBookings = () => (
    <div className="space-y-4">
      {text.bookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{booking.worker.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{booking.worker}</h3>
                  <p className="text-gray-600">{booking.service}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.date} - {booking.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status === 'upcoming' ? text.upcoming : 
                   booking.status === 'completed' ? text.completed : text.cancelled}
                </Badge>
                <div className="font-semibold text-green-600">{booking.price}</div>
                
                <div className="flex space-x-2">
                  {booking.status === 'upcoming' && (
                    <>
                      <Link to={`/chat/${booking.id}`}>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {text.chatWith}
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        {text.reschedule}
                      </Button>
                    </>
                  )}
                  {booking.status === 'completed' && (
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <Star className="h-3 w-3 mr-1" />
                      {text.rate}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFavorites = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {text.favorites.map((favorite) => (
        <Card key={favorite.id}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{favorite.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{favorite.name}</h3>
                <p className="text-gray-600">{favorite.trade}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium">{favorite.rating}</span>
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{favorite.city}</span>
              </div>
              
              <Link to={`/worker/${favorite.id}`}>
                <Button size="sm" variant="outline">
                  {text.viewProfile}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      {text.notifications.map((notification) => (
        <Card key={notification.id} className={notification.read ? 'opacity-60' : ''}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Bell className={`h-5 w-5 mt-1 ${notification.read ? 'text-gray-400' : 'text-orange-600'}`} />
              <div className="flex-1">
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-gray-600 text-sm">{notification.message}</p>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderProfile = () => (
    <Card>
      <CardHeader>
        <CardTitle>{isArabic ? 'معلوماتي الشخصية' : 'Mes Informations'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{isArabic ? 'الاسم الكامل' : 'Nom complet'}</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Entrez votre nom complet'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{isArabic ? 'البريد الإلكتروني' : 'Email'}</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Entrez votre email'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{isArabic ? 'رقم الهاتف' : 'Téléphone'}</label>
            <input 
              type="tel" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={isArabic ? 'أدخل رقم هاتفك' : 'Entrez votre téléphone'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{isArabic ? 'المدينة' : 'Ville'}</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={isArabic ? 'أدخل مدينتك' : 'Entrez votre ville'}
            />
          </div>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          {isArabic ? 'حفظ التغييرات' : 'Enregistrer les modifications'}
        </Button>
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
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  return (
    <LanguageProvider>
      <ClientDashboardContent />
    </LanguageProvider>
  );
};

export default ClientDashboard;
