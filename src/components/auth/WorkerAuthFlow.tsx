
import React, { useState } from 'react';
import { ConversationalRegistration } from './ConversationalRegistration';
import { useNavigate } from 'react-router-dom';

type AuthStep = 'registration' | 'complete';

export const WorkerAuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('registration');
  const [workerId, setWorkerId] = useState<string>('');
  const navigate = useNavigate();

  const handleRegistrationComplete = (workerId: string) => {
    setWorkerId(workerId);
    setCurrentStep('complete');
    
    // Redirect to the worker profile page after a short delay
    setTimeout(() => {
      navigate(`/worker-profile/${workerId}`);
    }, 3000);
  };

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-stone-900">مرحباً بك في Crafted!</h1>
          <p className="text-gray-600">
            تم إنشاء ملفك الشخصي بنجاح. سيتم توجيهك إلى صفحة الملف الشخصي...
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate(`/worker-profile/${workerId}`)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              عرض الملف الشخصي
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">انضم إلى Crafted</h1>
          <p className="text-lg text-gray-600">منصة المهنيين المغاربة المتخصصين</p>
        </div>

        {/* Registration Component */}
        <ConversationalRegistration onRegistrationComplete={handleRegistrationComplete} />
      </div>
    </div>
  );
};
