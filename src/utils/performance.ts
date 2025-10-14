// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component render time
  trackRenderTime(componentName: string, renderTime: number) {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    this.metrics.get(componentName)?.push(renderTime);
    
    // Keep only the last 100 measurements to prevent memory issues
    if (this.metrics.get(componentName)!.length > 100) {
      this.metrics.set(componentName, this.metrics.get(componentName)!.slice(-100));
    }
  }

  // Track API call performance
  trackAPICall(apiEndpoint: string, responseTime: number) {
    const metricName = `API: ${apiEndpoint}`;
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }
    this.metrics.get(metricName)?.push(responseTime);
    
    // Keep only the last 100 measurements to prevent memory issues
    if (this.metrics.get(metricName)!.length > 100) {
      this.metrics.set(metricName, this.metrics.get(metricName)!.slice(-100));
    }
  }

  // Get average render time for a component
  getAverageRenderTime(componentName: string): number {
    const times = this.metrics.get(componentName);
    if (!times || times.length === 0) return 0;
    
    const sum = times.reduce((acc, time) => acc + time, 0);
    return sum / times.length;
  }

  // Get average response time for an API endpoint
  getAverageAPITime(apiEndpoint: string): number {
    const metricName = `API: ${apiEndpoint}`;
    const times = this.metrics.get(metricName);
    if (!times || times.length === 0) return 0;
    
    const sum = times.reduce((acc, time) => acc + time, 0);
    return sum / times.length;
  }

  // Get all metrics
  getAllMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};
    
    for (const [name, times] of this.metrics.entries()) {
      if (times.length > 0) {
        const sum = times.reduce((acc, time) => acc + time, 0);
        result[name] = {
          average: sum / times.length,
          count: times.length
        };
      }
    }
    
    return result;
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics.clear();
  }
}

// Hook for measuring component render performance
export function useRenderTime(componentName: string) {
  if (typeof window === 'undefined') return null;
  
  const monitor = PerformanceMonitor.getInstance();
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    monitor.trackRenderTime(componentName, end - start);
  };
}

// Wrapper for API calls with performance tracking
export async function trackedAPICall<T>(endpoint: string, call: () => Promise<T>): Promise<T> {
  if (typeof window === 'undefined') return call();
  
  const monitor = PerformanceMonitor.getInstance();
  const start = performance.now();
  
  try {
    const result = await call();
    const end = performance.now();
    monitor.trackAPICall(endpoint, end - start);
    return result;
  } catch (error) {
    const end = performance.now();
    monitor.trackAPICall(endpoint, end - start);
    throw error;
  }
}

// Utility to log performance metrics to console
export function logPerformanceMetrics() {
  if (typeof window === 'undefined') return;
  
  const monitor = PerformanceMonitor.getInstance();
  const metrics = monitor.getAllMetrics();
  
  console.group("Performance Metrics");
  for (const [name, data] of Object.entries(metrics)) {
    console.log(`${name}: ${data.average.toFixed(2)}ms (count: ${data.count})`);
  }
  console.groupEnd();
}
