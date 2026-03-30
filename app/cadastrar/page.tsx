'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Cadastrar() {
  const [nome, setNome] = useState('')
  const [tel, setTel] = useState('')
  const [categoria, setCategoria] = useState('')
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
    
    if (!categoria) {
      setStatus('⚠️ Por favor, escolha uma categoria.')
      return
    }

    setStatus('Salvando...')

    // Retificação: Criamos o objeto explicitamente para evitar erros de mapeamento
    const dadosParaSalvar = {
      nome: nome.trim(),
      telefone: tel.trim(),
      categoria: categoria
    }

    const { error } = await supabase
      .from('prestadores')
      .insert([dadosParaSalvar])

    if (error) { 
      // Se o erro de "coluna não encontrada" persistir, o erro.message dirá o motivo exato
      setStatus('Erro: ' + error.message) 
    } else { 
      setStatus('✅ Indicação salva com sucesso!')
      setNome('')
      setTel('')
      setCategoria('')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const listaCategorias = [
    "🛠️ Construção e Reforma (Pintor, Pedreiro)",
    "⚡ Manutenção (Eletricista, Encanador)",
    "🧹 Limpeza e Diarista",
    "🚚 Fretes e Mudanças",
    "💻 TI e Eletrônicos",
    "🍕 Alimentação",
    "✨ Estética e Saúde",
    "📦 Outros"
  ]

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen text-black bg-gray-50 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-blue-900">Nova Indicação</h1>
        <Link href="/dashboard" className="text-blue-600 font-bold bg-blue-100 px-4 py-2 rounded-full text-sm">
          Voltar
        </Link>
      </div>

      <form onSubmit={salvar} className="flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Qual o tipo de serviço?</label>
          <select 
            className="border border-gray-300 p-3 rounded-xl outline-blue-500 bg-white text-gray-800"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            required
          >
            <option value="" disabled>Selecione uma categoria...</option>
            {listaCategorias.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Nome do profissional ou local</label>
          <input 
            type="text"
            autoCapitalize="words"
            className="border border-gray-300 p-3 rounded-xl outline-blue-500 placeholder-gray-400" 
            placeholder="Ex: Eletricista João" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">WhatsApp (Apenas números)</label>
          <input 
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            className="border border-gray-300 p-3 rounded-xl outline-blue-500 placeholder-gray-400" 
            placeholder="Ex: 11999999999" 
            value={tel} 
            onChange={e => setTel(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="bg-green-600 text-white p-4 rounded-xl font-bold text-lg mt-2 shadow-md hover:bg-green-700 transition-colors active:scale-95"
        >
          Salvar Indicação
        </button>
      </form>

      {status && (
        <div className={`mt-6 p-4 rounded-xl text-center font-bold border ${status.includes('Erro') || status.includes('⚠️') ? 'text-red-700 bg-red-50 border-red-200' : 'text-green-800 bg-green-50 border-green-200'}`}>
          {status}
        </div>
      )}
    </div>
  )
}