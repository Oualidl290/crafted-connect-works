
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, MapPin, Briefcase } from "lucide-react";
import { useLanguage } from "./LanguageToggle";

export const BilingualWhyCrafted = () => {
  const { isArabic } = useLanguage();

  const content = {
    ar: {
      title: "لماذا",
      platform: "كرافتد",
      subtitle: "نؤمن بكرامة العمل - خاصة ذلك المُنجَز بعناية ودقة وفخر",
      features: [
        {
          icon: Wrench,
          title: "مهارة بالخبرة",
          description: "كل حَرَفي مُوثّق من خلال الخبرة، ليس فقط الشهادات. عمل حقيقي، نتائج حقيقية.",
          color: "text-orange-600"
        },
        {
          icon: MapPin,
          title: "ثقة محلية",
          description: "ثقة مبنية من المجتمع من خلال مراجعات صادقة وروابط محلية تهم.",
          color: "text-emerald-600"
        },
        {
          icon: Briefcase,
          title: "عمل بكرامة",
          description: "أسعار عادلة، احترام للحِرَفية، وأدوات تُعطي الأولوية للمهنيين.",
          color: "text-blue-600"
        }
      ]
    },
    fr: {
      title: "Pourquoi",
      platform: "Crafted",
      subtitle: "Nous croyons en la dignité du travail - surtout celui fait avec soin, précision et fierté",
      features: [
        {
          icon: Wrench,
          title: "Compétent par Expérience",
          description: "Chaque artisan est vérifié par l'expérience, pas seulement les credentials. Vrai travail, vrais résultats.",
          color: "text-orange-600"
        },
        {
          icon: MapPin,
          title: "Confiance Locale",
          description: "Confiance construite par la communauté à travers des avis honnêtes et des connexions locales importantes.",
          color: "text-emerald-600"
        },
        {
          icon: Briefcase,
          title: "Travail avec Dignité",
          description: "Prix équitables, respect pour l'artisanat, et outils qui mettent les professionnels en premier.",
          color: "text-blue-600"
        }
      ]
    }
  };

  const text = content[isArabic ? 'ar' : 'fr'];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-stone-900 mb-6 ${isArabic ? 'font-bold' : ''}`}>
            {text.title} <span className="text-orange-600">{text.platform}</span>؟
          </h2>
          <p className={`text-xl text-stone-600 max-w-3xl mx-auto ${isArabic ? 'leading-relaxed' : ''}`}>
            {text.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {text.features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-stone-50/50 rounded-2xl group">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.color} bg-gradient-to-br from-stone-100 to-stone-200 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className={`text-2xl font-bold text-stone-900 mb-4 ${isArabic ? 'font-bold' : ''}`}>
                  {feature.title}
                </h3>
                <p className={`text-stone-600 leading-relaxed ${isArabic ? 'leading-loose' : ''}`}>
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
