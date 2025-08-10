export { AssetAllocationChart } from './AssetAllocationChart';
export { ExpenseCategoriesChart } from './ExpenseCategoriesChart';
export { SavingsGrowthChart } from './SavingsGrowthChart';
export { PortfolioPerformanceChart } from './PortfolioPerformanceChart';
export { MonthlyExpenseChart } from './MonthlyExpenseChart';

// Phase 6 - Modern chart components with ECharts theme integration (lazy-loaded for performance)
export { 
  Sparkline, 
  ModernLineChart, 
  ModernBarChart, 
  ModernDonutChart 
} from './LazyCharts';

// Direct imports available if needed (for advanced use cases)
export { default as SparklineComponent } from './Sparkline';
export { default as ModernLineChartComponent } from './ModernLineChart';
export { default as ModernBarChartComponent } from './ModernBarChart';
export { default as ModernDonutChartComponent } from './ModernDonutChart'; 