
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhoneVerificationProps {
  onVerificationComplete: (phone: string) => void;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onVerificationComplete }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const sendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      const { error: insertError } = await supabase
        .from('phone_verifications')
        .insert({
          phone,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString()
        });

      if (insertError) throw insertError;

      // In a real app, you'd send SMS here via Twilio or similar
      console.log(`OTP for ${phone}: ${otpCode}`);
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}. Check console for demo OTP.`,
      });

      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verify OTP
      const { data, error: verifyError } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('otp_code', otp)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (verifyError || !data) {
        throw new Error('Invalid or expired OTP');
      }

      // Mark as verified
      await supabase
        .from('phone_verifications')
        .update({ verified: true })
        .eq('id', data.id);

      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully!",
      });

      onVerificationComplete(phone);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
          <Phone className="w-8 h-8 text-orange-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!otpSent ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={sendOTP} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to {phone}
              </p>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                className="text-center text-xl tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button 
                onClick={verifyOTP} 
                disabled={isLoading || otp.length !== 6} 
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setOtpSent(false)} 
                className="w-full"
                disabled={isLoading}
              >
                Change Phone Number
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
