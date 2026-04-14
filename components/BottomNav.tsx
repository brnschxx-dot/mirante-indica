"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Clock, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 pb-8 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      
      {/* INÍCIO */}
      <Link href="/" className="flex flex-col items-center gap-1 group">
        <Home className={`w-6 h-6 transition-all ${isActive('/') ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive('/') ? 'text-indigo-600' : 'text-slate-400'}`}>
          Início
        </span>
      </Link>

      {/* RECENTES (Antiga Lupa) */}
      <Link href="/recentes" className="flex flex-col items-center gap-1 group">
        <Clock className={`w-6 h-6 transition-all ${isActive('/recentes') ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive('/recentes') ? 'text-indigo-600' : 'text-slate-400'}`}>
          Recentes
        </span>
      </Link>

      {/* BOTÃO CENTRAL: INDICAR */}
      <Link href="/cadastrar" className="relative -top-8 flex flex-col items-center gap-1">
        <div className="bg-indigo-600 p-4 rounded-full shadow-xl shadow-indigo-200 border-4 border-[#F8FAFC] active:scale-90 transition-all">
          <PlusCircle className="w-7 h-7 text-white" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mt-1">
          Indicar
        </span>
      </Link>

      {/* PERFIL */}
      <Link href="/perfil" className="flex flex-col items-center gap-1 group">
        <User className={`w-6 h-6 transition-all ${isActive('/perfil') ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive('/perfil') ? 'text-indigo-600' : 'text-slate-400'}`}>
          Perfil
        </span>
      </Link>

    </nav>
  );
}