import FormularioCadastro from "@/components/FormularioCadastro";

export default function CadastroPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Cadastrar no <span className="text-indigo-600">Mirante Indica</span>
          </h1>
          <p className="text-gray-500 mt-2">Adicione novos prestadores de confiança à nossa rede.</p>
        </header>

        <FormularioCadastro />

        <footer className="mt-8 text-center">
          <a href="/indicacoes" className="text-indigo-600 hover:underline text-sm font-medium">
            ← Voltar para a lista de indicações
          </a>
        </footer>
      </div>
    </main>
  );
}