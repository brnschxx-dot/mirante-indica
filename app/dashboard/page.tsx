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

  if (carregando) return <div className="flex justify-center items-center min-h-screen text-black">Verificando...</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-black">
      <h2 className="text-3xl font-bold mb-10 text-blue-900 text-center">O que você deseja fazer?</h2>
      
      <div className="flex flex-col sm:flex-row gap-12 items-center">
        <Link href="/cadastrar" className="group flex flex-col items-center">
          <div className="w-44 h-44 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <ClipboardPlus size={60} />
          </div>
          <span className="mt-4 font-bold text-lg">Quero indicar</span>
        </Link>

        <Link href="/" className="group flex flex-col items-center">
          <div className="w-44 h-44 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Search size={60} />
          </div>
          <span className="mt-4 font-bold text-lg text-blue-900">Quero indicações</span>
        </Link>
      </div>

      <button onClick={() => { supabase.auth.signOut(); router.push('/login'); }} className="mt-16 flex items-center gap-2 text-red-500 font-semibold">
        <LogOut size={20} /> Sair do Sistema
      </button>
    </div>
  )
}