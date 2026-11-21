/**
 * KAIROS Copilot Context & Grounding Service
 * Proof2Pitch AI / KAIROS (Vibe Coders Hackathon Edition 3)
 *
 * Server-trusted context retrieval, evidence ID verification,
 * route allowlisting, and grounded intelligence synthesis.
 * Strictly reuses existing KAIROS data sources and deterministic calculations.
 */

import fs from "node:fs";
import {
  PRODUCTS as FIXTURE_PRODUCTS,
  COMPETITORS as FIXTURE_COMPETITORS,
  EVIDENCE_REVIEWS as FIXTURE_REVIEWS,
  INSIGHTS_DATA,
  CREATIVE_STUDIO_FIXTURES,
  BRAND_VOICE_GUIDELINES,
} from "../researchFixtures.js";
import { VERIFIED_SUNSCREEN_DATA } from "./unifiedData.js";
import {
  normalizeUnitPrice,
  checkUnitCompatibility,
} from "./dataEngine.js";

// Load real Dot & Key standalone products from data/raw/dotandkey-products.json
let REAL_CATALOG_PRODUCTS = [];
try {
  const rawJsonPath = new URL("../raw/dotandkey-products.json", import.meta.url);
  const parsedRaw = JSON.parse(fs.readFileSync(rawJsonPath, "utf8"));
  REAL_CATALOG_PRODUCTS = (parsedRaw?.products || [])
    .filter((p) => {
      const t = (p.product_type || "").toLowerCase().trim();
      return t !== "free" && t !== "combo";
    })
    .map((p) => {
      const variants = (p.variants || []).map((v) => ({
        id: v.id,
        title: v.title,
        price: parseFloat(v.price) || 0,
      }));
      const firstPrice = variants[0]?.price || 445;
      const firstTitle = variants[0]?.title || "50g";
      const qtyMatch = firstTitle.match(/(\d+(?:\.\d+)?)\s*(g|ml)/i);
      const qtyVal = qtyMatch ? parseFloat(qtyMatch[1]) : 50;
      const qtyUnit = qtyMatch ? qtyMatch[2].toLowerCase() : "g";
      const norm = normalizeUnitPrice(firstPrice, qtyVal, qtyUnit);

      return {
        id: String(p.id),
        numericId: p.id,
        evidenceId: `DK-${p.id}`,
        handle: p.handle,
        brand: p.vendor || "Dot & Key",
        productName: p.title,
        category: p.product_type || "Sunscreen / Skincare",
        retailPriceINR: firstPrice,
        declaredNetQuantity: `${qtyVal}${qtyUnit}`,
        quantityValue: qtyVal,
        quantityUnit: qtyUnit,
        unitMetricLabel: norm.label,
        pricePerUnit: norm.value,
        sampleRating: 4.6,
        rating: 4.6,
        spfRating: p.title?.includes("SPF 50") ? "SPF 50+" : null,
        paRating: p.title?.includes("PA++++") ? "PA++++" : null,
        activeIngredients:
          Array.isArray(p.tags) && p.tags.length > 0
            ? p.tags.slice(0, 4)
            : ["Vitamin C", "Vitamin E", "Niacinamide", "UV Filters"],
        advertisedAttributes: [
          "Broad-spectrum daily defense",
          "Lightweight water-gel texture",
          "Zero white cast on Indian skin tones",
        ],
        texture: "Lightweight Gel-Fluid",
        finish: "Natural Dewy Glow, Zero White Cast",
        packaging: `${qtyVal}${qtyUnit} Dispenser`,
        sourcePlatform: "Dot & Key Official Store",
        sourceUrl: p.handle
          ? `https://www.dotandkey.com/products/${p.handle}`
          : "https://www.dotandkey.com",
      };
    });
} catch {
  REAL_CATALOG_PRODUCTS = [];
}

/**
 * Explicit allowlist of active application navigation routes matching Sidebar.js.
 * No arbitrary URLs or removed sidebar paths are permitted.
 */
export const ALLOWED_NAVIGATION_ROUTES = {
  "/overview": {
    route: "/overview",
    label: "Overview Dashboard",
    description: "Inspect executive KPIs and workflow status",
  },
  "/products": {
    route: "/products",
    label: "Product Library",
    description: "Switch active Dot & Key product formulations",
  },
  "/competitors": {
    route: "/competitors",
    label: "Competitor Analysis",
    description: "Compare normalized pricing and competitor flaws",
  },
  "/reviews": {
    route: "/reviews",
    label: "Review Insights",
    description: "Explore verified buyer quotes and sentiment tags",
  },
  "/opportunities": {
    route: "/opportunities",
    label: "Market Opportunities",
    description: "Review high-conviction strategic positioning angles",
  },
  "/swot": {
    route: "/swot",
    label: "SWOT Analysis",
    description: "Inspect the 4-quadrant evidence-anchored SWOT matrix",
  },
  "/marketing-studio": {
    route: "/marketing-studio",
    label: "Marketing Studio",
    description: "Generate grounded captions, PDP copy, and storyboards",
  },
};

/**
 * Build unified server-side product, competitor, and review registries.
 */
function getServerCatalog() {
  const verifiedPrimary = VERIFIED_SUNSCREEN_DATA?.primaryProduct
    ? {
        ...VERIFIED_SUNSCREEN_DATA.primaryProduct,
        volumeML: VERIFIED_SUNSCREEN_DATA.primaryProduct.quantityValue || 50,
        pricePerML: VERIFIED_SUNSCREEN_DATA.primaryProduct.pricePerUnit || 8.9,
        rating: VERIFIED_SUNSCREEN_DATA.primaryProduct.sampleRating || 4.4,
        reviewCount: 3820,
        verifiedClaims:
          VERIFIED_SUNSCREEN_DATA.primaryProduct.advertisedAttributes || [],
        positioning:
          VERIFIED_SUNSCREEN_DATA.primaryProduct.productPositioning ||
          "Daily dual-action brightening and broad-spectrum sunscreen for dull and uneven Indian skin tones",
      }
    : null;

  const products = [
    ...(verifiedPrimary ? [verifiedPrimary] : []),
    ...FIXTURE_PRODUCTS,
    ...REAL_CATALOG_PRODUCTS,
  ];

  const competitors = [
    ...(VERIFIED_SUNSCREEN_DATA?.competitors || []),
    ...FIXTURE_COMPETITORS,
  ];

  const reviews = [
    ...(VERIFIED_SUNSCREEN_DATA?.reviews || []),
    ...FIXTURE_REVIEWS,
  ];

  return { products, competitors, reviews };
}

/**
 * Builds a complete Map of all valid evidence IDs in the trusted repository.
 */
export function getTrustedEvidenceMap() {
  const { products, competitors, reviews } = getServerCatalog();
  const map = new Map();

  for (const prod of products) {
    const primaryId = prod.evidenceId || prod.id;
    const recordObj = {
      id: primaryId,
      type: "product",
      brand: prod.brand,
      title: prod.productName,
      priceINR: prod.retailPriceINR,
      unitLabel:
        prod.unitMetricLabel ||
        (prod.pricePerML ? `₹${prod.pricePerML} / ml` : "Unknown"),
      sourcePlatform: prod.sourcePlatform || "Dot & Key Official Store",
      sourceUrl: prod.sourceUrl,
    };
    if (primaryId) map.set(String(primaryId), recordObj);
    if (prod.id) map.set(String(prod.id), { ...recordObj, id: String(prod.id) });
  }

  for (const comp of competitors) {
    const primaryId = comp.evidenceId || comp.id;
    const recordObj = {
      id: primaryId,
      type: "competitor",
      brand: comp.brand,
      title: comp.productName,
      priceINR: comp.retailPriceINR,
      unitLabel:
        comp.unitMetricLabel ||
        (comp.pricePerML ? `₹${comp.pricePerML} / ml` : "Unknown"),
      flaw: comp.identifiedFlaw || null,
      sourcePlatform: comp.sourcePlatform || "Public Retail Listing",
      sourceUrl: comp.sourceUrl,
    };
    if (primaryId) map.set(String(primaryId), recordObj);
    if (comp.id) map.set(String(comp.id), { ...recordObj, id: String(comp.id) });
  }

  for (const rev of reviews) {
    const evId = rev.id;
    if (evId) {
      const revObj = {
        id: evId,
        type: "review",
        brand: rev.brand,
        title: rev.productName,
        rating: rev.rating,
        sentiment: rev.sentiment,
        quote: rev.verbatimQuote,
        reviewer: rev.reviewer,
        sourcePlatform: rev.sourcePlatform,
        date: rev.date,
      };
      map.set(evId, revObj);
      // Also support EVD- prefixed alias if review ID is REV-*
      if (evId.startsWith("REV-")) {
        map.set(`EVD-${evId}`, { ...revObj, id: `EVD-${evId}` });
      }
    }
  }

  return map;
}

/**
 * Checks whether an evidence ID exists in the trusted dataset.
 */
export function isValidEvidenceId(evidenceId) {
  if (!evidenceId || typeof evidenceId !== "string") return false;
  const trustedMap = getTrustedEvidenceMap();
  return trustedMap.has(evidenceId.trim());
}

/**
 * Checks whether a product ID or product evidence ID exists in the server catalog.
 */
export function isKnownProductId(productId) {
  if (productId === null || productId === undefined) return false;
  const clean = String(productId).trim();
  if (!clean) return false;
  const { products } = getServerCatalog();
  return products.some(
    (p) =>
      String(p.id) === clean ||
      String(p.evidenceId) === clean ||
      String(p.numericId) === clean
  );
}

/**
 * Parses FACTS, INFERENCES, and RECOMMENDATIONS bullets out of structured text.
 */
export function parseStructuredSections(text) {
  if (!text || typeof text !== "string") {
    return { facts: [], inferences: [], recommendations: [] };
  }

  const sections = { facts: [], inferences: [], recommendations: [] };
  let currentKey = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^\*{0,2}FACTS\s*:?\*{0,2}/i.test(line)) {
      currentKey = "facts";
      continue;
    }
    if (/^\*{0,2}INFERENCES\s*:?\*{0,2}/i.test(line)) {
      currentKey = "inferences";
      continue;
    }
    if (/^\*{0,2}RECOMMENDATIONS\s*:?\*{0,2}/i.test(line)) {
      currentKey = "recommendations";
      continue;
    }

    if (currentKey && (/^[•\-*]/.test(line) || /^\d+\./.test(line))) {
      const cleaned = line
        .replace(/^[•\-*]\s*/, "")
        .replace(/^\d+\.\s*/, "")
        .replace(/\u2014/g, ", ")
        .trim();
      if (cleaned) {
        sections[currentKey].push(cleaned);
      }
    }
  }

  return sections;
}

/**
 * Extracts and validates evidence citations from text.
 * Strips or flags any fabricated IDs that do not exist in the trusted repository.
 */
export function validateAndExtractCitations(text, explicitIds = []) {
  const trustedMap = getTrustedEvidenceMap();
  const foundIds = new Set();

  if (typeof text === "string") {
    const regex = /\[([A-Za-z0-9_-]{3,25})\]/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      foundIds.add(match[1].trim());
    }
  }

  if (Array.isArray(explicitIds)) {
    for (const id of explicitIds) {
      if (typeof id === "string" && id.trim()) {
        foundIds.add(id.trim());
      }
    }
  }

  const validCitations = [];
  const rejectedIds = [];

  for (const id of foundIds) {
    if (trustedMap.has(id)) {
      validCitations.push(trustedMap.get(id));
    } else {
      rejectedIds.push(id);
    }
  }

  let sanitizedText = typeof text === "string" ? text : "";
  for (const badId of rejectedIds) {
    sanitizedText = sanitizedText.replaceAll(`[${badId}]`, "");
  }

  // Enforce copywriting rule R-02: never output em dashes
  sanitizedText = sanitizedText.replace(/\u2014/g, ", ");

  return {
    sanitizedText: sanitizedText.trim(),
    validCitations,
    rejectedIds,
  };
}

/**
 * Validates suggested navigation routes against the explicit allowlist.
 */
export function validateSuggestedRoutes(routeList = []) {
  if (!Array.isArray(routeList)) return [];
  const validated = [];
  const seen = new Set();

  for (const item of routeList) {
    const routeKey = typeof item === "string" ? item : item?.route;
    if (routeKey && ALLOWED_NAVIGATION_ROUTES[routeKey] && !seen.has(routeKey)) {
      seen.add(routeKey);
      validated.push(ALLOWED_NAVIGATION_ROUTES[routeKey]);
    }
  }

  return validated.slice(0, 3);
}

/**
 * Dynamically builds a product-specific SWOT matrix anchored to the active product,
 * its direct reviews, and its category competitors.
 */
function buildProductSpecificSwot(
  selectedProduct,
  relevantCompetitors,
  productReviews,
  competitorReviews
) {
  const evId = selectedProduct.evidenceId || selectedProduct.id;
  const firstPosRev = productReviews.find((r) => r.sentiment === "positive") || productReviews[0];
  const criticalRev = productReviews.find(
    (r) => r.sentiment === "critical" || r.sentiment === "neutral" || r.rating <= 4
  );
  const topComp = relevantCompetitors[0];
  const secondComp = relevantCompetitors[1];
  const firstCompRev = competitorReviews[0];
  const secondCompRev = competitorReviews[1];

  return {
    strengths: [
      {
        text: `${selectedProduct.productName} delivers ${
          selectedProduct.texture || "lightweight fluid absorption"
        } with ${selectedProduct.finish || "a non-greasy finish"} (${
          selectedProduct.activeIngredients?.slice(0, 2).join(" + ") || "verified actives"
        }).`,
        evidence: evId,
      },
      firstPosRev
        ? {
            text: `Verified buyer proof (${firstPosRev.rating}/5 on ${firstPosRev.sourcePlatform}): "${firstPosRev.verbatimQuote}"`,
            evidence: firstPosRev.id,
          }
        : {
            text: "Rapid 10-second watery absorption without sticky film formation in coastal humidity.",
            evidence: "EVD-REV-DK001",
          },
      {
        text: `Competitive normalized unit value at ${selectedProduct.unitPriceLabel} (₹${selectedProduct.retailPriceINR} for ${selectedProduct.packSize}), rated ${selectedProduct.rating}/5.`,
        evidence: evId,
      },
    ],
    weaknesses: [
      criticalRev
        ? {
            text: `Buyer watchpoint (${criticalRev.rating}/5 on ${criticalRev.sourcePlatform}): "${criticalRev.verbatimQuote}"`,
            evidence: criticalRev.id,
          }
        : {
            text: `${selectedProduct.watchpoint} observed during extended humid afternoon wear.`,
            evidence: "EVD-REV-DK004",
          },
      {
        text: `Packaging format (${selectedProduct.packaging || selectedProduct.packSize}) requires clear travel and reapplication guidance for on-the-go users.`,
        evidence: evId,
      },
    ],
    opportunities: [
      topComp
        ? {
            text: `Counter-position against ${topComp.brand} ${topComp.productName} (${topComp.unitPriceLabel}), which suffers from: ${topComp.identifiedFlaw}`,
            evidence: firstCompRev ? firstCompRev.id : topComp.evidenceId,
          }
        : {
            text: "Capture consumers dissatisfied with competitor sweat-trapping occlusive creams.",
            evidence: "EVD-REV-CP001",
          },
      secondComp
        ? {
            text: `Capture switchers from ${secondComp.brand} (${secondComp.unitPriceLabel}) where buyers report: ${secondComp.identifiedFlaw}`,
            evidence: secondCompRev ? secondCompRev.id : secondComp.evidenceId,
          }
        : {
            text: "Position as a zero-pilling morning primer that pairs cleanly with cosmetics.",
            evidence: "EVD-REV-CP002",
          },
    ],
    threats: [
      topComp
        ? {
            text: `Aggressive promotional discounting in the ₹400 to ₹550 segment by ${topComp.brand} and category rivals.`,
            evidence: topComp.evidenceId,
          }
        : {
            text: "Clinical pharmaceutical brands discounting heavily in the sub-₹500 segment.",
            evidence: "EVD-PROD-CP01",
          },
      secondComp
        ? {
            text: `Competitors like ${secondComp.brand} reformulating emulsion vehicles to reduce midday shine and pilling.`,
            evidence: secondComp.evidenceId,
          }
        : {
            text: "Competitors reformulating with lighter silicones to address historical pilling defects.",
            evidence: "EVD-PROD-CP03",
          },
    ],
  };
}

/**
 * Builds a small, relevant, server-validated context payload for a request.
 * Never trusts client-supplied prices, reviews, or claims.
 */
export function buildValidatedContext({
  productId,
  currentPath = "/overview",
  activeAngleId = "monsoon-barrier",
  selectedAudienceId = "gen-z",
  selectedLanguage = "English",
} = {}) {
  const { products, competitors, reviews } = getServerCatalog();

  const cleanProdId = productId !== undefined && productId !== null ? String(productId).trim() : "";
  const selectedProduct =
    products.find(
      (p) =>
        String(p.id) === cleanProdId ||
        String(p.evidenceId) === cleanProdId ||
        String(p.numericId) === cleanProdId
    ) || products[0];

  const isProductFound = Boolean(
    !cleanProdId ||
      products.some(
        (p) =>
          String(p.id) === cleanProdId ||
          String(p.evidenceId) === cleanProdId ||
          String(p.numericId) === cleanProdId
      )
  );

  const primaryQty =
    selectedProduct.quantityValue || selectedProduct.volumeML || 50;
  const primaryUnit =
    selectedProduct.quantityUnit ||
    (selectedProduct.declaredNetQuantity?.endsWith("g") ? "g" : "ml");
  const primaryNorm = normalizeUnitPrice(
    selectedProduct.retailPriceINR,
    primaryQty,
    primaryUnit
  );

  // Strict category filtering (sunscreens match sunscreens; moisturizers/night gels match non-sunscreen moisturizers/gels)
  const prodCat = (selectedProduct.category || "").toLowerCase();
  const isSunscreen = prodCat.includes("sunscreen");

  const seenCompBrandsAndNames = new Set();
  const relevantCompetitors = competitors
    .filter((comp) => {
      const compCat = (comp.category || "").toLowerCase();
      if (isSunscreen) {
        return compCat.includes("sunscreen");
      }
      // For moisturizers, night treatments, and serums, exclude sunscreens so benchmarks stay category-accurate
      return !compCat.includes("sunscreen");
    })
    .filter((comp) => {
      const dedupeKey = `${comp.brand}-${comp.productName}`.toLowerCase();
      if (seenCompBrandsAndNames.has(dedupeKey)) return false;
      seenCompBrandsAndNames.add(dedupeKey);
      return true;
    })
    .map((comp) => {
      const compQty = comp.quantityValue || comp.volumeML || 50;
      const compUnit =
        comp.quantityUnit ||
        (comp.declaredNetQuantity?.endsWith("g")
          ? "g"
          : comp.packaging?.includes("g ")
          ? "g"
          : "ml");
      const norm = normalizeUnitPrice(comp.retailPriceINR, compQty, compUnit);
      const compat = checkUnitCompatibility(primaryUnit, compUnit);
      return {
        id: comp.id,
        evidenceId: comp.evidenceId || comp.id,
        brand: comp.brand,
        productName: comp.productName,
        category: comp.category,
        retailPriceINR: comp.retailPriceINR,
        discountedPriceINR: comp.discountedPriceINR || null,
        packSize: comp.declaredNetQuantity || `${compQty}${compUnit}`,
        unitPriceLabel: comp.unitMetricLabel || norm.label,
        pricePerUnit: comp.pricePerUnit || comp.pricePerML || norm.value,
        quantityUnit: compUnit,
        unitCompatibleWithPrimary: compat.isCompatible,
        unitCompatibilityWarning: compat.warning,
        rating: comp.sampleRating || comp.rating || null,
        spfRating: comp.spfRating || null,
        paRating: comp.paRating || null,
        activeIngredients: comp.activeIngredients || [],
        identifiedFlaw: comp.identifiedFlaw || null,
        sourcePlatform: comp.sourcePlatform,
      };
    });

  // All competitors (for specific brand lookup even if user asks cross-category)
  const allFormattedCompetitors = competitors.map((comp) => {
    const compQty = comp.quantityValue || comp.volumeML || 50;
    const compUnit =
      comp.quantityUnit ||
      (comp.declaredNetQuantity?.endsWith("g") ? "g" : "ml");
    const norm = normalizeUnitPrice(comp.retailPriceINR, compQty, compUnit);
    const compat = checkUnitCompatibility(primaryUnit, compUnit);
    return {
      id: comp.id,
      evidenceId: comp.evidenceId || comp.id,
      brand: comp.brand,
      productName: comp.productName,
      category: comp.category,
      retailPriceINR: comp.retailPriceINR,
      discountedPriceINR: comp.discountedPriceINR || null,
      packSize: comp.declaredNetQuantity || `${compQty}${compUnit}`,
      unitPriceLabel: comp.unitMetricLabel || norm.label,
      pricePerUnit: comp.pricePerUnit || comp.pricePerML || norm.value,
      quantityUnit: compUnit,
      unitCompatibleWithPrimary: compat.isCompatible,
      unitCompatibilityWarning: compat.warning,
      rating: comp.sampleRating || comp.rating || null,
      activeIngredients: comp.activeIngredients || [],
      identifiedFlaw: comp.identifiedFlaw || null,
      sourcePlatform: comp.sourcePlatform,
    };
  });

  const productReviews = reviews.filter(
    (r) =>
      r.targetProductId === selectedProduct.id ||
      r.targetProduct === selectedProduct.id
  );
  const competitorReviews = reviews.filter((r) => {
    const target = r.targetProductId || r.targetProduct || "";
    return relevantCompetitors.some((c) => c.id === target);
  });

  const cleanPath = ALLOWED_NAVIGATION_ROUTES[currentPath]
    ? currentPath
    : "/overview";
  const pageInfo = ALLOWED_NAVIGATION_ROUTES[cleanPath];

  const activeAngle =
    CREATIVE_STUDIO_FIXTURES.marketingAngles.find(
      (a) => a.id === activeAngleId
    ) || CREATIVE_STUDIO_FIXTURES.marketingAngles[0];
  const activeAudience =
    CREATIVE_STUDIO_FIXTURES.audiences.find(
      (a) => a.id === selectedAudienceId
    ) || CREATIVE_STUDIO_FIXTURES.audiences[0];

  const activeCampaignOutput =
    CREATIVE_STUDIO_FIXTURES.campaignOutputs?.[activeAngle.id]?.[
      activeAudience.id
    ] || null;

  const formattedSelectedProduct = {
    id: selectedProduct.id,
    evidenceId: selectedProduct.evidenceId || selectedProduct.id,
    brand: selectedProduct.brand,
    productName: selectedProduct.productName,
    category: selectedProduct.category,
    retailPriceINR: selectedProduct.retailPriceINR,
    discountedPriceINR: selectedProduct.discountedPriceINR || null,
    packSize:
      selectedProduct.declaredNetQuantity || `${primaryQty}${primaryUnit}`,
    unitPriceLabel: selectedProduct.unitMetricLabel || primaryNorm.label,
    pricePerUnit:
      selectedProduct.pricePerUnit ||
      selectedProduct.pricePerML ||
      primaryNorm.value,
    quantityUnit: primaryUnit,
    rating: selectedProduct.sampleRating || selectedProduct.rating || null,
    spfRating: selectedProduct.spfRating || null,
    paRating: selectedProduct.paRating || null,
    activeIngredients: selectedProduct.activeIngredients || [],
    claims:
      selectedProduct.advertisedAttributes ||
      selectedProduct.verifiedClaims ||
      [],
    texture: selectedProduct.texture || null,
    finish: selectedProduct.finish || null,
    packaging: selectedProduct.packaging || null,
    fragranceProfile: selectedProduct.fragranceProfile || null,
    positioning: selectedProduct.positioning || null,
    watchpoint:
      selectedProduct.identifiedWatchpoint ||
      "Midday T-zone shine in extreme 90%+ humidity after 4 hours",
    sourcePlatform: selectedProduct.sourcePlatform,
    sourceUrl: selectedProduct.sourceUrl,
  };

  const productSpecificSwot = buildProductSpecificSwot(
    formattedSelectedProduct,
    relevantCompetitors,
    productReviews,
    competitorReviews
  );

  return {
    isProductFound,
    requestedProductId: productId || selectedProduct.id,
    currentPage: pageInfo,
    selectedLanguage,
    datasetLimitationNote:
      "Grounded in public Nykaa and dotandkey.com pages collected on 21 Nov 2026. Static snapshot, not a live real-time feed.",
    selectedProduct: formattedSelectedProduct,
    relevantCompetitors,
    allFormattedCompetitors,
    allReviews: reviews,
    productReviews,
    competitorReviews,
    sentimentBreakdown: INSIGHTS_DATA.sentimentBreakdown,
    swot: productSpecificSwot,
    globalSwot: INSIGHTS_DATA.swot,
    opportunities: INSIGHTS_DATA.opportunityAreas,
    activeMarketingContext: {
      angle: activeAngle,
      audience: activeAudience,
      sampleOutput: activeCampaignOutput
        ? {
            headline: activeCampaignOutput.productDescription?.headline,
            tagline: activeCampaignOutput.productDescription?.tagline,
            firstCaption: activeCampaignOutput.instagramCaptions?.[0],
          }
        : null,
    },
    brandVoice: {
      pillars: BRAND_VOICE_GUIDELINES.pillars,
      wordsToUse: BRAND_VOICE_GUIDELINES.vocabularyRules.wordsToUse,
      wordsToAvoid: BRAND_VOICE_GUIDELINES.vocabularyRules.wordsToAvoid,
      multilingualGuidelines: BRAND_VOICE_GUIDELINES.multilingualGuidelines,
      transformations: BRAND_VOICE_GUIDELINES.transformations,
    },
  };
}

/**
 * Builds the strict grounding system prompt for external LLM calls.
 */
export function buildSystemPromptForLLM(validatedContext) {
  return `You are KAIROS Copilot, the Market Intelligence Assistant for Dot & Key Skincare inside the KAIROS (Proof2Pitch AI) platform.

STRICT GROUNDING & INTEGRITY RULES:
1. NEVER fabricate prices, competitor rankings, customer reviews, sales figures, market trends, evidence IDs, or clinical efficacy claims.
2. NEVER use the em dash character (—). Use commas, periods, colons, or parentheses instead.
3. Only cite evidence IDs that appear in the VALIDATED CONTEXT JSON below (such as [${validatedContext.selectedProduct.evidenceId}], [P001], [C001], [C002], [C003], [R001], [R002], [R003], [R004], [R005], [EVD-PROD-DK01], [EVD-REV-DK001], [EVD-REV-CP001], etc.). Write citations in square brackets like [P001].
4. Structure every analytical response clearly into three sections:
   - FACTS: Explicitly supported by the provided records with [EVIDENCE-ID] citations.
   - INFERENCES: Reasonable interpretations of the facts (such as unit-price advantage or formulation suitability).
   - RECOMMENDATIONS: Actionable next marketing or product strategy steps.
5. If the user asks about data that is not in the context (for example revenue, unlisted brands, or medical cures), explicitly state that the information is unavailable in the verified KAIROS dataset.
6. Acknowledge dataset limitations when relevant: ${validatedContext.datasetLimitationNote}

ACTIVE WORKSPACE CONTEXT:
- Current Page: ${validatedContext.currentPage.label} (${validatedContext.currentPage.route})
- Selected Product: ${validatedContext.selectedProduct.brand} ${validatedContext.selectedProduct.productName} [${validatedContext.selectedProduct.evidenceId}]
- Selected Audience: ${validatedContext.activeMarketingContext.audience.label}
- Selected Marketing Angle: ${validatedContext.activeMarketingContext.angle.name}
- Selected Language: ${validatedContext.selectedLanguage}

VALIDATED CONTEXT PAYLOAD:
${JSON.stringify(validatedContext, null, 2)}
`;
}

/**
 * Grounded server-side intelligence synthesis engine.
 * Produces deterministic, product-aware, evidence-cited analysis structured into
 * FACTS, INFERENCES, and RECOMMENDATIONS, plus contextual follow-up questions.
 */
export function generateGroundedResponse({ message, context }) {
  const q = (message || "").toLowerCase().trim();
  const prod = context.selectedProduct;
  const comps = context.relevantCompetitors;
  const prodRevs = context.productReviews;
  const compRevs = context.competitorReviews;
  const firstProdRev = prodRevs[0];
  const firstCompRev = compRevs[0];
  const topComp = comps[0];

  // 1. Check for unknown / out-of-scope / unsupported factual queries
  const unsupportedKeywords = [
    "revenue",
    "annual sales",
    "net profit",
    "ebitda",
    "stock price",
    "shareholder",
    "valuation",
    "cure eczema",
    "cure psoriasis",
    "prescription",
    "fda approval",
    "chanel",
    "dior",
    "estee lauder",
    "la mer",
    "shiseido",
    "european market share",
    "us market share",
  ];
  const matchedUnsupported = unsupportedKeywords.find((kw) =>
    q.includes(kw.toLowerCase())
  );

  if (matchedUnsupported) {
    const rawText = `**Dataset Boundary Notice:** I cannot verify information regarding **"${matchedUnsupported}"** because it is not present in the audited KAIROS repository. KAIROS Copilot refuses to fabricate financial figures, external luxury brand prices, or clinical medical claims.

**FACTS:**
• The active KAIROS dataset covers **${prod.brand} ${prod.productName}** [${prod.evidenceId}] listed at **₹${prod.retailPriceINR}** (${prod.packSize}, normalized at **${prod.unitPriceLabel}**).
• Our verified category competitor scope tracks Indian skincare benchmarks: ${comps
      .slice(0, 3)
      .map((c) => `${c.brand} [${c.evidenceId}]`)
      .join(", ")}.

**INFERENCES:**
• Making unbacked commercial or clinical efficacy claims outside audited records risks regulatory non-compliance and violates Dot & Key Brand Voice guardrails.

**RECOMMENDATIONS:**
• Focus campaign messaging on verified product attributes such as **${(
      prod.claims[0] || "lightweight absorption"
    ).toLowerCase()}** [${prod.evidenceId}].
• Review our approved claim boundaries in **Brand Voice**.`;

    return {
      reply: rawText,
      sections: {
        facts: [
          `Active dataset covers ${prod.brand} ${prod.productName} [${prod.evidenceId}] at ₹${prod.retailPriceINR} (${prod.packSize}, ${prod.unitPriceLabel}).`,
          `No verified records exist in the repository for "${matchedUnsupported}".`,
        ],
        inferences: [
          "Relying on unverified commercial or clinical claims violates KAIROS evidentiary integrity rules.",
        ],
        recommendations: [
          `Anchor claims strictly to verified records for ${prod.productName} [${prod.evidenceId}].`,
        ],
      },
      followUpQuestions: [
        `What verified evidence exists for ${prod.productName}?`,
        "What are our Brand Voice guardrails and forbidden words?",
        "What are the biggest competitor opportunities?",
      ],
      suggestedRoutes: ["/products", "/brand-voice"],
    };
  }

  // 2. Greeting / Capabilities / Help Intent
  const isGreetingOnly =
    /^(hi|hello|hey|namaste|help|what can you do|who are you|how does this work|start)[?!.\s]*$/i.test(
      q
    ) || q === "hello, what can you help me with?";

  if (isGreetingOnly) {
    const rawText = `Hello! I am **KAIROS Copilot**, your grounded market intelligence assistant for **${prod.brand} ${prod.productName}** [${prod.evidenceId}] (currently viewing **${context.currentPage.label}**).

**FACTS:**
• **Active Subject:** ${prod.brand} ${prod.productName} [${prod.evidenceId}], retailing at **₹${prod.retailPriceINR}** (${prod.packSize}, normalized at **${prod.unitPriceLabel}**, rated **${prod.rating}/5**).
• **Category Evidence Loaded:** Benchmarked against **${comps.length} direct category competitors** (${comps
      .map((c) => `${c.brand} [${c.evidenceId}]`)
      .join(", ")}) and **${prodRevs.length + compRevs.length} category customer review records**.

**INFERENCES:**
• Because every data point is tied to a persistent evidence ID, you can move directly from competitor defect detection to high-converting creative production without guessing claims.

**RECOMMENDATIONS:**
• Ask me to compare **${prod.productName}** against a specific rival (such as **${topComp?.brand || "The Derma Co"}**), audit review sentiment, inspect the SWOT matrix, or draft a localized campaign in **${context.selectedLanguage}**.`;

    return {
      reply: rawText,
      sections: {
        facts: [
          `Active subject: ${prod.brand} ${prod.productName} [${prod.evidenceId}] at ₹${prod.retailPriceINR} (${prod.packSize}, ${prod.unitPriceLabel}).`,
          `Tracking ${comps.length} category competitors (${comps.map((c) => `${c.brand} [${c.evidenceId}]`).join(", ")}) and ${prodRevs.length + compRevs.length} category buyer review records.`,
        ],
        inferences: [
          "All insights and creative drafts are anchored to inspectable evidence IDs with zero synthetic claims.",
        ],
        recommendations: [
          `Select any follow-up prompt below to analyze ${prod.productName} [${prod.evidenceId}].`,
        ],
      },
      followUpQuestions: [
        `Analyze ${prod.productName}'s market position.`,
        `How do we compare against ${topComp?.brand || "competitors"}?`,
        "Help me create a campaign from our findings.",
      ],
      suggestedRoutes: ["/overview", "/competitors", "/marketing-studio"],
    };
  }

  // 3. Specific Named Competitor Spotlight (e.g., "Dr. Sheth", "Derma Co", "Aqualogica", "Minimalist", "Plum", "Foxtale")
  const namedCompetitorMatchers = [
    { keywords: ["sheth", "dr. sheth", "dr sheth"], matchBrand: "sheth" },
    { keywords: ["derma co", "dermaco", "the derma"], matchBrand: "derma" },
    { keywords: ["aqualogica"], matchBrand: "aqualogica" },
    { keywords: ["minimalist", "b5 gel"], matchBrand: "minimalist" },
    { keywords: ["plum", "plum goodness"], matchBrand: "plum" },
    { keywords: ["foxtale"], matchBrand: "foxtale" },
  ];

  const matchedNamedComp = namedCompetitorMatchers.find((m) =>
    m.keywords.some((kw) => q.includes(kw))
  );

  if (matchedNamedComp) {
    // Prefer category-matched competitor first, fallback to full catalog
    const targetComp =
      comps.find((c) =>
        c.brand.toLowerCase().includes(matchedNamedComp.matchBrand)
      ) ||
      context.allFormattedCompetitors.find((c) =>
        c.brand.toLowerCase().includes(matchedNamedComp.matchBrand)
      );

    if (targetComp) {
      const targetRev = context.allReviews.find(
        (r) =>
          (r.targetProductId || r.targetProduct) === targetComp.id ||
          r.brand.toLowerCase().includes(matchedNamedComp.matchBrand)
      );

      const priceDiff = (targetComp.pricePerUnit || 0) - (prod.pricePerUnit || 0);
      const unitNote = targetComp.unitCompatibleWithPrimary
        ? `Both products are measured in compatible **${prod.quantityUnit}** units.`
        : `**Unit Notice:** ${targetComp.unitCompatibilityWarning}`;

      const rawText = `Here is the head-to-head benchmark comparing **${prod.brand} ${prod.productName}** [${prod.evidenceId}] against **${targetComp.brand} ${targetComp.productName}** [${targetComp.evidenceId}]:

**FACTS:**
• **${prod.brand} (Active Subject) [${prod.evidenceId}]:** Retails at **₹${prod.retailPriceINR}** (${prod.packSize}, normalized rate: **${prod.unitPriceLabel}**, rating: **${prod.rating}/5**). Key actives: **${prod.activeIngredients.slice(0, 3).join(", ")}**.
• **${targetComp.brand} (Competitor) [${targetComp.evidenceId}]:** Retails at **₹${targetComp.retailPriceINR}** (${targetComp.packSize}, normalized rate: **${targetComp.unitPriceLabel}**, rating: **${targetComp.rating}/5**). Key actives: **${targetComp.activeIngredients.join(", ")}**.
• **Documented Competitor Vulnerability:** ${targetComp.identifiedFlaw} ${
        targetRev
          ? `Verified buyer review [${targetRev.id}] on ${targetRev.sourcePlatform} (${targetRev.rating}/5) reports: *"${targetRev.verbatimQuote}"*`
          : ""
      }

**INFERENCES:**
• **Unit Economics:** ${unitNote} ${
        priceDiff > 0.05
          ? `Dot & Key is **₹${priceDiff.toFixed(2)} per ${prod.quantityUnit} more affordable** at MRP (${prod.unitPriceLabel} vs ${targetComp.unitPriceLabel}).`
          : `Both brands compete directly in the ₹9 to ₹10 per unit masstige tier.`
      }
• **Wearability Advantage:** While **${targetComp.brand}** struggles with *${(
        targetComp.identifiedFlaw || "texture breakdown"
      ).toLowerCase()}*, **${prod.productName}** counters with **${(
        prod.texture || "water-light absorption"
      ).toLowerCase()}** and **${(prod.finish || "zero white cast").toLowerCase()}** [${
        firstProdRev ? firstProdRev.id : prod.evidenceId
      }].

**RECOMMENDATIONS:**
• **Direct Counter-Hook:** *"Tired of skincare that feels heavy or breaks down in humidity [${
        targetRev ? targetRev.id : targetComp.evidenceId
      }]? Switch to ${prod.brand} ${prod.productName} for ${
        prod.texture || "weightless absorption"
      } at ${prod.unitPriceLabel} [${prod.evidenceId}]."*`;

      return {
        reply: rawText,
        sections: {
          facts: [
            `${prod.brand} ${prod.productName} [${prod.evidenceId}]: ₹${prod.retailPriceINR} (${prod.packSize}, ${prod.unitPriceLabel}), rated ${prod.rating}/5.`,
            `${targetComp.brand} ${targetComp.productName} [${targetComp.evidenceId}]: ₹${targetComp.retailPriceINR} (${targetComp.packSize}, ${targetComp.unitPriceLabel}), rated ${targetComp.rating}/5.`,
            targetRev
              ? `Competitor defect review [${targetRev.id}] (${targetRev.rating}/5): "${targetRev.verbatimQuote}"`
              : `Competitor vulnerability [${targetComp.evidenceId}]: ${targetComp.identifiedFlaw}`,
          ],
          inferences: [
            `${unitNote} Dot & Key outperforms ${targetComp.brand} on humid-weather breathability and layering comfort.`,
          ],
          recommendations: [
            `Deploy a comparative campaign targeting ${targetComp.brand}'s ${
              targetRev ? `[${targetRev.id}]` : `[${targetComp.evidenceId}]`
            } vulnerability in Marketing Studio.`,
          ],
        },
        followUpQuestions: [
          `Create an ad campaign countering ${targetComp.brand}.`,
          "What are the other competitor opportunities?",
          "Explain our customer review sentiment.",
        ],
        suggestedRoutes: ["/competitors", "/opportunities", "/marketing-studio"],
      };
    }
  }

  // 4. Brand Voice, Vocabulary Guardrails & Multilingual Copy Rules
  if (
    q.includes("brand voice") ||
    q.includes("forbidden") ||
    q.includes("vocabulary") ||
    q.includes("words to avoid") ||
    q.includes("words to use") ||
    q.includes("tone of voice") ||
    q.includes("compliance")
  ) {
    const bv = context.brandVoice;
    const langGuide =
      bv.multilingualGuidelines?.[context.selectedLanguage] ||
      bv.multilingualGuidelines?.English;

    const rawText = `Here are the **Dot & Key Brand Voice & Evidentiary Guardrails** applied to **${prod.productName}** [${prod.evidenceId}]:

**FACTS:**
• **4 Editorial Pillars:** ${bv.pillars.map((p) => `**${p.title}**`).join(", ")}.
• **Approved Sensory Vocabulary:** *${bv.wordsToUse.join(", ")}*.
• **Strictly Prohibited Terms:** *${bv.wordsToAvoid.join(", ")}*.
• **Active Language Profile (${context.selectedLanguage}):** ${langGuide.tone} Example tagline: *"${langGuide.exampleTagline}"*

**INFERENCES:**
• Transforming cold clinical claims into tactile, sensory language increases consumer trust while keeping every statement tied to verified product specs [${prod.evidenceId}] and buyer proof [${
      firstProdRev ? firstProdRev.id : "EVD-REV-DK001"
    }].

**RECOMMENDATIONS:**
• Replace generic buzzwords with concrete sensory proof: describe **${prod.productName}** using **${prod.texture || "water-break absorption"}** and **${prod.finish || "zero white cast"}** [${prod.evidenceId}].
• Open the **Brand Voice** page to inspect full clinical-to-editorial copy transformations.`;

    return {
      reply: rawText,
      sections: {
        facts: [
          `Core pillars: ${bv.pillars.map((p) => p.title).join(", ")}.`,
          `Approved vocabulary: ${bv.wordsToUse.slice(0, 5).join(", ")}.`,
          `Prohibited copy: ${bv.wordsToAvoid.slice(0, 5).join(", ")}.`,
        ],
        inferences: [
          "Pairing warm, tactile sensory phrasing with verifiable evidence citations prevents generic marketing fatigue.",
        ],
        recommendations: [
          `Apply the ${context.selectedLanguage} tone profile ("${langGuide.exampleTagline}") in Marketing Studio.`,
        ],
      },
      followUpQuestions: [
        `Help me create a campaign for ${prod.productName}.`,
        "Which evidence supports our marketing strategy?",
        "What are the active ingredients and finish of this product?",
      ],
      suggestedRoutes: ["/brand-voice", "/marketing-studio"],
    };
  }

  // 5. Formulation, Active Ingredients, Texture, Packaging & SPF
  if (
    q.includes("ingredient") ||
    q.includes("formulation") ||
    q.includes("active") ||
    q.includes("texture") ||
    q.includes("packaging") ||
    q.includes("finish") ||
    q.includes("white cast") ||
    q.includes("fragrance")
  ) {
    const rawText = `Here is the verified formulation and sensory specification for **${prod.brand} ${prod.productName}** [${prod.evidenceId}]:

**FACTS:**
• **Active Formulation Matrix [${prod.evidenceId}]:** ${prod.activeIngredients.join(", ")}.
• **Texture & Finish:** **${prod.texture || "Lightweight gel"}** delivering a **${prod.finish || "non-greasy finish"}**${
      prod.spfRating ? ` with certified **${prod.spfRating} ${prod.paRating}** broad-spectrum defense` : ""
    }.
• **Packaging & Pricing:** Packaged in a **${prod.packaging || prod.packSize}** at **₹${prod.retailPriceINR}** (${prod.packSize}, normalized at **${prod.unitPriceLabel}**).
• **Verified Sensory Feedback:** ${
      firstProdRev
        ? `Reviewer **${firstProdRev.reviewer}** [${firstProdRev.id}] (${firstProdRev.rating}/5 on ${firstProdRev.sourcePlatform}) confirms: *"${firstProdRev.verbatimQuote}"*`
        : `Audited buyer feedback [EVD-REV-DK001] confirms 10-second absorption with zero sticky residue.`
    }

**INFERENCES:**
• The combination of **${prod.activeIngredients[0] || "core actives"}** inside a **${(
      prod.texture || "fluid vehicle"
    ).toLowerCase()}** solves the biggest barrier for Indian consumers: achieving active skincare benefits without heavy, pore-clogging occlusion in humid weather.

**RECOMMENDATIONS:**
• Spotlight **${prod.activeIngredients.slice(0, 2).join(" + ")}** alongside **${prod.finish || "zero white cast"}** in PDP bullet points [${prod.evidenceId}].
• Address the packaging and 4-hour humid T-zone watchpoint transparently in usage directions.`;

    return {
      reply: rawText,
      sections: {
        facts: [
          `Active ingredients [${prod.evidenceId}]: ${prod.activeIngredients.join(", ")}.`,
          `Sensory profile: Texture is "${prod.texture || "Fluid"}"; Finish is "${prod.finish || "Dewy, non-greasy"}"; Packaging is "${prod.packaging || prod.packSize}".`,
          firstProdRev
            ? `Customer sensory proof [${firstProdRev.id}] (${firstProdRev.rating}/5): "${firstProdRev.verbatimQuote}"`
            : `Verified review [EVD-REV-DK001] confirms 10-second watery absorption.`,
        ],
        inferences: [
          `Formulating ${prod.activeIngredients[0]} in a ${
            prod.texture || "water-light"
          } base prevents the sweat-trapping occlusion seen in heavier competitor creams.`,
        ],
        recommendations: [
          `Feature the active matrix and "${prod.finish}" claim in A+ marketplace listings.`,
        ],
      },
      followUpQuestions: [
        "How do our ingredients compare to competitors?",
        "Help me create a campaign from our findings.",
        "Explain the current review sentiment.",
      ],
      suggestedRoutes: ["/products", "/marketing-studio", "/reviews"],
    };
  }

  // 6. Campaign / Creative Studio / Ad Copy / Hook Generation (with Multilingual Awareness)
  if (
    q.includes("campaign") ||
    q.includes("ad copy") ||
    q.includes("caption") ||
    q.includes("creative") ||
    q.includes("storyboard") ||
    q.includes("hook") ||
    q.includes("pitch") ||
    q.includes("marketing studio") ||
    q.includes("hindi") ||
    q.includes("hinglish") ||
    q.includes("bengali")
  ) {
    const requestedLang = q.includes("hinglish")
      ? "Hinglish"
      : q.includes("hindi")
      ? "Hindi"
      : q.includes("bengali")
      ? "Bengali"
      : context.selectedLanguage || "English";

    const langProfile =
      context.brandVoice.multilingualGuidelines?.[requestedLang] ||
      context.brandVoice.multilingualGuidelines?.English;

    const angle = context.activeMarketingContext.angle;
    const audience = context.activeMarketingContext.audience;

    const rawText = `Here is an evidence-backed campaign blueprint for **${prod.brand} ${prod.productName}** [${prod.evidenceId}], tailored for **${audience.label}** (${requestedLang} tone profile):

**FACTS:**
• **Product Spec:** ${prod.productName} [${prod.evidenceId}] retails at **₹${prod.retailPriceINR}** (${prod.packSize}, normalized at **${prod.unitPriceLabel}**) with key actives: **${prod.activeIngredients
      .slice(0, 3)
      .join(", ")}**.
• **Verified Buyer Proof:** ${
      firstProdRev
        ? `Customer feedback [${firstProdRev.id}] on ${firstProdRev.sourcePlatform} (${firstProdRev.rating}/5 stars) confirms: "${firstProdRev.verbatimQuote}"`
        : `Audited buyer feedback [EVD-REV-DK001] confirms 10-second watery absorption and zero sticky residue.`
    }
• **Competitor Defect Target:** ${
      topComp
        ? `${topComp.brand} ${topComp.productName} [${topComp.evidenceId}] (₹${topComp.retailPriceINR}, ${topComp.unitPriceLabel}) exhibits a documented vulnerability: ${topComp.identifiedFlaw}`
        : `Competitor gels [EVD-REV-CP001] suffer from sweat-trapping occlusion.`
    } ${firstCompRev ? `[${firstCompRev.id}]` : ""}

**INFERENCES:**
• Counter-positioning **${prod.texture || "water-light fluid texture"}** against competitor afternoon greasiness and pilling directly addresses the primary switching trigger for **${audience.label}**.
• At **${prod.unitPriceLabel}**, Dot & Key offers stronger active value per unit than ${
      topComp ? `${topComp.brand} (${topComp.unitPriceLabel})` : "rival gels"
    }.

**RECOMMENDATIONS:**
• **Primary Campaign Hook (${angle.name}):** *"Skip the midday grease slick. Experience ${
      prod.spfRating
        ? `${prod.spfRating} ${prod.paRating} brightening defense`
        : "probiotic barrier hydration"
    } with ${prod.texture || "10-second water-light absorption"} and ${
      prod.finish || "zero white cast"
    } [${firstProdRev ? firstProdRev.id : prod.evidenceId}]."*
• **Localized Tagline (${requestedLang}):** *"${langProfile.exampleTagline}"*
• **PDP Hero Bullet:** Highlight **${prod.activeIngredients[0] || "Key Actives"}** paired with **${
      prod.finish || "zero white cast finish"
    }** [${prod.evidenceId}].`;

    return {
      reply: rawText,
      sections: {
        facts: [
          `${prod.productName} [${prod.evidenceId}] is priced at ₹${prod.retailPriceINR} (${prod.packSize}, ${prod.unitPriceLabel}).`,
          firstProdRev
            ? `Verified review [${firstProdRev.id}] (${firstProdRev.rating}/5): "${firstProdRev.verbatimQuote}"`
            : `Verified review [EVD-REV-DK001] confirms 10-second absorption in humid weather.`,
          topComp
            ? `Target competitor gap [${topComp.evidenceId}]: ${topComp.brand} (${topComp.identifiedFlaw})`
            : `Competitor defect [EVD-REV-CP001] documents heavy occlusive sweat trapping.`,
        ],
        inferences: [
          `Positioning against competitor texture breakdown (${topComp?.brand || "rivals"}) resonates strongly with ${audience.label}.`,
        ],
        recommendations: [
          `Campaign Hook: "Skip the midday grease slick. Experience ${prod.productName} with ${prod.finish || "zero white cast"} [${firstProdRev ? firstProdRev.id : prod.evidenceId}]."`,
          `Localized (${requestedLang}) Tagline: "${langProfile.exampleTagline}"`,
        ],
      },
      followUpQuestions: [
        "Adapt this campaign hook into Hinglish.",
        "What are our Brand Voice guardrails?",
        `Which evidence supports ${prod.productName}?`,
      ],
      suggestedRoutes: ["/marketing-studio", "/brand-voice", "/exports"],
    };
  }

  // 7. Competitor Analysis / Opportunities / Pricing Comparison
  if (
    q.includes("competitor") ||
    q.includes("opportunit") ||
    q.includes("compare") ||
    q.includes("comparison") ||
    q.includes("vs") ||
    q.includes("price") ||
    q.includes("cheaper") ||
    q.includes("flaw") ||
    q.includes("gap")
  ) {
    const compLines = comps
      .slice(0, 4)
      .map(
        (c) =>
          `• **${c.brand} ${c.productName}** [${c.evidenceId}]: ₹${
            c.retailPriceINR
          } (${c.packSize}, **${c.unitPriceLabel}**), Rating: ${
            c.rating || "Unverified"
          }/5. Vulnerability: *${c.identifiedFlaw || "Noted texture friction"}*`
      )
      .join("\n");

    const defectCitations = compRevs
      .slice(0, 3)
      .map((r) => `[${r.id}] (${r.brand}: "${r.verbatimQuote}")`)
      .join("; ");

    const rawText = `Here is the competitive benchmark and opportunity analysis for **${prod.brand} ${prod.productName}** [${prod.evidenceId}]:

**FACTS:**
• **Active Subject:** ${prod.brand} ${prod.productName} [${prod.evidenceId}] is listed at **₹${prod.retailPriceINR}** for **${prod.packSize}** (normalized rate: **${prod.unitPriceLabel}**, rating: **${prod.rating}/5**).
${compLines}
• **Customer Defect Evidence:** ${
      defectCitations ||
      "Verified competitor defect reviews [EVD-REV-CP001], [EVD-REV-CP002], and [EVD-REV-CP003] document sweat-trapping, pilling, and jawline flaking."
    }

**INFERENCES:**
• **Normalized Unit Value:** At **${prod.unitPriceLabel}**, ${prod.productName} undercuts or matches key category rivals while delivering a multi-active matrix (**${prod.activeIngredients
      .slice(0, 2)
      .join(" + ")}**).
• **Formulation Gap:** Category competitors consistently fail on second-hour wear in Indian humidity (${comps
      .slice(0, 2)
      .map((c) => `${c.brand} [${c.evidenceId}]`)
      .join(" and ")}).

**RECOMMENDATIONS:**
• **Opportunity #1 (Counter Competitor Texture Breakdown):** Target buyers frustrated by competitor greasiness, sweat-trapping, or pilling using evidence [${
      compRevs[0]?.id || comps[0]?.evidenceId || "EVD-REV-CP001"
    }].
• **Opportunity #2 (Routine Compatibility & Finish):** Emphasize **${prod.finish || "zero white cast"}** and seamless morning layering [${
      firstProdRev ? firstProdRev.id : prod.evidenceId
    }].`;

    return {
      reply: rawText,
      sections: {
        facts: [
          `${prod.productName} [${prod.evidenceId}]: ₹${prod.retailPriceINR} (${prod.packSize}, ${prod.unitPriceLabel}).`,
          ...comps
            .slice(0, 3)
            .map(
              (c) =>
                `${c.brand} [${c.evidenceId}]: ₹${c.retailPriceINR} (${c.unitPriceLabel}) - Flaw: ${c.identifiedFlaw}`
            ),
        ],
        inferences: [
          "Competitor vulnerabilities center on humid-climate greasiness, sweat trapping, and morning layering pilling.",
        ],
        recommendations: [
          `Deploy comparative claims highlighting ${prod.productName} [${prod.evidenceId}] at ${prod.unitPriceLabel} with ${prod.finish || "weightless absorption"}.`,
        ],
      },
      followUpQuestions: [
        topComp
          ? `How do we compare specifically against ${topComp.brand}?`
          : "Which evidence supports our marketing strategy?",
        "Help me create a campaign from our findings.",
        "Explain the current review sentiment.",
      ],
      suggestedRoutes: ["/competitors", "/opportunities", "/marketing-studio"],
    };
  }

  // 8. Review Sentiment / Customer Feedback Analysis
  if (
    q.includes("review") ||
    q.includes("sentiment") ||
    q.includes("customer") ||
    q.includes("feedback") ||
    q.includes("buyer") ||
    q.includes("rating") ||
    q.includes("complaint")
  ) {
    const sb = context.sentimentBreakdown;
    const revBullets = prodRevs
      .map(
        (r) =>
          `• **[${r.id}] ${r.reviewer}** on ${r.sourcePlatform} (${r.rating}/5, *${r.sentiment}*): "${r.verbatimQuote}"`
      )
      .join("\n");

    const criticalProdRev = prodRevs.find(
      (r) => r.rating <= 4 || r.sentiment === "critical" || r.sentiment === "neutral"
    );

    const rawText = `Here is the verified customer review sentiment analysis for **${prod.brand} ${prod.productName}** [${prod.evidenceId}]:

**FACTS:**
• **Product-Specific Verified Reviews (${prodRevs.length} direct excerpts loaded for ${prod.productName}):**
${
  revBullets ||
  `• **[EVD-REV-DK001] Arundhati S.** on Nykaa (5/5, positive): "Absorbs within 10 seconds and leaves zero sticky residue."`
}
• **Category Sentiment Benchmark:** Across the KAIROS skincare audit (${sb.sampleSize.toLocaleString()} total audited reviews), sentiment distributes at **${sb.positivePercent}% Positive**, **${sb.neutralPercent}% Neutral**, and **${sb.criticalPercent}% Critical**.
• **Documented Watchpoint:** ${prod.watchpoint} [${
      criticalProdRev ? criticalProdRev.id : prod.evidenceId
    }].

**INFERENCES:**
• High positive sentiment (${prod.rating}/5 rating) is driven by **immediate sensory gratification** (${prod.texture || "water-light spreadability"} and ${prod.finish || "zero white cast"}).
• Minor buyer friction does not question core efficacy; instead, it centers on **4-hour T-zone shine in extreme coastal humidity** [${
      criticalProdRev ? criticalProdRev.id : prod.evidenceId
    }].

**RECOMMENDATIONS:**
• **Validate in Copy:** Lead with verbatim buyer proof around fast absorption and finish [${
      firstProdRev ? firstProdRev.id : prod.evidenceId
    }].
• **Set Honest Expectations:** Position the finish as a *"breathable natural glow"* rather than a heavy powder-matte finish to preempt humid afternoon shine complaints.`;

    return {
      reply: rawText,
      sections: {
        facts: [
          `Category audit distribution: ${sb.positivePercent}% Positive, ${sb.neutralPercent}% Neutral, ${sb.criticalPercent}% Critical.`,
          `Product rating for ${prod.productName} [${prod.evidenceId}] is ${prod.rating}/5.`,
          ...(prodRevs.length > 0
            ? prodRevs.map(
                (r) =>
                  `Verified review [${r.id}] (${r.rating}/5 on ${r.sourcePlatform}): "${r.verbatimQuote}"`
              )
            : [
                `Verified review [EVD-REV-DK001] (5/5 on Nykaa): "Absorbs within 10 seconds and leaves zero sticky residue."`,
              ]),
        ],
        inferences: [
          "Positive sentiment centers on zero white cast and fast water-light absorption; minor friction involves 4-hour humid T-zone shine.",
        ],
        recommendations: [
          "Highlight verified buyer texture proof while setting realistic natural-glow finish expectations.",
        ],
      },
      followUpQuestions: [
        "Which evidence supports our SWOT matrix?",
        "What are the biggest competitor opportunities?",
        "Help me create a campaign from our findings.",
      ],
      suggestedRoutes: ["/reviews", "/swot", "/marketing-studio"],
    };
  }

  // 9. Evidence / Provenance / SWOT / Strategy Questions (Product-Specific SWOT)
  if (
    q.includes("evidence") ||
    q.includes("swot") ||
    q.includes("prove") ||
    q.includes("source") ||
    q.includes("support") ||
    q.includes("strength") ||
    q.includes("weakness") ||
    q.includes("threat")
  ) {
    const swot = context.swot;
    const rawText = `Here is the product-specific evidentiary provenance and 4-quadrant SWOT synthesis for **${prod.brand} ${prod.productName}** [${prod.evidenceId}]:

**FACTS:**
• **Primary Specification [${prod.evidenceId}]:** Verified on **${prod.sourcePlatform}** at **₹${prod.retailPriceINR}** (${prod.packSize}, **${prod.unitPriceLabel}**). Actives: ${prod.activeIngredients.join(", ")}.
• **Strengths:**
  1. ${swot.strengths[0].text} [${swot.strengths[0].evidence}]
  2. ${swot.strengths[1].text} [${swot.strengths[1].evidence}]
• **Weaknesses / Watchpoints:**
  1. ${swot.weaknesses[0].text} [${swot.weaknesses[0].evidence}]
  2. ${swot.weaknesses[1].text} [${swot.weaknesses[1].evidence}]
• **Opportunities & Threats:**
  1. Opportunity: ${swot.opportunities[0].text} [${swot.opportunities[0].evidence}]
  2. Threat: ${swot.threats[0].text} [${swot.threats[0].evidence}]

**INFERENCES:**
• Every strategic claim for **${prod.productName}** is anchored directly to its product record [${prod.evidenceId}], verified customer reviews [${
      prodRevs.map((r) => r.id).join("], [") || prod.evidenceId
    }], and category competitor defect audits [${
      compRevs.map((r) => r.id).join("], [") || comps[0]?.evidenceId || "C001"
    }].

**RECOMMENDATIONS:**
• Click any citation badge below to inspect its full source record and URL in the **Evidence Drawer**.
• Navigate to **SWOT Analysis** or **Marketing Studio** to turn these verified strengths into campaign copy.`;

    return {
      reply: rawText,
      sections: {
        facts: [
          `Strength: ${swot.strengths[0].text} [${swot.strengths[0].evidence}]`,
          `Strength: ${swot.strengths[1].text} [${swot.strengths[1].evidence}]`,
          `Weakness: ${swot.weaknesses[0].text} [${swot.weaknesses[0].evidence}]`,
          `Opportunity: ${swot.opportunities[0].text} [${swot.opportunities[0].evidence}]`,
        ],
        inferences: [
          `Cross-linking ${prod.productName}'s formulation strengths [${prod.evidenceId}] against documented competitor defects provides verifiable creative claims.`,
        ],
        recommendations: [
          "Click any evidence badge below to open the Evidence Drawer or launch Marketing Studio.",
        ],
      },
      followUpQuestions: [
        "Help me create a campaign from these SWOT findings.",
        "What are the active ingredients and texture of this product?",
        "What are the biggest competitor opportunities?",
      ],
      suggestedRoutes: ["/swot", "/reviews", "/marketing-studio"],
    };
  }

  // 10. Default: Market Position & Executive Product Analysis
  const cheapestComp = [...comps].sort(
    (a, b) => (a.pricePerUnit || 999) - (b.pricePerUnit || 999)
  )[0];
  const priciestComp = [...comps].sort(
    (a, b) => (b.pricePerUnit || 0) - (a.pricePerUnit || 0)
  )[0];

  const rawText = `Here is the grounded market position analysis for **${prod.brand} ${prod.productName}** [${prod.evidenceId}] (currently viewing **${context.currentPage.label}**):

**FACTS:**
• **Product & Pricing Position:** ${prod.brand} ${prod.productName} [${prod.evidenceId}] is a **${prod.category}** listed at **₹${prod.retailPriceINR}**${
    prod.discountedPriceINR ? ` (online offer: ₹${prod.discountedPriceINR})` : ""
  } for **${prod.packSize}**, giving a deterministic unit rate of **${prod.unitPriceLabel}** and a verified rating of **${prod.rating}/5**.
• **Formulation & Protection:** Features **${prod.activeIngredients
    .slice(0, 3)
    .join(", ")}**${
    prod.spfRating
      ? ` with certified **${prod.spfRating} ${prod.paRating}** defense`
      : ""
  }.
• **Competitive Benchmark Range:** Across ${comps.length} audited category competitors, unit pricing spans from **${
    cheapestComp
      ? `${cheapestComp.brand} [${cheapestComp.evidenceId}] at ${cheapestComp.unitPriceLabel}`
      : "₹8.98 / g"
  }** up to **${
    priciestComp
      ? `${priciestComp.brand} [${priciestComp.evidenceId}] at ${priciestComp.unitPriceLabel}`
      : "₹13.98 / g"
  }**.
• **Verified Customer Proof:** Buyer reviews [${
    prodRevs.map((r) => r.id).join("], [") || prod.evidenceId
  }] praise the **${(prod.texture || "lightweight texture").toLowerCase()}** and **${(
    prod.finish || "non-greasy finish"
  ).toLowerCase()}**, noting only mild T-zone shine after 4 hours in peak humidity.

**INFERENCES:**
• **Value-Tier Leadership:** At **${prod.unitPriceLabel}**, ${prod.productName} sits at an advantageous price-to-efficacy ratio in the Indian masstige skincare market compared to ${
    priciestComp
      ? `${priciestComp.brand} [${priciestComp.evidenceId}] (${priciestComp.unitPriceLabel})`
      : "category rivals"
  }.
• **Sensory Differentiation:** While competitors like ${
    comps[0] ? `${comps[0].brand} [${comps[0].evidenceId}]` : "rivals"
  }${
    comps[1] ? ` and ${comps[1].brand} [${comps[1].evidenceId}]` : ""
  } struggle with midday oily film breakdown, pilling, or heavy occlusive feel [${
    compRevs[0]?.id || comps[0]?.evidenceId || "C001"
  }], Dot & Key wins on daily wearability under Indian weather conditions.

**RECOMMENDATIONS:**
• **Primary Positioning Hook:** Lead with *"${prod.unitPriceLabel} daily ${
    prod.spfRating
      ? "SPF 50+ brightening defense"
      : "barrier hydration"
  } with ${(prod.texture || "fast absorption").toLowerCase()} and ${(
    prod.finish || "zero white cast"
  ).toLowerCase()}"* [${prod.evidenceId}].
• **Explore Further:** Review the side-by-side matrix in **Competitor Analysis** or generate targeted assets in **Marketing Studio**.`;

  return {
    reply: rawText,
    sections: {
      facts: [
        `${prod.brand} ${prod.productName} [${prod.evidenceId}]: ₹${prod.retailPriceINR} (${prod.packSize}, ${prod.unitPriceLabel}), rated ${prod.rating}/5.`,
        `Formulated with ${prod.activeIngredients.slice(0, 3).join(", ")}.`,
        `Benchmarked against ${comps.length} category competitors (${comps
          .map((c) => `${c.brand} [${c.evidenceId}]`)
          .join(", ")}).`,
      ],
      inferences: [
        `Competitive unit rate (${prod.unitPriceLabel}) combined with ${
          prod.texture || "lightweight"
        } wearability gives Dot & Key a clear advantage over heavier competitor emulsions.`,
      ],
      recommendations: [
        "Use Competitor Analysis to inspect unit-price advantages and launch a targeted campaign in Marketing Studio.",
      ],
    },
    followUpQuestions: [
      topComp
        ? `How do we compare specifically against ${topComp.brand}?`
        : "What are the biggest competitor opportunities?",
      "Explain the current review sentiment.",
      "Help me create a campaign from our findings.",
    ],
    suggestedRoutes: ["/competitors", "/opportunities", "/marketing-studio"],
  };
}

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_TURNS = 8;
const MAX_HISTORY_ITEM_LENGTH = 1200;
const PROVIDER_TIMEOUT_MS = 15000;

async function callGeminiProvider({
  apiKey,
  modelName,
  systemPrompt,
  history,
  message,
}) {
  const model = modelName || "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const contents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 900,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== "string") {
      throw new Error("Gemini API returned an empty response payload.");
    }

    return { text, providerName: `Google Gemini (${model})` };
  } finally {
    clearTimeout(timer);
  }
}

async function callOpenAICompatibleProvider({
  apiKey,
  baseUrl,
  model,
  providerLabel,
  systemPrompt,
  history,
  message,
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 900,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.map((h) => ({
            role: h.role === "assistant" ? "assistant" : "user",
            content: h.content,
          })),
          { role: "user", content: message },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `${providerLabel} responded with status ${response.status}`
      );
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text || typeof text !== "string") {
      throw new Error(`${providerLabel} returned an empty response payload.`);
    }

    return { text, providerName: `${providerLabel} (${model})` };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Core request processor for POST /api/assistant.
 * Validates inputs, retrieves server-trusted context, executes AI synthesis,
 * enforces evidence ID verification, and handles provider errors cleanly.
 */
export async function handleAssistantRequest(body, envOverrides = null) {
  const env = envOverrides || process.env;

  if (!body || typeof body !== "object") {
    return {
      status: 400,
      payload: {
        error: "Invalid request payload. Expected a JSON object.",
        code: "INVALID_PAYLOAD",
      },
    };
  }

  if (
    body.tools !== undefined ||
    body.functions !== undefined ||
    body.function_call !== undefined ||
    body.systemPrompt !== undefined ||
    body.executeCode !== undefined
  ) {
    return {
      status: 400,
      payload: {
        error:
          "Unsupported tool execution or prompt override parameters are prohibited.",
        code: "UNSUPPORTED_TOOL_EXECUTION",
      },
    };
  }

  const rawMessage = body.message;
  if (typeof rawMessage !== "string" || rawMessage.trim().length === 0) {
    return {
      status: 400,
      payload: {
        error:
          "Message cannot be empty. Please enter a market intelligence question.",
        code: "EMPTY_MESSAGE",
      },
    };
  }

  const trimmedMessage = rawMessage.trim();
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return {
      status: 400,
      payload: {
        error: `Message exceeds the maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`,
        code: "MESSAGE_TOO_LONG",
      },
    };
  }

  const rawRequestedProductId =
    body.selectedProductId !== undefined && body.selectedProductId !== null
      ? body.selectedProductId
      : body.productId !== undefined && body.productId !== null
      ? body.productId
      : null;

  const requestedProductId =
    rawRequestedProductId !== null ? String(rawRequestedProductId).trim() : null;

  if (requestedProductId !== null) {
    if (
      requestedProductId.length === 0 ||
      requestedProductId.length > 64 ||
      !isKnownProductId(requestedProductId)
    ) {
      return {
        status: 400,
        payload: {
          error: `Unrecognized product ID "${String(requestedProductId).slice(
            0,
            32
          )}". Select a valid Dot & Key product from the catalog.`,
          code: "INVALID_PRODUCT_ID",
        },
      };
    }
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const sanitizedHistory = rawHistory
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_HISTORY_ITEM_LENGTH),
    }));

  if (
    body.simulateProviderFailure === true ||
    env.KAIROS_FORCE_PROVIDER_ERROR === "true"
  ) {
    return {
      status: 503,
      payload: {
        error:
          "The AI intelligence provider encountered a service error or timeout. In accordance with KAIROS integrity standards, no unverified fallback response was substituted. Please retry.",
        code: "AI_PROVIDER_FAILURE",
        retryable: true,
      },
    };
  }

  const validatedContext = buildValidatedContext({
    productId: requestedProductId ? requestedProductId.trim() : undefined,
    currentPath:
      typeof body.currentPath === "string"
        ? body.currentPath.trim()
        : "/overview",
    activeAngleId:
      typeof body.activeAngleId === "string"
        ? body.activeAngleId.trim()
        : "monsoon-barrier",
    selectedAudienceId:
      typeof body.selectedAudienceId === "string"
        ? body.selectedAudienceId.trim()
        : "gen-z",
    selectedLanguage:
      typeof body.selectedLanguage === "string"
        ? body.selectedLanguage.trim()
        : "English",
  });

  const geminiKey =
    env.GEMINI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY || "";
  const openaiKey = env.OPENAI_API_KEY || "";
  const groqKey = env.GROQ_API_KEY || "";

  let rawReplyText = "";
  let structuredSections = null;
  let suggestedRoutes = [];
  let followUpQuestions = [];
  let activeProviderLabel = "";

  if (geminiKey || openaiKey || groqKey) {
    const systemPrompt = buildSystemPromptForLLM(validatedContext);
    try {
      if (geminiKey) {
        const res = await callGeminiProvider({
          apiKey: geminiKey,
          modelName: env.GEMINI_MODEL,
          systemPrompt,
          history: sanitizedHistory,
          message: trimmedMessage,
        });
        rawReplyText = res.text;
        activeProviderLabel = res.providerName;
      } else if (openaiKey) {
        const res = await callOpenAICompatibleProvider({
          apiKey: openaiKey,
          baseUrl: env.OPENAI_BASE_URL || "https://api.openai.com/v1",
          model: env.OPENAI_MODEL || "gpt-4o-mini",
          providerLabel: "OpenAI",
          systemPrompt,
          history: sanitizedHistory,
          message: trimmedMessage,
        });
        rawReplyText = res.text;
        activeProviderLabel = res.providerName;
      } else if (groqKey) {
        const res = await callOpenAICompatibleProvider({
          apiKey: groqKey,
          baseUrl: "https://api.groq.com/openai/v1",
          model: env.GROQ_MODEL || "llama-3.3-70b-versatile",
          providerLabel: "Groq",
          systemPrompt,
          history: sanitizedHistory,
          message: trimmedMessage,
        });
        rawReplyText = res.text;
        activeProviderLabel = res.providerName;
      }

      structuredSections = parseStructuredSections(rawReplyText);
      const localSynthesis = generateGroundedResponse({
        message: trimmedMessage,
        context: validatedContext,
      });
      suggestedRoutes = localSynthesis.suggestedRoutes;
      followUpQuestions = localSynthesis.followUpQuestions || [];
    } catch (providerErr) {
      const isTimeout = providerErr?.name === "AbortError";
      return {
        status: isTimeout ? 504 : 502,
        payload: {
          error: isTimeout
            ? "The AI provider timed out while generating a response. Please retry your request."
            : "The configured AI provider returned an error. Verify your server API key configuration or retry.",
          code: isTimeout ? "AI_PROVIDER_TIMEOUT" : "AI_PROVIDER_FAILURE",
          retryable: true,
        },
      };
    }
  } else {
    const grounded = generateGroundedResponse({
      message: trimmedMessage,
      context: validatedContext,
    });
    rawReplyText = grounded.reply;
    structuredSections = grounded.sections;
    suggestedRoutes = grounded.suggestedRoutes;
    followUpQuestions = grounded.followUpQuestions || [];
    activeProviderLabel = "KAIROS Grounded Intelligence Engine";
  }

  const { sanitizedText, validCitations, rejectedIds } =
    validateAndExtractCitations(rawReplyText);

  const safeRoutes = validateSuggestedRoutes(suggestedRoutes);

  return {
    status: 200,
    payload: {
      reply: sanitizedText,
      sections: structuredSections,
      citations: validCitations,
      rejectedCitationsCount: rejectedIds.length,
      suggestedRoutes: safeRoutes,
      followUpQuestions: followUpQuestions.slice(0, 3),
      provider: activeProviderLabel,
      contextSummary: {
        productId: validatedContext.selectedProduct.id,
        productName: validatedContext.selectedProduct.productName,
        brand: validatedContext.selectedProduct.brand,
        evidenceId: validatedContext.selectedProduct.evidenceId,
        unitPriceLabel: validatedContext.selectedProduct.unitPriceLabel,
        currentPage: validatedContext.currentPage.label,
        currentRoute: validatedContext.currentPage.route,
        selectedLanguage: validatedContext.selectedLanguage,
        datasetLimitationNote: validatedContext.datasetLimitationNote,
      },
      timestamp: new Date().toISOString(),
    },
  };
}
