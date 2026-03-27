'use client'
import { useEffect, useState } from 'react'
// AJUSTE DE CAMINHO: Verifique se sua pasta lib está na raiz
import { supabase } from '../../lib/supabaseClient' 
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClipboardPlus, Search, LogOut, Building2 } from 'lucide-react'

export default function Dashboard() {
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checarAcesso = async () => {
      console.log("Iniciando checagem de acesso...");
      
      try {
        // Tenta pegar a sessão com um tempo limite (timeout)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro do Supabase:", error);
          router.replace('/login');
          return;
        }

        if (session) {
          console.log("Sessão encontrada!");
          setCarregando(false);
        } else {
          console.log("Nenhuma sessão, indo para login...");
          router.replace('/login');
        }
      } catch (err) {
        console.error("Erro crítico na checagem:", err);
        router.replace('/login');
      }
    };

    checarAcesso();

    // SEGURANÇA: Se em 5 segundos nada acontecer, força o estado de carregamento a parar
    // para podermos ver se a tela renderiza ou se o erro aparece.
    const timer = setTimeout(() => {
      if (carregando) {
        console.warn("A checagem demorou demais. Forçando parada...");
        // setCarregando(false); // Remova o comentário desta linha se quiser forçar a entrada para teste
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleSair = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  // Tela de transição rápida
  if (carregando) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Verificando acesso...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <nav className="bg-white border-b border-gray-100 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
            <Building2 size={24} className="text-blue-600" />
            <span>Mirante Indica</span>
          </div>
          <button 
            onClick={handleSair} 
            className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Olá, Vizinho! 👋
          </h2>
          <p className="text-gray-500 italic">O que você deseja fazer hoje?</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-12 w-full max-w-2xl justify-center items-center">
          
          {/* BOTÃO 1: QUERO INDICAR */}
          <Link href="/cadastrar" className="group flex flex-col items-center no-underline">
            <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-xl border-4 border-green-50">
              <ClipboardPlus size={64} strokeWidth={1.5} />
            </div>
            <span className="mt-6 text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
              Quero indicar
            </span>
          </Link>

          {/* BOTÃO 2: QUERO INDICAÇÕES */}
          <Link href="/" className="group flex flex-col items-center no-underline">
            <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xl border-4 border-blue-50">
              <Search size={64} strokeWidth={1.5} />
            </div>
            <span className="mt-6 text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              Quero indicações
            </span>
          </Link>

        </div>
      </main>

      <footer className="p-8 text-center text-gray-400 text-xs uppercase tracking-widest bg-gray-50">
        Ambiente Seguro • Condomínio Mirante
      </footer>
    </div>
  )
}