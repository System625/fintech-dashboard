import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// Initialize the worker when in browser environment
if (import.meta.env.MODE !== 'production') {
  console.log('[MSW] Starting mock service worker');
} 