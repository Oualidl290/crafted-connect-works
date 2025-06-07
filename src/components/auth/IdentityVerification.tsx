
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface IdentityVerificationProps {
  phone: string;
  onVerificationComplete: (workerId: string) => void;
}

const TRADE_OPTIONS = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Tiler',
  'Mason',
  'Welder',
  'HVAC Technician',
  'Gardener',
  'Cleaner',
  'Handyman',
  'Mechanic',
  'Roofer',
  'Locksmith',
  'Glazier',
  'Flooring Specialist',
  'Kitchen Installer',
  'Bathroom Fitter',
  'Solar Panel Installer',
  'Security System Installer',
  'Other'
];

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
      console.log('Starting worker profile creation process...');
      
      // Create a valid email format using the phone number
      const phoneDigits = phone.replace(/\D/g, '');
      const tempEmail = `${phoneDigits}@crafted.temp.com`;
      const tempPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

      console.log('Creating auth user with email:', tempEmail);

      // Create user account with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
        options: {
          data: {
            full_name: fullName,
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

      // Wait a moment for the trigger to create the user profile
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
            phone,
            full_name: fullName,
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

      // Update the user profile with phone number
      console.log('Updating user profile with phone number...');
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          phone,
          role: 'worker'
        })
        .eq('id', authData.user.id);

      if (userUpdateError) {
        console.error('User update error:', userUpdateError);
        // Don't throw here, just log the warning
      }

      // Create worker profile
      console.log('Creating worker profile...');
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .insert({
          user_id: authData.user.id,
          phone,
          full_name: fullName,
          city,
          trade,
          bio: bio || null,
          identity_verification_status: 'pending',
          is_approved: false,
          profile_completion: 60,
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
          overall_score: 0,
          identity_score: 0,
          skill_score: 0,
          reputation_score: 0,
          reliability_score: 0,
          total_jobs: 0,
          completed_jobs: 0,
          average_rating: 0,
          last_calculated: new Date().toISOString()
        });

      if (trustScoreError) {
        console.warn('Failed to create trust score record:', trustScoreError);
        // Don't throw here, just log the warning
      }

      console.log('Worker registration completed successfully');

      toast({
        title: "Profile Created",
        description: `Welcome ${fullName}! Your worker profile has been created successfully.`,
      });

      onVerificationComplete(workerData.id);
    } catch (err: any) {
      console.error('Profile creation error:', err);
      const errorMessage = err.message || 'Failed to create profile';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
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
        <p className="text-gray-600">Tell us about yourself to get started on Crafted</p>
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
              placeholder="Casablanca"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Trade/Profession *</label>
          <Select value={trade} onValueChange={setTrade} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select your profession" />
            </SelectTrigger>
            <SelectContent>
              {TRADE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio (Optional)</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Tell potential clients about your experience and expertise..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Ready to Start</h4>
              <p className="text-sm text-blue-700 mt-1">
                Once your profile is created, you'll be able to connect with clients and showcase your skills.
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
          className="w-full bg-orange-600 hover:bg-orange-700"
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
