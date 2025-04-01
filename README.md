# Fintech Savings & Investment Dashboard

A modern fintech dashboard application built with React, TypeScript, and Tailwind CSS. This application provides users with a comprehensive view of their savings, investments, and financial transactions.

![Fintech Dashboard Screenshot](image.png)

## Features

### User Authentication
- Secure login, signup, and password reset functionality using Firebase Auth
- Protected routes requiring authentication
- User profile management

### Dashboard Overview
- Account summary cards showing total balances
- Quick actions for transfers, deposits, and withdrawals
- Savings goals progress visualization
- Investment portfolio performance summary
- Financial insights with spending analysis
- Recent transactions list with category icons

### Savings Management
- Savings goals tracking with progress bars
- Interest earned statistics and projections
- Savings growth visualization charts
- New savings goal creation form with validation

### Investment Portfolio
- Portfolio performance chart with time range filters (1D, 1W, 1M, 3M, 1Y, ALL)
- Asset allocation visualization
- Detailed investment holdings table
- Investment metrics (total value, gain/loss, return)
- Add new investments functionality

### Transaction History
- Complete transaction list with filtering options
- Export functionality for transaction data
- Transaction categorization and type filtering
- Date range selection

### UI/UX Features
- Responsive design for mobile, tablet, and desktop
- Light and dark mode themes
- Interactive charts and data visualization
- Form validation and error handling
- Loading states and fallback data

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Routing**: React Router DOM
- **State Management**: React Context API & React Query
- **Authentication**: Firebase Authentication
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast notifications
- **Animations**: Framer Motion
- **Development Mocking**: Mock Service Worker (MSW)

## Project Architecture

```
src/
├── assets/           # Static assets like images
├── components/       # Reusable UI components
│   ├── charts/       # Chart components
│   ├── dashboard/    # Dashboard-specific components
│   ├── forms/        # Form components
│   ├── layout/       # Layout components
│   └── ui/           # Shadcn UI components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── mocks/            # MSW mock server setup
│   ├── data/         # Mock data
│   ├── handlers/     # API endpoint handlers
├── pages/            # Page components
├── services/         # Firebase and other service integrations
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fintech-dashboard.git
   cd fintech-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory (or copy from `.env.example`) and add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or with yarn
yarn build
```

This generates a production-ready build in the `dist` directory.

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication service and add Email/Password sign-in method
3. Copy your Firebase configuration (available in Project Settings > General > Your apps)
4. Paste the configuration into your `.env` file

## Deployment Options

### Deploying to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

### Deploying to Netlify

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy the project:
   ```bash
   netlify deploy
   ```

### Other Deployment Options

The application can also be deployed to:
- Firebase Hosting
- GitHub Pages
- AWS Amplify
- Digital Ocean App Platform

## Development Features

### Mock Services

This project uses Mock Service Worker (MSW) to intercept network requests during development, making it possible to work on the UI without a real backend.

- Mock handlers are defined in `src/mocks/handlers/`
- Mock data is stored in `src/mocks/data/`

To disable mocking, comment out the MSW initialization in `src/main.tsx`.

### Testing

Run tests with:
```bash
npm run test
# or
yarn test
```

### Development Tools

- MSW for API mocking
- React Developer Tools browser extension
- TypeScript for type safety

## Key Files and Components

- `src/App.tsx` - Main app component with routing
- `src/context/AuthContext.tsx` - Authentication state management
- `src/components/layout/DashboardLayout.tsx` - Main layout structure
- `src/pages/` - Major page components for each section
- `src/components/charts/` - Data visualization components
- `src/components/forms/` - User input form components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Mock Service Worker](https://mswjs.io/)
- [Framer Motion](https://www.framer.com/motion/)
