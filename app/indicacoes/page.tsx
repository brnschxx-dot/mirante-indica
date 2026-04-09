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
  endereco?: string;
  foto_url?: string; // Propriedade adicionada para as fotos
}

export default function IndicacoesPage() {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [eixo, setEixo] = useState("");
  const [sub, setSub] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar o popup (modal) de imagens
  const [fotosModal, setFotosModal] = useState<string[] | null>(null);

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
    alert("Informação não cadastrada por este prestador.");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 relative">
      
      {/* Header Fixo com Desfoque */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2 mb-6">
            <span className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Mirante<span className="text-indigo-600">Indica</span>
          </h1>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="O que você procura hoje?"
              className="w-full pl-6 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
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
                
                <div className="mb-4">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                    {item.subcategoria || item.eixo}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">{item.nome}</h3>

                {/* Comentário Destaque do Usuário */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-8 relative shadow-inner">
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-400 text-3xl font-serif leading-none mt-1">“</span>
                    <p className="text-slate-600 text-[13px] italic font-medium leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>
                </div>

                {/* Avaliação com Estrelas Douradas */}
                <div className="flex items-center gap-2 mb-10">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.floor(item.avaliacao || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-800 ml-1">{item.avaliacao || "5.0"}</span>
                </div>

                {/* Grid de Botões - Adicionado o Botão de Fotos */}
                <div className="flex justify-between items-center gap-2">
                  
                  {/* WhatsApp */}
                  <a 
                    href={item.telefone ? `https://wa.me/55${item.telefone.replace(/\D/g,'')}` : "#"}
                    onClick={!item.telefone ? handleNaoInformado : undefined}
                    target={item.telefone ? "_blank" : "_self"}
                    className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white transition-all active:scale-90 bg-emerald-500 shadow-emerald-100 flex-shrink-0 ${!item.telefone && 'opacity-40 cursor-not-allowed'}`}
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.875 1.215 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a 
                    href={item.instagram ? `https://instagram.com/${item.instagram.replace('@','')}` : "#"}
                    onClick={!item.instagram ? handleNaoInformado : undefined}
                    target={item.instagram ? "_blank" : "_self"}
                    className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white transition-all active:scale-90 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-pink-100 flex-shrink-0 ${!item.instagram && 'opacity-40 cursor-not-allowed'}`}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2.5} />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2.5} />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} />
                    </svg>
                  </a>

                  {/* Maps */}
                  <a 
                    href={item.endereco ? `https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(item.endereco)}` : "#"}
                    onClick={!item.endereco ? handleNaoInformado : undefined}
                    target={item.endereco ? "_blank" : "_self"}
                    className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white transition-all active:scale-90 bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#EA4335] shadow-blue-100 flex-shrink-0 ${!item.endereco && 'opacity-40 cursor-not-allowed'}`}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </a>

                  {/* Botão de Fotos (Galeria) */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.foto_url) {
                        setFotosModal(item.foto_url.split(","));
                      } else {
                        handleNaoInformado(e);
                      }
                    }}
                    className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white transition-all active:scale-90 bg-slate-800 shadow-slate-300 flex-shrink-0 ${!item.foto_url && 'opacity-40 cursor-not-allowed bg-slate-400'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão Flutuante de Indicação */}
      <Link 
        href="/cadastrar" 
        className="fixed bottom-10 right-6 bg-indigo-600 text-white pl-5 pr-6 py-4 rounded-full shadow-2xl shadow-indigo-200 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-30 ring-2 ring-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
        <span className="font-extrabold text-sm uppercase tracking-wider">Indicar</span>
      </Link>

      {/* POPUP (MODAL) DE FOTOS */}
      {fotosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
            
            {/* Header do Modal */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div>
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Fotos do Serviço</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{fotosModal.length} anexo(s)</p>
              </div>
              <button 
                onClick={() => setFotosModal(null)}
                className="bg-slate-100 p-2.5 rounded-full text-slate-600 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Galeria Rolável */}
            <div className="p-5 overflow-y-auto space-y-4 bg-slate-50">
              {fotosModal.map((url, index) => (
                <div key={index} className="rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                  <img 
                    src={url} 
                    alt={`Foto anexada ${index + 1}`} 
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
      
    </main>
  );
}