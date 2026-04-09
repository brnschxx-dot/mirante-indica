"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";
import Link from "next/link";

interface Prestador {
  id: number;
  nome: string;
  eixo: string;
  subcategoria: string;
  descricao: string;
  telefone: string;
  avaliacao: number;
  instagram?: string;
}

export default function IndicacoesPage() {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [eixo, setEixo] = useState("");
  const [sub, setSub] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      let query = supabase
        .from("prestadores")
        .select("*")
        .order("avaliacao", { ascending: false })
        .order("nome", { ascending: true });

      if (eixo) query = query.eq("eixo", eixo);
      if (sub) query = query.eq("subcategoria", sub);
      if (busca) query = query.ilike("nome", `%${busca}%`);

      const { data, error } = await query;
      if (!error) setPrestadores(data || []);
      setLoading(false);
    }
    const timer = setTimeout(fetchDados, 300);
    return () => clearTimeout(timer);
  }, [eixo, sub, busca]);

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      
      {/* Header Estilo App */}
      <div className="bg-white sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-2 bg-indigo-600 rounded-lg shadow-indigo-100 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Mirante<span className="text-indigo-600">Indica</span>
            </h1>
          </div>

          <div className="space-y-3">
            {/* Barra de Busca com Ícone */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Ex: Pintor, Loja de tintas..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-400"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {/* Filtros em Pílulas (Totalmente Redondos) */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select 
                  className="w-full appearance-none bg-indigo-50 text-indigo-700 font-bold py-2.5 px-5 rounded-full text-[11px] outline-none border-none cursor-pointer hover:bg-indigo-100 transition-colors"
                  value={eixo}
                  onChange={(e) => { setEixo(e.target.value); setSub(""); }}
                >
                  <option value="">Todas Categorias</option>
                  {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {eixo && (
                <div className="relative flex-1 animate-in fade-in slide-in-from-right-4">
                  <select 
                    className="w-full appearance-none bg-slate-100 text-slate-600 font-bold py-2.5 px-5 rounded-full text-[11px] outline-none border-none cursor-pointer hover:bg-slate-200 transition-colors"
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                  >
                    <option value="">Especialidade</option>
                    {(EIXOS_CATEGORIAS[eixo as keyof typeof EIXOS_CATEGORIAS] || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {prestadores.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        {item.subcategoria || item.eixo}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {item.nome}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {item.avaliacao || 0} recomendações
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-slate-100">
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                    {item.descricao}
                  </p>
                  
                  <div className="flex gap-3">
                    <a 
                      href={`https://wa.me/55${item.telefone?.replace(/\D/g,'') || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.875 1.215 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Falar agora
                    </a>
                    
                    {item.instagram && (
                      <a 
                        href={`https://instagram.com/${item.instagram.replace('@','')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[56px] h-[56px] bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-slate-200 hover:bg-slate-800"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB Estilo "New Indication" */}
      <Link 
        href="/cadastrar" 
        className="fixed bottom-8 right-6 bg-indigo-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-30 ring-4 ring-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
        <span className="font-bold text-sm">Indicar</span>
      </Link>
      
    </main>
  );
}