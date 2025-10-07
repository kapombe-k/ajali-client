import { createClient } from '@supabase/supabase-js';

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);