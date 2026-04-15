"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  Clock, ThumbsUp, ThumbsDown, Star, ArrowLeft, Image as ImageIcon, X 
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ITENS_POR_PAGINA = 50;

export default function RecentesPage() {
  const router = useRouter();
  const [indicacoes, setIndicacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImagens, setModalImagens] = useState<{aberto: boolean, fotos: string[]}>({ aberto: false, fotos: [] });

  useEffect(() => {
    fetchRecentes();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'prestadores' },
        (payload) => {
          setIndicacoes((prev) =>
            prev.map((item) =>
              item.id === payload.new.id 
                ? { ...item, likes: payload.new.likes, dislikes: payload.new.dislikes } 
                : item
            )
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchRecentes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("prestadores")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, ITENS_POR_PAGINA - 1);

    if (!error && data) setIndicacoes(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 pb-32 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto"> {/* Reduzi o max-width para os cards não ficarem esticados demais em telas grandes */}
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
          <div className="grid grid-cols-1 gap-6"> {/* ALTERADO PARA 1 COLUNA E AUMENTADO O GAP */}
            {indicacoes.map((item) => (
              <CardIndicao key={item.id} item={item} onOpenGallery={(fotos) => setModalImagens({ aberto: true, fotos })} />
            ))}
          </div>
        )}
      </div>

      {modalImagens.aberto && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col p-4 overflow-y-auto">
          <button onClick={() => setModalImagens({ aberto: false, fotos: [] })} className="self-end p-3 bg-white/10 rounded-full text-white mb-4"><X className="w-6 h-6" /></button>
          <div className="space-y-4 flex flex-col items-center">
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
  const [likes, setLikes] = useState<number>(item.likes || 0);
  const [dislikes, setDislikes] = useState<number>(item.dislikes || 0);
  const [votoUsuario, setVotoUsuario] = useState<'like' | 'dislike' | null>(null);

  const fotosArray = item.foto_url ? item.foto_url.split(',') : [];
  const dataFormatada = new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  useEffect(() => {
    setLikes(item.likes || 0);
    setDislikes(item.dislikes || 0);
  }, [item.likes, item.dislikes]);

  useEffect(() => {
    async function carregarVoto() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('votos')
          .select('tipo')
          .eq('prestador_id', item.id)
          .eq('user_id', user.id)
          .single();
        if (data) setVotoUsuario(data.tipo as 'like' | 'dislike');
      } else {
        const salvo = localStorage.getItem(`voto_${item.id}`);
        if (salvo) setVotoUsuario(salvo as 'like' | 'dislike');
      }
    }
    carregarVoto();
  }, [item.id]);

  async function processarVoto(tipo: 'like' | 'dislike') {
    const backup = { likes, dislikes, votoUsuario };
    let novoVoto: 'like' | 'dislike' | null = tipo;

    if (votoUsuario === tipo) {
      tipo === 'like' 
        ? setLikes((l: number) => l - 1) 
        : setDislikes((d: number) => d - 1);
      novoVoto = null;
    } else if (!votoUsuario) {
      tipo === 'like' 
        ? setLikes((l: number) => l + 1) 
        : setDislikes((d: number) => d + 1);
    } else {
      if (tipo === 'like') {
        setLikes((l: number) => l + 1);
        setDislikes((d: number) => d - 1);
      } else {
        setLikes((l: number) => l - 1);
        setDislikes((d: number) => d + 1);
      }
    }

    setVotoUsuario(novoVoto);
    if (novoVoto) localStorage.setItem(`voto_${item.id}`, novoVoto);
    else localStorage.removeItem(`voto_${item.id}`);

    const { error } = await supabase.rpc('gerenciar_voto', {
      p_prestador_id: item.id,
      p_tipo: novoVoto
    });

    if (error) {
      setLikes(backup.likes);
      setDislikes(backup.dislikes);
      setVotoUsuario(backup.votoUsuario);
      alert("Erro ao salvar voto. Verifique sua conexão ou login.");
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-full border-b-4 border-b-slate-200 transition-all active:scale-[0.99]">
      {/* FOTO AUMENTADA PARA 1 COLUNA */}
      <div onClick={() => fotosArray.length > 0 && onOpenGallery(fotosArray)} className="relative w-full h-48 md:h-64 bg-slate-100 cursor-pointer overflow-hidden">
        {fotosArray[0] ? (
          <img src={fotosArray[0]} className="w-full h-full object-cover" alt={item.nome} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-indigo-200"><ImageIcon className="w-10 h-10" /></div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-xl text-[10px] font-black shadow-sm">{dataFormatada}</div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* NOME E INSTAGRAM */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-[20px] font-black text-slate-800 italic uppercase line-clamp-1 flex-1">
            {item.nome}
          </h3>
          {item.instagram && (
            <a 
              href={`https://instagram.com/${item.instagram.replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg shadow-sm active:scale-90 transition-transform flex items-center justify-center"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-white">
                <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
              </svg>
            </a>
          )}
        </div>

        <p className="text-[10px] font-bold text-indigo-600 uppercase mb-4">{item.subcategoria}</p>
        
        {/* ESTRELAS E LOCALIZAÇÃO */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < item.avaliacao ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 48 48">
              <path fill="#1c9957" d="M42,39V9c0-1.657-1.343-3-3-3H9C7.343,6,6,7.343,6,9v30c0,1.657,1.343,3,3,3h30C40.657,42,42,40.657,42,39z"></path>
              <path fill="#3e7bf1" d="M9,42h30c1.657,0-15-16-15-16S7.343,42,9,42z"></path>
              <path fill="#cbccc9" d="M42,39V9c0-1.657-16,15-16,15S42,40.657,42,39z"></path>
              <path fill="#efefef" d="M39,42c1.657,0,3-1.343,3-3v-0.245L26.245,23L23,26.245L38.755,42H39z"></path>
              <path fill="#ffd73d" d="M42,9c0-1.657-1.343-3-3-3h-0.245L6,38.755V39c0,1.657,1.343,3,3,3h0.245L42,9.245V9z"></path>
              <path fill="#d73f35" d="M36,2c-5.523,0-10,4.477-10,10c0,6.813,7.666,9.295,9.333,19.851C35.44,32.531,35.448,33,36,33s0.56-0.469,0.667-1.149C38.334,21.295,46,18.813,46,12C46,6.477,41.523,2,36,2z"></path>
              <path fill="#752622" d="M36 8.5A3.5 3.5 0 1 0 36 15.5A3.5 3.5 0 1 0 36 8.5Z"></path>
              <path fill="#fff" d="M14.493,12.531v2.101h2.994c-0.392,1.274-1.455,2.185-2.994,2.185c-1.833,0-3.318-1.485-3.318-3.318s1.486-3.318,3.318-3.318c0.824,0,1.576,0.302,2.156,0.799l1.548-1.547C17.22,8.543,15.92,8,14.493,8c-3.038,0-5.501,2.463-5.501,5.5s2.463,5.5,5.501,5.5c4.81,0,5.637-4.317,5.184-6.461L14.493,12.531z"></path>
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tight">{item.bairro || 'Jundiaí'}</span>
          </div>
        </div>

        {/* COMENTÁRIO - MAIS ESPAÇOSO */}
        <p className="text-[13px] leading-relaxed text-slate-500 italic mb-6 bg-slate-50 p-4 rounded-2xl flex-1 border border-slate-100/50">
          "{item.comentario}"
        </p>

        {/* BOTÕES DE VOTO */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); processarVoto('like'); }} 
            className={`flex items-center gap-2 transition-all p-2 rounded-xl ${votoUsuario === 'like' ? 'text-green-500 bg-green-50 scale-105' : 'text-slate-300 hover:bg-slate-50'}`}
          >
            <ThumbsUp className={`w-5 h-5 ${votoUsuario === 'like' ? 'fill-green-500' : ''}`} />
            <span className="text-[12px] font-black">{likes}</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); processarVoto('dislike'); }} 
            className={`flex items-center gap-2 transition-all p-2 rounded-xl ${votoUsuario === 'dislike' ? 'text-red-500 bg-red-50 scale-105' : 'text-slate-300 hover:bg-slate-50'}`}
          >
            <ThumbsDown className={`w-5 h-5 ${votoUsuario === 'dislike' ? 'fill-red-500' : ''}`} />
            <span className="text-[12px] font-black">{dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}