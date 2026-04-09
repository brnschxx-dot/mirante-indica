import FormularioCadastro from "@/components/FormularioCadastro";
import Link from "next/link";

export default function CadastrarPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        <nav className="mb-8">
          <Link href="/indicacoes" className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-2">
            ← Ver lista de indicações
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Indicar <span className="text-indigo-600">Serviço</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Compartilhe um profissional de confiança com os moradores do Mirante.
          </p>
        </header>

        {/* Componente do Formulário */}
        <FormularioCadastro />

      </div>
    </main>
  );
}