import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhaqkbzhnzrxtvshijot.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_secret_VOrz4TTt-sAhnvVt43tEEw_04ForBcI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)