"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";
import Link from "next/link";

// 1. Criamos uma interface para o TypeScript não reclamar do "any"
interface Prestador {
  id: number;
  nome: string;
  eixo: string;
  subcategoria: string;
  descricao: string;
  telefone: string;
  avaliacao: number; // Coluna do seu SQL
  instagram?: string;
}

export default function IndicacoesPage() {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [eixo, setEixo] = useState("");
  const [sub, setSub] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      // Ajustado para 'avaliacao' conforme seu SQL e ordenado por nome
      let query = supabase
        .from("prestadores")
        .select("*")
        .order("nome", { ascending: true });

      if (eixo) query = query.eq("eixo", eixo);
      if (sub) query = query.eq("subcategoria", sub);

      const { data, error } = await query;
      if (!error) {
        setPrestadores(data || []);
      }
      setLoading(false);
    }
    fetchDados();
  }, [eixo, sub]);

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header com Filtros - Agora com largura máxima para não esticar */}
      <div className="bg-indigo-600 pt-6 pb-4 px-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-white text-xl font-black mb-4 tracking-tight text-center">Mirante Indica</h1>
          
          <div className="space-y-2">
            <select 
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 text-sm focus:bg-white focus:text-slate-900 outline-none transition-all"
              value={eixo}
              onChange={(e) => { setEixo(e.target.value); setSub(""); }}
            >
              <option className="text-slate-900" value="">Todas as Categorias</option>
              {EIXOS.map(e => <option className="text-slate-900" key={e} value={e}>{e}</option>)}
            </select>

            {eixo && (
              <select 
                className="w-full bg-white border-none text-slate-900 rounded-xl p-3 text-sm shadow-inner animate-in fade-in zoom-in-95 duration-200"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
              >
                <option value="">Todas as especialidades</option>
                {/* 2. Correção de Tipagem: Usando 'as keyof' para o TS aceitar a busca no objeto */}
                {(EIXOS_CATEGORIAS[eixo as keyof typeof EIXOS_CATEGORIAS] || []).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {loading ? (
          <div className="flex flex-col items-center py-20">
             <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-4 text-slate-400 text-sm font-medium">Carregando indicações...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prestadores.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase">
                    {item.subcategoria || item.eixo}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">{item.nome}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed">{item.descricao}</p>
                
                <div className="mt-5 flex items-center gap-2">
                  <a 
                    href={`https://wa.me/55${item.telefone?.replace(/\D/g,'') || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
                  >
                    WhatsApp
                  </a>
                  
                  {/* Botão de Votos Reabilitado */}
                  <div className="flex items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-600">★ {item.avaliacao || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link 
        href="/cadastrar" 
        className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all z-30 border-4 border-white"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </main>
  );
}