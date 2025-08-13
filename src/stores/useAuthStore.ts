import { create } from 'zustand';
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

interface AuthStore {
  currentUser: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initializeAuth: () => void;
}

let authUnsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  isLoading: true,
  
  signUp: async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!', {
        description: `Welcome to Budgetpunk, ${result.user.email}!`,
        duration: 5000
      });
    } catch (error: any) {
      const errorCode = error.code || '';
      const message = getErrorMessage(errorCode);
      toast.error('Sign up failed', { description: message });
      throw error;
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!', {
        description: 'Welcome back to Budgetpunk!',
        duration: 3000
      });
    } catch (error: any) {
      const errorCode = error.code || '';
      const message = getErrorMessage(errorCode);
      toast.error('Sign in failed', { description: message });
      throw error;
    }
  },
  
  logOut: async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error: any) {
      const errorCode = error.code || '';
      const message = getErrorMessage(errorCode);
      toast.error('Sign out failed', { description: message });
      throw error;
    }
  },
  
  resetPassword: async (email: string) => {
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
  },
  
  initializeAuth: () => {
    // Set auth persistence to LOCAL to persist through page refreshes
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Auth persistence error:", error);
      });
    
    // Clean up any existing listener
    if (authUnsubscribe) {
      authUnsubscribe();
    }
    
    // Set up auth state listener
    authUnsubscribe = onAuthStateChanged(auth, (user) => {
      set({ currentUser: user, isLoading: false });
    });
  }
}));