import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      product,
      audience,
      tone,
      price,
      details,
      condition,
      category,
      brand,
    } = await req.json();

    if (!product || !audience || !price || !details) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const prompt = `
Sos un experto en ventas, SEO y publicaciones de alto rendimiento en MercadoLibre Argentina.

Generá una publicación optimizada para vender este producto en MercadoLibre Argentina.

DATOS DEL PRODUCTO:
Producto: ${product}
Marca: ${brand || "No especificada"}
Categoría: ${category || "No especificada"}
Estado: ${condition || "No especificado"}
Público objetivo: ${audience}
Precio: ${price}
Tono: ${tone}
Detalles reales del producto: ${details}

OBJETIVO:
Crear una publicación clara, confiable y orientada a venta.

REGLAS:
- Usá español argentino natural.
- El título debe estar optimizado para búsqueda en MercadoLibre.
- No inventes marca, modelo, garantía, stock, envío gratis, cuotas ni datos técnicos.
- Usá únicamente la información dada.
- Si falta información, redactá de forma general pero profesional.
- Las características deben ser concretas.
- Los beneficios deben explicar por qué conviene comprarlo.
- La descripción debe generar confianza y deseo de compra.
- No dejes campos vacíos.

Respondé SOLO con JSON válido.
No uses markdown.
No agregues explicaciones.

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
          temperature: 0.6,
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