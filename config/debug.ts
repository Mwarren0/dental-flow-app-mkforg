
export interface DebugConfig {
  enabled: boolean;
  showConnectionStatus: boolean;
  showDataCounts: boolean;
  showTestDataButton: boolean;
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';
}

export const debugConfig: DebugConfig = {
  enabled: __DEV__, // Only enable in development
  showConnectionStatus: false, // Hide connection status from dashboard
  showDataCounts: false, // Hide debug data counts from dashboard
  showTestDataButton: false, // Hide test data button from dashboard
  logLevel: __DEV__ ? 'debug' : 'error',
};

export const debugLog = (level: 'error' | 'warn' | 'info' | 'debug', message: string, data?: any) => {
  if (!debugConfig.enabled) return;
  
  const levels = ['none', 'error', 'warn', 'info', 'debug'];
  const currentLevelIndex = levels.indexOf(debugConfig.logLevel);
  const messageLevelIndex = levels.indexOf(level);
  
  if (messageLevelIndex <= currentLevelIndex) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }
};
