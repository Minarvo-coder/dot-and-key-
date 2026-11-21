/**
 * Research Data Engine
 * Proof2Pitch AI / KAIROS (Vibe Coders Hackathon Edition 3)
 * 
 * Deterministic calculation, unit normalization, schema validation,
 * and data ingestion engine for market intelligence records.
 */

import {
  REQUIRED_PRODUCT_FIELDS,
  REQUIRED_REVIEW_FIELDS,
  VALID_UNITS,
  DATA_STATUS,
  SOURCE_TYPES,
} from "./schema.js";

/**
 * Normalizes price per unit deterministically.
 * Treats missing values as unknown rather than zero or negative.
 * 
 * @param {number|null} price
 * @param {number|null} quantityValue
 * @param {string} quantityUnit
 * @returns {{ value: number|null, label: string, isCalculable: boolean }}
 */
export function normalizeUnitPrice(price, quantityValue, quantityUnit) {
  if (
    price === null ||
    price === undefined ||
    isNaN(Number(price)) ||
    Number(price) <= 0
  ) {
    return {
      value: null,
      label: "Price Unknown",
      isCalculable: false,
    };
  }

  if (
    quantityValue === null ||
    quantityValue === undefined ||
    isNaN(Number(quantityValue)) ||
    Number(quantityValue) <= 0
  ) {
    return {
      value: null,
      label: "Pack Size Unknown",
      isCalculable: false,
    };
  }

  const cleanUnit = (quantityUnit || "").toLowerCase().trim();
  const unitLabel = cleanUnit || "unit";
  const numPrice = Number(price);
  const numQty = Number(quantityValue);
  const unitPrice = Number((numPrice / numQty).toFixed(2));

  return {
    value: unitPrice,
    label: `₹${unitPrice.toFixed(2)} / ${unitLabel}`,
    isCalculable: true,
  };
}

/**
 * Checks physical unit compatibility between two product quantities.
 * Prevents direct comparison between mass (g) and volume (ml) without density verification.
 * 
 * @param {string} unitA
 * @param {string} unitB
 * @returns {{ isCompatible: boolean, warning: string|null }}
 */
export function checkUnitCompatibility(unitA, unitB) {
  const uA = (unitA || "").toLowerCase().trim();
  const uB = (unitB || "").toLowerCase().trim();

  if (!uA || !uB) {
    return {
      isCompatible: false,
      warning: "One or both product pack units are unspecified.",
    };
  }

  if (uA === uB) {
    return {
      isCompatible: true,
      warning: null,
    };
  }

  // Cross-dimension check: mass (g/kg) vs volume (ml/l)
  const isMassA = uA === "g" || uA === "kg";
  const isMassB = uB === "g" || uB === "kg";
  const isVolA = uA === "ml" || uA === "l";
  const isVolB = uB === "ml" || uB === "l";

  if ((isMassA && isVolB) || (isVolA && isMassB)) {
    return {
      isCompatible: false,
      warning: `Incompatible comparison: Product A is measured in ${uA} while Product B is measured in ${uB}. Direct 1:1 comparison requires liquid density verification.`,
    };
  }

  return {
    isCompatible: false,
    warning: `Different unit metrics (${uA} vs ${uB}). Conversion required.`,
  };
}

/**
 * Validates a web source URL for protocol and structure.
 * 
 * @param {string} urlString
 * @returns {boolean}
 */
export function isValidSourceUrl(urlString) {
  if (!urlString || typeof urlString !== "string") return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates an individual product record.
 * 
 * @param {object} record
 * @param {Set<string>} existingEvidenceIds
 * @returns {{ isValid: boolean, errors: string[], warnings: string[], sanitized: object }}
 */
export function validateProductRecord(record, existingEvidenceIds = new Set()) {
  const errors = [];
  const warnings = [];

  if (!record || typeof record !== "object") {
    return {
      isValid: false,
      errors: ["Product record must be a non-null object."],
      warnings: [],
      sanitized: null,
    };
  }

  // Required field check
  for (const field of REQUIRED_PRODUCT_FIELDS) {
    if (!record[field] || String(record[field]).trim() === "") {
      errors.push(`Missing required product field: '${field}'.`);
    }
  }

  const evidenceId = String(record.evidenceId || record.id || "").trim();
  if (evidenceId && existingEvidenceIds.has(evidenceId)) {
    errors.push(`Duplicate evidence ID detected: '${evidenceId}'. Every record must have a unique ID.`);
  }

  // URL validity check
  if (record.sourceUrl && !isValidSourceUrl(record.sourceUrl)) {
    errors.push(`Invalid source URL format: '${record.sourceUrl}'. Must be a valid http or https URL.`);
  }

  // Price validation
  if (record.retailPriceINR !== undefined && record.retailPriceINR !== null) {
    const priceNum = Number(record.retailPriceINR);
    if (isNaN(priceNum) || priceNum <= 0) {
      warnings.push(`Retail price '${record.retailPriceINR}' is not a positive number. Marking as unknown.`);
    }
  } else {
    warnings.push("Retail price is missing. Treated as unknown rather than zero.");
  }

  // Pack size and unit validation
  if (!record.declaredNetQuantity) {
    warnings.push("Declared net quantity is missing. Pack size marked as unknown.");
  }

  // Unit normalization calculation
  const norm = normalizeUnitPrice(
    record.retailPriceINR,
    record.quantityValue,
    record.quantityUnit
  );

  const sanitized = {
    id: record.id || `PROD-${Date.now()}`,
    evidenceId: evidenceId || `EVD-${Date.now()}`,
    brand: String(record.brand || "Unknown Brand").trim(),
    productName: String(record.productName || "Unnamed Product").trim(),
    category: String(record.category || "Cosmetics").trim(),
    isPrimary: Boolean(record.isPrimary),
    retailPriceINR: (record.retailPriceINR && !isNaN(Number(record.retailPriceINR))) ? Number(record.retailPriceINR) : null,
    discountedPriceINR: (record.discountedPriceINR && !isNaN(Number(record.discountedPriceINR))) ? Number(record.discountedPriceINR) : null,
    currency: record.currency || "INR",
    declaredNetQuantity: record.declaredNetQuantity || "Unknown",
    quantityValue: (record.quantityValue && !isNaN(Number(record.quantityValue))) ? Number(record.quantityValue) : null,
    quantityUnit: record.quantityUnit || "unknown",
    unitMetricLabel: norm.label,
    pricePerUnit: norm.value,
    spfRating: record.spfRating || null,
    paRating: record.paRating || null,
    sampleRating: (record.sampleRating && !isNaN(Number(record.sampleRating))) ? Number(record.sampleRating) : null,
    ratingScale: record.ratingScale || "5.0",
    activeIngredients: Array.isArray(record.activeIngredients) ? record.activeIngredients : [],
    advertisedAttributes: Array.isArray(record.advertisedAttributes) ? record.advertisedAttributes : [],
    texture: record.texture || null,
    finish: record.finish || null,
    packaging: record.packaging || null,
    identifiedFlaw: record.identifiedFlaw || null,
    normalizationNote: record.normalizationNote || null,
    sourceUrl: record.sourceUrl || "",
    sourcePlatform: record.sourcePlatform || "Public Listing",
    sourceType: record.sourceType || SOURCE_TYPES.PUBLIC_ECOMMERCE,
    dataStatus: record.dataStatus || DATA_STATUS.VERIFIED_SNAPSHOT,
    collectedAt: record.collectedAt || new Date().toISOString(),
    verifiedBy: record.verifiedBy || "Proof2Pitch Ingestion Engine",
  };

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitized,
  };
}

/**
 * Validates an individual review record.
 * 
 * @param {object} record
 * @param {Set<string>} existingEvidenceIds
 * @returns {{ isValid: boolean, errors: string[], warnings: string[], sanitized: object }}
 */
export function validateReviewRecord(record, existingEvidenceIds = new Set()) {
  const errors = [];
  const warnings = [];

  if (!record || typeof record !== "object") {
    return {
      isValid: false,
      errors: ["Review record must be a non-null object."],
      warnings: [],
      sanitized: null,
    };
  }

  for (const field of REQUIRED_REVIEW_FIELDS) {
    if (!record[field] || String(record[field]).trim() === "") {
      errors.push(`Missing required review field: '${field}'.`);
    }
  }

  const reviewId = String(record.id || "").trim();
  if (reviewId && existingEvidenceIds.has(reviewId)) {
    errors.push(`Duplicate review ID detected: '${reviewId}'.`);
  }

  if (record.sourceUrl && !isValidSourceUrl(record.sourceUrl)) {
    warnings.push(`Source URL '${record.sourceUrl}' is not a standard http/https format.`);
  }

  let ratingNum = null;
  if (record.rating !== undefined && record.rating !== null) {
    ratingNum = Number(record.rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      warnings.push(`Rating '${record.rating}' is outside standard 1 to 5 range.`);
    }
  }

  const sanitized = {
    id: reviewId || `REV-${Date.now()}`,
    targetProductId: String(record.targetProductId || "").trim(),
    brand: String(record.brand || "Unknown Brand").trim(),
    productName: String(record.productName || "Unknown Product").trim(),
    reviewer: String(record.reviewer || "Anonymous Customer").trim(),
    date: record.date || "Unknown Date",
    rating: ratingNum,
    sentiment: record.sentiment || "neutral",
    category: record.category || "General Feedback",
    scope: record.scope || "product-level",
    verbatimQuote: String(record.verbatimQuote || "").trim(),
    tags: Array.isArray(record.tags) ? record.tags : [],
    sourcePlatform: String(record.sourcePlatform || "Public Review").trim(),
    sourceUrl: record.sourceUrl || "",
    sourceType: record.sourceType || SOURCE_TYPES.PUBLIC_ECOMMERCE,
    dataStatus: record.dataStatus || DATA_STATUS.VERIFIED_SNAPSHOT,
    collectedAt: record.collectedAt || new Date().toISOString(),
  };

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitized,
  };
}

/**
 * Validates a complete dataset payload.
 * 
 * @param {object} dataset
 * @returns {{ isValid: boolean, summary: object, errors: string[], warnings: string[], sanitizedDataset: object|null }}
 */
export function validateDataset(dataset) {
  const errors = [];
  const warnings = [];
  const existingIds = new Set();

  if (!dataset || typeof dataset !== "object") {
    return {
      isValid: false,
      summary: { totalRecords: 0 },
      errors: ["Dataset payload must be a non-null object."],
      warnings: [],
      sanitizedDataset: null,
    };
  }

  // Validate primary product if present
  let sanitizedPrimary = null;
  if (dataset.primaryProduct) {
    const prodCheck = validateProductRecord(dataset.primaryProduct, existingIds);
    if (!prodCheck.isValid) {
      errors.push(...prodCheck.errors.map((e) => `Primary Product: ${e}`));
    }
    warnings.push(...prodCheck.warnings.map((w) => `Primary Product: ${w}`));
    sanitizedPrimary = prodCheck.sanitized;
    if (sanitizedPrimary?.evidenceId) {
      existingIds.add(sanitizedPrimary.evidenceId);
    }
  } else {
    warnings.push("No primary product defined in dataset.");
  }

  // Validate competitors
  const sanitizedCompetitors = [];
  const compList = Array.isArray(dataset.competitors) ? dataset.competitors : [];
  compList.forEach((comp, idx) => {
    const compCheck = validateProductRecord(comp, existingIds);
    if (!compCheck.isValid) {
      errors.push(...compCheck.errors.map((e) => `Competitor #${idx + 1}: ${e}`));
    }
    warnings.push(...compCheck.warnings.map((w) => `Competitor #${idx + 1}: ${w}`));
    if (compCheck.sanitized) {
      sanitizedCompetitors.push(compCheck.sanitized);
      if (compCheck.sanitized.evidenceId) {
        existingIds.add(compCheck.sanitized.evidenceId);
      }
    }
  });

  // Validate reviews
  const sanitizedReviews = [];
  const reviewList = Array.isArray(dataset.reviews) ? dataset.reviews : [];
  reviewList.forEach((rev, idx) => {
    const revCheck = validateReviewRecord(rev, existingIds);
    if (!revCheck.isValid) {
      errors.push(...revCheck.errors.map((e) => `Review #${idx + 1}: ${e}`));
    }
    warnings.push(...revCheck.warnings.map((w) => `Review #${idx + 1}: ${w}`));
    if (revCheck.sanitized) {
      sanitizedReviews.push(revCheck.sanitized);
      if (revCheck.sanitized.id) {
        existingIds.add(revCheck.sanitized.id);
      }
    }
  });

  const sanitizedDataset = {
    metadata: dataset.metadata || {
      datasetName: "User Ingested Research Dataset",
      status: DATA_STATUS.IMPORTED_USER_DATA,
      collectionTimestamp: new Date().toISOString(),
      provenanceStatement: "User-imported research dataset verified through Proof2Pitch data validation engine.",
    },
    primaryProduct: sanitizedPrimary,
    competitors: sanitizedCompetitors,
    reviews: sanitizedReviews,
  };

  return {
    isValid: errors.length === 0,
    summary: {
      hasPrimaryProduct: Boolean(sanitizedPrimary),
      competitorsCount: sanitizedCompetitors.length,
      reviewsCount: sanitizedReviews.length,
      totalEvidenceRecords: existingIds.size,
    },
    errors,
    warnings,
    sanitizedDataset: errors.length === 0 ? sanitizedDataset : null,
  };
}

/**
 * Parses and validates raw JSON input.
 * 
 * @param {string} jsonString
 * @returns {{ success: boolean, dataset?: object, errors: string[], warnings: string[] }}
 */
export function parseAndValidateJSON(jsonString) {
  if (!jsonString || typeof jsonString !== "string" || jsonString.trim() === "") {
    return {
      success: false,
      errors: ["Input JSON string is empty."],
      warnings: [],
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    return {
      success: false,
      errors: [`JSON Syntax Error: ${err.message}`],
      warnings: [],
    };
  }

  const result = validateDataset(parsed);
  return {
    success: result.isValid,
    dataset: result.sanitizedDataset,
    summary: result.summary,
    errors: result.errors,
    warnings: result.warnings,
  };
}

/**
 * Parses a simple CSV row respecting quoted fields.
 * 
 * @param {string} text
 * @returns {string[][]}
 */
export function parseCSVToRows(text) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Parses and validates CSV formatted customer reviews.
 * Expected headers: id, targetProductId, brand, productName, reviewer, date, rating, sentiment, verbatimQuote, sourcePlatform, sourceUrl
 * 
 * @param {string} csvText
 * @returns {{ success: boolean, reviews?: object[], errors: string[], warnings: string[] }}
 */
export function parseAndValidateCSVReviews(csvText) {
  if (!csvText || typeof csvText !== "string" || csvText.trim() === "") {
    return {
      success: false,
      errors: ["Input CSV string is empty."],
      warnings: [],
    };
  }

  const rows = parseCSVToRows(csvText);
  if (rows.length < 2) {
    return {
      success: false,
      errors: ["CSV must contain a header row and at least one data row."],
      warnings: [],
    };
  }

  const headerRow = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const requiredHeaderKeys = ["id", "targetproductid", "verbatimquote", "sourceplatform"];
  for (const req of requiredHeaderKeys) {
    if (!headerRow.includes(req)) {
      return {
        success: false,
        errors: [`CSV missing required column header: '${req}'. Found: ${headerRow.join(", ")}`],
        warnings: [],
      };
    }
  }

  const headerMap = {};
  headerRow.forEach((col, idx) => {
    headerMap[col] = idx;
  });

  const parsedReviews = [];
  const errors = [];
  const warnings = [];
  const seenIds = new Set();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const getVal = (col) => (headerMap[col] !== undefined ? row[headerMap[col]] || "" : "");

    const rawRecord = {
      id: getVal("id"),
      targetProductId: getVal("targetproductid"),
      brand: getVal("brand") || "Dot & Key",
      productName: getVal("productname") || "Sunscreen",
      reviewer: getVal("reviewer") || "Imported Reviewer",
      date: getVal("date") || new Date().toISOString().split("T")[0],
      rating: getVal("rating") ? Number(getVal("rating")) : 5,
      sentiment: getVal("sentiment") || "positive",
      category: getVal("category") || "General",
      verbatimQuote: getVal("verbatimquote"),
      sourcePlatform: getVal("sourceplatform"),
      sourceUrl: getVal("sourceurl") || "https://example.com",
      tags: getVal("tags") ? getVal("tags").split(";").map((t) => t.trim()) : [],
    };

    const validated = validateReviewRecord(rawRecord, seenIds);
    if (!validated.isValid) {
      errors.push(...validated.errors.map((e) => `Row ${r}: ${e}`));
    }
    warnings.push(...validated.warnings.map((w) => `Row ${r}: ${w}`));

    if (validated.sanitized) {
      parsedReviews.push(validated.sanitized);
      seenIds.add(validated.sanitized.id);
    }
  }

  return {
    success: errors.length === 0,
    reviews: parsedReviews,
    errors,
    warnings,
  };
}
