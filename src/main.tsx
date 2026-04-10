import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize performance monitoring (Phase 7)
import './lib/performance'

// Initialize color support testing (Phase 7)
import './lib/colorSupport'

// Initialize WCAG 2.2 AA compliance auditing (Phase 7)
import './lib/wcagAudit'

async function startApp() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { initMocks } = await import('./mocks');
    const { resetMswWorker } = await import('./mocks/reset');
    await initMocks();
    await resetMswWorker();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

startApp();
