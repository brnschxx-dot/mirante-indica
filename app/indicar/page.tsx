import FormularioIndicar from "@/components/FormularioIndicar";
import Link from "next/link";

export default function IndicarPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Navegação e Título */}
        <nav className="mb-8">
          <Link href="/indicacoes" className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-2">
            ← Voltar para a lista
          </Link>
        </nav>

        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Indicar <span className="text-indigo-600">Serviço</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-light">
            Ajude a comunidade do Mirante indicando profissionais de qualidade.
          </p>
        </header>

        {/* Componente do Formulário */}
        <FormularioIndicar />

        <div className="mt-12 text-center text-slate-400 text-xs">
          <p>© 2026 Mirante Indica - Guia de Serviços Jundiaí</p>
        </div>

      </div>
    </main>
  );
}