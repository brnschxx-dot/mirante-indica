'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function Cadastrar() {
  const [nome, setNome] = useState('')
  const [tel, setTel] = useState('')
  const [status, setStatus] = useState('')

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Salvando...')
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
        <Link href="/" className="text-blue-600 underline text-sm">Voltar</Link>
      </div>
      
      <form onSubmit={salvar} className="flex flex-col gap-4">
        <input 
          className="border p-2 rounded text-black w-full" 
          placeholder="Nome do local (Ex: Pizzaria)" 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          required 
        />
        <input 
          className="border p-2 rounded text-black w-full" 
          placeholder="WhatsApp" 
          value={tel} 
          onChange={e => setTel(e.target.value)} 
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Enviar Indicação
        </button>
      </form>
      
      {status && <p className="mt-4 text-center font-medium text-gray-700">{status}</p>}
    </div>
  )
}