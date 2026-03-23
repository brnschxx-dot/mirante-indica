'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [lista, setLista] = useState<any[]>([])

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase.from('prestadores').select('*').order('criado_em', { ascending: false })
      if (data) setLista(data)
    }
    carregar()
  }, [])

  return (
    <main className="p-6 max-w-2xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Mirante Indica 🏢</h1>
        <Link href="/cadastrar" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          + Indicar
        </Link>
      </div>
      
      <div className="grid gap-4">
        {lista.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Nenhuma indicação ainda. Seja o primeiro!</p>
        ) : (
          lista.map(p => (
            <div key={p.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <h2 className="font-bold text-lg text-gray-800">{p.nome}</h2>
              <p className="text-gray-600 text-sm mt-1">Tel: {p.telefone}</p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}