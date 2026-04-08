'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Search, Hammer, Zap, Eraser, Truck, Monitor, Pizza, Sparkles, Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'
import VoteButtons from '../../components/VoteButtons'

const categoriasCarrossel = [
  { nome: 'Construção', icon: <Hammer size={24} />, color: 'bg-orange-100 text-orange-600', href: '/categoria/Construção' },
  { nome: 'Manutenção', icon: <Zap size={24} />, color: 'bg-yellow-100 text-yellow-600', href: '/categoria/Manutenção' },
  { nome: 'Limpeza', icon: <Eraser size={24} />, color: 'bg-blue-100 text-blue-600', href: '/categoria/Limpeza' },
  { nome: 'Fretes', icon: <Truck size={24} />, color: 'bg-purple-100 text-purple-600', href: '/categoria/Fretes' },
  { nome: 'Tecnologia', icon: <Monitor size={24} />, color: 'bg-indigo-100 text-indigo-600', href: '/categoria/Tecnologia' },
  { nome: 'Alimentação', icon: <Pizza size={24} />, color: 'bg-red-100 text-red-600', href: '/categoria/Alimentação' },
  { nome: 'Estética', icon: <Sparkles size={24} />, color: 'bg-pink-100 text-pink-600', href: '/categoria/Estética' },
]

export default function Lupa() {
  const [busca, setBusca] = useState('')
  const [prestadores, setPrestadores] = useState<any[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPrestadores = async () => {
      const { data } = await supabase.from('prestadores').select('*').limit(10)
      if (data) setPrestadores(data)
    }
    fetchPrestadores()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      
      {/* Header com barra de pesquisa centralizada no desktop */}
      <div className="bg-white p-6 pt-10 shadow-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto w-full">
          <h1 className="text-2xl font-black text-blue-900 mb-4 tracking-tight md:text-center">Explorar</h1>
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="O que você está procurando?"
              className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full py-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-6 mb-4 md:text-center">Categorias</h2>
        
        {/* Carrossel Centralizado no Desktop com Setas */}
        <div className="relative max-w-4xl mx-auto group">
          <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white border border-gray-100 shadow-md rounded-full p-2 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">
            <ChevronLeft size={24} />
          </button>

          <div ref={scrollRef} className="flex overflow-x-auto gap-4 px-6 md:px-12 pb-2 scrollbar-hide snap-x md:justify-center scroll-smooth">
            {categoriasCarrossel.map((cat, index) => (
              <Link key={index} href={cat.href} className="flex flex-col items-center gap-2 snap-center min-w-[70px]">
                <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all border border-white`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">
                  {cat.nome}
                </span>
              </Link>
            ))}
          </div>

          <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white border border-gray-100 shadow-md rounded-full p-2 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Últimos Adicionados</h2>
        
        <div className="space-y-3">
          {prestadores.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
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
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {p.local || 'Condomínio Mirante'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}