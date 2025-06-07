
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MessageCircle, User, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConversationalRegistrationProps {
  onRegistrationComplete: (workerId: string) => void;
}

interface ExtractedData {
  full_name: string;
  profession: string;
  city: string;
  experience_years?: number;
}

export const ConversationalRegistration: React.FC<ConversationalRegistrationProps> = ({ 
  onRegistrationComplete 
}) => {
  const [userText, setUserText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const processUserText = async () => {
    if (!userText.trim()) {
      setError('يرجى كتابة معلومات عن نفسك');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await supabase.functions.invoke('extract-profile', {
        body: { userText: userText.trim() }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to process text');
      }

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to extract profile information');
      }

      setExtractedData(response.data.data);
      toast({
        title: "تم استخراج المعلومات بنجاح",
        description: "يرجى مراجعة المعلومات المستخرجة وتأكيدها",
      });

    } catch (err: any) {
      console.error('Profile extraction error:', err);
      setError(err.message || 'فشل في معالجة النص. يرجى المحاولة مرة أخرى.');
      toast({
        title: "خطأ",
        description: err.message || 'فشل في معالجة النص',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const createProfile = async () => {
    if (!extractedData) return;

    setIsCreatingProfile(true);
    setError('');

    try {
      console.log('Starting worker profile creation with extracted data:', extractedData);
      
      // Create a valid email format using timestamp
      const timestamp = Date.now();
      const tempEmail = `worker_${timestamp}@crafted.temp.com`;
      const tempPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

      console.log('Creating auth user with email:', tempEmail);

      // Create user account with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
        options: {
          data: {
            full_name: extractedData.full_name,
            role: 'worker'
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('No user data returned from auth');
        throw new Error('Failed to create user account');
      }

      console.log('Auth user created successfully:', authData.user.id);

      // Wait for the trigger to create the user profile
      console.log('Waiting for user profile creation trigger...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify the user profile was created
      console.log('Checking if user profile was created...');
      const { data: userProfile, error: userCheckError } = await supabase
        .from('users')
        .select('id, role, full_name')
        .eq('id', authData.user.id)
        .single();

      if (userCheckError) {
        console.error('Error checking user profile:', userCheckError);
        console.log('Manually creating user profile...');
        
        // Try to create the user profile manually
        const { error: manualUserError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: tempEmail,
            full_name: extractedData.full_name,
            role: 'worker'
          });

        if (manualUserError) {
          console.error('Manual user creation error:', manualUserError);
          throw new Error('Failed to create user profile');
        }
        console.log('User profile created manually');
      } else {
        console.log('User profile found:', userProfile);
      }

      // Create worker profile
      console.log('Creating worker profile...');
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .insert({
          user_id: authData.user.id,
          phone: `temp_${timestamp}`, // Temporary phone number
          full_name: extractedData.full_name,
          city: extractedData.city,
          trade: extractedData.profession,
          bio: extractedData.experience_years ? 
            `خبرة ${extractedData.experience_years} سنوات في ${extractedData.profession}` : 
            `متخصص في ${extractedData.profession}`,
          identity_verification_status: 'pending',
          is_approved: false,
          profile_completion: 70,
          rating_avg: 0.0,
          rating_count: 0
        })
        .select()
        .single();

      if (workerError) {
        console.error('Worker creation error:', workerError);
        throw workerError;
      }

      console.log('Worker profile created successfully:', workerData.id);

      // Create initial trust score record
      console.log('Creating trust score record...');
      const { error: trustScoreError } = await supabase
        .from('trust_scores')
        .insert({
          worker_id: workerData.id,
          overall_score: 10, // Starting score for basic info
          identity_score: 0,
          skill_score: extractedData.experience_years ? Math.min(15, extractedData.experience_years * 2) : 5,
          reputation_score: 0,
          reliability_score: 0,
          total_jobs: 0,
          completed_jobs: 0,
          average_rating: 0,
          last_calculated: new Date().toISOString()
        });

      if (trustScoreError) {
        console.warn('Failed to create trust score record:', trustScoreError);
      }

      console.log('Worker registration completed successfully');

      toast({
        title: "تم إنشاء الملف الشخصي بنجاح",
        description: `مرحباً ${extractedData.full_name}! تم إنشاء ملفك الشخصي بنجاح.`,
      });

      onRegistrationComplete(workerData.id);
    } catch (err: any) {
      console.error('Profile creation error:', err);
      const errorMessage = err.message || 'فشل في إنشاء الملف الشخصي';
      setError(errorMessage);
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const resetForm = () => {
    setExtractedData(null);
    setUserText('');
    setError('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
          <MessageCircle className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">أخبرنا عن نفسك</CardTitle>
        <p className="text-gray-600">اكتب جملة تصف نفسك وخبرتك ومهنتك</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!extractedData ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">قل لنا من أنت وماذا تعمل</label>
                <textarea
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="مثال: أنا اسمي أحمد، سباك من الدار البيضاء، عندي 7 سنين ديال التجربة..."
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  disabled={isProcessing}
                  dir="rtl"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">نصائح للحصول على أفضل النتائج</h4>
                    <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                      <li>اذكر اسمك الكامل</li>
                      <li>حدد مهنتك أو تخصصك</li>
                      <li>اذكر المدينة التي تعمل بها</li>
                      <li>أضف سنوات خبرتك إن أمكن</li>
                    </ul>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={processUserText} 
                disabled={isProcessing || !userText.trim()} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  'معالجة المعلومات'
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <h3 className="font-medium">تم استخراج المعلومات بنجاح</h3>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div>
                  <span className="font-medium text-gray-700">الاسم: </span>
                  <span className="text-gray-900">{extractedData.full_name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المهنة: </span>
                  <span className="text-gray-900">{extractedData.profession}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المدينة: </span>
                  <span className="text-gray-900">{extractedData.city}</span>
                </div>
                {extractedData.experience_years && (
                  <div>
                    <span className="font-medium text-gray-700">سنوات الخبرة: </span>
                    <span className="text-gray-900">{extractedData.experience_years}</span>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-3">
                <Button 
                  onClick={createProfile} 
                  disabled={isCreatingProfile} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isCreatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      إنشاء الملف الشخصي...
                    </>
                  ) : (
                    'تأكيد وإنشاء الملف الشخصي'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={resetForm} 
                  disabled={isCreatingProfile}
                  className="flex-1"
                >
                  تعديل المعلومات
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
