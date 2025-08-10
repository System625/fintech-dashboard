/**
 * Cross-browser OKLCH color support detection and fallback testing
 * Phase 7 - ui-revamp.md requirements
 */

export interface ColorSupportInfo {
  oklch: boolean;
  p3: boolean;
  hsl: boolean;
  rgb: boolean;
  userAgent: string;
  fallbacksActive: boolean;
}

/**
 * Detects OKLCH color support in the current browser
 */
export function detectOKLCHSupport(): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') {
    return false;
  }

  try {
    // Test if browser supports OKLCH by checking if CSS.supports works with OKLCH values
    return CSS.supports('color', 'oklch(0.7 0.15 200)');
  } catch (error) {
    return false;
  }
}

/**
 * Detects P3 color space support
 */
export function detectP3Support(): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') {
    return false;
  }

  try {
    return CSS.supports('color', 'color(display-p3 1 0 0)');
  } catch (error) {
    return false;
  }
}

/**
 * Gets comprehensive color support information
 */
export function getColorSupportInfo(): ColorSupportInfo {
  const oklchSupported = detectOKLCHSupport();
  
  return {
    oklch: oklchSupported,
    p3: detectP3Support(),
    hsl: typeof CSS !== 'undefined' ? CSS.supports('color', 'hsl(200 50% 50%)') : true,
    rgb: typeof CSS !== 'undefined' ? CSS.supports('color', 'rgb(255 0 0)') : true,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    fallbacksActive: !oklchSupported
  };
}

/**
 * Tests if our CSS fallback system is working properly
 */
export function testColorFallbacks(): { success: boolean; report: string[] } {
  const report: string[] = [];
  let success = true;

  try {
    // Create a test element to verify color application
    const testEl = document.createElement('div');
    testEl.style.cssText = `
      color: hsl(216 85% 57%);
      color: oklch(0.65 0.25 285);
      background: hsl(216 85% 95%);
      background: oklch(0.95 0.02 285);
      border-color: hsl(216 85% 85%);
      border-color: oklch(0.85 0.05 285);
    `;
    
    document.body.appendChild(testEl);
    
    const styles = window.getComputedStyle(testEl);
    const supportInfo = getColorSupportInfo();
    
    // Test color property
    const colorValue = styles.color;
    if (supportInfo.oklch) {
      // If OKLCH is supported, we should see OKLCH values or equivalent computed values
      report.push(`✅ OKLCH supported: color computed as ${colorValue}`);
    } else {
      // If OKLCH not supported, should fall back to HSL
      report.push(`⚠️ OKLCH fallback active: color computed as ${colorValue}`);
      if (!colorValue.includes('rgb') && !colorValue.includes('hsl')) {
        report.push(`❌ Color fallback may have failed - unexpected value: ${colorValue}`);
        success = false;
      }
    }
    
    // Test background color
    const bgValue = styles.backgroundColor;
    report.push(`Background: ${bgValue}`);
    
    // Test border color  
    const borderValue = styles.borderColor;
    report.push(`Border: ${borderValue}`);
    
    document.body.removeChild(testEl);
    
    report.push(`Browser: ${supportInfo.userAgent.split(' ')[0]}`);
    report.push(`OKLCH Support: ${supportInfo.oklch ? '✅' : '❌'}`);
    report.push(`P3 Support: ${supportInfo.p3 ? '✅' : '❌'}`);
    
  } catch (error) {
    report.push(`❌ Fallback test failed: ${error}`);
    success = false;
  }

  return { success, report };
}

/**
 * Comprehensive browser compatibility test
 */
export function runCompatibilityTest(): {
  support: ColorSupportInfo;
  fallbackTest: { success: boolean; report: string[] };
  recommendations: string[];
} {
  const support = getColorSupportInfo();
  const fallbackTest = testColorFallbacks();
  const recommendations: string[] = [];

  // Generate recommendations based on support
  if (!support.oklch) {
    recommendations.push('✅ OKLCH fallbacks are active - HSL values being used');
    recommendations.push('Consider progressive enhancement with OKLCH for supported browsers');
  } else {
    recommendations.push('✅ Full OKLCH support detected - modern color features available');
  }

  if (!support.p3) {
    recommendations.push('P3 wide gamut not supported - using sRGB color space');
  }

  // Browser-specific recommendations
  const ua = support.userAgent.toLowerCase();
  if (ua.includes('firefox') && !support.oklch) {
    recommendations.push('Firefox: OKLCH support available in recent versions');
  }
  
  if (ua.includes('safari') && !support.oklch) {
    recommendations.push('Safari: OKLCH support available in Safari 15.4+');
  }
  
  if (ua.includes('chrome') && !support.oklch) {
    recommendations.push('Chrome: OKLCH support available in Chrome 111+');
  }

  return {
    support,
    fallbackTest,
    recommendations
  };
}

/**
 * Logs comprehensive color support report to console
 */
export function logColorSupportReport(): void {
  if (typeof console === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  const test = runCompatibilityTest();
  
  console.group('🎨 Color Support & Fallback Report');
  console.log('═'.repeat(50));
  
  console.group('Browser Support');
  Object.entries(test.support).forEach(([key, value]) => {
    if (key !== 'userAgent') {
      const status = typeof value === 'boolean' ? (value ? '✅' : '❌') : value;
      console.log(`${key.toUpperCase()}: ${status}`);
    }
  });
  console.groupEnd();
  
  console.group('Fallback Test Results');
  test.fallbackTest.report.forEach(line => console.log(line));
  console.groupEnd();
  
  console.group('Recommendations');
  test.recommendations.forEach(rec => console.log(rec));
  console.groupEnd();
  
  console.groupEnd();
}

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run test when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(logColorSupportReport, 1000);
    });
  } else {
    setTimeout(logColorSupportReport, 1000);
  }
}