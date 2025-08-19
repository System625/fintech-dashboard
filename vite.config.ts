import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { splitVendorChunkPlugin } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    splitVendorChunkPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Disable sourcemaps for production
    reportCompressedSize: false, // Faster builds
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem - ensure React and ReactDOM are bundled together
          if (id.includes('react') && !id.includes('react-router')) {
            return 'react-vendor';
          }
          
          // React Router
          if (id.includes('react-router')) {
            return 'react-router';
          }
          
          // Radix UI components
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }
          
          // Charts - Recharts only
          if (id.includes('recharts')) {
            return 'recharts';
          }
          
          // Forms & Validation
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'form-vendor';
          }
          
          // Data Fetching & State
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }
          
          // Firebase
          if (id.includes('firebase')) {
            return 'firebase';
          }
          
          // Utilities
          if (id.includes('clsx') || id.includes('class-variance-authority') || 
              id.includes('tailwind-merge') || id.includes('date-fns') || 
              id.includes('lucide-react') || id.includes('sonner')) {
            return 'utils-vendor';
          }
          
          // MSW (development only)
          if (id.includes('msw')) {
            return 'msw';
          }
          
          // Vendor chunks for other node_modules
          if (id.includes('node_modules')) {
            // Split large vendor libraries
            if (id.includes('lodash')) {
              return 'lodash';
            }
            if (id.includes('moment') || id.includes('dayjs')) {
              return 'date-utils';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    target: 'esnext',
    minify: 'esbuild', // Use esbuild instead of terser for better performance
  }
})
