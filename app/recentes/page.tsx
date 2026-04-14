"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  Clock, ThumbsUp, ThumbsDown, MapPin, 
  Star, ChevronLeft, ChevronRight, ArrowLeft, Image as ImageIcon, X 
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ITENS_POR_PAGINA = 50;

export default function RecentesPage() {
  const router = useRouter();
  const [indicacoes, setIndicacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [modalImagens, setModalImagens] = useState<{aberto: boolean, fotos: string[]}>({ aberto: false, fotos: [] });

  useEffect(() => { fetchRecentes(); }, [pagina]);

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
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100"><Clock className="w-5 h-5 text-white" /></div>
            <div className="text-right">
              <h1 className="text-xl font-black italic uppercase leading-none text-slate-800">Recentes</h1>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Feed de Indicações</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center p-20 animate-pulse text-[10px] font-black uppercase text-slate-300">Sincronizando...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {indicacoes.map((item) => (
              <CardIndicao key={item.id} item={item} onOpenGallery={(fotos) => setModalImagens({ aberto: true, fotos })} />
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE GALERIA */}
      {modalImagens.aberto && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col p-4 animate-in fade-in duration-200">
          <button onClick={() => setModalImagens({ aberto: false, fotos: [] })} className="self-end p-3 bg-white/10 rounded-full text-white mb-4"><X className="w-6 h-6" /></button>
          <div className="flex-1 overflow-y-auto space-y-4 flex flex-col items-center">
            {modalImagens.fotos.map((url, idx) => (
              <img key={idx} src={url} className="max-w-full rounded-2xl shadow-2xl border border-white/10" alt="Job" />
            ))}
          </div>
        </div>
      )}
      <BottomNav />
    </main>
  );
}

function CardIndicao({ item, onOpenGallery }: { item: any, onOpenGallery: (fotos: string[]) => void }) {
  // Estado local sincronizado com as props do Supabase
  const [likes, setLikes] = useState(item.likes || 0);
  const [dislikes, setDislikes] = useState(item.dislikes || 0);
  const [votoUsuario, setVotoUsuario] = useState<'like' | 'dislike' | null>(null);

  const fotosArray = item.foto_url ? item.foto_url.split(',') : [];
  const dataFormatada = new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  // Sincroniza o estado inicial e o localStorage
  useEffect(() => {
    const salvo = localStorage.getItem(`voto_${item.id}`);
    if (salvo) setVotoUsuario(salvo as 'like' | 'dislike');
    setLikes(item.likes || 0);
    setDislikes(item.dislikes || 0);
  }, [item.id, item.likes, item.dislikes]);

  async function processarVoto(tipo: 'like' | 'dislike') {
    const anterior = { likes, dislikes, votoUsuario };
    let acaoRpc = '';

    // Lógica de Atualização Otimista
    if (votoUsuario === tipo) {
      // Remover voto
      tipo === 'like' ? setLikes(l => l - 1) : setDislikes(d => d - 1);
      setVotoUsuario(null);
      localStorage.removeItem(`voto_${item.id}`);
      acaoRpc = tipo === 'like' ? 'rem_like' : 'rem_dislike';
    } 
    else if (!votoUsuario) {
      // Novo voto
      tipo === 'like' ? setLikes(l => l + 1) : setDislikes(d => d + 1);
      setVotoUsuario(tipo);
      localStorage.setItem(`voto_${item.id}`, tipo);
      acaoRpc = `add_${tipo}`;
    } 
    else {
      // Trocar voto
      if (tipo === 'like') {
        setLikes(l => l + 1);
        setDislikes(d => d - 1);
        acaoRpc = 'dislike_to_like';
      } else {
        setLikes(l => l - 1);
        setDislikes(d => d + 1);
        acaoRpc = 'like_to_dislike';
      }
      setVotoUsuario(tipo);
      localStorage.setItem(`voto_${item.id}`, tipo);
    }

    // Persistência no Banco
    const { error } = await supabase.rpc('gerenciar_voto', { row_id: item.id, acao: acaoRpc });

    if (error) {
      // Rollback em caso de erro
      setLikes(anterior.likes);
      setDislikes(anterior.dislikes);
      setVotoUsuario(anterior.votoUsuario);
      if (anterior.votoUsuario) localStorage.setItem(`voto_${item.id}`, anterior.votoUsuario);
      else localStorage.removeItem(`voto_${item.id}`);
      alert("Erro ao sincronizar voto. Tente novamente.");
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm flex flex-col h-full border-b-4 border-b-slate-200 transition-all active:scale-[0.98]">
      <div onClick={() => fotosArray.length > 0 && onOpenGallery(fotosArray)} className="relative w-full h-24 md:h-32 bg-slate-100 cursor-pointer overflow-hidden">
        {fotosArray[0] ? (
          <img src={fotosArray[0]} className="w-full h-full object-cover" alt={item.nome} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-indigo-200"><ImageIcon className="w-6 h-6" /></div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded-lg text-[8px] font-black">{dataFormatada}</div>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-[12px] font-black text-slate-800 italic uppercase line-clamp-1">{item.nome}</h3>
        <p className="text-[8px] font-bold text-indigo-600 uppercase mb-2">{item.subcategoria}</p>
        
        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-2.5 h-2.5 ${i < item.avaliacao ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
          ))}
        </div>

        <p className="text-[10px] text-slate-500 italic line-clamp-2 mb-3 bg-slate-50 p-2 rounded-xl flex-1">"{item.comentario}"</p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); processarVoto('like'); }} 
            className={`flex items-center gap-1.5 transition-all ${votoUsuario === 'like' ? 'text-green-500 scale-110' : 'text-slate-300'}`}
          >
            <ThumbsUp className={`w-4 h-4 ${votoUsuario === 'like' ? 'fill-green-50' : ''}`} />
            <span className="text-[10px] font-black">{likes}</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); processarVoto('dislike'); }} 
            className={`flex items-center gap-1.5 transition-all ${votoUsuario === 'dislike' ? 'text-red-500 scale-110' : 'text-slate-300'}`}
          >
            <ThumbsDown className={`w-4 h-4 ${votoUsuario === 'dislike' ? 'fill-red-50' : ''}`} />
            <span className="text-[10px] font-black">{dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}