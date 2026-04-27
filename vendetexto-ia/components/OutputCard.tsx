"use client";

export default function OutputCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert("Copiado!");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        <button
          onClick={handleCopy}
          className="text-sm bg-black text-white px-3 py-1 rounded-lg"
        >
          Copiar
        </button>
      </div>

      <p className="text-sm whitespace-pre-line">{content}</p>
    </div>
  );
}