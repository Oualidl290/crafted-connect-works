
import React, { useState } from 'react';
import { PhoneVerification } from './PhoneVerification';
import { IdentityVerification } from './IdentityVerification';
import { SkillProofUpload } from './SkillProofUpload';

type AuthStep = 'phone' | 'identity' | 'skills' | 'complete';

export const WorkerAuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [verifiedPhone, setVerifiedPhone] = useState<string>('');
  const [workerId, setWorkerId] = useState<string>('');

  const handlePhoneVerified = (phone: string) => {
    setVerifiedPhone(phone);
    setCurrentStep('identity');
  };

  const handleIdentityComplete = (workerId: string) => {
    setWorkerId(workerId);
    setCurrentStep('skills');
  };

  const handleSkillsComplete = () => {
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
            Your profile is being reviewed. You'll be notified once verification is complete.
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
                {currentStep === 'phone' ? '1' : '✓'}
              </div>
              <span className="hidden sm:inline">Phone</span>
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded">
              <div className={`h-full rounded transition-all ${
                currentStep === 'identity' || currentStep === 'skills' 
                  ? 'bg-green-500 w-full' 
                  : 'bg-gray-200 w-0'
              }`} />
            </div>
            <div className={`flex items-center space-x-2 ${
              currentStep === 'identity' 
                ? 'text-orange-600' 
                : currentStep === 'skills' 
                  ? 'text-green-600' 
                  : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'identity' 
                  ? 'bg-orange-100' 
                  : currentStep === 'skills' 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
              }`}>
                {currentStep === 'skills' ? '✓' : '2'}
              </div>
              <span className="hidden sm:inline">Profile</span>
            </div>
            <div className="w-12 h-1 bg-gray-200 rounded">
              <div className={`h-full rounded transition-all ${
                currentStep === 'skills' 
                  ? 'bg-orange-500 w-full' 
                  : 'bg-gray-200 w-0'
              }`} />
            </div>
            <div className={`flex items-center space-x-2 ${
              currentStep === 'skills' 
                ? 'text-orange-600' 
                : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'skills' 
                  ? 'bg-orange-100' 
                  : 'bg-gray-100'
              }`}>
                3
              </div>
              <span className="hidden sm:inline">Skills</span>
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        {currentStep === 'phone' && (
          <PhoneVerification onVerificationComplete={handlePhoneVerified} />
        )}
        
        {currentStep === 'identity' && (
          <IdentityVerification 
            phone={verifiedPhone} 
            onVerificationComplete={handleIdentityComplete} 
          />
        )}
        
        {currentStep === 'skills' && (
          <SkillProofUpload 
            workerId={workerId} 
            onComplete={handleSkillsComplete} 
          />
        )}
      </div>
    </div>
  );
};
