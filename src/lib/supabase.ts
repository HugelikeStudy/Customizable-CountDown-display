import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CountdownEvent {
  id: string;
  title: string;
  target_date: string;
  description: string;
  color: string;
  created_at: string;
  user_id: string | null;
  calendar_type?: string;
  lunar_date_display?: string;
}
