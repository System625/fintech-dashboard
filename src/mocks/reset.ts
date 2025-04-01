import { worker } from './browser';

// Function to reset the MSW worker
export const resetMswWorker = async () => {
  // Stop the worker if it's running
  await worker.stop();
  
  // Start it again
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
  
  console.log('[MSW] Worker has been reset');
}; 