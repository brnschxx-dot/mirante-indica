'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export default function Cadastrar() {
  const [nome, setNome] = useState('')
  const [tel, setTel] = useState('')
  const [categoria, setCategoria] = useState('')
  const [status, setStatus] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
      } else {
        setUserEmail(session.user.email || '')
      }
    }
    checkUser()
  }, [router])

  const salvarIndicao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoria) return setStatus('⚠️ Selecione uma categoria')
    
    setStatus('Enviando...')

    const { error } = await supabase.from('prestadores').insert([{
      nome: nome.trim(),
      telefone: tel.replace(/\D/g, ''), // Salva apenas números
      categoria,
      indicado_por: userEmail
    }])

    if (error) {
      setStatus('❌ Erro ao salvar: ' + error.message)
    } else {
      setStatus('✅ Indicação salva!')
      // Pequeno delay para o usuário ver o sucesso antes de voltar
      setTimeout(() => router.push('/'), 1500)
    }
  }

  const categorias = [
    "🛠️ Construção e Reforma", "⚡ Elétrica / Hidráulica", 
    "🧹 Limpeza", "🍕 Alimentação", "🚚 Mudanças", 
    "💻 Tecnologia", "✨ Estética", "📦 Outros"
  ]

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-50 min-h-screen text-black">
      {/* Header de Navegação */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-blue-900">Indicar Profissional</h1>
      </div>

      <form onSubmit={salvarIndicao} className="space-y-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
          <select 
            className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Profissional</label>
          <input 
            type="text"
            className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: Pedro Pintor"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoCapitalize="words"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp</label>
          <input 
            type="tel"
            inputMode="numeric"
            className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="11999999999"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} /> Salvar Indicação
        </button>
      </form>

      {status && (
        <div className="mt-6 p-4 rounded-2xl text-center font-bold bg-white border border-gray-100 shadow-sm animate-bounce">
          {status}
        </div>
      )}
    </div>
  )
}