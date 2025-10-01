
import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/environment';
import 'react-native-url-polyfill/auto';

export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
