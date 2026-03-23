'use client'
import { useState } from 'react'
// Ajustado de ../ para ../../ para encontrar a pasta lib corretamente
import { supabase } from '../../lib/supabaseClient' 
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('Entrando...')
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      // Traduzi o erro para ficar mais amigável para você
      setMensagem('Erro: E-mail ou senha incorretos.')
    } else {
      setMensagem('✅ Login realizado!')
      router.push('/') 
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto font-sans flex flex-col min-h-screen justify-center">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Mirante Indica 🏢</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-2 text-gray-700 text-center text-black">Acesso Morador</h2>
        <input 
          type="email"
          className="border p-2 rounded text-black outline-blue-500" 
          placeholder="E-mail" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password"
          className="border p-2 rounded text-black outline-blue-500" 
          placeholder="Senha" 
          value={senha} 
          onChange={e => setSenha(e.target.value)} 
          required 
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold transition-colors">
          Entrar
        </button>
      </form>
      {mensagem && (
        <p className={`mt-4 text-center text-sm font-medium ${mensagem.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
          {mensagem}
        </p>
      )}
    </div>
  )
}