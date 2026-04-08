'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { ArrowLeft, Trophy, Star, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'
import VoteButtons from '../../components/VoteButtons'

export default function Destaques() {
  const router = useRouter()
  const [destaques, setDestaques] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      const [resPrestadores, resVotos] = await Promise.all([
        supabase.from('prestadores').select('*'),
        supabase.from('votos').select('*')
      ])

      const prestadores = resPrestadores.data || []
      const votos = resVotos.data || []

      const ranking = prestadores.map(p => {
        const votosDeste = votos.filter(v => v.prestador_id === p.id)
        const ups = votosDeste.filter(v => v.tipo === 'up').length
        const downs = votosDeste.filter(v => v.tipo === 'down').length
        const saldo = ups - downs
        return { ...p, saldo, ups }
      })

      ranking.sort((a, b) => b.saldo - a.saldo || b.ups - a.ups)
      setDestaques(ranking.filter(p => p.ups > 0).slice(0, 10))
      setCarregando(false)
    }
    
    fetchRanking()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      
      {/* Header Limpo e Simples */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 bg-gray-50 rounded-full text-blue-600 active:scale-95 transition-all">
            <ArrowLeft size={20}/>
          </button>
          <h1 className="text-xl font-bold text-yellow-600 flex items-center gap-2">
            <Trophy size={20} className="fill-yellow-500"/> Destaques
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {carregando && <p className="text-center text-sm font-bold text-gray-400 mt-4 animate-pulse">Carregando ranking...</p>}
        
        {destaques.map((p, index) => (
          <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            
            {/* Tag de Posição Discreta */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl
              ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                index === 1 ? 'bg-gray-100 text-gray-600' : 
                index === 2 ? 'bg-orange-100 text-orange-700' : 
                'bg-gray-50 text-gray-400'}`}>
              #{index + 1}
            </div>

            <div className="flex items-center gap-3 mb-3 pr-8">
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
              </div>
            </div>

            <div className="border-t border-gray-50 pt-2 flex justify-between items-center">
              <VoteButtons prestadorId={p.id} />
              <span className="text-[10px] text-gray-500 font-bold uppercase">
                Score: {p.saldo}
              </span>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}