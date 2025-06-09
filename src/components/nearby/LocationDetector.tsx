
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface LocationDetectorProps {
  onLocationDetected: (location: UserLocation) => void;
}

export const LocationDetector: React.FC<LocationDetectorProps> = ({ onLocationDetected }) => {
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('الموقع الجغرافي غير مدعوم في هذا المتصفح');
      return;
    }

    setDetecting(true);
    setError('');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location detected:', position.coords);
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        onLocationDetected(location);
        setDetecting(false);
      },
      (error) => {
        console.error('Location detection error:', error);
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض الإذن للوصول إلى الموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'موقعك غير متاح حالياً. تأكد من تفعيل خدمات الموقع.';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى.';
            break;
          default:
            errorMessage = 'حدث خطأ في تحديد موقعك. يرجى المحاولة مرة أخرى.';
        }
        setError(errorMessage);
        setDetecting(false);
      },
      options
    );
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center space-x-2">
          <MapPin className="h-6 w-6 text-orange-600" />
          <span>تحديد موقعك</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          للعثور على العمال القريبين منك، نحتاج إلى تحديد موقعك الحالي
        </p>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={detectLocation} 
          disabled={detecting}
          className="bg-orange-600 hover:bg-orange-700"
          size="lg"
        >
          {detecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              جاري تحديد الموقع...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              تحديد موقعي الحالي
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500">
          لن نحفظ أو نشارك معلومات موقعك مع أي طرف ثالث
        </p>
      </CardContent>
    </Card>
  );
};
