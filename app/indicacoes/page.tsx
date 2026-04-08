'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { ArrowLeft, Star, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'
import VoteButtons from '../../components/VoteButtons'

// Isso garante que o Next.js sempre busque dados novos do banco
export const dynamic = 'force-dynamic'

export default function Indicacoes() {
  const router = useRouter()
  const [prestadores, setPrestadores] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fetchPrestadores = async () => {
      setCarregando(true)
      try {
        // Chamada ao banco de dados
        const { data, error } = await supabase
  .from('prestadores')
  .select('*')
  .order('id', { ascending: false })

        if (error) {
          // Se houver erro de permissão ou conexão, avisa na tela
          alert("Erro do Supabase: " + error.message)
          console.error("Detalhes do erro:", error)
        } else {
          console.log("Status da requisição:", status)
          console.log("Dados recebidos:", data)
          setPrestadores(data || [])
        }
      } catch (err) {
        console.error("Erro inesperado na aplicação:", err)
      } finally {
        setCarregando(false)
      }
    }

    fetchPrestadores()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 border-b border-gray-100 flex items-center gap-3">
        <button 
          onClick={() => router.back()} 
          className="p-2 bg-gray-50 rounded-full text-blue-600 active:scale-95 transition-all"
        >
          <ArrowLeft size={20}/>
        </button>
        <h1 className="text-xl font-bold text-blue-900">Indicações</h1>
      </div>

      <div className="p-4 space-y-3">
        {carregando ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-sm">Carregando indicações...</p>
          </div>
        ) : prestadores.length > 0 ? (
          prestadores.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
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
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-sm">Nenhuma indicação encontrada no banco.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}