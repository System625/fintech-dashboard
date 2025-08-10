/**
 * Performance utilities for monitoring Core Web Vitals and optimization
 * Implements Phase 7 performance requirements from ui-revamp.md
 */
import React from 'react';

// Core Web Vitals thresholds (from ui-revamp.md success metrics)
export const PERFORMANCE_THRESHOLDS = {
  // First Contentful Paint - target < 1.2s
  FCP: 1200,
  
  // Time to Interactive - target < 2.5s  
  TTI: 2500,
  
  // Largest Contentful Paint - good < 2.5s
  LCP: 2500,
  
  // First Input Delay - good < 100ms
  FID: 100,
  
  // Cumulative Layout Shift - good < 0.1
  CLS: 0.1,
  
  // Bundle size increase target < 15%
  BUNDLE_SIZE_INCREASE: 0.15,
} as const;

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  private constructor() {
    this.initializeObservers();
  }
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  private initializeObservers() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Observe paint timing
    this.observePaintTiming();
    
    // Observe layout shifts
    this.observeLayoutShift();
    
    // Observe largest contentful paint
    this.observeLCP();
    
    // Report initial page load metrics
    this.reportInitialMetrics();
  }
  
  private observePaintTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.set('FCP', entry.startTime);
            this.checkThreshold('FCP', entry.startTime, PERFORMANCE_THRESHOLDS.FCP);
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Paint timing observer not supported:', error);
    }
  }
  
  private observeLayoutShift() {
    try {
      let clsScore = 0;
      
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            this.metrics.set('CLS', clsScore);
            this.checkThreshold('CLS', clsScore, PERFORMANCE_THRESHOLDS.CLS);
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Layout shift observer not supported:', error);
    }
  }
  
  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.set('LCP', lastEntry.startTime);
        this.checkThreshold('LCP', lastEntry.startTime, PERFORMANCE_THRESHOLDS.LCP);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }
  }
  
  private reportInitialMetrics() {
    // Report navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.fetchStart;
          const domLoad = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          const pageLoad = navigation.loadEventEnd - navigation.fetchStart;
          
          this.metrics.set('TTFB', ttfb);
          this.metrics.set('DOM_LOAD', domLoad);
          this.metrics.set('PAGE_LOAD', pageLoad);
          
          // Log performance summary in development
          if (process.env.NODE_ENV === 'development') {
            this.logPerformanceSummary();
          }
        }
      }, 0);
    });
  }
  
  private checkThreshold(metric: string, value: number, threshold: number) {
    const status = value <= threshold ? '✅' : '⚠️';
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${status} ${metric}: ${value.toFixed(2)}ms (threshold: ${threshold}ms)`);
    }
  }
  
  private logPerformanceSummary() {
    console.group('🚀 Performance Metrics Summary');
    console.log('Target: Lighthouse 95+, FCP <1.2s, TTI <2.5s');
    console.log('═'.repeat(50));
    
    this.metrics.forEach((value, key) => {
      const threshold = (PERFORMANCE_THRESHOLDS as any)[key];
      if (threshold) {
        const status = value <= threshold ? '✅' : '⚠️';
        console.log(`${status} ${key}: ${value.toFixed(2)}ms`);
      } else {
        console.log(`ℹ️ ${key}: ${value.toFixed(2)}ms`);
      }
    });
    
    console.groupEnd();
  }
  
  // Public API for manual performance tracking
  public measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
  
  public measureAsync<T>(name: string, promise: Promise<T>): Promise<T> {
    const start = performance.now();
    
    return promise.finally(() => {
      const duration = performance.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${name} (async): ${duration.toFixed(2)}ms`);
      }
    });
  }
  
  public getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Helper function for measuring component render time
export function withPerformanceTracking<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  displayName?: string
) {
  const WrappedComponent = (props: P) => {
    return performanceMonitor.measureFunction(
      `Render: ${displayName || Component.displayName || Component.name}`,
      () => React.createElement(Component, props)
    );
  };
  
  WrappedComponent.displayName = `withPerformanceTracking(${displayName || Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Bundle size analyzer (development only)
export function logBundleInfo() {
  if (process.env.NODE_ENV === 'development') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalSize = 0;
    
    console.group('📦 Bundle Analysis');
    scripts.forEach((script: any) => {
      if (script.src && script.src.includes('/assets/')) {
        fetch(script.src, { method: 'HEAD' })
          .then(response => {
            const size = response.headers.get('content-length');
            if (size) {
              totalSize += parseInt(size);
              console.log(`• ${script.src.split('/').pop()}: ${(parseInt(size) / 1024).toFixed(1)}KB`);
            }
          })
          .catch(() => {}); // Ignore errors
      }
    });
    
    setTimeout(() => {
      console.log(`Total estimated size: ~${(totalSize / 1024).toFixed(1)}KB`);
      console.groupEnd();
    }, 1000);
  }
}

// Image loading optimization
export function optimizeImageLoading() {
  // Add loading="lazy" to images that don't have it
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img: any) => {
    // Don't lazy load images that are likely above the fold
    const rect = img.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      img.loading = 'lazy';
    }
  });
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Start performance monitoring
  performanceMonitor;
  
  // Optimize images when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImageLoading);
  } else {
    optimizeImageLoading();
  }
  
  // Log bundle info in development
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      setTimeout(logBundleInfo, 2000);
    });
  }
}