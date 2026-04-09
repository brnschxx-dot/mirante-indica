"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";

export default function FormularioIndicar() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: "", msg: "" });

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    eixo: "",
    subcategoria: "",
    descricao: ""
  });

  const [subsDisponiveis, setSubsDisponiveis] = useState<string[]>([]);

  // Atualiza subcategorias quando o eixo muda
  useEffect(() => {
    if (formData.eixo) {
      setSubsDisponiveis(EIXOS_CATEGORIAS[formData.eixo] || []);
      setFormData(prev => ({ ...prev, subcategoria: "" }));
    } else {
      setSubsDisponiveis([]);
    }
  }, [formData.eixo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ tipo: "", msg: "" });

    const { error } = await supabase
      .from("prestadores")
      .insert([
        { 
          nome: formData.nome,
          telefone: formData.telefone,
          eixo: formData.eixo,
          subcategoria: formData.subcategoria,
          descricao: formData.descricao
        }
      ]);

    if (error) {
      setFeedback({ tipo: "erro", msg: "Erro ao salvar: " + error.message });
    } else {
      setFeedback({ tipo: "sucesso", msg: "Indicação enviada com sucesso!" });
      setFormData({ nome: "", telefone: "", eixo: "", subcategoria: "", descricao: "" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
      
      {feedback.msg && (
        <div className={`p-4 rounded-xl text-sm font-bold ${feedback.tipo === "sucesso" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {feedback.msg}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nome do Profissional/Loja</label>
        <input
          required
          type="text"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})}
          placeholder="Ex: Borracharia do Jundiaí"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp (com DDD)</label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.telefone}
            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
            placeholder="11912345678"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Eixo Principal</label>
          <select
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.eixo}
            onChange={(e) => setFormData({...formData, eixo: e.target.value})}
          >
            <option value="">Selecione...</option>
            {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subcategoria</label>
        <select
          required
          disabled={!formData.eixo}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
          value={formData.subcategoria}
          onChange={(e) => setFormData({...formData, subcategoria: e.target.value})}
        >
          <option value="">{formData.eixo ? "Selecione a especialidade" : "Escolha o Eixo primeiro"}</option>
          {subsDisponiveis.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Observações (Opcional)</label>
        <textarea
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={formData.descricao}
          onChange={(e) => setFormData({...formData, descricao: e.target.value})}
          placeholder="Ex: Atendimento rápido e preço justo."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-gray-300"
      >
        {loading ? "Processando..." : "Finalizar Indicação"}
      </button>
    </form>
  );
}