'use client'
import { useRouter } from 'next/navigation'

export default function Confirmado() {
  const router = useRouter()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-8 text-black text-center">
      <h1 className="text-2xl font-bold mb-4">Email confirmado! Realize o login.</h1>
      <button 
        onClick={() => router.push('/login')}
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all"
      >
        Tela Inicial
      </button>
    </div>
  )
}