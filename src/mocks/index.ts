// Initialize MSW for development environment only
export async function initMocks() {
  if (import.meta.env.MODE !== 'production') {
    const { worker } = await import('./browser');
    return worker.start({
      onUnhandledRequest: 'bypass', // Silent mode, doesn't warn on unhandled requests
    });
  }
  return Promise.resolve();
} 