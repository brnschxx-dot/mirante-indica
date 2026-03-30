'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus, Home } from 'lucide-react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Função para Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setMessage('❌ Erro: ' + error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  // Função para Cadastro (Sign Up)
  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    })
    
    if (error) {
      setMessage('❌ Erro no cadastro: ' + error.message)
    } else {
      setMessage('✅ Verifique seu e-mail para confirmar o cadastro!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-black">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        
        {/* Logo/Ícone do App */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg mb-4">
            <Home size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">Mirante Indica</h1>
          <p className="text-gray-500 font-medium">O guia oficial do nosso condomínio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {/* Botão Principal: ENTRAR */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn size={20} /> {loading ? 'Carregando...' : 'Entrar'}
            </button>

            {/* Divisor Visual */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">Novo por aqui?</span></div>
            </div>

            {/* Botão Alternativo: CADASTRAR */}
            <button 
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-white text-blue-600 border-2 border-blue-600 p-4 rounded-2xl font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-blue-50"
            >
              <UserPlus size={20} /> Criar Minha Conta
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-2xl text-center text-sm font-bold ${message.includes('❌') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {message}
          </div>
        )}
      </div>
      
      <p className="mt-8 text-gray-400 text-xs font-medium">Exclusivo para moradores do Mirante</p>
    </div>
  )
}