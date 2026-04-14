"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  Clock, ThumbsUp, ThumbsDown, User, MapPin, 
  Star, ChevronLeft, ChevronRight, ArrowLeft, Image as ImageIcon, X
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ITENS_POR_PAGINA = 50;

export default function RecentesPage() {
  const router = useRouter();
  const [indicacoes, setIndicacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(0);
  
  // Estado para o Modal de Imagens
  const [modalImagens, setModalImagens] = useState<{aberto: boolean, fotos: string[]}>({
    aberto: false,
    fotos: []
  });

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
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-black tracking-tighter italic uppercase leading-none text-slate-800">Recentes</h1>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Feed de Indicações</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-300">
            Sincronizando...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {indicacoes.map((item) => (
                <CardIndicao 
                  key={item.id} 
                  item={item} 
                  onOpenGallery={(fotos) => setModalImagens({ aberto: true, fotos })}
                />
              ))}
            </div>

            {/* PAGINAÇÃO */}
            <div className="flex items-center justify-between mt-10 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <button disabled={pagina === 0} onClick={() => { setPagina(pagina - 1); window.scrollTo(0, 0); }} className="p-3 hover:bg-slate-50 rounded-xl disabled:opacity-20 transition-all">
                <ChevronLeft className="w-5 h-5 text-indigo-600" />
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Página {pagina + 1}</span>
              <button disabled={indicacoes.length < ITENS_POR_PAGINA} onClick={() => { setPagina(pagina + 1); window.scrollTo(0, 0); }} className="p-3 hover:bg-slate-50 rounded-xl disabled:opacity-20 transition-all">
                <ChevronRight className="w-5 h-5 text-indigo-600" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* MODAL DE GALERIA */}
      {modalImagens.aberto && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col p-4">
          <button 
            onClick={() => setModalImagens({ aberto: false, fotos: [] })}
            className="self-end p-3 bg-white/10 rounded-full text-white mb-4"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex-1 overflow-y-auto space-y-4 flex flex-col items-center justify-start">
            {modalImagens.fotos.map((url, idx) => (
              <img 
                key={idx} 
                src={url} 
                className="max-w-full rounded-2xl shadow-2xl border border-white/10" 
                alt="Visualização" 
              />
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function CardIndicao({ item, onOpenGallery }: { item: any, onOpenGallery: (fotos: string[]) => void }) {
  const [likes, setLikes] = useState(item.likes || 0);
  const [dislikes, setDislikes] = useState(item.dislikes || 0);
  const [votoAtual, setVotoAtual] = useState<'like' | 'dislike' | null>(null);

  // Carrega fotos (suporta string única ou separada por vírgula)
  const fotosArray = item.foto_url ? item.foto_url.split(',') : [];
  const primeiraFoto = fotosArray[0] || null;

  const dataFormatada = new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  // Recupera o voto salvo localmente ao carregar o card
  useEffect(() => {
    const votoSalvo = localStorage.getItem(`voto_${item.id}`);
    if (votoSalvo) setVotoAtual(votoSalvo as 'like' | 'dislike');
  }, [item.id]);

  async function handleVoto(tipo: 'like' | 'dislike') {
    let acao = '';
    
    // Se clicar no mesmo botão, remove o voto
    if (votoAtual === tipo) {
      if (tipo === 'like') { setLikes(likes - 1); acao = 'remover_like'; }
      else { setDislikes(dislikes - 1); acao = 'remover_dislike'; }
      setVotoAtual(null);
      localStorage.removeItem(`voto_${item.id}`);
    } 
    // Se não tinha voto, adiciona
    else if (votoAtual === null) {
      if (tipo === 'like') { setLikes(likes + 1); await supabase.rpc('incrementar_voto', { row_id: item.id, campo: 'like' }); }
      else { setDislikes(dislikes + 1); await supabase.rpc('incrementar_voto', { row_id: item.id, campo: 'dislike' }); }
      setVotoAtual(tipo);
      localStorage.setItem(`voto_${item.id}`, tipo);
      return;
    } 
    // Se está trocando o voto
    else {
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
      localStorage.setItem(`voto_${item.id}`, tipo);
    }

    if (acao) await supabase.rpc('alternar_voto', { row_id: item.id, acao });
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-all border-b-4 border-b-slate-200">
      
      {/* IMAGEM CLICÁVEL */}
      <div 
        onClick={() => fotosArray.length > 0 && onOpenGallery(fotosArray)}
        className={`relative w-full h-24 md:h-32 bg-slate-100 overflow-hidden ${fotosArray.length > 0 ? 'cursor-pointer active:opacity-80' : ''}`}
      >
        {primeiraFoto ? (
          <img src={primeiraFoto} alt={item.nome} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50 text-indigo-200">
            <ImageIcon className="w-6 h-6 mb-1" />
            <span className="text-[7px] font-black uppercase tracking-widest">Sem Foto</span>
          </div>
        )}
        
        {/* Badge de quantidade de fotos */}
        {fotosArray.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[7px] text-white font-black uppercase">
            +{fotosArray.length - 1} fotos
          </div>
        )}

        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm">
           <span className="text-[8px] font-black text-slate-600">{dataFormatada}</span>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="text-[13px] font-black leading-tight text-slate-800 line-clamp-1 italic uppercase">
            {item.nome}
          </h3>
          <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-tighter">
            {item.subcategoria}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 mb-2 truncate">
          <MapPin className="w-2 h-2 shrink-0" />
          <span>{item.local || 'Jundiaí'}</span>
        </div>

        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-2.5 h-2.5 ${i < item.avaliacao ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
          ))}
        </div>

        <p className="text-[10px] text-slate-500 leading-snug italic line-clamp-2 mb-3 bg-slate-50 p-2 rounded-xl flex-1">
          "{item.comentario}"
        </p>

        {/* FOOTER VOTOS (COM PERSISTÊNCIA NO LOCALSTORAGE) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
          <button onClick={() => handleVoto('like')} className={`flex items-center gap-1 transition-all ${votoAtual === 'like' ? 'text-green-500 scale-110' : 'text-slate-300 hover:text-green-400'}`}>
            <ThumbsUp className={`w-3.5 h-3.5 ${votoAtual === 'like' ? 'fill-green-50' : ''}`} />
            <span className="text-[10px] font-black">{likes}</span>
          </button>

          <button onClick={() => handleVoto('dislike')} className={`flex items-center gap-1 transition-all ${votoAtual === 'dislike' ? 'text-red-500 scale-110' : 'text-slate-300 hover:text-red-400'}`}>
            <ThumbsDown className={`w-3.5 h-3.5 ${votoAtual === 'dislike' ? 'fill-red-50' : ''}`} />
            <span className="text-[10px] font-black">{dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}