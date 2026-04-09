"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EIXOS, EIXOS_CATEGORIAS } from "@/lib/categorias";
import { useRouter } from "next/navigation";

export default function CadastrarPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [nota, setNota] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    local: "", // Mapeado para a coluna 'local'
    comentario: "", // Mapeado para 'comentario'
    eixo: "",
    subcategoria: "",
    instagram: "",
    email: "", // Coluna existente no seu banco
    indicado_por: "Comunidade", // Exemplo de preenchimento
  });

  const tagsDisponiveis = ["Pontual", "Preço Justo", "Limpo", "Rápido", "Educado"];

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 7) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setFormData({ ...formData, telefone: v });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoArquivo(file);
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nota === 0) return alert("Por favor, selecione uma avaliação.");
    setLoading(true);

    let urlFinalFoto = "";

    // 1. Upload da Foto (se houver)
    if (fotoArquivo) {
      const fileExt = fotoArquivo.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prestadores-midia')
        .upload(`fotos/${fileName}`, fotoArquivo);

      if (!uploadError) {
        const { data } = supabase.storage.from('prestadores-midia').getPublicUrl(`fotos/${fileName}`);
        urlFinalFoto = data.publicUrl;
      }
    }

    // 2. Montagem da Descrição com Tags
    const descricaoComTags = tags.length > 0 
      ? `[${tags.join(" • ")}] ${formData.comentario}` 
      : formData.comentario;

    // 3. Insert batendo com suas colunas
    const { error } = await supabase.from("prestadores").insert([
      {
        nome: formData.nome,
        telefone: formData.telefone,
        local: formData.local,
        eixo: formData.eixo,
        subcategoria: formData.subcategoria,
        categoria: formData.eixo, // Usando o eixo como categoria principal
        instagram: formData.instagram.replace("@", ""),
        email: formData.email,
        avaliacao: nota,
        comentario: formData.comentario,
        descricao: descricaoComTags,
        indicado_por: formData.indicado_por,
        foto_url: urlFinalFoto, // Lembrar de adicionar esta coluna no DB
      },
    ]);

    if (error) alert("Erro: " + error.message);
    else router.push("/indicacoes");
    
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 pb-24 font-sans text-slate-900">
      <div className="max-w-md mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tighter">Nova <span className="text-indigo-600">Indicação</span></h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Foto */}
          <div className="flex flex-col items-center mb-4">
            <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-3xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer shadow-sm">
              {fotoPreview ? <img src={fotoPreview} className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-slate-400">FOTO</span>}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFotoChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input required className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" placeholder="Nome *" onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            <input required type="tel" value={formData.telefone} onChange={handleTelefoneChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" placeholder="WhatsApp *" />
          </div>

          <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" placeholder="Local / Bairro em Jundiaí" onChange={(e) => setFormData({ ...formData, local: e.target.value })} />

          <div className="grid grid-cols-2 gap-4">
            <select required className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm appearance-none" value={formData.eixo} onChange={(e) => setFormData({ ...formData, eixo: e.target.value, subcategoria: "" })}>
              <option value="">Categoria...</option>
              {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select required disabled={!formData.eixo} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm appearance-none" value={formData.subcategoria} onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}>
              <option value="">Especialidade...</option>
              {(EIXOS_CATEGORIAS[formData.eixo as keyof typeof EIXOS_CATEGORIAS] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" placeholder="Instagram" onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} />
             <input type="email" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" placeholder="E-mail (opcional)" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div className="flex flex-wrap gap-2">
            {tagsDisponiveis.map(tag => (
              <button key={tag} type="button" onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${tags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>{tag}</button>
            ))}
          </div>

          <div className="bg-indigo-50/50 p-4 rounded-3xl text-center">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setNota(star)}>
                  <svg className={`w-8 h-8 ${star <= nota ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </button>
              ))}
            </div>
          </div>

          <textarea required className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm resize-none" rows={3} placeholder="Conte sua experiência..." onChange={(e) => setFormData({ ...formData, comentario: e.target.value })} />

          <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg disabled:opacity-50">
            {loading ? "Publicando..." : "Publicar Indicação"}
          </button>
        </form>
      </div>
    </main>
  );
}