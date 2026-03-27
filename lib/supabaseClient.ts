import { createClient } from '@supabase/supabase-js'

// Usando as suas chaves reais como fallback para garantir o funcionamento imediato
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhaqkbzhnzrxtvshijot.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oYXFrYnpobmpyeHR2c2hpam90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMzUyMzYsImV4cCI6MjA1ODcxMTIzNn0.Vf0yN0Tz9_2V3P7y8W3U8cdAcam' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)