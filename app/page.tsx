'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient' 
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Filter, Phone } from 'lucide-react'

export default function Home() {
  const [prestadores, setPrestadores] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  
  // Novos estados para a Busca e Filtro
  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas')
  const router = useRouter()

  useEffect(() => {
    const buscarDados = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.replace('/login')
        return
      }

      // Busca os dados já ordenados dos mais recentes para os mais antigos
      const { data } = await supabase
        .from('prestadores')
        .select('*')
        .order('id', { ascending: false })
      
      if (data) setPrestadores(data)
      setCarregando(false)
    }

    buscarDados()
  }, [router])

  // Lógica para filtrar a lista em TEMPO REAL
  const prestadoresFiltrados = prestadores.filter((p) => {
    const bateuBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) || 
                       (p.categoria && p.categoria.toLowerCase().includes(busca.toLowerCase()))
    
    const bateuCategoria = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro

    return bateuBusca && bateuCategoria
  })

  // Lista de categorias para o filtro
  const listaCategorias = [
    "Todas",
    "🛠️ Construção e Reforma (Pintor, Pedreiro)",
    "⚡ Manutenção (Eletricista, Encanador)",
    "🧹 Limpeza e Diarista",
    "🚚 Fretes e Mudanças",
    "💻 TI e Eletrônicos",
    "🍕 Alimentação",
    "✨ Estética e Saúde",
    "📦 Outros"
  ]

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto font-sans bg-gray-50 min-h-screen pb-20 text-black">
      
      {/* Cabeçalho Mobile */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900">Indicações</h1>
        <Link href="/dashboard" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-300 transition-all shadow-sm">
          Voltar ao Menu
        </Link>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-col gap-3 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Campo de Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nome ou serviço..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-blue-500 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        {/* Filtro de Categoria */}
        <div className="relative">
          <Filter className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <select 
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-blue-500 bg-gray-50 focus:bg-white appearance-none text-gray-700 font-medium"
          >
            {listaCategorias.map((cat, idx) => (
              <option key={idx} value={cat}>{cat.replace(/[^a-zA-ZÀ-ÿ\s()]/g, '')} {/* Remove o emoji no texto do select para ficar mais limpo */}</option>
            ))}
          </select>
        </div>
      </div>

      {/* SKELETON SCREEN (Mostra enquanto carrega) */}
      {carregando ? (
        <div className="grid gap-4 animate-pulse">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="border border-gray-100 p-5 rounded-2xl shadow-sm bg-white flex justify-between items-center">
              <div className="flex flex-col gap-2 w-2/3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : (
        
        /* LISTA DE RESULTADOS */
        <div className="grid gap-4">
          {prestadoresFiltrados.length > 0 ? (
            prestadoresFiltrados.map((p) => (
              <div key={p.id} className="border border-gray-100 p-5 rounded-2xl shadow-sm bg-white flex justify-between items-center hover:border-blue-300 transition-all">
                <div className="flex flex-col">
                  {/* Mostra a categoria se ela existir */}
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 line-clamp-1">
                    {p.categoria ? p.categoria : 'Serviço Geral'}
                  </span>
                  
                  <h3 className="font-bold text-xl text-gray-900 leading-tight">{p.nome}</h3>
                  
                  <p className="text-gray-600 font-medium mt-1 text-sm">
                    Zap: <span className="text-gray-900">{p.telefone}</span>
                  </p>
                </div>
                
                {/* Botão de WhatsApp direto com ícone */}
                <a 
                  href={`https://wa.me/55${p.telefone?.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-transform active:scale-95 flex items-center justify-center shadow-md flex-shrink-0"
                >
                  <Phone size={24} fill="currentColor" />
                </a>
              </div>
            ))
          ) : (
            /* TELA VAZIA (Caso a busca não encontre nada) */
            <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center">
              <span className="text-4xl mb-3">🕵️‍♂️</span>
              <h3 className="text-lg font-bold text-gray-800">Nenhum vizinho indicou isso ainda</h3>
              <p className="text-gray-500 text-sm mt-1">Que tal ser o primeiro a indicar?</p>
              <Link href="/cadastrar" className="mt-4 text-blue-600 font-bold underline text-sm">
                Fazer uma indicação
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}