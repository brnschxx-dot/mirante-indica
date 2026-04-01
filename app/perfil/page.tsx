'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut, User, MapPin, Phone } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

export default function Perfil() {
  const [usuario, setUsuario] = useState({
    nome: '', email: '', telefone: '', bloco: '', apto: ''
  })
  const router = useRouter()

  useEffect(() => {
    const carregarPerfil = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session && session.user) {
        // Puxamos os dados extras de dentro do user_metadata que salvamos no cadastro
        const meta = session.user.user_metadata || {}
        setUsuario({
          nome: meta.full_name || 'Morador',
          email: session.user.email || '',
          telefone: meta.phone || 'Não informado',
          bloco: meta.bloco || '-',
          apto: meta.apto || '-'
        })
      } else {
        router.replace('/login')
      }
    }
    carregarPerfil()
  }, [router])

  const handleSair = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-28">
      <div className="bg-blue-600 p-6 rounded-b-3xl shadow-md mb-8 flex items-center gap-4 text-white">
        <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </div>

      <div className="p-6 max-w-md mx-auto flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner border-4 border-white">
          <User size={40} className="text-gray-400" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-800 text-center">{usuario.nome}</h2>
        <p className="text-gray-500 mb-6 text-sm">{usuario.email}</p>

        {/* Card com os dados do morador */}
        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin size={20} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Endereço no Condomínio</p>
              <p className="font-medium">Bloco {usuario.bloco} - Apto {usuario.apto}</p>
            </div>
          </div>
          
          <div className="w-full h-px bg-gray-100"></div>

          <div className="flex items-center gap-3 text-gray-700">
            <Phone size={20} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Telefone Cadastrado</p>
              <p className="font-medium">{usuario.telefone}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSair} 
          className="w-full bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <LogOut size={20} /> Sair do Aplicativo
        </button>
      </div>

      <BottomNav />
    </div>
  )
}