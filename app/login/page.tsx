'use client'
import { useState } from 'react'
import Image from 'next/image' 
import { supabase } from '../../lib/supabaseClient' 
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setMensagem('Verificando credenciais...')
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setMensagem('❌ E-mail ou senha incorretos.')
      setCarregando(false)
    } else {
      setMensagem('✅ Sucesso! Redirecionando...')
      router.replace('/') 
    }
  }

  // Função retificada: agora apenas redireciona para a tela de registro
  const handleSignUp = () => {
    router.push('/registro')
  }

  return (
    <div className="p-8 max-w-md mx-auto font-sans flex flex-col min-h-screen justify-center bg-gray-50 text-black">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="bg-white p-4 rounded-full shadow-md mb-4 border border-gray-100">
          <Image src="/logo-mirante.png" alt="Logo" width={80} height={80} priority />
        </div>
        <h1 className="text-3xl font-bold text-blue-900">Mirante Indica</h1>
        <p className="text-gray-500 text-sm">Acesso exclusivo para moradores</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <input 
          type="email" placeholder="Seu e-mail" 
          className="border border-gray-200 p-3 rounded-xl outline-blue-500"
          value={email} onChange={e => setEmail(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Sua senha" 
          className="border border-gray-200 p-3 rounded-xl outline-blue-500"
          value={senha} onChange={e => setSenha(e.target.value)} required 
        />
        
        <button 
          type="submit" 
          disabled={carregando}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 font-bold transition-all disabled:opacity-50"
        >
          <LogIn size={20} /> Entrar
        </button>

        <button 
          type="button"
          onClick={handleSignUp}
          className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 p-3 rounded-xl hover:bg-blue-50 font-bold transition-all"
        >
          <UserPlus size={20} /> Cadastrar Novo Morador
        </button>
      </form>
      
      {mensagem && <p className="mt-4 text-center text-sm font-semibold text-gray-700">{mensagem}</p>}
    </div>
  )
}