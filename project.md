# Fintech Savings & Investment App Dashboard Project Plan

Here's a comprehensive plan for developing your Fintech dashboard, structured as prompts you can feed to Cursor IDE:

## Project Setup & Structure

```
Create a new React project for a Fintech Savings & Investment Dashboard using Vite. Set up the folder structure with components, pages, hooks, services, and context directories. Install TailwindCSS for styling, Shadcn Ui for components React Router for navigation, and React Query for API data fetching. Use framer motion for animations, here is the new command for shadcn to install a button: npx shadcn@latest add button
```

## Authentication Implementation

```
Implement user authentication using Firebase Auth. Create login, signup, and password reset pages. Set up protected routes that redirect unauthenticated users to the login page. Add a context provider to manage authentication state across the application.
```

Firebase Auth is user-friendly and has a generous free tier that's suitable for this assessment.

## Dashboard Layout & Navigation

```
Create a responsive dashboard layout with a sidebar navigation (that converts to a mobile drawer menu on smaller screens). The sidebar should include links to Dashboard Home, Savings, Investments, Transactions, and Profile/Settings. Add a header with user info, notifications icon, and logout button. Use iconify-react for icons.
```

## Dashboard Overview Page

```
Build the dashboard home page with the following components:
1. Account summary card showing total balance
2. Quick actions section (transfer, deposit, withdraw)
3. Savings goals progress cards
4. Investment portfolio summary with performance chart
5. Recent transactions list limited to 5 items with a "View All" link
```

## Savings Features

```
Create a savings page with:
1. Current savings accounts/pots displayed as cards
2. Progress bars for savings goals
3. A form to create new savings goals
4. Historical savings growth chart
5. Interest earned statistics
```

## Investment Portfolio

```
Build an investment portfolio page showing:
1. Asset allocation pie chart
2. Investment performance line chart with filter options (1D, 1W, 1M, 1Y, All)
3. Individual investment cards with performance indicators
4. Buy/sell interface or buttons
5. Recommended investments section
```

## Transaction History

```
Implement a transactions page with:
1. Filterable transaction table (date, category, amount)
2. Search functionality
3. Transaction categorization
4. Expense analytics with charts
5. Export options for transaction data
```

## API Integration

For mock financial data:

```
Set up mock API endpoints using MSW (Mock Service Worker) to simulate:
1. User account data (balance, personal info)
2. Savings accounts data
3. Investment portfolio data
4. Transaction history
5. Market performance data

Create API service files to handle data fetching with React Query, including loading and error states.
```

## State Management

```
Implement state management using React Context API for global state like authentication, and React Query for server state. Create custom hooks to access and update different parts of the application state.
```

## Responsive Design Implementation

```
Ensure the dashboard is fully responsive using TailwindCSS breakpoints:
1. Mobile-first approach with sidebar converting to bottom navigation
2. Card layouts that stack on mobile and display in a grid on larger screens
3. Charts that resize properly across different screen sizes
4. Appropriate font sizes and spacing for different devices
5. Touch-friendly controls for mobile users
```

## Data Visualization

```
Implement data visualization with Recharts or Chart.js:
1. Line charts for performance tracking
2. Pie/donut charts for asset allocation
3. Bar charts for spending categories
4. Progress bars for savings goals
5. Custom tooltips for detailed information
```

## Deployment & Final Steps

```
Set up CI/CD with GitHub Actions. Configure deployment to Vercel. Add README documentation with project overview, setup instructions, and key features highlighted. Prepare a short Loom video demonstrating the app's responsive design and key features.
```

## API Resources

1. **Authentication**: Firebase Auth (https://firebase.google.com/docs/auth)

2. **Mock Financial Data API Options**:
   - Use MSW (Mock Service Worker): https://mswjs.io/
   - Financial data structure examples:

```javascript
// Example savings data structure
const savingsAccounts = [
  {
    id: "sav-1",
    name: "Emergency Fund",
    currentAmount: 5000,
    targetAmount: 10000,
    interestRate: 2.5,
    createdAt: "2023-01-15T00:00:00Z",
    lastUpdated: "2023-10-01T00:00:00Z"
  },
  // More savings accounts...
];

// Example investment data structure
const investments = [
  {
    id: "inv-1",
    name: "Tech Growth ETF",
    ticker: "TECH",
    shares: 10.5,
    buyPrice: 95.2,
    currentPrice: 105.8,
    category: "ETF",
    lastUpdated: "2023-10-02T12:30:00Z"
  },
  // More investments...
];

// Example transactions data structure
const transactions = [
  {
    id: "tx-1",
    date: "2023-10-01T10:23:00Z",
    description: "Salary deposit",
    amount: 3500,
    type: "income",
    category: "Salary",
    accountId: "acc-1"
  },
  // More transactions...
];
```

3. **Alternative: Real Financial APIs (if you prefer actual data)**:
   - Alpha Vantage (free tier): https://www.alphavantage.co/
   - Finnhub (free tier): https://finnhub.io/
   - Polygon.io (free tier): https://polygon.io/

Let me know if you need more specific guidance on any part of this project!