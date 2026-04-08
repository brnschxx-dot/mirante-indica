'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Trophy, PlusCircle, LayoutDashboard } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50">
      
      <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Search size={24} />
        <span className="text-[10px] font-bold">Início</span>
      </Link>

      <Link href="/destaques" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/destaques' ? 'text-yellow-500' : 'text-gray-400'}`}>
        <Trophy size={24} />
        <span className="text-[10px] font-bold">Destaques</span>
      </Link>

      <Link href="/cadastrar" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/cadastrar' ? 'text-blue-600' : 'text-gray-400'}`}>
        <PlusCircle size={24} />
        <span className="text-[10px] font-bold">Indicar</span>
      </Link>

      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-400'}`}>
        <LayoutDashboard size={24} />
        <span className="text-[10px] font-bold">Menu</span>
      </Link>

    </div>
  )
}