
import Constants from 'expo-constants';

export interface Environment {
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  enableDebug: boolean;
}

const developmentConfig: Environment = {
  supabaseUrl: 'https://hlcnivhpjhrfymwhtrwt.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY25pdmhwamhyZnltd2h0cnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzQ0NzQsImV4cCI6MjA1MTUxMDQ3NH0.Hs3gGJBJqGJQOKGJQOKGJQOKGJQOKGJQOKGJQOKGJQO',
  environment: 'development',
  apiUrl: 'https://hlcnivhpjhrfymwhtrwt.supabase.co',
  enableDebug: true,
};

const productionConfig: Environment = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hlcnivhpjhrfymwhtrwt.supabase.co',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-production-anon-key',
  environment: 'production',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://hlcnivhpjhrfymwhtrwt.supabase.co',
  enableDebug: false,
};

const getEnvironmentConfig = (): Environment => {
  if (__DEV__) {
    return developmentConfig;
  }
  
  // Check if we're in Expo Go or a development build
  if (Constants.appOwnership === 'expo') {
    return developmentConfig;
  }
  
  return productionConfig;
};

export const env = getEnvironmentConfig();

// Helper function to check if we're in development
export const isDevelopment = () => env.environment === 'development';
export const isProduction = () => env.environment === 'production';
