"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  Clock, ThumbsUp, ThumbsDown, User, MapPin, 
  Star, ChevronLeft, ChevronRight, ArrowLeft 
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ITENS_POR_PAGINA = 50;

export default function RecentesPage() {
  const router = useRouter();
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
    <main className="min-h-screen bg-[#F8FAFC] p-4 pb-32 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto"> {/* Limita a largura no PC */}
        
        {/* BOTÃO VOLTAR E HEADER */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm active:scale-90 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-black tracking-tighter italic uppercase leading-none">Recentes</h1>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Feed de Indicações</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 italic text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            Carregando...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {indicacoes.map((item) => (
                <CardIndicao key={item.id} item={item} />
              ))}
            </div>

            {/* PAGINAÇÃO */}
            <div className="flex items-center justify-between mt-10 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <button 
                disabled={pagina === 0}
                onClick={() => { setPagina(pagina - 1); window.scrollTo(0, 0); }}
                className="p-3 hover:bg-slate-50 rounded-xl disabled:opacity-20"
              >
                <ChevronLeft className="w-5 h-5 text-indigo-600" />
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Página {pagina + 1}
              </span>
              <button 
                disabled={indicacoes.length < ITENS_POR_PAGINA}
                onClick={() => { setPagina(pagina + 1); window.scrollTo(0, 0); }}
                className="p-3 hover:bg-slate-50 rounded-xl disabled:opacity-20"
              >
                <ChevronRight className="w-5 h-5 text-indigo-600" />
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

function CardIndicao({ item }: { item: any }) {
  const [likes, setLikes] = useState(item.likes || 0);
  const [dislikes, setDislikes] = useState(item.dislikes || 0);
  const [votoAtual, setVotoAtual] = useState<'like' | 'dislike' | null>(null);

  const dataFormatada = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit'
  });

  async function handleVoto(tipo: 'like' | 'dislike') {
    let acao = '';

    if (votoAtual === tipo) {
      // Remover voto se clicar no mesmo
      if (tipo === 'like') { setLikes(likes - 1); acao = 'remover_like'; }
      else { setDislikes(dislikes - 1); acao = 'remover_dislike'; }
      setVotoAtual(null);
    } 
    else if (votoAtual === null) {
      // Primeiro voto
      if (tipo === 'like') { setLikes(likes + 1); await supabase.rpc('incrementar_voto', { row_id: item.id, campo: 'like' }); }
      else { setDislikes(dislikes + 1); await supabase.rpc('incrementar_voto', { row_id: item.id, campo: 'dislike' }); }
      setVotoAtual(tipo);
      return;
    } 
    else {
      // Trocar voto
      if (tipo === 'like') {
        setLikes(likes + 1);
        setDislikes(dislikes - 1);
        acao = 'dislike_para_like';
      } else {
        setLikes(likes - 1);
        setDislikes(dislikes + 1);
        acao = 'like_para_dislike';
      }
      setVotoAtual(tipo);
    }

    if (acao) {
      await supabase.rpc('alternar_voto', { row_id: item.id, acao });
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">
          <User className="w-2.5 h-2.5" />
          <span className="truncate max-w-[50px]">{item.indicado_por || 'Anon'}</span>
          <span>•</span>
          <span>{dataFormatada}</span>
        </div>

        <h3 className="text-[14px] font-black leading-tight text-slate-800 mb-1 line-clamp-2">
          {item.nome}
        </h3>

        <p className="text-[8px] font-black text-indigo-600 uppercase mb-2">
          {item.eixo} • {item.subcategoria}
        </p>

        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 mb-3">
          <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-300" />
          <span className="truncate">{item.local || 'Jundiaí'}</span>
        </div>

        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-2.5 h-2.5 ${i < item.avaliacao ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
          ))}
        </div>

        <p className="text-[10px] text-slate-600 leading-relaxed italic mb-4 line-clamp-3 font-medium bg-slate-50/50 p-2 rounded-lg border border-slate-100">
          "{item.comentario}"
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
        <button 
          onClick={() => handleVoto('like')}
          className={`flex items-center gap-1.5 transition-all ${votoAtual === 'like' ? 'text-green-500 scale-110' : 'text-slate-300'}`}
        >
          <ThumbsUp className={`w-4 h-4 ${votoAtual === 'like' ? 'fill-green-50' : ''}`} />
          <span className="text-[10px] font-black">{likes}</span>
        </button>

        <button 
          onClick={() => handleVoto('dislike')}
          className={`flex items-center gap-1.5 transition-all ${votoAtual === 'dislike' ? 'text-red-500 scale-110' : 'text-slate-300'}`}
        >
          <ThumbsDown className={`w-4 h-4 ${votoAtual === 'dislike' ? 'fill-red-50' : ''}`} />
          <span className="text-[10px] font-black">{dislikes}</span>
        </button>
      </div>
    </div>
  );
}