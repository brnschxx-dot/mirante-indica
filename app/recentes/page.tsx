"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Clock, ThumbsUp, ThumbsDown, User, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";

const ITENS_POR_PAGINA = 50;

export default function RecentesPage() {
  const [indicacoes, setIndicacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(0);

  useEffect(() => {
    fetchRecentes();
  }, [pagina]);

  async function fetchRecentes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("prestadores")
      .select("*")
      .order("created_at", { ascending: false })
      .range(pagina * ITENS_POR_PAGINA, (pagina + 1) * ITENS_POR_PAGINA - 1);

    if (!error && data) setIndicacoes(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 pb-24 font-sans text-slate-900">
      {/* HEADER COM ÍCONE DE RELÓGIO */}
      <header className="mb-8 flex items-center gap-3">
        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter italic uppercase leading-none">Recentes</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Atividade da Comunidade</p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* GRID EM DUAS COLUNAS */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {indicacoes.map((item) => (
              <CardIndicao key={item.id} item={item} />
            ))}
          </div>

          {/* CONTROLE DE PÁGINAS (50 POR PÁGINA) */}
          <div className="flex items-center justify-between mt-10 p-2 bg-white rounded-2xl border border-slate-100">
            <button 
              disabled={pagina === 0}
              onClick={() => { setPagina(pagina - 1); window.scrollTo(0, 0); }}
              className="p-3 hover:bg-slate-50 rounded-xl disabled:opacity-20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-indigo-600" />
            </button>
            
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Página {pagina + 1}
            </span>

            <button 
              disabled={indicacoes.length < ITENS_POR_PAGINA}
              onClick={() => { setPagina(pagina + 1); window.scrollTo(0, 0); }}
              className="p-3 hover:bg-slate-50 rounded-xl disabled:opacity-20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-indigo-600" />
            </button>
          </div>
        </>
      )}
    </main>
  );
}

function CardIndicao({ item }: { item: any }) {
  const [votos, setVotos] = useState({ likes: item.likes || 0, dislikes: item.dislikes || 0 });
  const [votou, setVotou] = useState(false);

  const dataFormatada = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });

  async function handleVoto(tipo: 'like' | 'dislike') {
    if (votou) return; // Evita múltiplos votos na mesma sessão

    // Atualiza localmente para feedback instantâneo
    setVotos(prev => ({ ...prev, [tipo === 'like' ? 'likes' : 'dislikes']: prev[tipo === 'like' ? 'likes' : 'dislikes'] + 1 }));
    setVotou(true);

    // Salva no Supabase via RPC
    await supabase.rpc('incrementar_voto', { 
      row_id: item.id, 
      campo: tipo 
    });
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm flex flex-col h-full border-b-4 border-b-slate-200">
      <div className="flex-1">
        {/* INDICADO POR E QUANDO */}
        <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3 opacity-60">
          <User className="w-2.5 h-2.5" />
          <span className="truncate max-w-[60px]">{item.indicado_por || 'Anônimo'}</span>
          <span>•</span>
          <span>{dataFormatada}</span>
        </div>

        {/* NOME DA INDICAÇÃO (MAIOR) */}
        <h3 className="text-[15px] font-black leading-tight text-slate-800 mb-1 line-clamp-2 min-h-[40px]">
          {item.nome}
        </h3>

        {/* CATEGORIA / SUBCATEGORIA */}
        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter mb-2 line-clamp-1">
          {item.eixo} • {item.subcategoria}
        </p>

        {/* LOCALIZAÇÃO */}
        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 mb-3">
          <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-300" />
          <span className="truncate">{item.local || 'Jundiaí / SP'}</span>
        </div>

        {/* ESTRELAS */}
        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3 h-3 ${i < item.avaliacao ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} 
            />
          ))}
        </div>

        {/* COMENTÁRIO */}
        <p className="text-[11px] text-slate-600 leading-relaxed italic mb-4 line-clamp-3 font-medium bg-slate-50/50 p-2 rounded-lg">
          "{item.comentario}"
        </p>
      </div>

      {/* LIKE / DISLIKE OPERACIONAL */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
        <button 
          onClick={() => handleVoto('like')}
          disabled={votou}
          className={`flex items-center gap-1.5 transition-all ${votou ? 'text-green-500' : 'text-slate-300 hover:text-green-500'}`}
        >
          <ThumbsUp className={`w-4 h-4 ${votou ? 'fill-green-50' : ''}`} />
          <span className="text-[10px] font-black">{votos.likes}</span>
        </button>

        <button 
          onClick={() => handleVoto('dislike')}
          disabled={votou}
          className={`flex items-center gap-1.5 transition-all ${votou ? 'text-red-500' : 'text-slate-300 hover:text-red-500'}`}
        >
          <ThumbsDown className={`w-4 h-4 ${votou ? 'fill-red-50' : ''}`} />
          <span className="text-[10px] font-black">{votos.dislikes}</span>
        </button>
      </div>
    </div>
  );
}