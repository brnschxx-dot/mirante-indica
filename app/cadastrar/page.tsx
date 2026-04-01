'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

export default function Cadastrar() {
  const [formData, setFormData] = useState({
    nome: '', telefone: '', local: '', instagram: '', email: '', 
    categoria: 'Construção e Reforma', avaliacao: 0, comentario: ''
  })
  const [userMetadata, setUserMetadata] = useState<any>(null)
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUserMetadata(session.user.user_metadata)
    }
    getSession()
  }, [])

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('Salvando...')

    const partes = (userMetadata?.full_name || 'Morador').split(' ')
    const nomeExibicao = partes.length > 1 ? `${partes[0]} ${partes[partes.length - 1]}` : partes[0]

    const { error } = await supabase.from('prestadores').insert([{
      ...formData,
      indicado_por: nomeExibicao 
    }])

    if (error) setMensagem('❌ Erro: ' + error.message)
    else {
      setMensagem('✅ Indicação realizada!')
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-28">
      <div className="bg-white p-6 shadow-sm mb-6 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full text-blue-600"><ArrowLeft size={20}/></button>
        <h1 className="text-xl font-bold text-blue-900">Fazer Indicação</h1>
      </div>

      <form onSubmit={handleSalvar} className="p-6 max-w-md mx-auto flex flex-col gap-4">
        <input placeholder="Nome do Profissional*" className="p-4 rounded-xl border bg-white" required onChange={e => setFormData({...formData, nome: e.target.value})}/>
        <input placeholder="Telefone*" className="p-4 rounded-xl border bg-white" required onChange={e => setFormData({...formData, telefone: e.target.value})}/>
        
        <select 
          className="p-4 rounded-xl border bg-white font-medium text-gray-700" 
          value={formData.categoria}
          onChange={e => setFormData({...formData, categoria: e.target.value})}
        >
          <option value="🛠️ Construção e Reforma">🛠️ Construção e Reforma</option>
          <option value="⚡ Manutenção e Elétrica">⚡ Manutenção e Elétrica</option>
          <option value="🧹 Limpeza e Diaristas">🧹 Limpeza e Diaristas</option>
          <option value="🚚 Fretes e Mudanças">🚚 Fretes e Mudanças</option>
          <option value="💻 Tecnologia">💻 Tecnologia</option>
          <option value="🍕 Alimentação">🍕 Alimentação</option>
          <option value="✨ Estética">✨ Estética</option>
          <option value="📦 Outros">📦 Outros</option>
        </select>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm font-bold text-gray-500 mb-2">Avaliação:</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(num => (
              <Star key={num} size={30} onClick={() => setFormData({...formData, avaliacao: num})}
                className={formData.avaliacao >= num ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
        </div>

        <input placeholder="Local/Bairro" className="p-4 rounded-xl border bg-white" onChange={e => setFormData({...formData, local: e.target.value})}/>
        <input placeholder="Instagram (@usuario)" className="p-4 rounded-xl border bg-white" onChange={e => setFormData({...formData, instagram: e.target.value})}/>
        <textarea placeholder="Comentário..." className="p-4 rounded-xl border bg-white h-24" onChange={e => setFormData({...formData, comentario: e.target.value})}/>

        <button type="submit" className="bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all">Confirmar Indicação</button>
        {mensagem && <p className="text-center font-bold text-blue-600 animate-pulse">{mensagem}</p>}
      </form>
      <BottomNav />
    </div>
  )
}