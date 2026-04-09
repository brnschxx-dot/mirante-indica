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
  
  // Estados para múltiplas fotos
  const [fotosArquivos, setFotosArquivos] = useState<File[]>([]);
  const [fotosPreviews, setFotosPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    local: "",
    comentario: "",
    eixo: "",
    subcategoria: "",
    instagram: "",
    email: "",
    indicado_por: "Comunidade",
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
    const files = Array.from(e.target.files || []);
    
    if (fotosArquivos.length + files.length > 5) {
      alert("Você pode enviar no máximo 5 fotos.");
      return;
    }

    const novosArquivos = [...fotosArquivos, ...files];
    setFotosArquivos(novosArquivos);

    // Gerar previews
    const novosPreviews = files.map(file => URL.createObjectURL(file));
    setFotosPreviews([...fotosPreviews, ...novosPreviews]);
  };

  const removerFoto = (index: number) => {
    setFotosArquivos(prev => prev.filter((_, i) => i !== index));
    setFotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nota === 0) return alert("Por favor, selecione uma avaliação.");
    setLoading(true);

    const urlsFotos: string[] = [];

    // 1. Upload de múltiplas fotos
    for (const file of fotosArquivos) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `fotos/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('prestadores-midia')
        .upload(filePath, file);

      if (uploadError) {
        // ESSAS DUAS LINHAS VÃO TE MOSTRAR O ERRO
        console.error("Erro no Supabase Storage:", uploadError);
        alert("Erro ao subir a foto: " + uploadError.message); 
      } else {
        const { data: urlData } = supabase.storage.from('prestadores-midia').getPublicUrl(filePath);
        urlsFotos.push(urlData.publicUrl);
      }
    }

    const descricaoFinal = tags.length > 0 
      ? `[${tags.join(" • ")}] ${formData.comentario}` 
      : formData.comentario;

    // 2. Insert no banco (foto_url salva como string separada por vírgula ou JSON)
    const { error } = await supabase.from("prestadores").insert([
      {
        nome: formData.nome,
        telefone: formData.telefone,
        local: formData.local,
        eixo: formData.eixo,
        subcategoria: formData.subcategoria,
        categoria: formData.eixo,
        instagram: formData.instagram.replace("@", ""),
        email: formData.email,
        avaliacao: nota,
        comentario: formData.comentario,
        descricao: descricaoFinal,
        indicado_por: formData.indicado_por,
        foto_url: urlsFotos.join(","), // Salva as URLs separadas por vírgula
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
          <h1 className="text-3xl font-black tracking-tighter italic">Nova <span className="text-indigo-600 uppercase">Indicação</span></h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Preencha os dados do prestador</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nome *</label>
              <input required className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="Ex: João" onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">WhatsApp *</label>
              <input required type="tel" value={formData.telefone} onChange={handleTelefoneChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="(11) 99999-9999" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Localização</label>
            <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="Bairro ou região de Jundiaí" onChange={(e) => setFormData({ ...formData, local: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Categoria *</label>
              <select required className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none" value={formData.eixo} onChange={(e) => setFormData({ ...formData, eixo: e.target.value, subcategoria: "" })}>
                <option value="">Selecione...</option>
                {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Especialidade *</label>
              <select required disabled={!formData.eixo} className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none disabled:bg-slate-50" value={formData.subcategoria} onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}>
                <option value="">O que faz?</option>
                {(EIXOS_CATEGORIAS[formData.eixo as keyof typeof EIXOS_CATEGORIAS] || []).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Instagram do Prestador</label>
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
    <input 
      type="text" 
      className="w-full p-4 pl-8 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all" 
      placeholder="usuario.do.insta" 
      value={formData.instagram}
      onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace("@", "").toLowerCase().trim() })} 
    />
  </div>
  <p className="text-[9px] text-slate-400 mt-2 ml-1 font-medium italic">Opcional: Ajuda a validar o trabalho do profissional.</p>
</div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Destaques</label>
            <div className="flex flex-wrap gap-2">
              {tagsDisponiveis.map(tag => (
                <button key={tag} type="button" onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tags.includes(tag) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{tag}</button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 text-center">
            <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3">Avaliação *</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setNota(star)}>
                  <svg className={`w-10 h-10 ${star <= nota ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} fill={star <= nota ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* COMENTÁRIO COM LIMITE DE 100 CARACTERES */}
          <div>
            <div className="flex justify-between items-end mb-2 ml-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Comentário *</label>
              <span className={`text-[10px] font-bold ${formData.comentario.length >= 100 ? 'text-red-500' : 'text-slate-400'}`}>{formData.comentario.length}/100</span>
            </div>
            <textarea required maxLength={100} className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm" rows={3} placeholder="Resuma sua experiência..." onChange={(e) => setFormData({ ...formData, comentario: e.target.value })} />
          </div>

          {/* SEÇÃO DE FOTOS (MÁXIMO 5) ABAIXO DOS COMENTÁRIOS */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Fotos / Comprovantes (Máx 5)</label>
            <div className="flex flex-wrap gap-3">
              {fotosPreviews.map((url, index) => (
                <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm group">
                  <img src={url} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removerFoto(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              
              {fotosPreviews.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-16 h-16 rounded-xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-indigo-400 hover:text-indigo-400 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
              )}
            </div>
            <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFotoChange} />
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50">
            {loading ? "Publicando..." : "Finalizar Indicação"}
          </button>

        </form>
      </div>
    </main>
  );
}