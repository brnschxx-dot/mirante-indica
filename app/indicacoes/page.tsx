"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";
import Link from "next/link";

export default function IndicacoesPage() {
  const [prestadores, setPrestadores] = useState<any[]>([]);
  const [eixo, setEixo] = useState("");
  const [sub, setSub] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      let query = supabase.from("prestadores").select("*").order("nome");
      if (eixo) query = query.eq("eixo", eixo);
      if (sub) query = query.eq("subcategoria", sub);

      const { data } = await query;
      setPrestadores(data || []);
      setLoading(false);
    }
    fetchDados();
  }, [eixo, sub]);

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header com Filtros */}
      <div className="bg-indigo-600 pt-6 pb-4 px-4 sticky top-0 z-20 shadow-lg">
        <h1 className="text-white text-xl font-black mb-4">Mirante Indica</h1>
        
        <div className="space-y-2">
          {/* Select de Eixo */}
          <select 
            className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 text-sm focus:bg-white focus:text-slate-900 outline-none transition-all"
            value={eixo}
            onChange={(e) => { setEixo(e.target.value); setSub(""); }}
          >
            <option className="text-slate-900" value="">Todas as Categorias</option>
            {EIXOS.map(e => <option className="text-slate-900" key={e} value={e}>{e}</option>)}
          </select>

          {/* Select de Subcategoria - Só aparece se houver Eixo */}
          {eixo && (
            <select 
              className="w-full bg-white border-none text-slate-900 rounded-xl p-3 text-sm shadow-inner"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
            >
              <option value="">Todas as especialidades</option>
              {EIXOS_CATEGORIAS[eixo].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {loading ? (
          <div className="text-center py-10 text-slate-400 animate-pulse font-medium">Buscando recomendações...</div>
        ) : (
          <div className="space-y-4">
            {prestadores.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase tracking-wider">
                    {item.subcategoria || item.eixo}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{item.nome}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{item.descricao}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{item.telefone}</span>
                  <a 
                    href={`https://wa.me/55${item.telefone?.replace(/\D/g,'')}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-green-600"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão Flutuante (FAB) para Indicar */}
      <Link 
        href="/cadastrar" 
        className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-30"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </main>
  );
}