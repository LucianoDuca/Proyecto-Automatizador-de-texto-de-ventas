"use client";

import { useState } from "react";
import type React from "react";
import OutputCard from "./OutputCard";

type GeneratedResult = {
  title: string;
  shortDesc: string;
  longDesc: string;
  instagram: string;
  whatsapp: string;
  hashtags: string;
};

export default function GeneratorForm() {
  const [form, setForm] = useState({
    product: "",
    audience: "",
    tone: "profesional",
    price: "",
  });

  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleGenerate = async () => {
    if (!form.product.trim() || !form.audience.trim() || !form.price.trim()) {
      setError("Completá producto, público objetivo y precio antes de generar.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      setResult({
        title: data.result,
        shortDesc: data.result,
        longDesc: data.result,
        instagram: data.result,
        whatsapp: data.result,
        hashtags: data.result,
      });
    } catch {
setError("Error al generar contenido con IA. Revisá la terminal o la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-2">
          VendeTexto IA
        </p>

        <h1 className="text-4xl font-bold text-white mb-3">
          Generá textos para vender mejor
        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto">
          Creá títulos, descripciones, publicaciones y respuestas comerciales en
          segundos.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
        <input
          name="product"
          placeholder="Ej: Remera oversize negra"
          className="w-full p-3 border rounded-lg mb-3 text-slate-900"
          onChange={handleChange}
        />

        <input
          name="audience"
          placeholder="Ej: jóvenes que compran ropa urbana"
          className="w-full p-3 border rounded-lg mb-3 text-slate-900"
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Ej: $18.000"
          className="w-full p-3 border rounded-lg mb-3 text-slate-900"
          onChange={handleChange}
        />

        <select
          name="tone"
          className="w-full p-3 border rounded-lg mb-4 text-slate-900"
          onChange={handleChange}
          value={form.tone}
        >
          <option value="profesional">Profesional</option>
          <option value="juvenil">Juvenil</option>
          <option value="urgente">Urgente</option>
        </select>

        {error && (
          <p className="text-red-600 text-sm font-medium mb-3">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {loading ? "Generando con IA..." : "Generar contenido"}
        </button>
      </div>

      {loading && (
        <div className="text-center text-slate-300 mb-6">
          Conectando con la IA...
        </div>
      )}

      {result && (
        <div className="grid md:grid-cols-2 gap-4">
          <OutputCard title="Resultado IA" content={result.title} />
        </div>
      )}
    </div>
  );
}