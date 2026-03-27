'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient' 
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [prestadores, setPrestadores] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checarAcesso = async () => {
      // 1. Verifica se o usuário está logado
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Se NÃO estiver logado, manda direto para a tela de login
        router.replace('/login')
      } else {
        // Se ESTIVER logado, busca os dados
        const { data } = await supabase.from('prestadores').select('*')
        if (data) setPrestadores(data)
        setCarregando(false)
      }
    }

    checarAcesso()
  }, [router])

  // Enquanto verifica a sessão, mostra um aviso simples
  if (carregando) {
    return <div className="flex justify-center items-center min-h-screen text-gray-600 font-medium">Carregando indicações...</div>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-6 gap-4">
        <h1 className="text-3xl font-bold text-blue-900">Mirante Indica 🏢</h1>
        
        <div className="flex gap-3">
          <Link href="/dashboard" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-300 transition-all shadow-sm">
            Menu
          </Link>
          <Link href="/cadastrar" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-all shadow-sm">
            + Nova Indicação
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Indicações da Vizinhança:</h2>
        
        {prestadores.map((p) => (
          <div key={p.id} className="border border-gray-100 p-5 rounded-xl shadow-sm bg-white flex justify-between items-center hover:border-blue-200 transition-all">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Serviço / Local</span>
              <h3 className="font-bold text-xl text-gray-800">{p.nome}</h3>
              <p className="text-green-600 font-bold mt-1 flex items-center gap-1">
                <span>WhatsApp:</span> {p.telefone}
              </p>
            </div>
            
            {/* Botão de WhatsApp direto */}
            <a 
              href={`https://wa.me/55${p.telefone?.replace(/\D/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-100 text-green-700 p-3 rounded-full hover:bg-green-200 transition-all flex items-center justify-center w-12 h-12"
            >
              📱
            </a>
          </div>
        ))}

        {prestadores.length === 0 && (
          <div className="text-center p-10 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 italic">Nenhuma indicação cadastrada ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}