import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { product, audience, tone, price } = await req.json();

    if (!product || !audience || !tone || !price) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const prompt = `
Sos un experto en ventas, marketing digital y copywriting para negocios de Argentina.

Generá contenido para vender este producto:

Producto: ${product}
Público objetivo: ${audience}
Precio: ${price}
Tono: ${tone}

REGLAS IMPORTANTES:
- Usá español argentino natural.
- No uses "quieres", usá "querés".
- No inventes links, URLs, números de WhatsApp ni redes sociales.
- No dejes campos vacíos.
- El texto de Instagram debe parecer una publicación real.
- El mensaje de WhatsApp debe parecer un mensaje real para enviarle a un cliente.
- Los hashtags deben empezar con #.
- El precio debe aparecer de forma natural cuando tenga sentido.

Respondé SOLO con JSON válido.
No agregues explicaciones.
No uses markdown.
No uses comillas triples.

Estructura exacta:

{
  "titulo": "",
  "descripcion_corta": "",
  "descripcion_larga": "",
  "texto_instagram": "",
  "mensaje_whatsapp": "",
  "hashtags": []
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