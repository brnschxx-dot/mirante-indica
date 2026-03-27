'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// Importando os ícones da biblioteca que você instalou
import { ClipboardPlus, Search, LogOut, Building2 } from 'lucide-react'

export default function Dashboard() {
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checarAcesso = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setCarregando(false)
      }
    }
    checarAcesso()
  }, [router])

  const handleSair = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-500 font-medium">
        Carregando menu...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header Minimalista */}
      <nav className="bg-white border-b border-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
            <Building2 size={24} className="text-blue-600" />
            <span>Mirante Indica</span>
          </div>
          <button 
            onClick={handleSair} 
            className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo Centralizado */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
          Olá, Vizinho! 👋
        </h2>
        <p className="text-gray-500 mb-12 text-center">O que você deseja fazer agora?</p>

        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl justify-center items-center">
          
          {/* BOTÃO 1: QUERO INDICAR */}
          <Link href="/cadastrar" className="group flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-green-200">
              <ClipboardPlus size={56} strokeWidth={1.5} />
            </div>
            <span className="mt-4 text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
              Quero indicar
            </span>
          </Link>

          {/* BOTÃO 2: QUERO INDICAÇÕES */}
          <Link href="/" className="group flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-blue-200">
              <Search size={56} strokeWidth={1.5} />
            </div>
            <span className="mt-4 text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              Quero indicações
            </span>
          </Link>

        </div>
      </main>

      {/* Footer Discreto */}
      <footer className="p-6 text-center text-gray-400 text-xs uppercase tracking-widest">
        Exclusivo para moradores Mirante
      </footer>
    </div>
  )
}