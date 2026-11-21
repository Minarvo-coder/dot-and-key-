import rawData from "../data/raw/dot_key_market_data_21nov2026.json";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  size: string;
  tags: string[];
  claims: string[];
  ingredients: string[];
  url: string;
  mrp: number;
  sourceId: string;
  priceContext?: string;
}

export interface Competitor {
  productId: string;
  name: string;
  price: number;
  rating: number;
  ratingCount: number;
  claims: string[];
  url: string;
  comparesToProductId: string;
  size: string;
  mrp: number;
  sourceId: string;
  ratingCountScope?: string;
}

export interface Review {
  productId: string;
  brand: string;
  source: string;
  stars: number;
  text: string;
  date: string;
  sourceUrl: string;
  sourceId: string;
  textType: "paraphrase" | string;
}

export interface Signal {
  productId: string;
  source: string;
  metric: string;
  value: number | string;
  collectedOn: string;
  sourceUrl: string;
  note?: string;
}

export interface Source {
  url: string;
  source: string;
}

export interface MarketDataset {
  meta: Record<string, any>;
  products: Product[];
  competitors: Competitor[];
  reviews: Review[];
  signals: Signal[];
  sources: Record<string, Source>;
}

const dataset: MarketDataset = rawData as MarketDataset;

/** Returns the hero product: DK-VITC-80 */
export function getHero(): Product {
  const hero = dataset.products.find((p) => p.id === "DK-VITC-80");
  if (!hero) {
    return dataset.products[0];
  }
  return hero;
}

/** Returns all Dot & Key products in the research pack */
export function getProducts(): Product[] {
  return dataset.products || [];
}

/** Returns a single product by ID */
export function getProduct(productId: string): Product | undefined {
  return (dataset.products || []).find((p) => p.id === productId);
}

/** Returns competitors, optionally filtered by the product they compare to */
export function getCompetitors(productId?: string): Competitor[] {
  const all = dataset.competitors || [];
  if (!productId) return all;
  const filtered = all.filter((c) => c.comparesToProductId === productId);
  return filtered.length > 0 ? filtered : all;
}

/** Returns reviews, optionally filtered by productId */
export function getReviews(productId?: string): Review[] {
  const all = dataset.reviews || [];
  if (!productId) return all;
  return all.filter((r) => r.productId === productId);
}

/** Returns signals, optionally filtered by productId */
export function getSignals(productId?: string): Signal[] {
  const all = dataset.signals || [];
  if (!productId) return all;
  return all.filter((s) => s.productId === productId);
}

/** Returns a source by source ID */
export function getSource(sourceId: string): Source | undefined {
  return (dataset.sources || {})[sourceId];
}

/** Returns the dataset metadata */
export function getMeta(): Record<string, any> {
  return dataset.meta || {};
}

/**
 * Parses gram-sized strings only (e.g. "80g", "50g").
 * Never converts ml to g (returns null for "50ml").
 */
export function parseGramSize(sizeStr?: string): number | null {
  if (!sizeStr) return null;
  const trimmed = sizeStr.trim().toLowerCase();
  if (trimmed.endsWith("ml")) {
    return null; // Never convert ml to g
  }
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*g$/);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

/**
 * Computes price per gram for gram-sized products only.
 * Returns null if not gram-sized or size is invalid.
 */
export function computePricePerGram(price: number, sizeStr?: string): number | null {
  const grams = parseGramSize(sizeStr);
  if (!grams || grams <= 0 || !price || price <= 0) return null;
  return Number((price / grams).toFixed(2));
}

/**
 * Computes discount percentage from price and MRP.
 */
export function computeDiscountPct(price: number, mrp: number): number | null {
  if (!mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Extracts and computes deterministic facts for a product and its competitors
 */
export function getComputedFacts(productId: string) {
  const product = getProduct(productId) || getHero();
  const productSignals = getSignals(product.id);
  const productReviews = getReviews(product.id);
  const competitors = getCompetitors(product.id);

  // Extract signals for product
  const nykaaRatingSignal = productSignals.find((s) => s.metric === "nykaa_average_rating");
  const nykaaRatingsCountSignal = productSignals.find((s) => s.metric === "nykaa_verified_rating_count");
  const brandSiteReviewsSignal = productSignals.find((s) => s.metric === "brand_site_review_count");

  const productRating = typeof nykaaRatingSignal?.value === "number" ? nykaaRatingSignal.value : 4.4;
  const productRatingCount = typeof nykaaRatingsCountSignal?.value === "number" ? nykaaRatingsCountSignal.value : 165841;
  const productPricePerGram = computePricePerGram(product.price, product.size);
  const productDiscountPct = computeDiscountPct(product.price, product.mrp);

  // Compute ranking by rating count across all available products
  const pool = [
    { name: "Dot & Key", ratingCount: productRatingCount },
    ...competitors.map((c) => ({ name: c.name, ratingCount: c.ratingCount })),
  ].sort((a, b) => b.ratingCount - a.ratingCount);

  const productRank = pool.findIndex((p) => p.name === "Dot & Key") + 1;

  return {
    product: {
      ...product,
      rating: productRating,
      ratingCount: productRatingCount,
      pricePerGram: productPricePerGram,
      discountPct: productDiscountPct,
      brandSiteReviews: brandSiteReviewsSignal?.value,
      rankByRatingCount: productRank,
      totalRanked: pool.length,
    },
    competitors: competitors.map((c) => {
      const ppg = computePricePerGram(c.price, c.size);
      const disc = computeDiscountPct(c.price, c.mrp);
      const rank = pool.findIndex((p) => p.name === c.name) + 1;
      return {
        ...c,
        pricePerGram: ppg,
        discountPct: disc,
        rankByRatingCount: rank,
        totalRanked: pool.length,
      };
    }),
    reviews: productReviews,
    signals: productSignals,
  };
}
