import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initMocks } from './mocks'
import { resetMswWorker } from './mocks/reset'

// Initialize performance monitoring (Phase 7)
import './lib/performance'

// Initialize color support testing (Phase 7)
import './lib/colorSupport'

// Initialize WCAG 2.2 AA compliance auditing (Phase 7)
import './lib/wcagAudit'

// Initialize MSW before rendering the app
async function startApp() {
  // Start MSW in all environments
  await initMocks();
  
  // Reset the worker to ensure all routes are registered
  await resetMswWorker();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

startApp();
