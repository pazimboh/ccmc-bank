
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

interface StoredUserData {
  user: User;
  profile: Profile;
  userRole: UserRole;
  timestamp: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'ccmc_user_data';
const DATA_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

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

  const isAdmin = userRole?.role === 'admin';

  // Load user data from localStorage
  const loadStoredUserData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredUserData = JSON.parse(stored);
        // Check if data is not expired
        if (Date.now() - data.timestamp < DATA_EXPIRY) {
          setUser(data.user);
          setProfile(data.profile);
          setUserRole(data.userRole);
          return true;
        } else {
          // Data expired, remove it
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading stored user data:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return false;
  };

  // Store user data in localStorage
  const storeUserData = (user: User, profile: Profile, userRole: UserRole) => {
    try {
      const data: StoredUserData = {
        user,
        profile,
        userRole,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  // Clear stored user data
  const clearStoredUserData = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

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
        return null;
      }

      // Fetch role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleError) {
        console.error('Role fetch error:', roleError);
        return null;
      }

      const allowedStatuses: Array<'pending' | 'approved' | 'rejected'> = ['pending', 'approved', 'rejected'];
      const status: 'pending' | 'approved' | 'rejected' = 
        profileData?.status && allowedStatuses.includes(profileData.status as any)
          ? (profileData.status as 'pending' | 'approved' | 'rejected')
          : 'pending';

      const updatedProfile: Profile = { 
        ...profileData, 
        status 
      };

      console.log('Fetched profile:', updatedProfile);
      console.log('Fetched role:', roleData);

      return { profile: updatedProfile, userRole: roleData };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const refreshUserData = async () => {
    if (user?.id) {
      const userData = await fetchUserData(user.id);
      if (userData) {
        setProfile(userData.profile);
        setUserRole(userData.userRole);
        storeUserData(user, userData.profile, userData.userRole);
      }
    }
  };

  const signOut = async () => {
    try {
      // Clear stored data first
      clearStoredUserData();
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRole(null);
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Try to load stored user data first
    const hasStoredData = loadStoredUserData();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          // Only fetch from database if we don't have stored data
          if (!hasStoredData || event === 'SIGNED_IN') {
            const userData = await fetchUserData(session.user.id);
            if (userData) {
              setProfile(userData.profile);
              setUserRole(userData.userRole);
              storeUserData(session.user, userData.profile, userData.userRole);
            }
          }
        } else {
          // Clear all state when signed out
          clearStoredUserData();
          setUser(null);
          setProfile(null);
          setUserRole(null);
        }
      }
    );

    // Check for existing session only if no stored data
    if (!hasStoredData) {
      const initializeAuth = async () => {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          const userData = await fetchUserData(initialSession.user.id);
          if (userData) {
            setProfile(userData.profile);
            setUserRole(userData.userRole);
            storeUserData(initialSession.user, userData.profile, userData.userRole);
          }
        }
      };

      initializeAuth();
    }

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        userRole,
        isAdmin,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
