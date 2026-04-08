import { createClient } from '@supabase/supabase-js'

// Aqui o código apenas busca o que está no .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Atenção: As chaves do Supabase não foram encontradas no .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)