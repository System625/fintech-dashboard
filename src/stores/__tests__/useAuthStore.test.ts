import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAuthStore } from '../useAuthStore'
import { mockUser } from '@/test/test-utils'
import { toast } from 'sonner'

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  setPersistence: vi.fn(),
  browserLocalPersistence: 'LOCAL'
}))

// Mock Firebase config
vi.mock('@/services/firebase', () => ({
  auth: {}
}))

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}))

// Import mocked functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
} from 'firebase/auth'

describe('useAuthStore', () => {
  const mockCreateUser = createUserWithEmailAndPassword as Mock
  const mockSignIn = signInWithEmailAndPassword as Mock  
  const mockSignOut = signOut as Mock
  const mockOnAuthStateChanged = onAuthStateChanged as Mock
  const mockSendPasswordResetEmail = sendPasswordResetEmail as Mock
  const mockSetPersistence = setPersistence as Mock
  const mockToast = toast as unknown as { success: Mock; error: Mock }

  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      currentUser: null,
      isLoading: true
    })
    
    // Clear all mocks
    vi.clearAllMocks()
    
    // Setup default mock implementations
    mockSetPersistence.mockResolvedValue(undefined)
    mockOnAuthStateChanged.mockImplementation(() => {
      // Return unsubscribe function
      return () => {}
    })
  })

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useAuthStore())
      
      expect(result.current.currentUser).toBeNull()
      expect(result.current.isLoading).toBe(true)
      expect(typeof result.current.signUp).toBe('function')
      expect(typeof result.current.signIn).toBe('function')
      expect(typeof result.current.logOut).toBe('function')
      expect(typeof result.current.resetPassword).toBe('function')
      expect(typeof result.current.initializeAuth).toBe('function')
    })

    it('should call setPersistence and onAuthStateChanged on initializeAuth', () => {
      const { result } = renderHook(() => useAuthStore())
      
      act(() => {
        result.current.initializeAuth()
      })
      
      expect(mockSetPersistence).toHaveBeenCalledWith(expect.anything(), 'LOCAL')
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Function)
      )
    })
  })

  describe('signUp', () => {
    it('should successfully create a new user', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockUserCredential = { user: mockUser }
      mockCreateUser.mockResolvedValue(mockUserCredential)

      await act(async () => {
        await result.current.signUp('test@example.com', 'password123')
      })

      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      )
      expect(mockToast.success).toHaveBeenCalledWith(
        'Account created successfully!',
        {
          description: `Welcome to Budgetpunk, ${mockUser.email}!`,
          duration: 5000
        }
      )
    })

    it('should handle signUp errors', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockError = { code: 'auth/email-already-in-use' }
      mockCreateUser.mockRejectedValue(mockError)

      await act(async () => {
        try {
          await result.current.signUp('test@example.com', 'password123')
        } catch (error) {
          expect(error).toBe(mockError)
        }
      })

      expect(mockToast.error).toHaveBeenCalledWith(
        'Sign up failed',
        {
          description: 'This email is already in use. Please try a different email or sign in.'
        }
      )
    })
  })

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockUserCredential = { user: mockUser }
      mockSignIn.mockResolvedValue(mockUserCredential)

      await act(async () => {
        await result.current.signIn('test@example.com', 'password123')
      })

      expect(mockSignIn).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      )
      expect(mockToast.success).toHaveBeenCalledWith(
        'Signed in successfully!',
        {
          description: 'Welcome back to Budgetpunk!',
          duration: 3000
        }
      )
    })

    it('should handle signIn errors', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockError = { code: 'auth/invalid-credential' }
      mockSignIn.mockRejectedValue(mockError)

      await act(async () => {
        try {
          await result.current.signIn('test@example.com', 'wrongpassword')
        } catch (error) {
          expect(error).toBe(mockError)
        }
      })

      expect(mockToast.error).toHaveBeenCalledWith(
        'Sign in failed',
        {
          description: 'Invalid login credentials. Please check your email and password.'
        }
      )
    })
  })

  describe('logOut', () => {
    it('should successfully sign out a user', async () => {
      const { result } = renderHook(() => useAuthStore())
      mockSignOut.mockResolvedValue(undefined)

      await act(async () => {
        await result.current.logOut()
      })

      expect(mockSignOut).toHaveBeenCalledWith(expect.anything())
      expect(mockToast.success).toHaveBeenCalledWith('Signed out successfully')
    })

    it('should handle signOut errors', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockError = { code: 'auth/network-request-failed' }
      mockSignOut.mockRejectedValue(mockError)

      await act(async () => {
        try {
          await result.current.logOut()
        } catch (error) {
          expect(error).toBe(mockError)
        }
      })

      expect(mockToast.error).toHaveBeenCalledWith(
        'Sign out failed',
        {
          description: 'Network error. Please check your internet connection and try again.'
        }
      )
    })
  })

  describe('resetPassword', () => {
    it('should successfully send password reset email', async () => {
      const { result } = renderHook(() => useAuthStore())
      mockSendPasswordResetEmail.mockResolvedValue(undefined)

      await act(async () => {
        await result.current.resetPassword('test@example.com')
      })

      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com'
      )
      expect(mockToast.success).toHaveBeenCalledWith(
        'Password reset email sent',
        {
          description: 'Please check your email for instructions to reset your password.',
          duration: 5000
        }
      )
    })

    it('should handle resetPassword errors', async () => {
      const { result } = renderHook(() => useAuthStore())
      const mockError = { code: 'auth/user-not-found' }
      mockSendPasswordResetEmail.mockRejectedValue(mockError)

      await act(async () => {
        try {
          await result.current.resetPassword('nonexistent@example.com')
        } catch (error) {
          expect(error).toBe(mockError)
        }
      })

      expect(mockToast.error).toHaveBeenCalledWith(
        'Password reset failed',
        {
          description: 'No account found with this email. Please check your email or sign up.'
        }
      )
    })
  })

  describe('auth state changes', () => {
    it('should update user state when auth state changes', () => {
      const { result } = renderHook(() => useAuthStore())
      
      // Mock the onAuthStateChanged callback
      let authCallback: (user: any) => void
      mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
        authCallback = callback
        return () => {}
      })
      
      act(() => {
        result.current.initializeAuth()
      })
      
      // Simulate user signed in
      act(() => {
        authCallback(mockUser)
      })
      
      expect(result.current.currentUser).toEqual(mockUser)
      expect(result.current.isLoading).toBe(false)
      
      // Simulate user signed out
      act(() => {
        authCallback(null)
      })
      
      expect(result.current.currentUser).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('error message mapping', () => {
    const errorMappingTests = [
      { code: 'auth/email-already-in-use', expected: 'This email is already in use. Please try a different email or sign in.' },
      { code: 'auth/invalid-email', expected: 'The email address is invalid. Please check and try again.' },
      { code: 'auth/user-disabled', expected: 'This account has been disabled. Please contact support.' },
      { code: 'auth/weak-password', expected: 'Password is too weak. Please use a stronger password (at least 6 characters).' },
      { code: 'auth/too-many-requests', expected: 'Too many failed login attempts. Please try again later or reset your password.' },
      { code: 'unknown-error', expected: 'An unexpected error occurred. Please try again.' }
    ]

    errorMappingTests.forEach(({ code, expected }) => {
      it(`should map error code ${code} correctly`, async () => {
        const { result } = renderHook(() => useAuthStore())
        const mockError = { code }
        mockSignIn.mockRejectedValue(mockError)

        await act(async () => {
          try {
            await result.current.signIn('test@example.com', 'password')
          } catch (error) {
            // Expected to throw
          }
        })

        expect(mockToast.error).toHaveBeenCalledWith(
          'Sign in failed',
          { description: expected }
        )
      })
    })
  })
})