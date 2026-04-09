import FormularioCadastro from "@/components/FormularioCadastro";
import Link from "next/link";

export default function CadastrarPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:py-20">
      <div className="max-w-3xl mx-auto">
        
        {/* Navegação Superior */}
        <nav className="mb-8">
          <Link 
            href="/indicacoes" 
            className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-2 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            Voltar para a lista de indicações
          </Link>
        </nav>

        {/* Header da Página */}
        <header className="mb-10 text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Indicar <span className="text-indigo-600">Serviço</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-light leading-relaxed max-w-xl">
            Contribua com a comunidade compartilhando profissionais e serviços que você realmente confia e recomenda.
          </p>
        </header>

        {/* Seção do Formulário */}
        <section className="relative">
          {/* O componente FormularioCadastro abaixo já deve conter a lógica 
              de Select em cascata (Eixo -> Subcategoria) que montamos.
          */}
          <FormularioCadastro />
        </section>

        {/* Rodapé da Página */}
        <footer className="mt-16 text-center text-slate-400 text-xs tracking-widest uppercase">
          <p>© 2026 Mirante Indica • Jundiaí, SP</p>
        </footer>

      </div>
    </main>
  );
}