'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

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

  // Função para Cadastro (Nova Função)
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
    <div className="p-8 max-w-md mx-auto text-black font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">Mirante Indica</h1>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="E-mail" 
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Entrar'}
        </button>

        {/* Alternativa de Cadastro */}
        <button 
          type="button"
          onClick={handleSignUp}
          disabled={loading}
          className="text-blue-600 font-bold text-sm hover:underline"
        >
          Não tem conta? Cadastre-se aqui
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center text-sm font-medium">
          {message}
        </div>
      )}
    </div>
  )
}