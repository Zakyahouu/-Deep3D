/**
 * Comprehensive Error Handling Utility
 * Catches and handles all potential runtime errors
 */

class ErrorHandler {
  constructor() {
    this.setupGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.logError('Unhandled Promise Rejection', event.reason);
      event.preventDefault();
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Uncaught error:', event.error);
      this.logError('Uncaught Error', event.error);
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        console.error('Resource loading error:', event.target.src || event.target.href);
        this.logError('Resource Loading Error', {
          type: event.target.tagName,
          src: event.target.src || event.target.href,
          error: event.error
        });
      }
    }, true);
  }

  logError(type, error) {
    const errorInfo = {
      type,
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    // this.sendToErrorService(errorInfo);
  }

  // Safe function wrapper
  safeCall(fn, context = null, ...args) {
    try {
      if (typeof fn !== 'function') {
        throw new Error('safeCall: First argument must be a function');
      }
      return fn.apply(context, args);
    } catch (error) {
      this.logError('Safe Call Error', error);
      return null;
    }
  }

  // Safe async function wrapper
  async safeAsyncCall(fn, context = null, ...args) {
    try {
      if (typeof fn !== 'function') {
        throw new Error('safeAsyncCall: First argument must be a function');
      }
      return await fn.apply(context, args);
    } catch (error) {
      this.logError('Safe Async Call Error', error);
      return null;
    }
  }

  // Validate data structure
  validateData(data, schema) {
    try {
      if (!data || typeof data !== 'object') {
        return false;
      }

      for (const [key, validator] of Object.entries(schema)) {
        if (!validator(data[key])) {
          console.warn(`Validation failed for key: ${key}`, data[key]);
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logError('Data Validation Error', error);
      return false;
    }
  }

  // Safe array operations
  safeArrayOperation(array, operation, fallback = []) {
    try {
      if (!Array.isArray(array)) {
        console.warn('safeArrayOperation: Expected array, got:', typeof array);
        return fallback;
      }
      return operation(array);
    } catch (error) {
      this.logError('Safe Array Operation Error', error);
      return fallback;
    }
  }

  // Safe object property access
  safeGet(obj, path, defaultValue = null) {
    try {
      if (!obj || typeof obj !== 'object') {
        return defaultValue;
      }

      const keys = path.split('.');
      let current = obj;

      for (const key of keys) {
        if (current === null || current === undefined || !(key in current)) {
          return defaultValue;
        }
        current = current[key];
      }

      return current;
    } catch (error) {
      this.logError('Safe Get Error', error);
      return defaultValue;
    }
  }

  // Safe JSON operations
  safeJSONParse(str, fallback = null) {
    try {
      return JSON.parse(str);
    } catch (error) {
      this.logError('Safe JSON Parse Error', error);
      return fallback;
    }
  }

  safeJSONStringify(obj, fallback = '{}') {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      this.logError('Safe JSON Stringify Error', error);
      return fallback;
    }
  }

  // Check if Electron API is available
  isElectronAPIReady() {
    return !!(window.electronAPI && typeof window.electronAPI === 'object');
  }

  // Safe Electron API call
  async safeElectronCall(method, ...args) {
    try {
      if (!this.isElectronAPIReady()) {
        throw new Error('Electron API not available');
      }

      if (typeof window.electronAPI[method] !== 'function') {
        throw new Error(`Electron API method '${method}' not found`);
      }

      return await window.electronAPI[method](...args);
    } catch (error) {
      this.logError('Safe Electron Call Error', error);
      throw error;
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export for use in components
export default errorHandler;

// Export utility functions for convenience
export const {
  safeCall,
  safeAsyncCall,
  validateData,
  safeArrayOperation,
  safeGet,
  safeJSONParse,
  safeJSONStringify,
  isElectronAPIReady,
  safeElectronCall
} = errorHandler;
