'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Cadastrar() {
  const [nome, setNome] = useState('')
  const [tel, setTel] = useState('')
  const [status, setStatus] = useState('')
  const router = useRouter()

  // PROTEÇÃO: Verifica se o usuário está logado ao carregar a página
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // Se não tiver sessão, manda para o login
        router.replace('/login')
      }
    }
    checkUser()
  }, [router])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Salvando...')
    
    // O Supabase agora sabe QUEM está inserindo se o RLS estiver configurado
    const { error } = await supabase.from('prestadores').insert([{ nome, telefone: tel }])
    
    if (error) {
      setStatus('Erro: ' + error.message)
    } else {
      setStatus('✅ Sucesso!')
      setNome('')
      setTel('')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nova Indicação</h1>
        <Link href="/dashboard" className="text-blue-600 underline text-sm font-medium">Voltar ao Menu</Link>
      </div>
      
      <form onSubmit={salvar} className="flex flex-col gap-4">
        <input 
          className="border border-gray-300 p-3 rounded-xl text-black w-full outline-blue-500" 
          placeholder="Nome do local (Ex: Eletricista João)" 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          required 
        />
        <input 
          className="border border-gray-300 p-3 rounded-xl text-black w-full outline-blue-500" 
          placeholder="WhatsApp (Ex: 11999999999)" 
          value={tel} 
          onChange={e => setTel(e.target.value)} 
        />
        <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 font-bold transition-colors mt-2">
          Enviar Indicação
        </button>
      </form>
      
      {status && (
        <p className={`mt-6 p-3 rounded-lg text-center text-sm font-medium border ${status.includes('Erro') ? 'text-red-600 bg-red-50 border-red-100' : 'text-green-700 bg-green-50 border-green-100'}`}>
          {status}
        </p>
      )}
    </div>
  )
}