'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Trophy, PlusCircle, MessageSquare, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 py-3 z-50">
      {/* Container centralizado para aproximar os ícones */}
      <div className="flex justify-around items-center max-w-sm mx-auto px-4">
        
        <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Search size={22} />
          <span className="text-[10px] font-bold">Lupa</span>
        </Link>

        <Link href="/indicacoes" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/indicacoes' ? 'text-blue-600' : 'text-gray-400'}`}>
          <MessageSquare size={22} />
          <span className="text-[10px] font-bold">Indicações</span>
        </Link>

        <Link href="/cadastrar" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/cadastrar' ? 'text-blue-600' : 'text-gray-400'}`}>
          <PlusCircle size={22} />
          <span className="text-[10px] font-bold">Indicar</span>
        </Link>

        <Link href="/destaques" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/destaques' ? 'text-yellow-500' : 'text-gray-400'}`}>
          <Trophy size={22} />
          <span className="text-[10px] font-bold">Destaques</span>
        </Link>

        <Link href="/perfil" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/perfil' ? 'text-blue-600' : 'text-gray-400'}`}>
          <User size={22} />
          <span className="text-[10px] font-bold">Perfil</span>
        </Link>

      </div>
    </div>
  )
}