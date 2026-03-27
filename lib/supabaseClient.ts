import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhaqkbzhnzrxtvshijot.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oYXFrYnpobnpyeHR2c2hpam90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTg0NzMsImV4cCI6MjA4OTY3NDQ3M30.EIFWOa3anuFJL7rgCI2nN0Qnmxld0-2beULhmD4w0uI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)