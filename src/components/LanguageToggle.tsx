
import React, { useState, createContext, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageContextType {
  isArabic: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  isArabic: true,
  toggleLanguage: () => {}
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isArabic, setIsArabic] = useState(true);

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  return (
    <LanguageContext.Provider value={{ isArabic, toggleLanguage }}>
      <div className={isArabic ? 'rtl' : 'ltr'} dir={isArabic ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const LanguageToggle: React.FC = () => {
  const { isArabic, toggleLanguage } = useLanguage();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-stone-300 hover:border-orange-300 hover:bg-orange-50"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {isArabic ? 'FR' : 'العربية'}
      </span>
    </Button>
  );
};
