// Initialize MSW for all environments
export async function initMocks() {
  // Remove environment check to enable mocks in production too
  const { worker } = await import('./browser');
  return worker.start({
    onUnhandledRequest: 'bypass', // Silent mode, doesn't warn on unhandled requests
  });
} 