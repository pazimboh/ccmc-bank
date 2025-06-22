
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  account_type?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface UserRole {
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  // const [isLoading, setIsLoading] = useState(true); // Replaced by authResolved
  const [authResolved, setAuthResolved] = useState(false); // New state

  const isLoading = !authResolved; // isLoading is now derived
  const isApproved = profile?.status === 'approved';
  const isAdmin = userRole?.role === 'admin';

  const fetchUserData = async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      // Fetch role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleError) {
        console.error('Role fetch error:', roleError);
      }

      // Fix: Ensure status is one of the allowed values with proper typing
      const allowedStatuses: Array<'pending' | 'approved' | 'rejected'> = ['pending', 'approved', 'rejected'];
      const status: 'pending' | 'approved' | 'rejected' = 
        profileData?.status && allowedStatuses.includes(profileData.status as any)
          ? (profileData.status as 'pending' | 'approved' | 'rejected')
          : 'pending';

      const updatedProfile: Profile | null = profileData
        ? { 
            ...profileData, 
            status 
          }
        : null;

      console.log('Fetched profile:', updatedProfile);
      console.log('Fetched role:', roleData);

      setProfile(updatedProfile);
      setUserRole(roleData);
      
      // setIsLoading calls removed from fetchUserData
    } catch (error) {
      console.error('Error fetching user data:', error);
      // setIsLoading calls removed from fetchUserData
    }
    // No finally block needed here for setIsLoading
  };

  const refreshUserData = async () => {
    if (user?.id) {
      await fetchUserData(user.id);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // State updates (setUser, setSession, setProfile, setUserRole) and navigation
      // will now be handled by the onAuthStateChange listener and the UI component respectively.
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally, re-throw or handle UI feedback if needed, though onAuthStateChange should eventually reflect failure.
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null); // This should be the current user state before this event
        const currentUser = user; // Capture state user before it's updated by setUser above for comparison
        
        if (session?.user) {
          // Only fetch full user data if:
          // 1. The user ID has changed from the current user state (new login).
          // 2. It's a USER_UPDATED event (user's attributes might have changed on the server).
          // 3. The profile is currently null for the logged-in user (e.g., initial SIGNED_IN).
          if (currentUser?.id !== session.user.id || event === "USER_UPDATED" || (profile === null && session.user.id)) {
            console.log('AuthContext: Fetching user data due to user change, USER_UPDATED, or missing profile for current session user.');
            await fetchUserData(session.user.id);
          } else if (event === "TOKEN_REFRESHED") {
            console.log("AuthContext: Token refreshed, profile data not re-fetched as user is same and profile exists.");
            // Safety check: if for some reason profile is null even though user hasn't changed, fetch it.
            if (profile === null && currentUser?.id === session.user.id) {
                 console.log("AuthContext: Profile was null for current user during TOKEN_REFRESHED, fetching.");
                 await fetchUserData(session.user.id);
            }
          }
        } else { // No session.user (e.g., SIGNED_OUT event)
          console.log("AuthContext: No session user (e.g., SIGNED_OUT), clearing profile and role.");
          setProfile(null);
          setUserRole(null);
        }

        // Ensure authResolved is set to true after the first time an event is processed.
        // This prevents it from being set repeatedly if already true.
        if (!authResolved) {
             setAuthResolved(true);
        }
        console.log('[AuthContext] onAuthStateChange processed event. Current authResolved:', authResolved, 'Newly set authResolved:', !isLoading, 'Event:', event);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
      console.log('Initial session check:', initialSession?.user?.email);

      if (sessionError) {
        console.error("Error getting initial session:", sessionError);
      }
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        await fetchUserData(initialSession.user.id);
      }
      // Mark auth as resolved after initial check and potential data fetch
      setAuthResolved(true);
      console.log('[AuthContext] initializeAuth completed, setAuthResolved: true');
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  console.log('[AuthContext] Provider Render. authResolved:', authResolved, 'Derived isLoading:', isLoading, 'User ID:', user?.id);
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        userRole,
        isLoading,
        isApproved,
        isAdmin,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
