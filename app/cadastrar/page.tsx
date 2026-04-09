"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";
import { useRouter } from "next/navigation";

export default function CadastrarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nota, setNota] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    descricao: "", 
    eixo: "",
    subcategoria: "",
    instagram: "",
  });

  const tagsDisponiveis = ["Pontual", "Preço Justo", "Limpo", "Rápido", "Educado"];

  // Função para formatar o telefone automaticamente (Máscara Manual)
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
    if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 dígitos

    // Aplica a máscara (11) 99999-9999
    if (valor.length > 7) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else if (valor.length > 0) {
      valor = `(${valor}`;
    }

    setFormData({ ...formData, telefone: valor });
  };

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nota === 0) return alert("Por favor, selecione uma avaliação.");
    
    setLoading(true);
    const descricaoFinal = tags.length > 0 
      ? `[${tags.join(" • ")}] ${formData.descricao}` 
      : formData.descricao;

    const { error } = await supabase.from("prestadores").insert([
      {
        ...formData,
        descricao: descricaoFinal,
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
    <main className="min-h-screen bg-[#F8FAFC] p-6 pb-24 font-sans text-slate-900">
      <div className="max-w-md mx-auto">
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tighter">Nova <span className="text-indigo-600">Indicação</span></h1>
          <p className="text-slate-500 text-sm mt-1">Sua indicação ajuda a comunidade de Jundiaí</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Nome e Contato */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nome *</label>
              <input
                required
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="Ex: João"
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">WhatsApp *</label>
              <input
                required
                type="tel"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* 2. Endereço */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Local / Bairro</label>
            <input
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Rua ou Bairro em Jundiaí..."
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            />
          </div>

          {/* 3. Categoria e Subcategoria */}
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
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Especialidade *</label>
              <select
                required
                disabled={!formData.eixo}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none disabled:bg-slate-50"
                value={formData.subcategoria}
                onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
              >
                <option value="">O que faz?</option>
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 font-bold">@</span>
              <input
                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                placeholder="perfil"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>
          </div>

          {/* 5. Tags de Qualidade */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Destaques do Serviço</label>
            <div className="flex flex-wrap gap-2">
              {tagsDisponiveis.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    tags.includes(tag) 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Avaliação (Estrelas) */}
          <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 text-center">
            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3">Sua Avaliação *</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setNota(star)}>
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
          </div>

          {/* 7. Comentário com Contador */}
          <div>
            <div className="flex justify-between items-end mb-2 ml-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Seu Comentário *</label>
              <span className={`text-[10px] font-bold ${formData.descricao.length >= 200 ? 'text-red-500' : 'text-slate-400'}`}>
                {formData.descricao.length}/200
              </span>
            </div>
            <textarea
              required
              maxLength={200}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
              rows={4}
              placeholder="Descreva o serviço..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Processando..." : "Publicar Indicação"}
          </button>

        </form>
      </div>
    </main>
  );
}