'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone } from 'lucide-react'

// Dicionário definitivo: Define a palavra-chave de busca no banco e o Título limpo
const configCategoria: Record<string, { palavraChave: string, titulo: string }> = {
  'construcao': { palavraChave: '%Constru%', titulo: 'Construção e Reforma' },
  'manutencao': { palavraChave: '%Manuten%', titulo: 'Manutenção e Elétrica' }, // Busca palavras parecidas
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
  
  // Se não achar a categoria, usa um padrão seguro
  const config = configCategoria[params.id] || { palavraChave: '%%', titulo: 'Categoria' }

  // Função para extrair apenas o Primeiro e Último nome
  const formatarNome = (nomeCompleto: string) => {
    if (!nomeCompleto) return '';
    if (nomeCompleto.includes('@')) return nomeCompleto.split('@')[0]; // Se for email, pega o começo
    const partes = nomeCompleto.trim().split(' ');
    if (partes.length === 1) return partes[0];
    return `${partes[0]} ${partes[partes.length - 1]}`;
  }

  useEffect(() => {
    const buscarPrestadores = async () => {
      // O ilike é o segredo: ele busca a palavra no meio da string, ignorando emojis!
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .ilike('categoria', config.palavraChave) 
        .order('id', { ascending: false })
      
      if (data) setPrestadores(data)
    }
    buscarPrestadores()
  }, [config.palavraChave])

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-24">
      <div className="bg-white p-6 shadow-sm mb-6 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full text-blue-600 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        {/* Título agora puxa direto da nossa configuração, sem cortar letras */}
        <h1 className="text-xl font-bold text-blue-900 truncate">{config.titulo}</h1>
      </div>

      <div className="p-4 max-w-md mx-auto grid gap-4">
        {prestadores.length > 0 ? (
          prestadores.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{p.nome}</h3>
                <p className="text-gray-600 text-sm mt-1">Zap: {p.telefone}</p>
                {p.indicado_por && (
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    Indicado por: {formatarNome(p.indicado_por)}
                  </p>
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