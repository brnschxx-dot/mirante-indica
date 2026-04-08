'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export default function VoteButtons({ prestadorId }: { prestadorId: any }) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [upvotes, setUpvotes] = useState(0)
  const [downvotes, setDownvotes] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchVotes = async () => {
      // Pega usuário logado
      const { data: { session } } = await supabase.auth.getSession()
      const currentUserId = session?.user?.id || null
      if (currentUserId) setUserId(currentUserId)

      // Pega todos os votos deste prestador
      const { data: votos } = await supabase
        .from('votos')
        .select('*')
        .eq('prestador_id', prestadorId)

      if (votos) {
        setUpvotes(votos.filter(v => v.tipo === 'up').length)
        setDownvotes(votos.filter(v => v.tipo === 'down').length)
        
        if (currentUserId) {
          const myVote = votos.find(v => v.usuario_id === currentUserId)
          if (myVote) setUserVote(myVote.tipo as 'up' | 'down')
        }
      }
    }
    fetchVotes()
  }, [prestadorId])

  const handleVote = async (tipo: 'up' | 'down') => {
    if (!userId) {
      alert('Você precisa estar logado para votar!')
      return
    }

    // Se clicar no mesmo voto, abre o popup de remover
    if (userVote === tipo) {
      setShowConfirm(true)
      return
    }

    const previousVote = userVote
    
    // Atualização otimista (muda a tela antes do banco pra ficar rápido)
    setUserVote(tipo)
    if (tipo === 'up') {
      setUpvotes(prev => prev + 1)
      if (previousVote === 'down') setDownvotes(prev => prev - 1)
    } else {
      setDownvotes(prev => prev + 1)
      if (previousVote === 'up') setUpvotes(prev => prev - 1)
    }

    if (previousVote) {
      // Troca o voto (update)
      await supabase.from('votos').update({ tipo }).match({ prestador_id: prestadorId, usuario_id: userId })
    } else {
      // Novo voto (insert)
      await supabase.from('votos').insert({ prestador_id: prestadorId, usuario_id: userId, tipo })
    }
  }

  const confirmRemove = async () => {
    // Reverte na tela
    if (userVote === 'up') setUpvotes(prev => prev - 1)
    if (userVote === 'down') setDownvotes(prev => prev - 1)
    setUserVote(null)
    setShowConfirm(false)

    // Remove do banco
    await supabase.from('votos').delete().match({ prestador_id: prestadorId, usuario_id: userId })
  }

  return (
    <div className="relative inline-flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
      
      <button onClick={() => handleVote('up')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors active:scale-95 ${userVote === 'up' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-200'}`}>
        <ThumbsUp size={16} className={userVote === 'up' ? 'fill-green-700' : ''} />
        <span className="text-xs font-bold">{upvotes}</span>
      </button>

      <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>

      <button onClick={() => handleVote('down')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors active:scale-95 ${userVote === 'down' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:bg-gray-200'}`}>
        <ThumbsDown size={16} className={userVote === 'down' ? 'fill-red-600' : ''} />
        <span className="text-xs font-bold">{downvotes}</span>
      </button>

      {/* Popup discreto de confirmação */}
      {showConfirm && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-20 flex flex-col items-center animate-in fade-in zoom-in duration-200">
          <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest text-center">Remover seu voto?</p>
          <div className="flex gap-2 w-full">
            <button onClick={confirmRemove} className="flex-1 bg-red-50 text-red-600 text-xs py-2 rounded-xl font-bold hover:bg-red-100 transition-colors">Sim</button>
            <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-50 text-gray-600 text-xs py-2 rounded-xl font-bold hover:bg-gray-100 transition-colors">Não</button>
          </div>
        </div>
      )}
    </div>
  )
}