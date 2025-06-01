
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LanguageToggle, LanguageProvider, useLanguage } from "@/components/LanguageToggle";
import { Link, useParams } from "react-router-dom";
import { Wrench, Send, Phone, Calendar, CheckCircle, X } from "lucide-react";

const ChatPageContent = () => {
  const { isArabic } = useLanguage();
  const { jobId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'worker',
      text: isArabic ? 'السلام عليكم! شاهدت طلبك للعمل الكهربائي. يمكنني البدء غداً صباحاً.' : 'Bonjour! J\'ai vu votre demande de travail électrique. Je peux commencer demain matin.',
      time: '10:30',
      type: 'text'
    },
    {
      id: 2,
      sender: 'client',
      text: isArabic ? 'ممتاز! ما هو السعر المتوقع؟' : 'Parfait! Quel est le prix attendu?',
      time: '10:32',
      type: 'text'
    },
    {
      id: 3,
      sender: 'worker',
      text: isArabic ? 'بناءً على الوصف، أقدر التكلفة بـ 800 درهم شاملة المواد.' : 'Basé sur la description, j\'estime le coût à 800 MAD matériaux inclus.',
      time: '10:35',
      type: 'offer',
      offer: {
        amount: '800 MAD',
        description: isArabic ? 'تركيب وصيانة كهربائية شاملة' : 'Installation et maintenance électrique complète'
      }
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const content = {
    ar: {
      title: "المحادثة",
      worker: "أحمد المهدي",
      online: "متصل",
      typePlaceholder: "اكتب رسالتك...",
      send: "إرسال",
      offer: "عرض سعر",
      accept: "قبول",
      decline: "رفض",
      confirmJob: "تأكيد العمل",
      jobConfirmed: "تم تأكيد العمل",
      callWorker: "اتصال بالحَرَفي",
      scheduleVisit: "جدولة زيارة"
    },
    fr: {
      title: "Discussion",
      worker: "Ahmed Mehdi",
      online: "en ligne",
      typePlaceholder: "Tapez votre message...",
      send: "Envoyer",
      offer: "Offre de prix",
      accept: "Accepter",
      decline: "Refuser",
      confirmJob: "Confirmer le travail",
      jobConfirmed: "Travail confirmé",
      callWorker: "Appeler l'artisan",
      scheduleVisit: "Programmer visite"
    }
  };

  const text = content[isArabic ? 'ar' : 'fr'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'client',
        text: message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleAcceptOffer = () => {
    const confirmMessage = {
      id: messages.length + 1,
      sender: 'system',
      text: text.jobConfirmed,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      type: 'system'
    };
    setMessages([...messages, confirmMessage]);
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

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{text.worker.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{text.worker}</h3>
                      <p className="text-sm text-green-600">{text.online}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      {text.callWorker}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {text.scheduleVisit}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'client' 
                        ? 'bg-orange-600 text-white' 
                        : msg.sender === 'system'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {msg.type === 'offer' && msg.offer ? (
                        <div className="space-y-3">
                          <div className="font-semibold text-orange-600">{text.offer}</div>
                          <div>
                            <div className="font-bold text-lg">{msg.offer.amount}</div>
                            <div className="text-sm">{msg.offer.description}</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={handleAcceptOffer}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {text.accept}
                            </Button>
                            <Button size="sm" variant="outline">
                              <X className="h-3 w-3 mr-1" />
                              {text.decline}
                            </Button>
                          </div>
                        </div>
                      ) : msg.type === 'system' ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>{msg.text}</span>
                        </div>
                      ) : (
                        <div>
                          <p>{msg.text}</p>
                          <div className={`text-xs mt-1 ${
                            msg.sender === 'client' ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {msg.time}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder={text.typePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    dir={isArabic ? 'rtl' : 'ltr'}
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">{isArabic ? 'تفاصيل العمل' : 'Détails du travail'}</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">{isArabic ? 'النوع' : 'Type'}</div>
                  <div className="font-medium">{isArabic ? 'تركيب كهربائي' : 'Installation électrique'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{isArabic ? 'التاريخ' : 'Date'}</div>
                  <div className="font-medium">{isArabic ? 'غداً 9:00 ص' : 'Demain 9:00'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{isArabic ? 'الحالة' : 'Statut'}</div>
                  <div className="text-orange-600 font-medium">{isArabic ? 'في الانتظار' : 'En attente'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  return (
    <LanguageProvider>
      <ChatPageContent />
    </LanguageProvider>
  );
};

export default ChatPage;
