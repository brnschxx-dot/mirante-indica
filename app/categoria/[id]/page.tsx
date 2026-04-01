'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Star } from 'lucide-react'

const configCategoria: Record<string, { titulo: string }> = {
  'construcao': { titulo: 'Construção e Reforma' },
  'manutencao': { titulo: 'Manutenção e Elétrica' }, 
  'limpeza': { titulo: 'Limpeza e Diaristas' },
  'fretes': { titulo: 'Fretes e Mudanças' },
  'ti': { titulo: 'Tecnologia' },
  'alimentacao': { titulo: 'Alimentação' },
  'estetica': { titulo: 'Estética' },
  'outros': { titulo: 'Outros' }
}

export default function CategoriaLista({ params }: { params: { id: string } }) {
  const [prestadores, setPrestadores] = useState<any[]>([])
  const router = useRouter()
  const config = configCategoria[params.id] || { titulo: 'Categoria' }

  const formatarNome = (nomeCompleto: string) => {
    if (!nomeCompleto) return '';
    const partes = nomeCompleto.trim().split(' ');
    if (partes.length === 1) return partes[0];
    return `${partes[0]} ${partes[partes.length - 1]}`;
  }

  useEffect(() => {
    const buscarPrestadores = async () => {
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .eq('categoria', config.titulo) // Busca exata pelo nome limpo
        .order('id', { ascending: false })
      
      if (data) setPrestadores(data)
      if (error) console.error(error)
    }
    buscarPrestadores()
  }, [config.titulo])

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-24">
      <div className="bg-white p-6 shadow-sm mb-6 flex items-center gap-4 sticky top-0 z-10 border-b">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full text-blue-600 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-900">{config.titulo}</h1>
      </div>

      <div className="p-4 max-w-md mx-auto grid gap-4">
        {prestadores.length > 0 ? (
          prestadores.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{p.nome}</h3>
                  <div className="flex gap-0.5 my-1">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <Star key={estrela} size={14} className={p.avaliacao >= estrela ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm font-medium">{p.telefone}</p>
                </div>
                <a href={`https://wa.me/55${p.telefone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white p-3 rounded-full shadow-md active:scale-90 transition-all">
                  <Phone size={18} fill="currentColor" />
                </a>
              </div>

              {p.comentario && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 italic text-xs text-gray-700">
                  "{p.comentario}"
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-[10px]">
                <span className="text-gray-400 font-medium">INDICADO POR: {formatarNome(p.indicado_por)}</span>
                {p.instagram && <span className="text-blue-600 font-bold uppercase">{p.instagram}</span>}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-medium">Nenhum profissional indicado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}