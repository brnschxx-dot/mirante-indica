'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, MapPin } from 'lucide-react'
import BottomNav from '../../../components/BottomNav'
import VoteButtons from '../../../components/VoteButtons'

export default function CategoriaPage() {
  const params = useParams()
  const router = useRouter()
  // O decodeURIComponent serve para transformar "Constru%C3%A7%C3%A3o" em "Construção"
  const categoriaNome = decodeURIComponent(params.slug as string)
  
  const [prestadores, setPrestadores] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fetchPorCategoria = async () => {
      setCarregando(true)
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .eq('categoria', categoriaNome) // Filtra direto pela categoria da URL
        .order('nome', { ascending: true })

      if (data) setPrestadores(data)
      setCarregando(false)
    }

    if (categoriaNome) fetchPorCategoria()
  }, [categoriaNome])

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      
      {/* Header Fixo */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 border-b border-gray-100 flex items-center gap-3">
        <button 
          onClick={() => router.back()} 
          className="p-2 bg-gray-50 rounded-full text-blue-600 active:scale-95 transition-all"
        >
          <ArrowLeft size={20}/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-blue-900">{categoriaNome}</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Resultados encontrados</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {carregando ? (
          <p className="text-center text-gray-400 py-10 animate-pulse font-bold text-sm">Buscando profissionais...</p>
        ) : prestadores.length > 0 ? (
          prestadores.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg uppercase shrink-0">
                  {p.nome.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{p.nome}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 my-0.5">
                    <Star size={12} className="fill-yellow-500" />
                    <span className="text-xs font-bold">{p.avaliacao || '5.0'}</span>
                    <span className="text-gray-300 mx-1">•</span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase">{p.categoria}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin size={12} />
                    <span className="text-[10px] truncate">{p.local || 'Condomínio Mirante'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-2 flex justify-between items-center">
                <VoteButtons prestadorId={p.id} />
                <span className="text-[9px] text-gray-400 font-bold uppercase">
                  Por: {p.indicado_por || 'Vizinho'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold text-sm">Nenhum profissional indicado nesta categoria ainda.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}