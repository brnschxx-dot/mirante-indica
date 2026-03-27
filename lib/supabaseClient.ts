import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhaqkbzhnzrxtvshijot.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_nxaXHKuHvhgxco_jceo9AA_F3aZrdt8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)