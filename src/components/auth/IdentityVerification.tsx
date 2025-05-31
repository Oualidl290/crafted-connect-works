
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Camera, FileText, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface IdentityVerificationProps {
  phone: string;
  onVerificationComplete: (workerId: string) => void;
}

export const IdentityVerification: React.FC<IdentityVerificationProps> = ({ 
  phone, 
  onVerificationComplete 
}) => {
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [trade, setTrade] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!fullName || !city || !trade) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First, sign up the user with phone as email (temporary)
      const tempEmail = `${phone.replace(/\D/g, '')}@crafted.temp`;
      const tempPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create worker profile
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .insert({
          user_id: authData.user.id,
          phone,
          full_name: fullName,
          city,
          trade,
          bio: bio || null,
          identity_verification_status: 'pending'
        })
        .select()
        .single();

      if (workerError) throw workerError;

      toast({
        title: "Profile Created",
        description: "Your worker profile has been created successfully!",
      });

      onVerificationComplete(workerData.id);
    } catch (err: any) {
      console.error('Identity verification error:', err);
      setError(err.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Create Your Profile</CardTitle>
        <p className="text-gray-600">Tell us about yourself and your trade</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name *</label>
            <Input
              type="text"
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">City *</label>
            <Input
              type="text"
              placeholder="San Francisco"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Trade/Profession *</label>
          <Input
            type="text"
            placeholder="Plumber, Electrician, Carpenter, etc."
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio (Optional)</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={3}
            placeholder="Tell potential clients about your experience and expertise..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Camera className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Next: Identity Verification</h4>
              <p className="text-sm text-amber-700 mt-1">
                After creating your profile, you'll be asked to upload a photo ID and selfie for verification.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !fullName || !city || !trade} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Profile...
            </>
          ) : (
            'Create Profile'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
