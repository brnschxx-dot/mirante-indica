// components/FiltroEixo.tsx
"use client";

import { EIXOS } from "@/lib/categorias";

interface FiltroEixoProps {
  eixoSelecionado: string;
  onSelecionarEixo: (eixo: string) => void;
}

export default function FiltroEixo({ eixoSelecionado, onSelecionarEixo }: FiltroEixoProps) {
  return (
    <div className="w-full mb-6">
      <label htmlFor="filtro-eixo" className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por Categoria Principal
      </label>
      <select
        id="filtro-eixo"
        value={eixoSelecionado}
        onChange={(e) => onSelecionarEixo(e.target.value)}
        className="w-full sm:w-auto bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm transition-colors"
      >
        <option value="">Todos os serviços</option>
        {EIXOS.map((eixo) => (
          <option key={eixo} value={eixo}>
            {eixo}
          </option>
        ))}
      </select>
    </div>
  );
}