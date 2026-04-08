'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Star, 
  User, 
  Phone, 
  Tag, 
  MapPin, 
  Camera, 
  MessageSquare 
} from 'lucide-react'
import BottomNav from '../../components/BottomNav'

export default function Cadastrar() {
  const [formData, setFormData] = useState({
    nome: '', telefone: '', local: '', Camera: '', email: '', 
    categoria: 'Construção', 
    avaliacao: 0, // ALTERADO: Agora começa em 0 (estrelas vazias)
    comentario: ''
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
    
    // Validação opcional: impede salvar se não houver avaliação
    if (formData.avaliacao === 0) {
      setMensagem('⚠️ Por favor, selecione uma nota!')
      return
    }

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
    <div className="min-h-screen bg-gray-50 text-black pb-32 font-sans">
      <div className="bg-white p-6 shadow-sm mb-6 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full text-blue-600 active:scale-90 transition-all">
          <ArrowLeft size={20}/>
        </button>
        <h1 className="text-xl font-bold text-blue-900">Nova Indicação</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSalvar} className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="bg-blue-600 p-6 text-white text-center">
            <h2 className="text-lg font-semibold tracking-tight italic">"Quem indica, amigo é!"</h2>
          </div>

          <div className="p-6 space-y-5">
            
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={18} />
              <input 
                required 
                placeholder="Nome do Profissional*" 
                className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={e => setFormData({...formData, nome: e.target.value})}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-4 text-gray-400" size={18} />
              <input 
                required 
                placeholder="Telefone*" 
                className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={e => setFormData({...formData, telefone: e.target.value})}
              />
            </div>

            <div className="relative">
              <Tag className="absolute left-4 top-4 text-gray-400" size={18} />
              <select 
                className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium text-gray-700" 
                value={formData.categoria}
                onChange={e => setFormData({...formData, categoria: e.target.value})}
              >
                <option value="Construção">🛠️ Construção e Reforma</option>
                <option value="Manutenção">⚡ Manutenção e Elétrica</option>
                <option value="Limpeza">🧹 Limpeza e Diaristas</option>
                <option value="Fretes">🚚 Fretes e Mudanças</option>
                <option value="Tecnologia">💻 Tecnologia</option>
                <option value="Alimentação">🍕 Alimentação</option>
                <option value="Estética">✨ Estética</option>
                <option value="Outros">📦 Outros</option>
              </select>
            </div>

            {/* Avaliação - Estrelas começam vazias */}
            <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Sua Nota</p>
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5].map(num => (
                  <button key={num} type="button" onClick={() => setFormData({...formData, avaliacao: num})} className="active:scale-125 transition-transform">
                    <Star 
                      size={32} 
                      className={formData.avaliacao >= num ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                <input placeholder="Local/Bairro" className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl outline-none" onChange={e => setFormData({...formData, local: e.target.value})}/>
              </div>
              <div className="relative">
                <Camera className="absolute left-4 top-4 text-pink-500" size={18} />
                <input placeholder="Instagram (@usuario)" className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl outline-none" onChange={e => setFormData({...formData, Camera: e.target.value})}/>
              </div>
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea 
                placeholder="Comentário..." 
                className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl h-24 outline-none resize-none focus:ring-2 focus:ring-blue-500" 
                onChange={e => setFormData({...formData, comentario: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all">
              Confirmar Indicação
            </button>

            {mensagem && (
              <p className="text-center font-bold text-blue-600 animate-pulse text-sm">
                {mensagem}
              </p>
            )}
          </div>
        </form>
      </div>
      <BottomNav />
    </div>
  )
}