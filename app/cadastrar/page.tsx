import FormularioCadastro from "@/components/FormularioCadastro";
import Link from "next/link";

export default function CadastrarPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header Estilo App */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 px-4 py-4 flex items-center shadow-sm">
        <Link href="/indicacoes" className="p-2 -ml-2 text-indigo-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="ml-2 text-lg font-bold text-slate-800">Indicar Novo Serviço</h1>
      </div>

      <div className="max-w-md mx-auto p-4 pb-12">
        <div className="bg-indigo-50 p-4 rounded-2xl mb-6 border border-indigo-100">
          <p className="text-indigo-700 text-sm leading-tight font-medium">
            Sua indicação ajuda outros moradores do Mirante a encontrarem profissionais de confiança.
          </p>
        </div>

        {/* O FormularioCadastro deve ter botões grandes e inputs arredondados */}
        <FormularioCadastro />
      </div>
    </main>
  );
}