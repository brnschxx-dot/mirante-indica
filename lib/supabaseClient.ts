import { createClient } from '@supabase/supabase-js'

// As variáveis DEVEM começar com NEXT_PUBLIC_ para o navegador enxergar
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Se isso imprimir no console, as chaves não carregaram
if (!supabaseUrl) {
  console.error("❌ Erro Crítico: NEXT_PUBLIC_SUPABASE_URL não definida!")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)