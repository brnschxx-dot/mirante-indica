'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { ArrowLeft, Trophy, Star, ChevronLeft, ChevronRight, Hammer, Zap, Eraser, Truck, Monitor, Pizza, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'
import VoteButtons from '../../components/VoteButtons'

const categoriasFiltro = [
  { nome: 'Construção', icon: <Hammer size={24} />, color: 'bg-orange-100 text-orange-600' },
  { nome: 'Manutenção', icon: <Zap size={24} />, color: 'bg-yellow-100 text-yellow-600' },
  { nome: 'Limpeza', icon: <Eraser size={24} />, color: 'bg-blue-100 text-blue-600' },
  { nome: 'Fretes', icon: <Truck size={24} />, color: 'bg-purple-100 text-purple-600' },
  { nome: 'Tecnologia', icon: <Monitor size={24} />, color: 'bg-indigo-100 text-indigo-600' },
  { nome: 'Alimentação', icon: <Pizza size={24} />, color: 'bg-red-100 text-red-600' },
  { nome: 'Estética', icon: <Sparkles size={24} />, color: 'bg-pink-100 text-pink-600' },
]

export default function Destaques() {
  const router = useRouter()
  const [rankingGeral, setRankingGeral] = useState<any[]>([])
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRanking = async () => {
      const [resPrestadores, resVotos] = await Promise.all([
        supabase.from('prestadores').select('*'),
        supabase.from('votos').select('*')
      ])

      const prestadores = resPrestadores.data || []
      const votos = resVotos.data || []

      const rankingCalculado = prestadores.map(p => {
        const votosDeste = votos.filter(v => v.prestador_id === p.id)
        const ups = votosDeste.filter(v => v.tipo === 'up').length
        const downs = votosDeste.filter(v => v.tipo === 'down').length
        const saldo = ups - downs
        return { ...p, saldo, ups }
      })

      // Ordena por saldo e desempata por total de ups
      rankingCalculado.sort((a, b) => b.saldo - a.saldo || b.ups - a.ups)
      // Mantém apenas os que tem pelo menos 1 upvote
      setRankingGeral(rankingCalculado.filter(p => p.ups > 0))
      setCarregando(false)
    }
    fetchRanking()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  // Aplica o filtro na hora de exibir
  const destaquesExibidos = categoriaAtiva 
    ? rankingGeral.filter(p => p.categoria === categoriaAtiva).slice(0, 10)
    : rankingGeral.slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-2 bg-gray-50 rounded-full text-blue-600 active:scale-95 transition-all">
            <ArrowLeft size={20}/>
          </button>
          <h1 className="text-xl font-bold text-yellow-600 flex items-center gap-2">
            <Trophy size={20} className="fill-yellow-500"/> Destaques
          </h1>
        </div>
      </div>

      {/* Carrossel de Filtro */}
      <div className="w-full py-4 bg-white border-b border-gray-100 mb-4">
        <div className="relative max-w-4xl mx-auto group">
          <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white border border-gray-100 shadow-md rounded-full p-2 text-gray-600 hover:bg-gray-50">
            <ChevronLeft size={24} />
          </button>

          <div ref={scrollRef} className="flex overflow-x-auto gap-4 px-6 md:px-12 pb-2 scrollbar-hide snap-x md:justify-center scroll-smooth">
            {categoriasFiltro.map((cat, index) => {
              const isActive = categoriaAtiva === cat.nome;
              return (
                <button 
                  key={index} 
                  onClick={() => setCategoriaAtiva(isActive ? null : cat.nome)}
                  className="flex flex-col items-center gap-2 snap-center min-w-[70px] outline-none"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all border-2 
                    ${isActive ? 'border-blue-500 scale-105' : 'border-transparent'} 
                    ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[10px] font-bold text-center leading-tight ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {cat.nome}
                  </span>
                </button>
              )
            })}
          </div>

          <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white border border-gray-100 shadow-md rounded-full p-2 text-gray-600 hover:bg-gray-50">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-3">
        {carregando && <p className="text-center text-sm font-bold text-gray-400 mt-4 animate-pulse">Carregando ranking...</p>}
        
        {!carregando && destaquesExibidos.length === 0 && (
          <p className="text-center text-sm font-bold text-gray-400 mt-8">Nenhum destaque para exibir nesta categoria.</p>
        )}

        {destaquesExibidos.map((p, index) => (
          <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            
            {/* Tag de Posição Discreta */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl
              ${index === 0 && !categoriaAtiva ? 'bg-yellow-100 text-yellow-700' : 
                index === 1 && !categoriaAtiva ? 'bg-gray-100 text-gray-600' : 
                index === 2 && !categoriaAtiva ? 'bg-orange-100 text-orange-700' : 
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