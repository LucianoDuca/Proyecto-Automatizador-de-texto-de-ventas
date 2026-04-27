type GeneratorData = {
  product: string;
  audience: string;
  tone: string;
  price: string;
};

export function generateContent(data: GeneratorData) {
  const { product, audience, tone, price } = data;

  const tones = {
    profesional: {
      title: "Calidad, confianza y buen precio",
      intro: "Una opción práctica y confiable",
      cta: "Consultá disponibilidad hoy mismo.",
    },
    juvenil: {
      title: "Estilo, onda y precio increíble",
      intro: "Ideal para destacar y comprar sin vueltas",
      cta: "Mandanos mensaje y te pasamos más info.",
    },
    urgente: {
      title: "Oferta por tiempo limitado",
      intro: "Stock limitado disponible ahora",
      cta: "Reservá antes de que se agote.",
    },
  };

  const selectedTone = tones[tone as keyof typeof tones] ?? tones.profesional;

  return {
    title: `${product} para ${audience} - ${selectedTone.title}`,

    shortDesc: `🔥 ${selectedTone.intro}: ${product} pensado para ${audience}. Precio: ${price}. ${selectedTone.cta}`,

    longDesc: `${product}

${selectedTone.intro} para ${audience}.

✅ Excelente relación precio-calidad
✅ Atención personalizada
✅ Producto listo para entregar
✅ Precio: ${price}

${selectedTone.cta}`,

    instagram: `✨ ${product}

${selectedTone.intro} para ${audience}.

💰 Precio: ${price}
📦 Consultá envíos y disponibilidad

${selectedTone.cta}

#venta #emprendedores #oferta #argentina #compraya`,

    whatsapp: `Hola! 👋 Sí, tenemos ${product} disponible.

Es ideal para ${audience}.
Precio: ${price}.

${selectedTone.cta}`,

    hashtags: `#venta #emprendedores #oferta #argentina #compraya`,
  };
}