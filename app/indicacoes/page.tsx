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
  descricao: string; // Este será o "comentário destaque" de quem cadastrou
  telefone: string;
  avaliacao: number;
  instagram?: string;
  endereco?: string;
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
        .order("avaliacao", { ascending: false });

      if (eixo) query = query.eq("eixo", typeof eixo === "string" ? eixo : "");
      if (sub) query = query.eq("subcategoria", sub);
      if (busca) query = query.ilike("nome", `%${busca}%`);

      const { data, error } = await query;
      if (!error) setPrestadores(data || []);
      setLoading(false);
    }
    const timer = setTimeout(fetchDados, 300);
    return () => clearTimeout(timer);
  }, [eixo, sub, busca]);

  const handleNaoInformado = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Informação não cadastrada pelo prestador.");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      
      {/* Header Premium com Blur */}
      <div className="bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Mirante<span className="text-indigo-600">Indica</span>
            </h1>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar por nome ou serviço..."
                className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {/* Filtros em Pílula */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <div className="relative flex-1 min-w-[140px]">
                <select 
                  className="w-full appearance-none bg-indigo-50 text-indigo-700 font-bold py-3 px-5 rounded-full text-xs outline-none border-none cursor-pointer"
                  value={eixo}
                  onChange={(e) => { setEixo(e.target.value); setSub(""); }}
                >
                  <option value="">Todas Categorias</option>
                  {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {eixo && (
                <div className="relative flex-1 min-w-[140px] animate-in slide-in-from-right-2">
                  <select 
                    className="w-full appearance-none bg-slate-100 text-slate-600 font-bold py-3 px-5 rounded-full text-xs outline-none border-none cursor-pointer"
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                  >
                    <option value="">Especialidade</option>
                    {(EIXOS_CATEGORIAS[eixo as keyof typeof EIXOS_CATEGORIAS] || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {prestadores.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
                
                {/* Badge de Categoria */}
                <div className="mb-4">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                    {item.subcategoria || item.eixo}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-6 transition-colors group-hover:text-indigo-600">{item.nome}</h3>

                {/* Bloco de Comentário Destaque (A descrição de quem cadastrou) */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-6 relative">
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-300 text-3xl font-serif">“</span>
                    <p className="text-slate-700 text-[13px] italic font-medium leading-relaxed">
                      {item.descricao || "Prestador recomendado pela comunidade do Mirante Indica."}
                    </p>
                  </div>
                </div>

                {/* Estrelas e Avaliação */}
                <div className="flex items-center gap-2 mb-10 pt-2 border-t border-dashed border-slate-100">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.floor(item.avaliacao || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927p.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-800 ml-1">{item.avaliacao || "5.0"}</span>
                </div>

                {/* Botões Redondos Dinâmicos */}
                <div className="flex justify-between items-center gap-4">
                  
                  {/* WhatsApp */}
                  <a 
                    href={item.telefone ? `https://wa.me/55${item.telefone.replace(/\D/g,'')}` : "#"}
                    onClick={!item.telefone ? handleNaoInformado : undefined}
                    target={item.telefone ? "_blank" : "_self"}
                    className={`group/btn w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-300 active:scale-90 ${item.telefone ? 'border-emerald-500 bg-white text-emerald-500 hover:bg-emerald-500 hover:text-white active:bg-emerald-600' : 'border-slate-100 bg-slate-50 text-slate-300'}`}
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.875 1.215 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>

                  {/* Instagram - Mantendo o gradiente vibrante */}
                  <a 
                    href={item.instagram ? `https://instagram.com/${item.instagram.replace('@','')}` : "#"}
                    onClick={!item.instagram ? handleNaoInformado : undefined}
                    target={item.instagram ? "_blank" : "_self"}
                    className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-300 active:scale-90 ${item.instagram ? 'border-pink-500 bg-white text-pink-500 hover:bg-gradient-to-tr hover:from-orange-400 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent' : 'border-slate-100 bg-slate-50 text-slate-300'}`}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2.5} />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2.5} />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} />
                    </svg>
                  </a>

                  {/* Google Maps - Novo Gradiente Vibrante de 2026 */}
                  <a 
                    href={item.endereco ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.endereco)}` : "#"}
                    onClick={!item.endereco ? handleNaoInformado : undefined}
                    target={item.endereco ? "_blank" : "_self"}
                    className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-300 active:scale-90 ${item.endereco ? 'border-blue-500 bg-white text-blue-500 hover:bg-gradient-to-br hover:from-blue-500 hover:via-green-500 hover:via-yellow-400 hover:to-red-500 hover:text-white hover:border-transparent' : 'border-slate-100 bg-slate-50 text-slate-300'}`}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </a>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link 
        href="/cadastrar" 
        className="fixed bottom-10 right-6 bg-indigo-600 text-white pl-5 pr-6 py-4 rounded-full shadow-2xl shadow-indigo-200 flex items-center gap-3 hover:scale-105 hover:bg-indigo-700 active:scale-95 transition-all z-30 ring-2 ring-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
        <span className="font-extrabold text-sm uppercase tracking-wider text-white">Indicar</span>
      </Link>
      
    </main>
  );
}