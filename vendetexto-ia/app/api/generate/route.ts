import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { product, audience, tone, price } = await req.json();

    if (!product || !audience || !price) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const prompt = `
Sos un experto en ventas, copywriting y publicaciones de alto rendimiento en MercadoLibre Argentina.

Tu objetivo NO es solo describir el producto, sino hacerlo irresistible para comprar.

Producto: ${product}
Público objetivo: ${audience}
Precio: ${price}
Tono: ${tone}

REGLAS:
- Escribí como un vendedor que quiere cerrar la venta.
- Enfocate en beneficios reales: qué gana el cliente.
- Usá lenguaje claro, directo y persuasivo.
- Generá confianza sin mentir.
- Usá pequeños disparadores de urgencia o valor.
- No inventes marca, modelo, stock, garantía real, envío gratis ni datos técnicos si no fueron dados.
- Si falta información técnica, usá frases generales pero útiles.
- El título debe estar optimizado para búsqueda en MercadoLibre.
- No dejes campos vacíos.

Respondé SOLO con JSON válido.
No uses markdown.
No agregues explicaciones.
No uses comillas triples.

Estructura exacta:
{
  "titulo": "",
  "descripcion": "",
  "caracteristicas": [],
  "beneficios": [],
  "info_adicional": ""
}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "Respondé únicamente con JSON válido. No incluyas texto fuera del JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al conectar con Groq" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "La IA no devolvió contenido" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Error al generar contenido con la IA" },
      { status: 500 }
    );
  }
}