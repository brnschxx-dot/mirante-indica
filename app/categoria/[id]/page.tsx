'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone } from 'lucide-react'

// Dicionário CORRIGIDO para bater exatamente com as opções da tela de Cadastro
const mapaCategorias: Record<string, string> = {
  'construcao': '🛠️ Construção e Reforma',
  'manutencao': '⚡ Elétrica / Hidráulica',
  'limpeza': '🧹 Limpeza',
  'fretes': '🚚 Mudanças',
  'ti': '💻 Tecnologia',
  'alimentacao': '🍕 Alimentação',
  'estetica': '✨ Estética',
  'outros': '📦 Outros'
}

export default function CategoriaLista({ params }: { params: { id: string } }) {
  const [prestadores, setPrestadores] = useState<any[]>([])
  const router = useRouter()
  
  const nomeExatoNoBanco = mapaCategorias[params.id] || 'Categoria'
  // Remove o emoji da frente apenas para o título da página ficar mais limpo
  const nomeCurtoParaTitulo = nomeExatoNoBanco.substring(3).trim()

  useEffect(() => {
    const buscarPrestadores = async () => {
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .eq('categoria', nomeExatoNoBanco)
        .order('id', { ascending: false })
      
      if (error) {
        console.error("Erro ao buscar:", error)
      } else if (data) {
        setPrestadores(data)
      }
    }
    buscarPrestadores()
  }, [nomeExatoNoBanco])

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-24">
      {/* Cabeçalho Fixo */}
      <div className="bg-white p-6 shadow-sm mb-6 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full text-blue-600 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-900 truncate">{nomeCurtoParaTitulo}</h1>
      </div>

      <div className="p-4 max-w-md mx-auto grid gap-4">
        {prestadores.length > 0 ? (
          prestadores.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{p.nome}</h3>
                <p className="text-gray-600 text-sm mt-1">Zap: {p.telefone}</p>
                {p.indicado_por && (
                  <p className="text-[10px] text-gray-400 mt-2 italic">Indicação: {p.indicado_por.split('@')[0]}</p>
                )}
              </div>
              <a href={`https://wa.me/55${p.telefone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white p-3 rounded-full flex-shrink-0 shadow-md">
                <Phone size={20} fill="currentColor" />
              </a>
            </div>
          ))
        ) : (
          <div className="text-center mt-12 text-gray-500 flex flex-col items-center">
            <span className="text-4xl mb-3">📭</span>
            <p>Nenhuma indicação nesta categoria ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}