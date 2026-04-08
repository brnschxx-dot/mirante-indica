import { createClient } from '@supabase/supabase-auth-helpers-nextjs' // ou @supabase/supabase-js

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Variáveis do Supabase não encontradas!")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)