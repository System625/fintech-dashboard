import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI Library
          'radix-ui': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog', 
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs'
          ],
          
          // Charts & Data Visualization  
          'chart-vendor': ['echarts', 'recharts'],
          
          // Animation
          'framer-motion': ['framer-motion'],
          
          // Forms & Validation
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Data Fetching & State
          'query-vendor': ['@tanstack/react-query'],
          
          // Utilities
          'utils-vendor': [
            'clsx', 
            'class-variance-authority', 
            'tailwind-merge',
            'date-fns',
            'lucide-react',
            'sonner'
          ]
        }
      }
    }
  }
})
