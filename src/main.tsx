import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initMocks } from './mocks'
import { resetMswWorker } from './mocks/reset'

// Initialize MSW before rendering the app
async function startApp() {
  // Start MSW in development environment
  await initMocks();
  
  // Reset the worker to ensure all routes are registered
  if (import.meta.env.MODE !== 'production') {
    await resetMswWorker();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

startApp();
