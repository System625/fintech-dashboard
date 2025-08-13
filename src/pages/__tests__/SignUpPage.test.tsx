import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SignUpPage from '../SignUpPage'
import { useAuthStore } from '@/stores/useAuthStore'
import { resetStores } from '@/test/test-utils'
import { toast } from 'sonner'

// Mock the auth store
vi.mock('@/stores/useAuthStore')

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  }
}))

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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const MockedUseAuthStore = useAuthStore as any
const mockToast = toast as { error: any; success: any }

describe('SignUpPage', () => {
  const mockSignUp = vi.fn()
  
  beforeEach(() => {
    resetStores()
    vi.clearAllMocks()
    
    // Setup auth store mock
    MockedUseAuthStore.mockReturnValue({
      signUp: mockSignUp,
      currentUser: null,
      isLoading: false
    })
  })

  const renderSignUpPage = () => {
    return render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    )
  }

  describe('UI Rendering', () => {
    it('should render signup form with all required elements', () => {
      renderSignUpPage()

      // Check if logo and brand name are rendered
      expect(screen.getByTestId('budgetpunk-logo')).toBeInTheDocument()
      expect(screen.getByText('Budgetpunk')).toBeInTheDocument()

      // Check form elements
      expect(screen.getByText('Sign up')).toBeInTheDocument()
      expect(screen.getByText('Create an account to start managing your finances')).toBeInTheDocument()
      
      // Check form inputs
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      
      // Check buttons and links
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should have proper form structure with required attributes', () => {
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('required')
      expect(emailInput).toHaveAttribute('placeholder', 'name@example.com')
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('placeholder', '••••••••')
      
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
      expect(confirmPasswordInput).toHaveAttribute('required')
      expect(confirmPasswordInput).toHaveAttribute('placeholder', '••••••••')
    })
  })

  describe('Form Interactions', () => {
    it('should update input values when user types', async () => {
      const user = userEvent.setup()
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
      expect(confirmPasswordInput).toHaveValue('password123')
    })

    it('should submit form with correct data when valid', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue({})
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      // Fill out the form
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      
      // Submit the form
      await user.click(submitButton)

      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('should show loading state during form submission', async () => {
      const user = userEvent.setup()
      
      // Make signUp return a pending promise
      let resolveSignUp: () => void
      const signUpPromise = new Promise<void>((resolve) => {
        resolveSignUp = resolve
      })
      mockSignUp.mockReturnValue(signUpPromise)
      
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      // Fill out the form
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      
      // Submit the form
      await user.click(submitButton)

      // Check loading state
      expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()

      // Resolve the promise to finish loading
      resolveSignUp!()
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup()
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      // Fill out the form with mismatched passwords
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'differentpassword')
      
      // Submit the form
      await user.click(submitButton)

      expect(mockToast.error).toHaveBeenCalledWith('Passwords do not match', {
        description: 'Please ensure both passwords are identical.'
      })
      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('should show error when password is too short', async () => {
      const user = userEvent.setup()
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      // Fill out the form with short password
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, '123')
      await user.type(confirmPasswordInput, '123')
      
      // Submit the form
      await user.click(submitButton)

      expect(mockToast.error).toHaveBeenCalledWith('Password too short', {
        description: 'Password must be at least 6 characters long.'
      })
      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('should pass validation with valid inputs', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue({})
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      // Fill out the form with valid data
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'validpassword123')
      await user.type(confirmPasswordInput, 'validpassword123')
      
      // Submit the form
      await user.click(submitButton)

      expect(mockToast.error).not.toHaveBeenCalled()
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'validpassword123')
    })

    it('should validate password length at boundary (exactly 6 characters)', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue({})
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      // Fill out the form with exactly 6 characters
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, '123456')
      await user.type(confirmPasswordInput, '123456')
      
      // Submit the form
      await user.click(submitButton)

      expect(mockToast.error).not.toHaveBeenCalled()
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', '123456')
    })
  })

  describe('Navigation and Redirects', () => {
    it('should navigate to dashboard after successful signup', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue({})
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('should have correct navigation link to login', () => {
      renderSignUpPage()

      const signInLink = screen.getByRole('link', { name: /sign in/i })
      expect(signInLink).toHaveAttribute('href', '/login')
    })
  })

  describe('Error Handling', () => {
    it('should handle signup errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const error = new Error('Email already in use')
      mockSignUp.mockRejectedValue(error)
      
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Signup error:', error)
      })

      // Should reset loading state
      expect(screen.getByRole('button', { name: /create account/i })).not.toBeDisabled()
      
      consoleErrorSpy.mockRestore()
    })

    it('should not navigate when signup fails', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSignUp.mockRejectedValue(new Error('Signup failed'))
      
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
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
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      expect(emailInput).toHaveAttribute('id', 'email')
      expect(passwordInput).toHaveAttribute('id', 'password')
      expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword')
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      renderSignUpPage()

      // Tab through form elements
      await user.tab()
      expect(screen.getByLabelText(/email/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/^password/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/confirm password/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /create account/i })).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty form submission by relying on HTML5 validation', async () => {
      const user = userEvent.setup()
      renderSignUpPage()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      // Try to submit empty form
      await user.click(submitButton)

      // signUp should not be called because HTML5 validation prevents submission
      expect(mockSignUp).not.toHaveBeenCalled()
      expect(mockToast.error).not.toHaveBeenCalled()
    })

    it('should handle whitespace in inputs correctly', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue({})
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      // The form appears to trim whitespace automatically (good behavior)
      await user.type(emailInput, ' test@example.com ')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(submitButton)

      // Verify that whitespace is trimmed
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  describe('Form Submission via Enter Key', () => {
    it('should submit form when pressing Enter in any input field', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue({})
      renderSignUpPage()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.type(confirmPasswordInput, '{enter}')

      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})