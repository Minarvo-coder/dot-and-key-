import productsRaw from "./raw/dotandkey-products.json";

// Filter standalone products: exclude product_type "Free" and "Combo"/"combo"
export const standaloneProducts = (productsRaw?.products || [])
  .filter((p) => {
    const t = (p.product_type || "").toLowerCase().trim();
    return t !== "free" && t !== "combo";
  })
  .map((p) => {
    const variants = (p.variants || []).map((v) => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price) || 0,
      sku: v.sku,
      image: v.featured_image?.src || p.images?.[0]?.src || null,
      display: `${v.title} Rs ${Math.round(parseFloat(v.price) || 0)}`,
    }));

    return {
      id: p.id,
      handle: p.handle,
      productName: p.title,
      title: p.title,
      brand: p.vendor || "Dot & Key",
      category: p.product_type || "Skincare",
      retailPriceINR: variants[0]?.price || 0,
      variants,
      image: p.images?.[0]?.src || null,
      images: (p.images || []).map((img) => img.src),
      tags: p.tags || [],
    };
  });

// Find the hero product starting with "Dragon Fruit Bounce Gel Sunscreen SPF 50+ PA++++"
export const HERO_PRODUCT =
  standaloneProducts.find((p) =>
    (p.title || "").startsWith("Dragon Fruit Bounce Gel Sunscreen SPF 50+ PA++++")
  ) || standaloneProducts[0];

// Compute catalogue stats: count and real price range
export function getCatalogueStats() {
  const count = standaloneProducts.length;
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  standaloneProducts.forEach((p) => {
    p.variants.forEach((v) => {
      const price = v.price;
      if (price > 0) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    });
  });

  if (minPrice === Infinity) minPrice = 0;
  if (maxPrice === -Infinity) maxPrice = 0;

  return {
    count,
    minPrice,
    maxPrice,
    priceRangeFormatted: `₹${minPrice} - ₹${maxPrice}`,
  };
}
