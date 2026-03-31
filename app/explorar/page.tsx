'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

// Array de categorias vinculando à URL amigável
const categorias = [
  { id: 'construcao', nome: 'Construção', icone: '🛠️' },
  { id: 'manutencao', nome: 'Manutenção', icone: '⚡' },
  { id: 'limpeza', nome: 'Limpeza', icone: '🧹' },
  { id: 'fretes', nome: 'Fretes', icone: '🚚' },
  { id: 'ti', nome: 'Tecnologia', icone: '💻' },
  { id: 'alimentacao', nome: 'Alimentação', icone: '🍕' },
  { id: 'estetica', nome: 'Estética', icone: '✨' },
  { id: 'outros', nome: 'Outros', icone: '📦' }
]

export default function Explorar() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-28">
      {/* Cabeçalho com botão Voltar */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full text-blue-600 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-blue-900">Categorias</h1>
      </div>

      {/* Grid de Ícones Redondos */}
      <div className="p-6 grid grid-cols-2 gap-6 max-w-md mx-auto">
        {categorias.map((cat) => (
          <Link key={cat.id} href={`/categoria/${cat.id}`} className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all active:scale-95">
            <div className="text-4xl w-20 h-20 bg-blue-50 flex items-center justify-center rounded-full mb-3 shadow-inner">
              {cat.icone}
            </div>
            <span className="font-bold text-gray-700 text-center">{cat.nome}</span>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}