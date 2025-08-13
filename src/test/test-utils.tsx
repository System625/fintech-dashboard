import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { useThemeStore } from '@/stores/useThemeStore'
import { useLoadingStore } from '@/stores/useLoadingStore'
import { useAuthStore } from '@/stores/useAuthStore'

// Test utilities for Zustand store reset
export const resetStores = () => {
  useThemeStore.setState({ theme: 'light' })
  useLoadingStore.setState({ visible: false, message: 'Loading', counter: 0 })
  useAuthStore.setState({ currentUser: null, isLoading: false })
}

// Create a new QueryClient for each test to ensure isolation
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
})

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

const AllTheProviders = ({ 
  children, 
  queryClient = createTestQueryClient()
}: {
  children: React.ReactNode
  queryClient?: QueryClient
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  {
    queryClient,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  // Reset all stores before each render
  resetStores()
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders queryClient={queryClient}>
      {children}
    </AllTheProviders>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock user factory for testing
export const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
  photoURL: null,
  phoneNumber: null,
  providerId: 'firebase',
  isAnonymous: false,
  metadata: {
    creationTime: '2024-01-01T00:00:00.000Z',
    lastSignInTime: '2024-01-01T00:00:00.000Z',
  },
  providerData: [],
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-id-token',
  getIdTokenResult: async () => ({ token: 'mock-token' } as any),
  reload: async () => {},
  toJSON: () => ({}),
}

// Export everything
export * from '@testing-library/react'
export { customRender as render }
export { createTestQueryClient }