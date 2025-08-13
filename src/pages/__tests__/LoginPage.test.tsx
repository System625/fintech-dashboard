import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'
import { useAuthStore } from '@/stores/useAuthStore'
import { resetStores } from '@/test/test-utils'

// Mock the auth store
vi.mock('@/stores/useAuthStore')

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock the BudgetpunkLogo component
vi.mock('@/components/logo/BudgetpunkLogo', () => ({
  BudgetpunkLogo: ({ size }: { size: number }) => (
    <div data-testid="budgetpunk-logo" data-size={size}>Logo</div>
  )
}))

// Mock react-router-dom hooks
const mockNavigate = vi.fn()
const mockLocation = { state: null, pathname: '/login' }

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  }
})

const MockedUseAuthStore = useAuthStore as any

describe('LoginPage', () => {
  const mockSignIn = vi.fn()
  
  beforeEach(() => {
    resetStores()
    vi.clearAllMocks()
    
    // Setup auth store mock
    MockedUseAuthStore.mockReturnValue({
      signIn: mockSignIn,
      currentUser: null,
      isLoading: false
    })
  })

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )
  }

  describe('UI Rendering', () => {
    it('should render login form with all required elements', () => {
      renderLoginPage()

      // Check if logo and brand name are rendered
      expect(screen.getByTestId('budgetpunk-logo')).toBeInTheDocument()
      expect(screen.getByText('Budgetpunk')).toBeInTheDocument()

      // Check form elements - use getAllByText since "Sign in" appears twice (title and button)
      expect(screen.getAllByText('Sign in')).toHaveLength(2) // Title and button
      expect(screen.getByText('Enter your email and password to access your account')).toBeInTheDocument()
      
      // Check form inputs
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      
      // Check buttons and links
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    })

    it('should have proper form structure with required attributes', () => {
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('required')
      expect(emailInput).toHaveAttribute('placeholder', 'name@example.com')
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('placeholder', '••••••••')
    })
  })

  describe('Form Interactions', () => {
    it('should update input values when user types', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })

    it('should submit form with correct data when valid', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({})
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      // Fill out the form
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      // Submit the form
      await user.click(submitButton)

      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('should show loading state during form submission', async () => {
      const user = userEvent.setup()
      
      // Make signIn return a pending promise
      let resolveSignIn: () => void
      const signInPromise = new Promise<void>((resolve) => {
        resolveSignIn = resolve
      })
      mockSignIn.mockReturnValue(signInPromise)
      
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      // Fill out the form
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      // Submit the form
      await user.click(submitButton)

      // Check loading state
      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()

      // Resolve the promise to finish loading
      resolveSignIn!()
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      })
    })

    it('should prevent form submission with empty fields due to HTML5 validation', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      // Try to submit empty form
      await user.click(submitButton)

      // signIn should not be called because HTML5 validation prevents submission
      expect(mockSignIn).not.toHaveBeenCalled()
    })
  })

  describe('Navigation and Redirects', () => {
    it('should navigate to dashboard after successful login', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({})
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
      })
    })

    it('should navigate to the intended route from location state', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({})
      
      // Mock location with state
      ;(mockLocation as any).state = { from: { pathname: '/investments' } }
      
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/investments', { replace: true })
      })

      // Reset location state for other tests
      mockLocation.state = null
    })

    it('should have correct navigation links', () => {
      renderLoginPage()

      const forgotPasswordLink = screen.getByRole('link', { name: /forgot your password/i })
      const signUpLink = screen.getByRole('link', { name: /sign up/i })

      expect(forgotPasswordLink).toHaveAttribute('href', '/reset-password')
      expect(signUpLink).toHaveAttribute('href', '/signup')
    })
  })

  describe('Error Handling', () => {
    it('should handle login errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const error = new Error('Invalid credentials')
      mockSignIn.mockRejectedValue(error)
      
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Login error:', error)
      })

      // Should reset loading state
      expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled()
      
      consoleErrorSpy.mockRestore()
    })

    it('should not navigate when login fails', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSignIn.mockRejectedValue(new Error('Login failed'))
      
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled()
      })

      expect(mockNavigate).not.toHaveBeenCalled()
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels and ARIA attributes', () => {
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      expect(emailInput).toHaveAttribute('id', 'email')
      expect(passwordInput).toHaveAttribute('id', 'password')
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      // Test that key form elements can receive focus
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      // Focus each element directly to test they can receive focus
      await user.click(emailInput)
      expect(emailInput).toHaveFocus()
      
      await user.click(passwordInput)
      expect(passwordInput).toHaveFocus()
      
      await user.click(submitButton)
      expect(submitButton).toHaveFocus()
      
      // Test tab navigation from email input
      await user.click(emailInput)
      await user.tab()
      // The focus might go to password input or the forgot password link depending on DOM order
      const currentFocus = document.activeElement
      expect(
        currentFocus === passwordInput || 
        currentFocus === screen.getByRole('link', { name: /forgot your password/i })
      ).toBe(true)
    })
  })

  describe('Form Submission via Enter Key', () => {
    it('should submit form when pressing Enter in email field', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({})
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(emailInput, '{enter}')

      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('should submit form when pressing Enter in password field', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({})
      renderLoginPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(passwordInput, '{enter}')

      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})