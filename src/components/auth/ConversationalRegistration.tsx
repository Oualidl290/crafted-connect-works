
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
  const [geminiResponse, setGeminiResponse] = useState<any>(null);
  const { toast } = useToast();

  const processUserText = async () => {
    if (!userText.trim()) {
      setError('يرجى كتابة معلومات عن نفسك');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('Sending text to extract-profile function:', userText.trim());
      
      const response = await supabase.functions.invoke('extract-profile', {
        body: { userText: userText.trim() }
      });

      console.log('Response from extract-profile function:', response);

      if (response.error) {
        console.error('Function invocation error:', response.error);
        throw new Error(response.error.message || 'Failed to process text');
      }

      if (!response.data) {
        throw new Error('No response data received from the function');
      }

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to extract profile information');
      }

      console.log('Successfully extracted data:', response.data.data);
      setExtractedData(response.data.data);
      setGeminiResponse(response.data);
      
      toast({
        title: "تم استخراج المعلومات بنجاح",
        description: "يرجى مراجعة المعلومات المستخرجة وتأكيدها",
      });

    } catch (err: any) {
      console.error('Profile extraction error:', err);
      const errorMessage = err.message || 'فشل في معالجة النص. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      toast({
        title: "خطأ",
        description: errorMessage,
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
      
      // Generate unique identifiers
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const tempEmail = `worker_${timestamp}_${randomSuffix}@crafted.temp`;
      const tempPassword = `temp_${timestamp}_${randomSuffix}`;

      console.log('Creating auth user with email:', tempEmail);

      // Step 1: Create authentication user
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
        throw new Error(`فشل في إنشاء حساب المستخدم: ${authError.message}`);
      }

      if (!authData.user) {
        console.error('No user data returned from auth');
        throw new Error('فشل في إنشاء حساب المستخدم');
      }

      const userId = authData.user.id;
      console.log('Auth user created successfully:', userId);

      // Step 2: Wait a moment for any triggers to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Check if user record exists, if not create it
      let { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (checkError) {
        console.warn('Error checking user existence:', checkError);
      }

      if (!existingUser) {
        console.log('Creating user record manually...');
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: tempEmail,
            full_name: extractedData.full_name,
            role: 'worker'
          });

        if (userError) {
          console.error('Error creating user record:', userError);
          // Don't throw here, continue with worker creation
        } else {
          console.log('User record created successfully');
        }
      } else {
        console.log('User record already exists');
      }

      // Step 4: Create worker profile
      console.log('Creating worker profile...');
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .insert({
          user_id: userId,
          phone: `temp_${timestamp}`,
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
        throw new Error(`فشل في إنشاء ملف العامل: ${workerError.message}`);
      }

      console.log('Worker profile created successfully:', workerData.id);

      // Step 5: Store extracted profile information
      try {
        console.log('Storing extracted profile information...');
        const { error: extractedProfileError } = await supabase
          .from('extracted_profiles')
          .insert({
            worker_id: workerData.id,
            original_text: userText.trim(),
            extracted_full_name: extractedData.full_name,
            extracted_profession: extractedData.profession,
            extracted_city: extractedData.city,
            extracted_experience_years: extractedData.experience_years || null,
            extraction_confidence: 0.95,
            gemini_response: geminiResponse
          });

        if (extractedProfileError) {
          console.warn('Failed to store extracted profile:', extractedProfileError);
        } else {
          console.log('Extracted profile information stored successfully');
        }
      } catch (extractError) {
        console.warn('Error storing extracted profile:', extractError);
      }

      // Step 6: Create initial trust score
      try {
        const { error: trustScoreError } = await supabase
          .from('trust_scores')
          .insert({
            worker_id: workerData.id,
            overall_score: 10,
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
          console.warn('Failed to create trust score:', trustScoreError);
        } else {
          console.log('Trust score created successfully');
        }
      } catch (trustError) {
        console.warn('Error creating trust score:', trustError);
      }

      console.log('Worker registration completed successfully');

      toast({
        title: "تم إنشاء الملف الشخصي بنجاح",
        description: `مرحباً ${extractedData.full_name}! تم إنشاء ملفك الشخصي بنجاح.`,
      });

      onRegistrationComplete(workerData.id);

    } catch (err: any) {
      console.error('Profile creation error:', err);
      const errorMessage = err.message || 'فشل في إنشاء الملف الشخصي. يرجى المحاولة مرة أخرى.';
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
    setGeminiResponse(null);
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
