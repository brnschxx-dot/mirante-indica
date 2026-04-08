'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { 
  Search, 
  Hammer, 
  Zap, 
  Eraser, 
  Truck, 
  Monitor, 
  Pizza, 
  Sparkles, 
  MoreHorizontal,
  Star,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'

// Configuração das categorias do Carrossel
const categoriasCarrossel = [
  { nome: 'Construção', icon: <Hammer size={24} />, color: 'bg-orange-100 text-orange-600', href: '/categoria/Construção' },
  { nome: 'Manutenção', icon: <Zap size={24} />, color: 'bg-yellow-100 text-yellow-600', href: '/categoria/Manutenção' },
  { nome: 'Limpeza', icon: <Eraser size={24} />, color: 'bg-blue-100 text-blue-600', href: '/categoria/Limpeza' },
  { nome: 'Fretes', icon: <Truck size={24} />, color: 'bg-purple-100 text-purple-600', href: '/categoria/Fretes' },
  { nome: 'Tecnologia', icon: <Monitor size={24} />, color: 'bg-indigo-100 text-indigo-600', href: '/categoria/Tecnologia' },
  { nome: 'Comida', icon: <Pizza size={24} />, color: 'bg-red-100 text-red-600', href: '/categoria/Alimentação' },
  { nome: 'Estética', icon: <Sparkles size={24} />, color: 'bg-pink-100 text-pink-600', href: '/categoria/Estética' },
  { nome: 'Mais', icon: <MoreHorizontal size={24} />, color: 'bg-gray-100 text-gray-600', href: '/categorias' },
]

export default function Home() {
  const [busca, setBusca] = useState('')
  const [prestadores, setPrestadores] = useState<any[]>([])

  // Busca inicial de prestadores (ex: os mais recentes ou em destaque)
  useEffect(() => {
    const fetchPrestadores = async () => {
      const { data } = await supabase
        .from('prestadores')
        .select('*')
        .limit(5)
      if (data) setPrestadores(data)
    }
    fetchPrestadores()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      
      {/* Header e Busca */}
      <div className="bg-white p-6 pt-10 rounded-b-[40px] shadow-sm border-b border-gray-100">
        <h1 className="text-2xl font-black text-blue-900 mb-4 tracking-tight">Mirante Indica</h1>
        
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

      {/* CARROSSEL DE CATEGORIAS */}
      <div className="w-full py-6">
        <div className="flex items-center justify-between px-6 mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Categorias</h2>
          <Link href="/categorias" className="text-xs font-bold text-blue-600">Ver todas</Link>
        </div>

        <div className="flex overflow-x-auto gap-4 px-6 pb-2 scrollbar-hide snap-x">
          {categoriasCarrossel.map((cat, index) => (
            <Link 
              key={index} 
              href={cat.href}
              className="flex flex-col items-center gap-2 snap-center min-w-[70px]"
            >
              <div className={`w-16 h-16 ${cat.color} rounded-[22px] flex items-center justify-center shadow-sm active:scale-90 transition-all border border-white`}>
                {cat.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">
                {cat.nome}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Lista de Prestadores em Destaque */}
      <div className="px-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Destaques recentes</h2>
        
        <div className="space-y-4">
          {prestadores.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl uppercase">
                {p.nome.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 leading-tight">{p.nome}</h3>
                <div className="flex items-center gap-1 text-yellow-500 my-1">
                  <Star size={12} className="fill-yellow-500" />
                  <span className="text-xs font-bold">{p.avaliacao || '5.0'}</span>
                  <span className="text-gray-300 mx-1">•</span>
                  <span className="text-gray-400 text-[10px] font-medium uppercase">{p.categoria}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin size={12} />
                  <span className="text-[11px] truncate">{p.local || 'Condomínio Mirante'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}