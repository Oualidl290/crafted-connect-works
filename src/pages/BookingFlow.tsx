
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LanguageToggle, LanguageProvider, useLanguage } from "@/components/LanguageToggle";
import { Link } from "react-router-dom";
import { Wrench, Calendar, MapPin, Clock, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

const BookingFlowContent = () => {
  const { isArabic } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    address: '',
    notes: ''
  });

  const content = {
    ar: {
      title: "حجز خدمة",
      steps: ["اختر الخدمة", "التاريخ والوقت", "العنوان", "التأكيد"],
      selectService: "اختر نوع الخدمة",
      selectDate: "اختر التاريخ",
      selectTime: "اختر الوقت",
      address: "العنوان",
      notes: "ملاحظات إضافية",
      notesPlaceholder: "أي تفاصيل إضافية عن العمل المطلوب...",
      next: "التالي",
      previous: "السابق",
      confirm: "تأكيد الحجز",
      success: "تم تأكيد الحجز بنجاح!",
      jobNumber: "رقم العمل",
      workerWillContact: "سيتواصل معك الحَرَفي قريباً",
      chatButton: "بدء المحادثة",
      services: ["تركيب كهربائي", "صيانة كهربائية", "تركيب كاميرات", "إضاءة LED"],
      times: ["9:00 صباحاً", "11:00 صباحاً", "2:00 مساءً", "4:00 مساءً"]
    },
    fr: {
      title: "Réservation de Service",
      steps: ["Choisir Service", "Date & Heure", "Adresse", "Confirmation"],
      selectService: "Choisissez le type de service",
      selectDate: "Choisissez la date",
      selectTime: "Choisissez l'heure",
      address: "Adresse",
      notes: "Notes supplémentaires",
      notesPlaceholder: "Détails supplémentaires sur le travail demandé...",
      next: "Suivant",
      previous: "Précédent",
      confirm: "Confirmer la réservation",
      success: "Réservation confirmée avec succès!",
      jobNumber: "Numéro de travail",
      workerWillContact: "L'artisan vous contactera bientôt",
      chatButton: "Commencer la discussion",
      services: ["Installation électrique", "Maintenance électrique", "Installation caméras", "Éclairage LED"],
      times: ["9:00", "11:00", "14:00", "16:00"]
    }
  };

  const text = content[isArabic ? 'ar' : 'fr'];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirm = () => {
    setCurrentStep(5); // Success step
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="service">{text.selectService}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {text.services.map((service, index) => (
                <Button
                  key={index}
                  variant={bookingData.service === service ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => setBookingData({...bookingData, service})}
                >
                  {service}
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="date">{text.selectDate}</Label>
              <Input
                type="date"
                id="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>{text.selectTime}</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {text.times.map((time, index) => (
                  <Button
                    key={index}
                    variant={bookingData.time === time ? "default" : "outline"}
                    onClick={() => setBookingData({...bookingData, time})}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">{text.address}</Label>
              <Input
                id="address"
                placeholder={isArabic ? "أدخل عنوانك الكامل..." : "Entrez votre adresse complète..."}
                value={bookingData.address}
                onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">{text.notes}</Label>
              <textarea
                id="notes"
                placeholder={text.notesPlaceholder}
                value={bookingData.notes}
                onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md h-24 resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{text.confirm}</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">{text.selectService}:</span>
                <span>{bookingData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{text.selectDate}:</span>
                <span>{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{text.selectTime}:</span>
                <span>{bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{text.address}:</span>
                <span>{bookingData.address}</span>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-600">{text.success}</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-medium">{text.jobNumber}: #JOB-{Math.floor(Math.random() * 10000)}</p>
              <p className="text-sm text-gray-600 mt-2">{text.workerWillContact}</p>
            </div>
            <Link to="/chat">
              <Button className="bg-orange-600 hover:bg-orange-700">
                {text.chatButton}
              </Button>
            </Link>
          </div>
        );

      default:
        return null;
    }
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

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
        {currentStep <= 4 && (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {text.steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index + 1 <= currentStep ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`ml-2 text-sm ${index + 1 <= currentStep ? 'text-orange-600' : 'text-gray-500'}`}>
                      {step}
                    </span>
                    {index < text.steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        index + 1 < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <h1 className={`text-3xl font-bold text-stone-900 mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
              {text.title}
            </h1>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{currentStep <= 4 ? text.steps[currentStep - 1] : ''}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}
            
            {currentStep <= 4 && (
              <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    {isArabic ? <ArrowRight className="h-4 w-4 mr-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
                    {text.previous}
                  </Button>
                )}
                
                {currentStep < 4 && (
                  <Button 
                    onClick={handleNext}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={
                      (currentStep === 1 && !bookingData.service) ||
                      (currentStep === 2 && (!bookingData.date || !bookingData.time)) ||
                      (currentStep === 3 && !bookingData.address)
                    }
                  >
                    {text.next}
                    {isArabic ? <ArrowLeft className="h-4 w-4 ml-2" /> : <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                )}
                
                {currentStep === 4 && (
                  <Button 
                    onClick={handleConfirm}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {text.confirm}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const BookingFlow = () => {
  return (
    <LanguageProvider>
      <BookingFlowContent />
    </LanguageProvider>
  );
};

export default BookingFlow;
