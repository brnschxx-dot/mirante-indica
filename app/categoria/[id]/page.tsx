'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Star } from 'lucide-react'

// Dicionário definitivo: Define a palavra-chave de busca no banco e o Título limpo
const configCategoria: Record<string, { palavraChave: string, titulo: string }> = {
  'construcao': { palavraChave: '%Constru%', titulo: 'Construção e Reforma' },
  'manutencao': { palavraChave: '%Manuten%', titulo: 'Manutenção e Elétrica' }, 
  'limpeza': { palavraChave: '%Limpez%', titulo: 'Limpeza e Diaristas' },
  'fretes': { palavraChave: '%Frete%', titulo: 'Fretes e Mudanças' },
  'ti': { palavraChave: '%Tecnolo%', titulo: 'Tecnologia' },
  'alimentacao': { palavraChave: '%Alimenta%', titulo: 'Alimentação' },
  'estetica': { palavraChave: '%Estética%', titulo: 'Estética' },
  'outros': { palavraChave: '%Outros%', titulo: 'Outros' }
}

export default function CategoriaLista({ params }: { params: { id: string } }) {
  const [prestadores, setPrestadores] = useState<any[]>([])
  const router = useRouter()
  
  const config = configCategoria[params.id] || { palavraChave: '%%', titulo: 'Categoria' }

  const formatarNome = (nomeCompleto: string) => {
    if (!nomeCompleto) return '';
    if (nomeCompleto.includes('@')) return nomeCompleto.split('@')[0];
    const partes = nomeCompleto.trim().split(' ');
    if (partes.length === 1) return partes[0];
    return `${partes[0]} ${partes[partes.length - 1]}`;
  }

  useEffect(() => {
    const buscarPrestadores = async () => {
      const categoriaParaFiltro = configCategoria[params.id]?.titulo;

      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .eq('categoria', categoriaParaFiltro) 
        .order('id', { ascending: false })
      
      if (data) setPrestadores(data)
    }
    buscarPrestadores()
  }, [params.id])

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-24">
      <div className="bg-white p-6 shadow-sm mb-6 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full text-blue-600 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-900 truncate">{config.titulo}</h1>
      </div>

      <div className="p-4 max-w-md mx-auto grid gap-4">
        {prestadores.length > 0 ? (
          prestadores.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{p.nome}</h3>
                  
                  {/* Inclusão da Avaliação por Estrelas */}
                  <div className="flex gap-0.5 my-1">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <Star 
                        key={estrela} 
                        size={14} 
                        className={p.avaliacao >= estrela ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm italic">{p.telefone}</p>
                  {p.local && <p className="text-gray-400 text-[10px] mt-1">📍 {p.local}</p>}
                </div>

                <a href={`https://wa.me/55${p.telefone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white p-3 rounded-full flex-shrink-0 shadow-md">
                  <Phone size={18} fill="currentColor" />
                </a>
              </div>

              {/* Inclusão do Comentário */}
              {p.comentario && (
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <p className="text-xs text-gray-700 leading-relaxed italic">"{p.comentario}"</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                {p.indicado_por && (
                  <p className="text-[10px] text-gray-400 font-medium">
                    Indicado por: {formatarNome(p.indicado_por)}
                  </p>
                )}
                {p.instagram && (
                  <span className="text-[10px] text-blue-600 font-bold">{p.instagram}</span>
                )}
              </div>
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