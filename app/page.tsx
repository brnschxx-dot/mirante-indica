'use client'
import BottomNav from '../components/BottomNav'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans pb-28">
      
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <h1 className="text-3xl font-black text-gray-300 tracking-widest uppercase">Hello World!</h1>
        <p className="text-sm font-medium text-gray-400 mt-2">Sua nova tela inicial</p>
      </div>

      <BottomNav />
    </div>
  )
}