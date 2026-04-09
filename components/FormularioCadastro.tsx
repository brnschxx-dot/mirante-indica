"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";

export default function FormularioCadastro() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  // Estados do Formulário
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    descricao: "",
    eixo: "",
    subcategoria: ""
  });

  // Lista de subcategorias que muda dinamicamente
  const [subcategoriasDisponiveis, setSubcategoriasDisponiveis] = useState<string[]>([]);

  // Efeito para atualizar subcategorias quando o Eixo muda
  useEffect(() => {
    if (formData.eixo) {
      setSubcategoriasDisponiveis(EIXOS_CATEGORIAS[formData.eixo] || []);
      setFormData(prev => ({ ...prev, subcategoria: "" })); // Reseta a subcategoria ao mudar o eixo
    } else {
      setSubcategoriasDisponiveis([]);
    }
  }, [formData.eixo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: "", texto: "" });

    const { error } = await supabase
      .from("prestadores")
      .insert([
        { 
          nome: formData.nome,
          telefone: formData.telefone,
          descricao: formData.descricao,
          eixo: formData.eixo,
          subcategoria: formData.subcategoria
        }
      ]);

    if (error) {
      setMensagem({ tipo: "erro", texto: "Erro ao cadastrar: " + error.message });
    } else {
      setMensagem({ tipo: "sucesso", texto: "Prestador cadastrado com sucesso!" });
      setFormData({ nome: "", telefone: "", descricao: "", eixo: "", subcategoria: "" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Novo Cadastro</h2>

      {mensagem.texto && (
        <div className={`p-4 rounded-lg text-sm font-medium ${mensagem.tipo === "sucesso" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {mensagem.texto}
        </div>
      )}

      {/* Nome */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Prestador / Empresa</label>
        <input
          required
          type="text"
          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="Ex: João da Silva"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />
      </div>

      {/* Telefone e Eixo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone (WhatsApp)</label>
          <input
            required
            type="text"
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="11999999999"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Eixo Principal</label>
          <select
            required
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
            value={formData.eixo}
            onChange={(e) => setFormData({ ...formData, eixo: e.target.value })}
          >
            <option value="">Selecione um Eixo</option>
            {EIXOS.map(eixo => <option key={eixo} value={eixo}>{eixo}</option>)}
          </select>
        </div>
      </div>

      {/* Subcategoria */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Subcategoria</label>
        <select
          required
          disabled={!formData.eixo}
          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white outline-none disabled:bg-gray-50 disabled:text-gray-400"
          value={formData.subcategoria}
          onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
        >
          <option value="">{formData.eixo ? "Selecione a Subcategoria" : "Selecione um Eixo primeiro"}</option>
          {subcategoriasDisponiveis.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Breve Descrição</label>
        <textarea
          rows={3}
          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="Descreva brevemente o serviço..."
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:bg-gray-400"
      >
        {loading ? "Cadastrando..." : "Confirmar Indicação"}
      </button>
    </form>
  );
}