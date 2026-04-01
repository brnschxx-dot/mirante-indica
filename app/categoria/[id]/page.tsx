'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Star, User } from 'lucide-react'

const mapaCategorias: Record<string, string> = {
  'construcao': 'Construção',
  'manutencao': 'Manutenção',
  'limpeza': 'Limpeza',
  'fretes': 'Fretes',
  'ti': 'Tecnologia',
  'alimentacao': 'Alimentação',
  'estetica': 'Estética',
  'outros': 'Outros'
}

export default function CategoriaLista({ params }: { params: { id: string } }) {
  const [prestadores, setPrestadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const nomeCategoriaNoBanco = mapaCategorias[params.id]

  useEffect(() => {
    async function buscar() {
      if (!nomeCategoriaNoBanco) {
        console.error("ID da URL não mapeado:", params.id)
        setLoading(false)
        return
      }

      console.log("Buscando no banco por categoria igual a:", nomeCategoriaNoBanco)

      setLoading(true)
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .eq('categoria', nomeCategoriaNoBanco)
        .order('id', { ascending: false })
      
      if (error) {
        console.error("Erro na consulta do Supabase:", error.message)
      }

      if (data) {
        console.log("Resultados encontrados:", data.length)
        setPrestadores(data)
      }
      
      setLoading(false)
    }
    buscar()
  }, [params.id, nomeCategoriaNoBanco])

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-24">
      <div className="bg-white p-6 shadow-sm mb-6 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full text-blue-600 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-900">{nomeCategoriaNoBanco || 'Categoria'}</h1>
      </div>

      <div className="p-4 max-w-md mx-auto grid gap-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Carregando...</div>
        ) : prestadores.length > 0 ? (
          prestadores.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{p.nome}</h3>
                  <div className="flex gap-0.5 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={p.avaliacao >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm font-semibold">{p.telefone}</p>
                </div>
                <a href={`https://wa.me/55${p.telefone?.replace(/\D/g, '')}`} target="_blank" className="bg-green-500 text-white p-3 rounded-full shadow-md">
                  <Phone size={18} fill="currentColor" />
                </a>
              </div>
              
              {p.comentario && <div className="bg-gray-50 p-3 rounded-xl italic text-xs text-gray-700">"{p.comentario}"</div>}
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-[10px] uppercase font-bold text-gray-400">
                <span>Por: {p.indicado_por}</span>
                {p.instagram && <div className="flex items-center gap-1 text-blue-600 lowercase font-bold"><User size={10} /> {p.instagram.replace('@', '')}</div>}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-20 text-gray-400 uppercase text-xs tracking-widest">
            Nenhuma indicação encontrada em {nomeCategoriaNoBanco}
          </div>
        )}
      </div>
    </div>
  )
}