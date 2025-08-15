import { describe, it, expect, beforeEach, afterEach, afterAll, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewSavingsGoalForm } from '../NewSavingsGoalForm'
import { toast } from 'sonner'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  }
}))

const mockToast = toast as { error: any; success: any }

// MSW Server for API mocking
const server = setupServer()

describe('NewSavingsGoalForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    server.listen({ onUnhandledRequest: 'bypass' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('UI Rendering', () => {
    it('should render trigger button', () => {
      render(<NewSavingsGoalForm />)
      
      expect(screen.getByRole('button', { name: /new savings goal/i })).toBeInTheDocument()
    })

    it('should open dialog when trigger button is clicked', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      const triggerButton = screen.getByRole('button', { name: /new savings goal/i })
      await user.click(triggerButton)

      // Check if dialog content is rendered
      expect(screen.getByText('Create New Savings Goal')).toBeInTheDocument()
      expect(screen.getByText('Set up a new savings goal to track your progress.')).toBeInTheDocument()
    })

    it('should render all form fields when dialog is open', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Check all form fields are present
      expect(screen.getByLabelText(/goal title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/target amount/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/initial deposit/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/target date/i)).toBeInTheDocument()

      // Check form buttons
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create goal/i })).toBeInTheDocument()
    })

    it('should have correct input types and placeholders', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      const titleInput = screen.getByLabelText(/goal title/i)
      const descriptionInput = screen.getByLabelText(/description/i)
      const targetAmountInput = screen.getByLabelText(/target amount/i)
      const initialAmountInput = screen.getByLabelText(/initial deposit/i)

      expect(titleInput).toHaveAttribute('placeholder', 'E.g., Emergency Fund')
      expect(descriptionInput).toHaveAttribute('placeholder', 'E.g., For unexpected expenses')
      expect(targetAmountInput).toHaveAttribute('type', 'number')
      expect(targetAmountInput).toHaveAttribute('placeholder', '10000')
      expect(initialAmountInput).toHaveAttribute('type', 'number')
      expect(initialAmountInput).toHaveAttribute('placeholder', '0')
    })
  })

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))
      
      // Try to submit empty form
      const createButton = screen.getByRole('button', { name: /create goal/i })
      await user.click(createButton)

      // Check for validation error messages
      await waitFor(() => {
        expect(screen.getByText('Title must be at least 2 characters.')).toBeInTheDocument()
      })
      expect(screen.getByText('Description must be at least 2 characters.')).toBeInTheDocument()
      expect(screen.getByText('Target amount must be greater than 0.')).toBeInTheDocument()
    })

    it('should validate minimum length for title and description', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      const titleInput = screen.getByLabelText(/goal title/i)
      const descriptionInput = screen.getByLabelText(/description/i)

      // Enter single character
      await user.type(titleInput, 'A')
      await user.type(descriptionInput, 'B')
      
      // Trigger validation by attempting to submit
      await user.click(screen.getByRole('button', { name: /create goal/i }))

      await waitFor(() => {
        expect(screen.getByText('Title must be at least 2 characters.')).toBeInTheDocument()
      })
      expect(screen.getByText('Description must be at least 2 characters.')).toBeInTheDocument()
    })

    it('should validate target amount is greater than 0', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      const targetAmountInput = screen.getByLabelText(/target amount/i)
      
      // Clear default value and set to 0
      await user.clear(targetAmountInput)
      await user.type(targetAmountInput, '0')
      
      await user.click(screen.getByRole('button', { name: /create goal/i }))

      await waitFor(() => {
        expect(screen.getByText('Target amount must be greater than 0.')).toBeInTheDocument()
      })
    })

    it('should validate initial amount is 0 or greater', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      const initialAmountInput = screen.getByLabelText(/initial deposit/i)
      
      // Set to negative value
      await user.clear(initialAmountInput)
      await user.type(initialAmountInput, '-100')
      
      await user.click(screen.getByRole('button', { name: /create goal/i }))

      await waitFor(() => {
        expect(screen.getByText('Initial amount must be 0 or greater.')).toBeInTheDocument()
      })
    })

    it('should accept valid form data', async () => {
      const user = userEvent.setup()
      
      // Mock successful API response
      server.use(
        http.post('/api/savings', () => {
          return HttpResponse.json({
            id: '123',
            name: 'Emergency Fund',
            description: 'For unexpected expenses',
            targetAmount: 10000,
            currentAmount: 1000,
            targetDate: '2024-12-31T00:00:00.000Z'
          })
        })
      )

      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Fill form with valid data
      await user.type(screen.getByLabelText(/goal title/i), 'Emergency Fund')
      await user.type(screen.getByLabelText(/description/i), 'For unexpected expenses')
      
      const targetAmountInput = screen.getByLabelText(/target amount/i)
      await user.clear(targetAmountInput)
      await user.type(targetAmountInput, '10000')
      
      const initialAmountInput = screen.getByLabelText(/initial deposit/i)
      await user.clear(initialAmountInput)
      await user.type(initialAmountInput, '1000')
      
      await user.click(screen.getByRole('button', { name: /create goal/i }))

      // Should not show validation errors and should proceed with submission
      expect(screen.queryByText('Title must be at least 2 characters.')).not.toBeInTheDocument()
      expect(screen.queryByText('Description must be at least 2 characters.')).not.toBeInTheDocument()
      expect(screen.queryByText('Target amount must be greater than 0.')).not.toBeInTheDocument()
      expect(screen.queryByText('Initial amount must be 0 or greater.')).not.toBeInTheDocument()
    })
  })

  describe('Date Selection', () => {
    it('should have default date set to 90 days from now', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      const dateButton = screen.getByRole('button', { name: /target date/i })
      expect(dateButton).toBeInTheDocument()
      
      // The button should show a formatted date since there's a default value
      // It should not show "Pick a date"
      expect(dateButton).not.toHaveTextContent('Pick a date')
      // It should show a date in the future (formatted as "PPP" format from date-fns)
      expect(dateButton.textContent).toMatch(/[A-Za-z]+ \d{1,2}(st|nd|rd|th), \d{4}/)
    })

    it('should open calendar when date button is clicked', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      const dateButton = screen.getByLabelText(/target date/i)
      await user.click(dateButton)

      // Calendar should be visible - look for navigation buttons
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument()
      })
      expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument()
    })

    it('should not allow selecting past dates', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      const dateButton = screen.getByLabelText(/target date/i)
      await user.click(dateButton)

      // Get yesterday's date
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayButton = screen.queryByRole('button', { 
        name: yesterday.getDate().toString() 
      })

      // Past dates should be disabled
      if (yesterdayButton) {
        expect(yesterdayButton).toBeDisabled()
      }
    })
  })

  describe('Form Submission', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      
      // Mock delayed API response
      let resolveRequest: () => void
      server.use(
        http.post('/api/savings', () => {
          return new Promise((resolve) => {
            resolveRequest = () => resolve(HttpResponse.json({ id: '123' }))
          })
        })
      )

      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Fill form with valid data
      await user.type(screen.getByLabelText(/goal title/i), 'Test Goal')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')

      const targetAmountInput = screen.getByLabelText(/target amount/i)
      await user.clear(targetAmountInput)
      await user.type(targetAmountInput, '5000')

      await user.click(screen.getByRole('button', { name: /create goal/i }))

      // Should show loading state
      expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()

      // Resolve the request
      resolveRequest!()

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /creating/i })).not.toBeInTheDocument()
      })
    })

    it('should submit correct data to API', async () => {
      const user = userEvent.setup()
      
      let requestBody: any
      server.use(
        http.post('/api/savings', async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json({ id: '123', ...requestBody })
        })
      )

      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Fill form
      await user.type(screen.getByLabelText(/goal title/i), 'Vacation Fund')
      await user.type(screen.getByLabelText(/description/i), 'Summer vacation')

      const targetAmountInput = screen.getByLabelText(/target amount/i)
      await user.clear(targetAmountInput)
      await user.type(targetAmountInput, '5000')

      const initialAmountInput = screen.getByLabelText(/initial deposit/i)
      await user.clear(initialAmountInput)
      await user.type(initialAmountInput, '500')

      await user.click(screen.getByRole('button', { name: /create goal/i }))

      await waitFor(() => {
        expect(requestBody).toEqual({
          name: 'Vacation Fund',
          description: 'Summer vacation',
          targetAmount: 5000,
          currentAmount: 500,
          targetDate: expect.any(String)
        })
      })
    })

    it('should show success toast and close dialog on successful submission', async () => {
      const user = userEvent.setup()
      
      server.use(
        http.post('/api/savings', () => {
          return HttpResponse.json({
            id: '123',
            name: 'Test Goal',
            description: 'Test Description',
            targetAmount: 5000,
            currentAmount: 0
          })
        })
      )

      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Fill and submit form
      await user.type(screen.getByLabelText(/goal title/i), 'Test Goal')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')

      const targetAmountInput = screen.getByLabelText(/target amount/i)
      await user.clear(targetAmountInput)
      await user.type(targetAmountInput, '5000')

      await user.click(screen.getByRole('button', { name: /create goal/i }))

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Savings Goal Created', {
          description: 'Your Test Goal goal has been successfully created.'
        })
      })

      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByText('Create New Savings Goal')).not.toBeInTheDocument()
      })
    })

    it('should call onSuccess callback when provided', async () => {
      const user = userEvent.setup()
      const onSuccessMock = vi.fn()
      
      server.use(
        http.post('/api/savings', () => {
          return HttpResponse.json({ id: '123' })
        })
      )

      render(<NewSavingsGoalForm onSuccess={onSuccessMock} />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Fill and submit form
      await user.type(screen.getByLabelText(/goal title/i), 'Test Goal')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')

      const targetAmountInput = screen.getByLabelText(/target amount/i)
      await user.clear(targetAmountInput)
      await user.type(targetAmountInput, '5000')

      await user.click(screen.getByRole('button', { name: /create goal/i }))

      await waitFor(() => {
        expect(onSuccessMock).toHaveBeenCalled()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      server.use(
        http.post('/api/savings', () => {
          return new HttpResponse('Server Error', { status: 500 })
        })
      )

      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Fill and submit form
      await user.type(screen.getByLabelText(/goal title/i), 'Test Goal')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')

      const targetAmountInput = screen.getByLabelText(/target amount/i)
      await user.clear(targetAmountInput)
      await user.type(targetAmountInput, '5000')

      await user.click(screen.getByRole('button', { name: /create goal/i }))

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Error', {
          description: 'Failed to create savings goal. Please try again.'
        })
      })

      expect(consoleErrorSpy).toHaveBeenCalled()
      
      // Dialog should remain open
      expect(screen.getByText('Create New Savings Goal')).toBeInTheDocument()
      
      consoleErrorSpy.mockRestore()
    })

    it('should reset loading state after error', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      server.use(
        http.post('/api/savings', () => {
          return new HttpResponse('Server Error', { status: 500 })
        })
      )

      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Fill and submit form
      await user.type(screen.getByLabelText(/goal title/i), 'Test Goal')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')

      const targetAmountInput = screen.getByLabelText(/target amount/i)
      await user.clear(targetAmountInput)
      await user.type(targetAmountInput, '5000')

      await user.click(screen.getByRole('button', { name: /create goal/i }))

      // Wait for error to be handled
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled()
      })

      // Button should not be in loading state anymore
      expect(screen.getByRole('button', { name: /create goal/i })).not.toBeDisabled()
      expect(screen.queryByRole('button', { name: /creating/i })).not.toBeInTheDocument()
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Dialog Controls', () => {
    it('should close dialog when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))
      
      expect(screen.getByText('Create New Savings Goal')).toBeInTheDocument()
      
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Savings Goal')).not.toBeInTheDocument()
      })
    })

    it('should reset form when dialog is closed and reopened', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      // Open dialog and fill some data
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))
      await user.type(screen.getByLabelText(/goal title/i), 'Test Goal')
      
      // Verify the data was entered
      expect(screen.getByLabelText(/goal title/i)).toHaveValue('Test Goal')
      
      // Close dialog
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      
      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByText('Create New Savings Goal')).not.toBeInTheDocument()
      })
      
      // Reopen dialog
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))
      
      // Wait for dialog to open
      await waitFor(() => {
        expect(screen.getByText('Create New Savings Goal')).toBeInTheDocument()
      })
      
      // Clear the form and fill it with new data
      const titleInput = screen.getByLabelText(/goal title/i)
      await user.clear(titleInput)
      await user.type(titleInput, 'New Test Goal')
      expect(titleInput).toHaveValue('New Test Goal')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and descriptions', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Check form field descriptions
      expect(screen.getByText('The name of your savings goal.')).toBeInTheDocument()
      expect(screen.getByText('A short description of your goal.')).toBeInTheDocument()
      expect(screen.getByText('The date by which you want to reach your target.')).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<NewSavingsGoalForm />)
      
      // Open dialog
      await user.click(screen.getByRole('button', { name: /new savings goal/i }))

      // Tab through form elements - check the actual tab order
      await user.tab()
      expect(screen.getByLabelText(/description/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/target amount/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/initial deposit/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/target date/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/goal title/i)).toHaveFocus()
    })
  })
})