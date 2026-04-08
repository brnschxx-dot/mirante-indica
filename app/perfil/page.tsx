'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { User, LogOut, Camera, Mail } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loadingFoto, setLoadingFoto] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUser(session.user)
      else router.push('/login')
    }
    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Função para salvar a foto no metadata do usuário
  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoadingFoto(true)
    
    // Converte a imagem para Base64 para salvar direto no perfil
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      
      const { data, error } = await supabase.auth.updateUser({
        data: { avatar_url: base64String }
      })

      if (!error && data.user) {
        setUser(data.user)
      } else {
        alert('Erro ao atualizar foto')
      }
      setLoadingFoto(false)
    }
    reader.readAsDataURL(file)
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>

  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name || 'Morador'

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      
      <div className="bg-white p-6 shadow-sm border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-900">Meu Perfil</h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center gap-4">
          
          {/* Componente da Foto de Perfil */}
          <div className="relative">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-gray-300" />
              )}
            </div>
            
            {/* Botão de Upload da Câmera */}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg active:scale-95 transition-transform">
              <Camera size={16} />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFotoUpload} 
                disabled={loadingFoto}
              />
            </label>
          </div>
          
          {loadingFoto && <p className="text-xs text-blue-600 animate-pulse">Atualizando foto...</p>}

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800">{fullName}</h2>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 my-2"></div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold active:scale-95 transition-all"
          >
            <LogOut size={18} />
            Sair do App
          </button>

        </div>
      </div>

      <BottomNav />
    </div>
  )
}