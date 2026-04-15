"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Search, MapPin, Star, Bookmark, Bell, BadgeCheck, 
  Paintbrush, Zap, Wrench, Droplets, Hammer, ChevronRight,
  User, Sparkles
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function InicioPage() {
  const [userName, setUserName] = useState("Bruno");
  const [destaque, setDestaque] = useState<any>(null);
  const [pertoDeVoce, setPertoDeVoce] = useState<any[]>([]);
  const [votosPositivos, setVotosPositivos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  // Categorias mapeadas para os seus eixos/subcategorias
  const categorias = [
    { id: 1, nome: "Pintura", icon: Paintbrush },
    { id: 2, nome: "Elétrica", icon: Zap },
    { id: 3, nome: "Mecânica", icon: Wrench },
    { id: 4, nome: "Hidráulica", icon: Droplets },
    { id: 5, nome: "Obras", icon: Hammer },
  ];

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      
      // 1. Nome do Usuário (Se estiver logado via Auth)
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(' ')[0]);
      }

      // 2. Indicação da Semana: Buscamos o prestador com maior avaliação e mais likes
      const { data: feat } = await supabase
        .from("prestadores")
        .select("*")
        .order("avaliacao", { ascending: false })
        .order("likes", { ascending: false })
        .limit(1)
        .single();
      setDestaque(feat);

      // 3. Perto de Você: Filtra pela coluna 'local' (ajustado para Jundiaí/Vila Arens)
      const { data: perto } = await supabase
        .from("prestadores")
        .select("*")
        .ilike("local", "%Jundiaí%") // Busca flexível na sua coluna 'local'
        .limit(6);
      setPertoDeVoce(perto || []);

      // 4. Seção Salvos: Vamos contar quantos 'likes' o usuário atual já deu na tabela 'votos'
      if (user) {
        const { count } = await supabase
          .from("votos")
          .select("*", { count: 'exact', head: true })
          .eq("user_id", user.id)
          .eq("tipo", "like");
        setVotosPositivos(count || 0);
      }

      setLoading(false);
    }

    loadHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900">
      
      {/* HEADER: Saudação + Perfil */}
      <header className="bg-white px-4 pt-6 pb-6 rounded-b-[2.5rem] shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Bem-vindo,</p>
              <h1 className="text-xl font-black text-slate-800 leading-none">{userName}</h1>
            </div>
          </div>
          <button className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 relative active:scale-90 transition-all">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* BUSCA INPUT ARREDONDADO */}
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="O que você precisa hoje?" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-inner focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder:text-slate-400"
          />
          <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-10 mt-4">
        
        {/* CATEGORIAS (Stories) */}
        <section>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
            {categorias.map((cat) => (
              <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[75px] snap-start cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 p-[2px] transition-transform group-active:scale-90">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white">
                    <cat.icon className="w-6 h-6 text-slate-700" />
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{cat.nome}</span>
              </div>
            ))}
          </div>
        </section>

        {/* INDICAÇÃO DA SEMANA */}
        {destaque && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="p-1.5 bg-amber-100 rounded-lg"><Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" /></div>
              <h2 className="text-[14px] font-black uppercase italic text-slate-800">Indicação da Semana</h2>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-xl shadow-slate-200/50 relative overflow-hidden group border-b-4 border-b-indigo-500">
              <div className="flex flex-col sm:flex-row gap-5 items-center relative z-10">
                <div className="w-28 h-28 bg-slate-100 rounded-3xl overflow-hidden shrink-0 shadow-md">
                  <img src={destaque.foto_url?.split(',')[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={destaque.nome} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                    <h3 className="text-lg font-black uppercase italic text-slate-800 leading-tight">{destaque.nome}</h3>
                    {/* Selo Verificado (Estático por enquanto) */}
                    <BadgeCheck className="w-5 h-5 text-indigo-500 fill-indigo-50" />
                  </div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-3 tracking-widest">{destaque.subcategoria || destaque.categoria}</p>
                  <p className="text-[13px] text-slate-500 italic line-clamp-2 mb-4 leading-relaxed">"{destaque.comentario}"</p>
                  <button className="px-6 py-2.5 bg-slate-900 text-white font-black text-[10px] uppercase rounded-xl active:scale-95 transition-all">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PERTO DE VOCÊ */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <h2 className="text-[14px] font-black uppercase italic text-slate-800">Em Jundiaí</h2>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-2">
            {pertoDeVoce.map((item) => (
              <div key={item.id} className="min-w-[200px] bg-white border border-slate-100 rounded-[2rem] p-4 snap-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full h-24 bg-slate-50 rounded-2xl mb-3 overflow-hidden">
                  <img src={item.foto_url?.split(',')[0]} className="w-full h-full object-cover" alt="" />
                </div>
                <h4 className="text-[12px] font-black text-slate-800 uppercase italic line-clamp-1">{item.nome}</h4>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-400">{item.avaliacao || '5.0'}</span>
                </div>
                <p className="text-[9px] font-black text-indigo-500 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {item.local?.split('-')[0] || 'Vila Arens'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO SALVOS (Baseado na sua tabela de votos) */}
        <section>
          <div className="bg-indigo-600 rounded-[2rem] p-6 flex items-center justify-between shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <Bookmark className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h4 className="text-[14px] font-black text-white uppercase italic">Seus Favoritos</h4>
                <p className="text-[10px] text-indigo-100 font-medium">Você curtiu {votosPositivos} profissionais</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/50 relative z-10" />
          </div>
        </section>

      </div>

      <BottomNav />
    </main>
  );
}