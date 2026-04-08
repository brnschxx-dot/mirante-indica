'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Trophy, PlusCircle, MessageSquare, User, Home } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 py-3 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto px-4">
        
        <Link href="/lupa" className={`flex flex-col items-center gap-1 ${pathname === '/lupa' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Search size={20} />
          <span className="text-[9px] font-bold">Lupa</span>
        </Link>

        <Link href="/indicacoes" className={`flex flex-col items-center gap-1 ${pathname === '/indicacoes' ? 'text-blue-600' : 'text-gray-400'}`}>
          <MessageSquare size={20} />
          <span className="text-[9px] font-bold">Indicações</span>
        </Link>

        {/* Início no Centro */}
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Home size={24} className={pathname === '/' ? 'fill-blue-50' : ''} />
          <span className="text-[9px] font-bold">Início</span>
        </Link>

        <Link href="/cadastrar" className={`flex flex-col items-center gap-1 ${pathname === '/cadastrar' ? 'text-blue-600' : 'text-gray-400'}`}>
          <PlusCircle size={20} />
          <span className="text-[9px] font-bold">Indicar</span>
        </Link>

        <Link href="/destaques" className={`flex flex-col items-center gap-1 ${pathname === '/destaques' ? 'text-yellow-500' : 'text-gray-400'}`}>
          <Trophy size={20} />
          <span className="text-[9px] font-bold">Ranking</span>
        </Link>

        <Link href="/perfil" className={`flex flex-col items-center gap-1 ${pathname === '/perfil' ? 'text-blue-600' : 'text-gray-400'}`}>
          <User size={20} />
          <span className="text-[9px] font-bold">Perfil</span>
        </Link>

      </div>
    </div>
  )
}