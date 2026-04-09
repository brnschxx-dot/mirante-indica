// app/indicacoes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Certifique-se de que o caminho está correto
import FiltroEixo from "@/components/FiltroEixo";

export default function IndicacoesPage() {
  const [prestadores, setPrestadores] = useState<any[]>([]);
  const [eixoSelecionado, setEixoSelecionado] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrestadores() {
      setLoading(true);

      // Inicia a query apontando para a sua tabela
      let query = supabase
        .from("prestadores")
        .select("*")
        .order("id", { ascending: false });

      // Se o usuário selecionou um eixo específico, adiciona o filtro na query
      if (eixoSelecionado !== "") {
        query = query.eq("eixo", eixoSelecionado);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar prestadores:", error);
      } else {
        setPrestadores(data || []);
      }

      setLoading(false);
    }

    fetchPrestadores();
  }, [eixoSelecionado]); // O array de dependências aciona o useEffect toda vez que o filtro muda

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Guia Mirante Indica</h1>

      {/* Renderiza o componente de filtro */}
      <FiltroEixo 
        eixoSelecionado={eixoSelecionado} 
        onSelecionarEixo={setEixoSelecionado} 
      />

      {/* Renderização Condicional da Lista */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500 font-medium animate-pulse">Carregando indicações...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prestadores.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Nenhum prestador encontrado para esta categoria.</p>
            </div>
          ) : (
            prestadores.map((prestador) => (
              <div key={prestador.id} className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                <h2 className="font-bold text-lg text-gray-900">{prestador.nome}</h2>
                
                {/* Exibição das categorias como "Badges" (etiquetas) */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {prestador.eixo && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
                      {prestador.eixo}
                    </span>
                  )}
                  {prestador.subcategoria && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                      {prestador.subcategoria}
                    </span>
                  )}
                </div>
                
                {/* Aqui você pode adicionar as outras variáveis do seu banco, como telefone, descrição, etc. */}
                {prestador.telefone && (
                  <p className="mt-3 text-sm text-gray-600">
                    <strong>Contato:</strong> {prestador.telefone}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}