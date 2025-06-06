
import React, { useState } from 'react';
import { PhoneVerification } from './PhoneVerification';
import { IdentityVerification } from './IdentityVerification';

type AuthStep = 'phone' | 'info' | 'complete';

export const WorkerAuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [verifiedPhone, setVerifiedPhone] = useState<string>('');
  const [workerId, setWorkerId] = useState<string>('');

  const handlePhoneVerified = (phone: string) => {
    setVerifiedPhone(phone);
    setCurrentStep('info');
  };

  const handleInfoComplete = (workerId: string) => {
    setWorkerId(workerId);
    setCurrentStep('complete');
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
          <h1 className="text-3xl font-bold text-stone-900">Welcome to Crafted!</h1>
          <p className="text-gray-600">
            Your profile has been created successfully. You can now start connecting with clients.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Continue to Platform
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center space-x-2 ${
              currentStep === 'phone' 
                ? 'text-orange-600' 
                : 'text-green-600'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'phone' 
                  ? 'bg-orange-100' 
                  : 'bg-green-100'
              }`}>
                {currentStep !== 'phone' ? '✓' : '1'}
              </div>
              <span className="hidden sm:inline">Phone</span>
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded">
              <div className={`h-full rounded transition-all ${
                currentStep === 'info' || currentStep === 'complete'
                  ? 'bg-orange-500 w-full' 
                  : 'bg-gray-200 w-0'
              }`} />
            </div>
            <div className={`flex items-center space-x-2 ${
              currentStep === 'info' 
                ? 'text-orange-600' 
                : currentStep === 'complete'
                ? 'text-green-600'
                : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'info' 
                  ? 'bg-orange-100' 
                  : currentStep === 'complete'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}>
                {currentStep === 'complete' ? '✓' : '2'}
              </div>
              <span className="hidden sm:inline">Info</span>
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        {currentStep === 'phone' && (
          <PhoneVerification onVerificationComplete={handlePhoneVerified} />
        )}
        
        {currentStep === 'info' && (
          <IdentityVerification 
            phone={verifiedPhone} 
            onVerificationComplete={handleInfoComplete} 
          />
        )}
      </div>
    </div>
  );
};
