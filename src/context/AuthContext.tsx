import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleAuthProvider, testConnection } from '../lib/firebase.ts';

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest: boolean;
  role?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, displayName?: string) => Promise<void>;
  loginAsDemoUser: (demo: { uid: string; email: string; displayName: string; role?: string }) => void;
  signOutUser: () => Promise<void>;
  continueAsGuest: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate Firestore connection on boot
    testConnection().catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
          isGuest: false,
        });
      } else {
        // Fallback or keep current if was guest
        setUser((prev) => (prev?.isGuest ? prev : null));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
          photoURL: result.user.photoURL,
          isGuest: false,
        });
      }
    } catch (err: unknown) {
      console.error('Google Sign-in failed:', err);
      const msg = err instanceof Error ? err.message : 'Sign-in failed';
      setError(msg);
    }
  };

  const signInWithEmail = async (email: string, displayName?: string) => {
    setError(null);
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please provide a valid email address');
      return;
    }
    const name = displayName?.trim() || cleanEmail.split('@')[0];
    const generatedUid = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    setUser({
      uid: generatedUid,
      email: cleanEmail,
      displayName: name,
      photoURL: null,
      isGuest: false,
      role: 'Project Member',
    });
  };

  const loginAsDemoUser = (demo: { uid: string; email: string; displayName: string; role?: string }) => {
    setUser({
      uid: demo.uid,
      email: demo.email,
      displayName: demo.displayName,
      photoURL: null,
      isGuest: false,
      role: demo.role || 'Member',
    });
    setError(null);
  };

  const continueAsGuest = () => {
    setUser({
      uid: 'guest_user_lead',
      email: 'lead.architect@workspace.local',
      displayName: 'Alex Rivera (Lead)',
      photoURL: null,
      isGuest: true,
      role: 'Lead Architect',
    });
    setError(null);
  };

  const signOutUser = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      setUser(null);
    } catch (err: unknown) {
      console.error('Sign-out error:', err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        loginAsDemoUser,
        signOutUser,
        continueAsGuest,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
