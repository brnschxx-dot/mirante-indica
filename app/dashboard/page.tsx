'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient' 
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClipboardPlus, Search, LogOut } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

export default function Dashboard() {
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
      } else {
        setCarregando(false)
      }
    }
    checarSessao()
  }, [router])

  if (carregando) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-blue-900 font-bold animate-pulse">
      Verificando acesso...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Conteúdo Centralizado */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
            Olá! 👋
          </h2>
          <p className="text-gray-500 mt-2 font-medium uppercase text-[10px] tracking-widest">
            O que você deseja fazer hoje?
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
          
          {/* Card: Quero Indicar */}
          <Link href="/cadastrar" className="group">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center transition-all group-hover:shadow-xl group-hover:-translate-y-1 active:scale-95">
              <div className="w-24 h-24 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <ClipboardPlus size={40} />
              </div>
              <span className="font-bold text-gray-800 text-lg">Quero indicar</span>
              <p className="text-gray-400 text-xs mt-1 text-center">Ajude a comunidade compartilhando um serviço</p>
            </div>
          </Link>

          {/* Card: Quero Indicações */}
          <Link href="/" className="group">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center transition-all group-hover:shadow-xl group-hover:-translate-y-1 active:scale-95">
              <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Search size={40} />
              </div>
              <span className="font-bold text-gray-800 text-lg">Indicações</span>
              <p className="text-gray-400 text-xs mt-1 text-center">Encontre os melhores profissionais do Mirante</p>
            </div>
          </Link>

        </div>

        {/* Botão Sair - Mais discreto e elegante */}
        <button 
          onClick={() => { supabase.auth.signOut(); router.push('/login'); }} 
          className="mt-12 flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors"
        >
          <LogOut size={16} /> Sair do Sistema
        </button>
      </div>

      <BottomNav />
    </div>
  )
}