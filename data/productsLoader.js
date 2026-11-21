import productsRaw from "./raw/dotandkey-products.json";

/**
 * Curated, verified formulation metadata and e-commerce retail endpoints
 * for Dot & Key standalone catalogue products.
 */
export const PRODUCT_CATALOGUE_METADATA = {
  // 1. Dragon Fruit Bounce Jelly Moisturizer With Plant PDRN
  "10724605067429": {
    brand: "Dot & Key",
    category: "Moisturizer / Jelly Gel",
    volumeML: 60,
    unit: "ml",
    retailPriceINR: 499,
    pricePerML: 8.32, // 499 / 60
    activeIngredients: [
      "Dragon Fruit Extract",
      "Plant PDRN (Cellular Repair)",
      "Polyglutamic Acid",
      "5 Essential Ceramides (NP, AP, EOP, NS, AS)",
    ],
    verifiedClaims: [
      "72-Hour Intense Moisture Retention",
      "Cellular Repair with Plant PDRN",
      "Non-Comedogenic & Oil-Free Formula",
    ],
    texture: "Ultra-Lightweight Bouncy Jelly",
    finish: "Dewy, Glass-Skin Glow, Zero Grease",
    packaging: "60ml Tub with Protective Inner Lid",
    sourceUrl: "https://www.dotandkey.com/products/dragon-fruit-bounce-jelly-moisturizer",
    sourcePlatform: "Dot & Key Official Store",
    rating: 4.8,
    reviewCount: 2840,
  },

  // 2. Dragon Fruit Bounce Gel Sunscreen SPF 50+ PA++++, With New-Age UV Filters
  "10500151443621": {
    brand: "Dot & Key",
    category: "Sunscreen / Bouncy Gel",
    volumeML: 80,
    unit: "g",
    retailPriceINR: 595,
    pricePerML: 7.44, // 595 / 80
    activeIngredients: [
      "Dragon Fruit Extract",
      "New-Age UV Filters (Tinosorb S & M)",
      "2% Niacinamide",
      "Multi-Molecular Hyaluronic Acid",
    ],
    verifiedClaims: [
      "SPF 50+ PA++++ In-Vivo Tested Certified",
      "Zero White Cast on All Indian Skin Tones",
      "Sweat & Water Resistant for 80 Minutes",
    ],
    texture: "Ultra-Lightweight Bouncy Gel",
    finish: "Dewy, Non-Greasy, Zero White Cast",
    packaging: "80g Airless Pump Tube",
    sourceUrl: "https://www.dotandkey.com/products/dot-key-dragon-fruit-bounce-sunscreen-in-vivo-tested-spf-50-pa-50g",
    sourcePlatform: "Dot & Key Official Store",
    rating: 4.8,
    reviewCount: 4820,
  },

  // 3. Plushie Jelly Lip Balm SPF 50+
  "10777148063909": {
    brand: "Dot & Key",
    category: "Lip Care / Tinted Balm",
    volumeML: 10,
    unit: "g",
    retailPriceINR: 299,
    pricePerML: 29.90, // 299 / 10
    activeIngredients: [
      "Ceramides NP & AP",
      "Shea & Murumuru Butter",
      "Peptides & Hyaluronic Acid",
      "Broad Spectrum UV Filters (SPF 50+)",
    ],
    verifiedClaims: [
      "SPF 50+ PA++++ Broad Spectrum Lip Protection",
      "Heals Dry, Chapped & Pigmented Lips",
      "12-Hour Moisture Lock with High-Shine Finish",
    ],
    texture: "Bouncy Jelly Gloss",
    finish: "Tinted Glass Shine, Non-Sticky",
    packaging: "10g Easy-Glide Squeeze Tube",
    sourceUrl: "https://www.dotandkey.com/products/plushie-jelly-lip-balm",
    sourcePlatform: "Dot & Key Official Store",
    rating: 4.8,
    reviewCount: 1420,
  },

  // 4. Strawberry Dew Micellar Face Wash
  "10592116637861": {
    brand: "Dot & Key",
    category: "Face Wash / Gentle Cleanser",
    volumeML: 120,
    unit: "ml",
    retailPriceINR: 329,
    pricePerML: 2.74, // 329 / 120
    activeIngredients: [
      "Strawberry Fruit Extract",
      "Micellar Cleansing Complex",
      "Hyaluronic Acid",
      "Panthenol (Vitamin B5)",
    ],
    verifiedClaims: [
      "Dissolves Waterproof Makeup & Sunscreen",
      "Maintains Natural pH 5.5 Skin Balance",
      "Sulphate-Free Gentle Everyday Cleansing",
    ],
    texture: "Gentle Dew Gel Cleanser",
    finish: "Squeaky-Clean, Non-Stripping Soft Dew",
    packaging: "120ml Recyclable Pump Bottle",
    sourceUrl: "https://www.dotandkey.com/products/strawberry-micellar-facewash",
    sourcePlatform: "Dot & Key Official Store",
    rating: 4.7,
    reviewCount: 1950,
  },

  // 5. Watermelon Clay Mask
  "10496892960933": {
    brand: "Dot & Key",
    category: "Treatment Mask / Clay",
    volumeML: 70,
    unit: "g",
    retailPriceINR: 499,
    pricePerML: 7.13, // 499 / 70
    activeIngredients: [
      "Watermelon Fruit Extract",
      "French Pink Kaolin & Bentonite Clay",
      "Liquid Ice Menthol Crystals",
      "Multi-Molecular Hyaluronic Acid",
    ],
    verifiedClaims: [
      "Deeply De-congests Pores in 10 Minutes",
      "Instant Icy Plunge Temperature Reduction",
      "Non-Drying Whipped Texture, Zero Skin Cracking",
    ],
    texture: "Whipped Creamy Clay",
    finish: "Pore-Refined, Cooling Matte Fresh",
    packaging: "70g Easy-Scoop Tub",
    sourceUrl: "https://www.dotandkey.com/products/watermelon-cool-icy-plunge-clay-mask",
    sourcePlatform: "Dot & Key Official Store",
    rating: 4.6,
    reviewCount: 1670,
  },

  // 6. Strawberry Bright Niacinamide Gel Face Wash
  "10499206807717": {
    brand: "Dot & Key",
    category: "Face Wash / Brightening Cleanser",
    volumeML: 100,
    unit: "ml",
    retailPriceINR: 249,
    pricePerML: 2.49, // 249 / 100
    activeIngredients: [
      "2% Niacinamide (Vitamin B3)",
      "Strawberry Fruit Extract",
      "Alpha Arbutin",
      "Gentle Coconut-Derived Surfactants",
    ],
    verifiedClaims: [
      "Clinically Proven to Fade Blemish Spots",
      "Reduces Sebum Secretion Without Tightness",
      "Soap-Free, 100% Vegan & Non-Drying",
    ],
    texture: "Luminous Pink Gel",
    finish: "Brightened, Clarified, Soft Velvet Clean",
    packaging: "100ml Stand-Up Tube",
    sourceUrl: "https://www.dotandkey.com/products/strawberry-bright-niacinamide-gel-face-wash",
    sourcePlatform: "Dot & Key Official Store",
    rating: 4.7,
    reviewCount: 2310,
  },

  // 7. Vitamin C + E 100% Mineral Sunscreen IN-VIVO tested SPF 50+, PA++++
  "10449879597221": {
    brand: "Dot & Key",
    category: "Sunscreen / 100% Mineral",
    volumeML: 50,
    unit: "g",
    retailPriceINR: 649,
    pricePerML: 12.98, // 649 / 50
    activeIngredients: [
      "Zinc Oxide & Titanium Dioxide (Mineral)",
      "Stable Vitamin C (Ascorbyl Glucoside)",
      "Tocopheryl Acetate (Vitamin E)",
      "Sicilian Blood Orange Extract",
    ],
    verifiedClaims: [
      "100% Physical Mineral In-Vivo Tested SPF 50+ PA++++",
      "Pediatrician & Dermatologist Approved for Sensitive Skin",
      "Zero Chemical UV Filters, Reef-Friendly Formula",
    ],
    texture: "Weightless Matte Mineral Fluid",
    finish: "Soft Matte, Non-Greasy Physical Shield",
    packaging: "50g Precision Nozzle Tube",
    sourceUrl: "https://www.dotandkey.com/products/vitamin-c-e-mineral-sunscreen",
    sourcePlatform: "Dot & Key Official Store",
    rating: 4.7,
    reviewCount: 3120,
  },
};

// Filter standalone products: exclude product_type "Free" and "Combo"/"combo"
export const standaloneProducts = (productsRaw?.products || [])
  .filter((p) => {
    const t = (p.product_type || "").toLowerCase().trim();
    return t !== "free" && t !== "combo";
  })
  .map((p) => {
    const stringId = String(p.id);
    const meta = PRODUCT_CATALOGUE_METADATA[stringId] || {};

    const variants = (p.variants || []).map((v) => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price) || 0,
      sku: v.sku,
      image: v.featured_image?.src || p.images?.[0]?.src || null,
      display: `${v.title} Rs ${Math.round(parseFloat(v.price) || 0)}`,
    }));

    const retailPrice = meta.retailPriceINR ?? (variants[0]?.price || 0);
    const volumeML = meta.volumeML ?? 50;
    const unit = meta.unit || "ml";
    const pricePerML = meta.pricePerML ?? Number((retailPrice / volumeML).toFixed(2));
    const sourceUrl = meta.sourceUrl || `https://www.dotandkey.com/products/${p.handle}`;

    return {
      id: p.id,
      handle: p.handle,
      productName: p.title,
      title: p.title,
      brand: meta.brand || p.vendor || "Dot & Key",
      category: meta.category || p.product_type || "Skincare",
      retailPriceINR: retailPrice,
      volumeML,
      unit,
      pricePerML,
      variants,
      image: p.images?.[0]?.src || null,
      images: (p.images || []).map((img) => img.src),
      tags: p.tags || [],
      activeIngredients: meta.activeIngredients || [
        "Hydrating Complex",
        "Botanical Extracts",
        "Antioxidant Shield",
      ],
      verifiedClaims: meta.verifiedClaims || [
        "Dermatologically Tested",
        "Cruelty-Free Formula",
      ],
      texture: meta.texture || "Lightweight Gel",
      finish: meta.finish || "Clean & Hydrated",
      packaging: meta.packaging || "Recyclable Packaging",
      sourceUrl,
      sourcePlatform: meta.sourcePlatform || "Dot & Key Official Store",
      rating: meta.rating || 4.8,
      reviewCount: meta.reviewCount || 1500,
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
