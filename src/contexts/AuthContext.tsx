import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userProfile: any;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string, userRole: string) => {
    try {
      if (userRole === 'worker') {
        const { data: workerProfile } = await supabase
          .from('workers_profile')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (workerProfile) {
          setUserProfile({ ...workerProfile, type: 'worker' });
        }
      } else if (userRole === 'client') {
        const { data: clientProfile } = await supabase
          .from('clients_profile')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (clientProfile) {
          setUserProfile({ ...clientProfile, type: 'client' });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.user_metadata?.role) {
      await fetchUserProfile(user.id, user.user_metadata.role);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Create user profile if doesn't exist
        createUserProfileIfNeeded(session.user);
        // Fetch extended profile
        if (session.user.user_metadata?.role) {
          fetchUserProfile(session.user.id, session.user.user_metadata.role);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Create user profile if doesn't exist
          setTimeout(() => {
            createUserProfileIfNeeded(session.user);
          }, 0);
          
          // Fetch extended profile
          if (session.user.user_metadata?.role) {
            setTimeout(() => {
              fetchUserProfile(session.user.id, session.user.user_metadata.role);
            }, 0);
          }
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfileIfNeeded = async (user: User) => {
    try {
      // First ensure user exists in users table
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
          role: user.user_metadata?.role || 'client',
          location_city: user.user_metadata?.city || '',
          language_preference: 'ar'
        }, { onConflict: 'id' });

      if (userError) {
        console.error('Error creating user profile:', userError);
        return;
      }

      // Create role-specific profile
      const role = user.user_metadata?.role || 'client';
      
      if (role === 'worker') {
        const { error: workerError } = await supabase
          .from('workers_profile')
          .upsert({
            user_id: user.id,
            profession: 'حرفي',
            bio: '',
            experience_years: 0
          }, { onConflict: 'user_id' });

        if (workerError) {
          console.error('Error creating worker profile:', workerError);
        }
      } else {
        const { error: clientError } = await supabase
          .from('clients_profile')
          .upsert({
            user_id: user.id,
            job_count: 0,
            is_blocked: false
          }, { onConflict: 'user_id' });

        if (clientError) {
          console.error('Error creating client profile:', clientError);
        }
      }
    } catch (error) {
      console.error('Error in createUserProfileIfNeeded:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({ title: "خطأ", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "تم", description: "تم تسجيل الخروج بنجاح" });
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({ title: "خطأ", description: "حدث خطأ أثناء تسجيل الخروج", variant: "destructive" });
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    userProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};