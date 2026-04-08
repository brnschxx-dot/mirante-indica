'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { User, LogOut, Camera, Mail, Trash2, RefreshCw } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUser(session.user)
      else router.push('/login')
    }
    fetchUser()
  }, [router])

  const updateAvatar = async (base64: string | null) => {
    setLoading(true)
    const { data, error } = await supabase.auth.updateUser({
      data: { avatar_url: base64 }
    })
    if (!error && data.user) setUser(data.user)
    setLoading(false)
    setShowMenu(false)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => updateAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">
      <div className="bg-white p-6 shadow-sm border-b border-gray-100"><h1 className="text-xl font-bold text-blue-900 text-center">Meu Perfil</h1></div>

      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
          
          <div className="relative group">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg transition-transform active:scale-95"
            >
              {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : <User size={48} className="text-gray-300" />}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </button>

            {/* Menu de Opções da Foto */}
            {showMenu && (
              <div className="absolute top-full mt-2 bg-white shadow-xl border border-gray-100 rounded-2xl p-2 z-30 w-48 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-2">
                <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer text-sm font-bold text-gray-700">
                  <RefreshCw size={16} className="text-blue-500" />
                  {avatarUrl ? 'Trocar Foto' : 'Incluir Foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
                {avatarUrl && (
                  <button onClick={() => updateAvatar(null)} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-sm font-bold text-red-600">
                    <Trash2 size={16} /> Remover
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <h2 className="text-xl font-black text-gray-800">{user.user_metadata?.full_name || 'Morador'}</h2>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1"><Mail size={14}/> {user.email}</p>
          </div>

          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="mt-8 w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} /> Sair do App
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}