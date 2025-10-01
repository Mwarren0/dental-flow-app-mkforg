import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hlcnivhpjhrfymwhtrwt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY25pdmhwamhyZnltd2h0cnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyOTIyMzQsImV4cCI6MjA3NDg2ODIzNH0.0bAEPsBAXaEQkjDfd98PNBzUcwJwwqOORcLYdw6bQBk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
