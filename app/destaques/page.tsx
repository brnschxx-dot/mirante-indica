'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Trophy, Star, MapPin } from 'lucide-react'
import BottomNav from '../../components/BottomNav'
import VoteButtons from '../../components/VoteButtons'

export default function Destaques() {
  const [destaques, setDestaques] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      // Puxa prestadores e todos os votos simultaneamente
      const [resPrestadores, resVotos] = await Promise.all([
        supabase.from('prestadores').select('*'),
        supabase.from('votos').select('*')
      ])

      const prestadores = resPrestadores.data || []
      const votos = resVotos.data || []

      // Calcula a nota/saldo de cada prestador
      const ranking = prestadores.map(p => {
        const votosDeste = votos.filter(v => v.prestador_id === p.id)
        const ups = votosDeste.filter(v => v.tipo === 'up').length
        const downs = votosDeste.filter(v => v.tipo === 'down').length
        const saldo = ups - downs
        return { ...p, saldo, ups }
      })

      // Ordena: Primeiro quem tem maior saldo de votos. Desempate por quem tem mais ups.
      ranking.sort((a, b) => b.saldo - a.saldo || b.ups - a.ups)

      // Salva apenas o Top 10 com saldo positivo ou neutro
      setDestaques(ranking.filter(p => p.ups > 0).slice(0, 10))
      setCarregando(false)
    }
    
    fetchRanking()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      
      {/* Header Estilizado */}
      <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 p-6 pt-12 pb-12 rounded-b-[40px] shadow-md text-center text-white relative overflow-hidden">
        <Trophy size={120} className="absolute -right-6 -bottom-6 opacity-10" />
        <h1 className="text-3xl font-black mb-2 tracking-tight flex justify-center items-center gap-2">
          <Trophy size={28} className="fill-yellow-400" /> Destaques
        </h1>
        <p className="text-sm font-medium text-yellow-100">Os profissionais mais queridos do Mirante</p>
      </div>

      <div className="px-6 mt-8 space-y-4">
        {carregando && <p className="text-center font-bold text-gray-400 animate-pulse">Calculando ranking...</p>}
        
        {!carregando && destaques.length === 0 && (
          <div className="text-center bg-white p-8 rounded-[32px] border border-gray-100">
            <p className="text-gray-400 font-medium">Nenhum voto registrado ainda. Seja o primeiro a apoiar um profissional!</p>
          </div>
        )}

        {destaques.map((p, index) => (
          <div key={p.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden">
            
            {/* Tag de Posição (1º, 2º, 3º...) */}
            <div className={`absolute top-0 right-0 w-12 h-12 flex items-center justify-center font-black text-lg rounded-bl-[32px]
              ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                index === 1 ? 'bg-gray-300 text-gray-800' : 
                index === 2 ? 'bg-orange-300 text-orange-900' : 
                'bg-gray-50 text-gray-400'}`}>
              #{index + 1}
            </div>

            <div className="flex items-center gap-4 pr-10">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl uppercase shrink-0">
                {p.nome.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 leading-tight">{p.nome}</h3>
                <div className="flex items-center gap-1 text-yellow-500 my-1">
                  <Star size={12} className="fill-yellow-500" />
                  <span className="text-xs font-bold">{p.avaliacao || '5.0'}</span>
                  <span className="text-gray-300 mx-1">•</span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase">{p.categoria}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin size={12} />
                  <span className="text-[11px] truncate">{p.local || 'Condomínio Mirante'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
              <VoteButtons prestadorId={p.id} />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
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