const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers
  }
});

const number = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ ok: true, app: 'soft-wellness', time: new Date().toISOString() });
    }

    const barcodeMatch = url.pathname.match(/^\/api\/food\/(\d{8,18})$/);
    if (barcodeMatch) {
      const barcode = barcodeMatch[1];
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
          headers: {
            'user-agent': 'SoftWellness/1.0 (Cloudflare Worker; contact via project repository)',
            accept: 'application/json'
          },
          cf: { cacheTtl: 3600, cacheEverything: true }
        });

        if (!response.ok) {
          return json({ found: false, error: 'Сервис продуктов временно недоступен' }, 502);
        }

        const payload = await response.json();
        if (!payload?.product) {
          return json({ found: false, error: 'Продукт не найден' }, 404);
        }

        const product = payload.product;
        const nutrients = product.nutriments || {};
        const name = product.product_name_ru || product.product_name_uk || product.product_name || product.generic_name || `Продукт ${barcode}`;
        const calories = number(nutrients['energy-kcal_100g']) || number(nutrients.energy_100g) / 4.184;

        return json({
          found: true,
          barcode,
          product: {
            name,
            brand: product.brands || '',
            image: product.image_front_small_url || product.image_small_url || '',
            calories,
            protein: number(nutrients.proteins_100g),
            fat: number(nutrients.fat_100g),
            carbs: number(nutrients.carbohydrates_100g)
          },
          source: 'Open Food Facts'
        }, 200, { 'cache-control': 'public, max-age=3600' });
      } catch {
        return json({ found: false, error: 'Не удалось связаться с базой продуктов' }, 502);
      }
    }

    return env.ASSETS.fetch(request);
  }
};
