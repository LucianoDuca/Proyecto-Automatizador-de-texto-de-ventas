"use client";

import { useState } from "react";

type FormData = {
  product: string;
  audience: string;
  tone: string;
  price: string;
  details: string;
  condition: string;
  category: string;
  brand: string;
};

type ResultData = {
  titulo: string;
  descripcion: string;
  caracteristicas: string[];
  beneficios: string[];
  info_adicional: string;
};

type HistoryItem = {
  id: number;
  product: string;
  createdAt: string;
  result: ResultData;
};

export default function Home() {
  const [form, setForm] = useState<FormData>({
    product: "",
    audience: "",
    tone: "profesional",
    price: "",
    details: "",
    condition: "nuevo",
    category: "",
    brand: "",
  });

  const [result, setResult] = useState<ResultData | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("ml-generation-history");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function saveToHistory(newResult: ResultData) {
    const item: HistoryItem = {
      id: Date.now(),
      product: form.product,
      createdAt: new Date().toLocaleString("es-AR"),
      result: newResult,
    };

    const updatedHistory = [item, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem("ml-generation-history", JSON.stringify(updatedHistory));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!form.product || !form.audience || !form.price || !form.details) {
      setError("Completá producto, público objetivo, precio y detalles.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ocurrió un error.");
        return;
      }

      setResult(data);
      saveToHistory(data);
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("ml-generation-history");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <section className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
        <div>
          <span className="inline-block mb-4 text-sm text-yellow-400 font-medium">
            Generador para MercadoLibre Argentina
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Creá publicaciones más precisas para vender mejor
          </h1>

          <p className="text-zinc-400 text-lg mb-8">
            Cargá los datos reales del producto y generá una publicación lista
            para usar en MercadoLibre.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
          >
            <InputField
              label="Producto"
              name="product"
              value={form.product}
              onChange={handleChange}
              placeholder="Ej: Auriculares Bluetooth"
            />

            <InputField
              label="Marca"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Ej: JBL, Samsung, Genérico"
            />

            <InputField
              label="Categoría"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ej: Tecnología, Indumentaria, Hogar"
            />

            <InputField
              label="Público objetivo"
              name="audience"
              value={form.audience}
              onChange={handleChange}
              placeholder="Ej: personas que buscan auriculares cómodos para uso diario"
            />

            <InputField
              label="Precio"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Ej: $25.000"
            />

            <div>
              <label className="block mb-2 text-sm text-zinc-300">Estado</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-4 py-3 outline-none focus:border-yellow-500"
              >
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
                <option value="reacondicionado">Reacondicionado</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-300">
                Tono de venta
              </label>
              <select
                name="tone"
                value={form.tone}
                onChange={handleChange}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-4 py-3 outline-none focus:border-yellow-500"
              >
                <option value="profesional">Profesional</option>
                <option value="directo">Directo</option>
                <option value="confiable">Confiable</option>
                <option value="premium">Premium</option>
                <option value="simple">Simple</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-300">
                Detalles reales del producto
              </label>
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="Ej: color negro, batería hasta 8 horas, incluye cable USB, buen sonido, compatible con Android y iPhone"
                rows={5}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-4 py-3 outline-none focus:border-yellow-500 resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 bg-red-950/40 border border-red-900 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black disabled:bg-yellow-900 disabled:text-zinc-300 disabled:cursor-not-allowed transition rounded-xl py-3 font-semibold"
            >
              {loading ? "Generando publicación..." : "Generar publicación"}
            </button>
          </form>

          {history.length > 0 && (
            <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Historial reciente</h2>
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Borrar
                </button>
              </div>

              <div className="space-y-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setResult(item.result)}
                    className="w-full text-left bg-zinc-950 border border-zinc-800 hover:border-yellow-500 rounded-xl p-3 transition"
                  >
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-zinc-500">{item.createdAt}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[400px]">
          {!result && (
            <div className="h-full flex items-center justify-center text-zinc-500 text-center">
              La publicación generada aparecerá acá.
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <ResultBlock title="Título SEO" content={result.titulo} />
              <ResultBlock title="Descripción" content={result.descripcion} />
              <ResultBlock
                title="Características"
                content={result.caracteristicas.map((item) => `• ${item}`).join("\n")}
              />
              <ResultBlock
                title="Beneficios"
                content={result.beneficios.map((item) => `• ${item}`).join("\n")}
              />
              <ResultBlock
                title="Información adicional"
                content={result.info_adicional}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block mb-2 text-sm text-zinc-300">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-4 py-3 outline-none focus:border-yellow-500"
      />
    </div>
  );
}

function ResultBlock({ title, content }: { title: string; content: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="border-b border-zinc-800 pb-5 last:border-b-0">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h2 className="text-sm uppercase tracking-wide text-yellow-400">
          {title}
        </h2>

        <button
          onClick={copyText}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-3 py-1 transition"
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      <p className="text-zinc-200 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}