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

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.replace('/login')
    }
    check()
  }, [router])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Salvando...')
    const { error } = await supabase.from('prestadores').insert([{ nome, telefone: tel }])
    if (error) { setStatus('Erro: ' + error.message) } 
    else { setStatus('✅ Sucesso!'); setNome(''); setTel(''); }
  }

  return (
    <div className="p-8 max-w-md mx-auto min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Nova Indicação</h1>
        <Link href="/dashboard" className="text-blue-600 font-medium">Voltar</Link>
      </div>
      <form onSubmit={salvar} className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md">
        <input className="border p-3 rounded-lg" placeholder="Nome do local" value={nome} onChange={e => setNome(e.target.value)} required />
        <input className="border p-3 rounded-lg" placeholder="WhatsApp (DDD+Número)" value={tel} onChange={e => setTel(e.target.value)} required />
        <button type="submit" className="bg-green-600 text-white p-3 rounded-lg font-bold">Salvar Indicação</button>
      </form>
      {status && <p className="mt-4 text-center font-bold">{status}</p>}
    </div>
  )
}