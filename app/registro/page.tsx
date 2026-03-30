'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, UserPlus } from 'lucide-react'

export default function Registro() {
  const [formData, setFormData] = useState({
    nome: '', tel: '', bloco: '', apto: '', email: '', senha: '', confirmaSenha: ''
  })
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.senha !== formData.confirmaSenha) return setMensagem('⚠️ As senhas não conferem.')
    
    setCarregando(true)
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.senha,
      options: {
        data: { 
          full_name: formData.nome, 
          phone: formData.tel, 
          bloco: formData.bloco, 
          apto: formData.apto 
        },
        emailRedirectTo: `${window.location.origin}/confirmado`,
      }
    })

    if (error) {
      setMensagem('❌ ' + error.message)
      setCarregando(false)
    } else {
      setMensagem('✅ Cadastro realizado! Verifique seu e-mail.')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-50 min-h-screen text-black">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-blue-600 font-bold">
        <ArrowLeft size={20} /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-blue-900 mb-6">Cadastro de Morador</h1>

      <form onSubmit={handleRegistro} className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <input type="text" placeholder="Nome Completo" className="border p-3 rounded-xl outline-blue-500" required
          onChange={e => setFormData({...formData, nome: e.target.value})} />
        
        <input type="tel" placeholder="Telefone" className="border p-3 rounded-xl outline-blue-500" required
          onChange={e => setFormData({...formData, tel: e.target.value})} />
        
        <div className="flex gap-2">
          <input type="text" placeholder="Bloco" className="border p-3 rounded-xl outline-blue-500 w-1/2" required
            onChange={e => setFormData({...formData, bloco: e.target.value})} />
          <input type="text" placeholder="Apto" className="border p-3 rounded-xl outline-blue-500 w-1/2" required
            onChange={e => setFormData({...formData, apto: e.target.value})} />
        </div>

        <input type="email" placeholder="E-mail" className="border p-3 rounded-xl outline-blue-500" required
          onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <input type="password" placeholder="Senha" className="border p-3 rounded-xl outline-blue-500" required
          onChange={e => setFormData({...formData, senha: e.target.value})} />
        
        <input type="password" placeholder="Confirmar Senha" className="border p-3 rounded-xl outline-blue-500" required
          onChange={e => setFormData({...formData, confirmaSenha: e.target.value})} />

        <button type="submit" disabled={carregando} className="bg-blue-600 text-white p-3 rounded-xl font-bold mt-2 disabled:opacity-50">
          {carregando ? 'Processando...' : 'Finalizar Cadastro'}
        </button>
      </form>
      {mensagem && <p className="mt-4 text-center text-sm font-semibold">{mensagem}</p>}
    </div>
  )
}