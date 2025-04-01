import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { toast } from 'sonner';

// Map Firebase error codes to user-friendly messages
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please try a different email or sign in.';
    case 'auth/invalid-email':
      return 'The email address is invalid. Please check and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/invalid-credential':
      return 'Invalid login credentials. Please check your email and password.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later or reset your password.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password (at least 6 characters).';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again later.';
    case 'auth/invalid-login-credentials':
      return 'Invalid login credentials. Please check your email and password.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

type AuthContextType = {
  currentUser: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth persistence when the app loads
  useEffect(() => {
    // Set auth persistence to LOCAL to persist through page refreshes
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Auth persistence error:", error);
      });
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!', {
        description: `Welcome to FinDash, ${result.user.email}!`,
        duration: 5000
      });
    } catch (error: any) {
      const errorCode = error.code || '';
      const message = getErrorMessage(errorCode);
      toast.error('Sign up failed', { description: message });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!', {
        description: 'Welcome back to FinDash!',
        duration: 3000
      });
    } catch (error: any) {
      const errorCode = error.code || '';
      const message = getErrorMessage(errorCode);
      toast.error('Sign in failed', { description: message });
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error: any) {
      const errorCode = error.code || '';
      const message = getErrorMessage(errorCode);
      toast.error('Sign out failed', { description: message });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent', {
        description: 'Please check your email for instructions to reset your password.',
        duration: 5000
      });
    } catch (error: any) {
      const errorCode = error.code || '';
      const message = getErrorMessage(errorCode);
      toast.error('Password reset failed', { description: message });
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isLoading,
    signUp,
    signIn,
    logOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 