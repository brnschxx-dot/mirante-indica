'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Camera, 
  MessageCircle,
  SearchX
} from 'lucide-react'
import BottomNav from '../../../components/BottomNav'
import VoteButtons from '../../../components/VoteButtons'

export default function CategoriaPage() {
  const params = useParams()
  const router = useRouter()
  const slug = decodeURIComponent(params.slug as string)
  
  const [prestadores, setPrestadores] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fetchPorCategoria = async () => {
      setCarregando(true)
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .eq('categoria', slug)
        .order('nome', { ascending: true })

      if (data) setPrestadores(data)
      setCarregando(false)
    }

    if (slug) fetchPorCategoria()
  }, [slug])

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      
      {/* Header Fixo com botão de voltar */}
      <div className="bg-white p-6 pt-12 shadow-sm sticky top-0 z-20 border-b border-gray-100 flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 bg-gray-50 rounded-full text-blue-600 active:scale-90 transition-all border border-gray-100"
        >
          <ArrowLeft size={20}/>
        </button>
        <div>
          <h1 className="text-xl font-black text-blue-900 leading-none">{slug}</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            {prestadores.length} {prestadores.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        
        {carregando && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-[32px]"></div>
            ))}
          </div>
        )}

        {!carregando && prestadores.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SearchX size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold">Nenhum profissional encontrado nesta categoria.</p>
            <button 
              onClick={() => router.push('/cadastrar')}
              className="mt-4 text-blue-600 font-bold text-sm underline"
            >
              Seja o primeiro a indicar!
            </button>
          </div>
        )}

        {prestadores.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4">
            
            {/* Topo do Card: Info Principal */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl uppercase shrink-0">
                {p.nome.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 leading-tight truncate">{p.nome}</h3>
                <div className="flex items-center gap-1 text-yellow-500 my-1">
                  <Star size={12} className="fill-yellow-500" />
                  <span className="text-xs font-bold">{p.avaliacao || '5.0'}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin size={12} />
                  <span className="text-[11px] truncate">{p.local || 'Condomínio Mirante'}</span>
                </div>
              </div>
            </div>

            {/* Comentário do Vizinho */}
            {p.comentario && (
              <div className="bg-gray-50 p-4 rounded-2xl italic text-gray-600 text-xs border-l-4 border-blue-200">
                "{p.comentario}"
              </div>
            )}

            {/* Ações e Redes Sociais */}
            <div className="border-t border-gray-50 pt-4 flex flex-col gap-4">
              
              <div className="flex items-center justify-between">
                {/* Nosso componente de voto aqui! */}
                <VoteButtons prestadorId={p.id} />

                <div className="flex gap-2">
                  {p.instagram && (
                    <a 
                      href={`https://instagram.com/${p.instagram.replace('@', '')}`} 
                      target="_blank" 
                      className="p-2 bg-pink-50 text-pink-600 rounded-xl active:scale-90 transition-all"
                    >
                      <Camera size={18} />
                    </a>
                  )}
                  <a 
                    href={`https://wa.me/55${p.telefone.replace(/\D/g, '')}`} 
                    target="_blank"
                    className="p-2 bg-green-50 text-green-600 rounded-xl flex items-center gap-2 px-4 active:scale-95 transition-all"
                  >
                    <MessageCircle size={18} />
                    <span className="text-xs font-bold">Contato</span>
                  </a>
                </div>
              </div>

              <div className="flex justify-between items-center">
                 <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                  Indicado por: {p.indicado_por || 'Vizinho'}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}