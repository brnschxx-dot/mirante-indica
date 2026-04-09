"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";
import { useRouter } from "next/navigation";

export default function CadastrarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nota, setNota] = useState(0); // Começa em 0 para estrelas não preenchidas

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    descricao: "", 
    eixo: "",
    subcategoria: "",
    instagram: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nota === 0) return alert("Por favor, selecione uma avaliação em estrelas.");
    
    setLoading(true);
    const { error } = await supabase.from("prestadores").insert([
      {
        ...formData,
        avaliacao: nota,
        instagram: formData.instagram.replace("@", ""),
      },
    ]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      router.push("/indicacoes");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 pb-20 font-sans text-slate-900">
      <div className="max-w-md mx-auto">
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tighter">Nova <span className="text-indigo-600">Indicação</span></h1>
          <p className="text-slate-500 text-sm mt-1">Preencha os dados do prestador abaixo</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Nome e Contato lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nome *</label>
              <input
                required
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                placeholder="Ex: João"
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Contato *</label>
              <input
                required
                type="tel"
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                placeholder="(11) 9..."
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
          </div>

          {/* 2. Endereço */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Endereço / Local</label>
            <input
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Rua, bairro ou cidade..."
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            />
          </div>

          {/* 3. Categoria e Subcategoria lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Categoria *</label>
              <select
                required
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none"
                value={formData.eixo}
                onChange={(e) => setFormData({ ...formData, eixo: e.target.value, subcategoria: "" })}
              >
                <option value="">Selecione...</option>
                {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Subcategoria *</label>
              <select
                required
                disabled={!formData.eixo}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                value={formData.subcategoria}
                onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
              >
                <option value="">Espec...</option>
                {(EIXOS_CATEGORIAS[formData.eixo as keyof typeof EIXOS_CATEGORIAS] || []).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Instagram */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Instagram</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
              <input
                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="usuario"
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>
          </div>

          {/* 5. Avaliação (Estrelas vazias inicialmente) */}
          <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 shadow-inner text-center">
            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3">Sua Avaliação *</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNota(star)}
                  className="transition-all hover:scale-110 active:scale-95"
                >
                  <svg 
                    className={`w-10 h-10 ${star <= nota ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                    fill={star <= nota ? "currentColor" : "none"}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              ))}
            </div>
            {nota === 0 && <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Toque para avaliar</p>}
          </div>

          {/* 6. Comentário */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Comentário *</label>
            <textarea
              required
              rows={4}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
              placeholder="Conte como foi sua experiência com este prestador..."
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>

          {/* Botão Finalizar */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Finalizar"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}