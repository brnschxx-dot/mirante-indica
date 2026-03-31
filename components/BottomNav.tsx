'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  
  const getCor = (caminho: string) => 
    pathname === caminho ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-6 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {/* Botão Início (Feed) */}
      <Link href="/dashboard" className={`flex flex-col items-center p-2 w-16 ${getCor('/dashboard')}`}>
        <Home size={24} />
        <span className="text-[10px] font-bold mt-1">Início</span>
      </Link>
      
      {/* Botão Lupa */}
      <Link href="/explorar" className={`flex flex-col items-center p-2 w-16 ${getCor('/explorar')}`}>
        <Search size={24} />
        <span className="text-[10px] font-bold mt-1">Lupa</span>
      </Link>

      {/* Botão Central de Cadastro (+) */}
      <Link href="/cadastrar" className="flex flex-col items-center -mt-8 relative z-10">
        <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg border-4 border-gray-50 active:scale-95 transition-transform">
          <Plus size={28} strokeWidth={3} />
        </div>
      </Link>

      {/* Botão Perfil */}
      <Link href="/perfil" className={`flex flex-col items-center p-2 w-16 ${getCor('/perfil')}`}>
        <User size={24} />
        <span className="text-[10px] font-bold mt-1">Perfil</span>
      </Link>
    </div>
  )
}