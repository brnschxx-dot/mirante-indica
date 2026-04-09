"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";
import { useRouter } from "next/navigation";

export default function CadastrarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nota, setNota] = useState(5); // Valor padrão da avaliação

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    descricao: "", // Este é o seu "Comentário"
    eixo: "",
    subcategoria: "",
    instagram: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("prestadores").insert([
      {
        ...formData,
        avaliacao: nota,
        instagram: formData.instagram.replace("@", ""), // Limpa o @ se o usuário digitar
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
        
        <header className="mb-8">
          <button onClick={() => router.back()} className="mb-4 text-indigo-600 font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="text-3xl font-black tracking-tighter">Nova <span className="text-indigo-600">Indicação</span></h1>
          <p className="text-slate-500 text-sm mt-1">Campos com * são obrigatórios.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nome */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nome do Prestador *</label>
            <input
              required
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Ex: João da Pintura"
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>

          {/* Contato/Telefone */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Contato (WhatsApp) *</label>
            <input
              required
              type="tel"
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="11999999999"
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            />
          </div>

          {/* Categoria (Eixo) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Categoria *</label>
            <select
              required
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              value={formData.eixo}
              onChange={(e) => setFormData({ ...formData, eixo: e.target.value, subcategoria: "" })}
            >
              <option value="">Selecione...</option>
              {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Subcategoria */}
          {formData.eixo && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Subcategoria *</label>
              <select
                required
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                value={formData.subcategoria}
                onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
              >
                <option value="">Qual a especialidade?</option>
                {(EIXOS_CATEGORIAS[formData.eixo as keyof typeof EIXOS_CATEGORIAS] || []).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Avaliação em Estrelas */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">Sua Avaliação *</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNota(star)}
                  className="transition-transform active:scale-90"
                >
                  <svg 
                    className={`w-10 h-10 ${star <= nota ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Comentário (Descrição) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Seu Comentário *</label>
            <textarea
              required
              rows={3}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="O que achou do serviço?"
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>

          <hr className="border-slate-100" />

          {/* Local (Endereço) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Local / Endereço (Opcional)</label>
            <input
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Rua, Bairro ou Cidade"
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Instagram (Opcional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
              <input
                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="perfil_do_prestador"
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>
          </div>

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Confirmar Indicação"}
          </button>

        </form>
      </div>
    </main>
  );
}