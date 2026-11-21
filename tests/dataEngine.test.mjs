/**
 * Data Validation Test Suite
 * Proof2Pitch AI / KAIROS (Vibe Coders Hackathon Edition 3)
 * 
 * Tests deterministic engine logic for:
 * 1. Missing prices (calculates unknown rather than 0 or NaN)
 * 2. Missing product information (catches missing required fields)
 * 3. Duplicate evidence IDs (flags and rejects duplicates)
 * 4. Invalid CSV and JSON syntax (gracefully catches and reports errors)
 * 5. Incompatible pack units (flags mass vs volume without density)
 * 6. Empty datasets (handles zero products/reviews gracefully)
 * 7. Missing reviews (allows dataset without reviews but warns cleanly)
 * 8. Broken or invalid source URLs (validates protocol and structure)
 */

import {
  normalizeUnitPrice,
  checkUnitCompatibility,
  isValidSourceUrl,
  validateProductRecord,
  validateReviewRecord,
  validateDataset,
  parseAndValidateJSON,
  parseAndValidateCSVReviews,
} from "../data/research/dataEngine.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  FAIL: ${testName} - ${details}`);
  }
}

console.log("\n========================================================");
console.log("RUNNING PROOF2PITCH DATA ENGINE TEST SUITE");
console.log("========================================================\n");

// 1. Missing Prices Test
console.log("1. Testing Missing Prices & Zero Handling:");
{
  const missingPrice = normalizeUnitPrice(null, 50, "g");
  assert(
    missingPrice.value === null && missingPrice.label === "Price Unknown",
    "Null price returns isCalculable: false and 'Price Unknown' label",
    JSON.stringify(missingPrice)
  );

  const zeroPrice = normalizeUnitPrice(0, 50, "g");
  assert(
    zeroPrice.value === null,
    "Zero price is treated as unknown rather than valid free price"
  );

  const validPrice = normalizeUnitPrice(445, 50, "g");
  assert(
    validPrice.value === 8.90 && validPrice.label === "₹8.90 / g",
    "Valid price calculates exact 8.90 per gram"
  );
}

// 2. Missing Product Information Test
console.log("\n2. Testing Missing Product Information:");
{
  const invalidProd = validateProductRecord({
    brand: "Dot & Key",
    // Missing productName, id, evidenceId, category, sourceUrl
  });
  assert(
    !invalidProd.isValid && invalidProd.errors.length >= 3,
    "Incomplete product record correctly rejected with required field errors"
  );

  const completeProd = validateProductRecord({
    id: "DK-01",
    evidenceId: "P001",
    brand: "Dot & Key",
    productName: "Vitamin C + E Sunscreen",
    category: "Sunscreen",
    sourceUrl: "https://dotandkey.com/product",
  });
  assert(
    completeProd.isValid && completeProd.sanitized.productName === "Vitamin C + E Sunscreen",
    "Complete product record passes validation"
  );
}

// 3. Duplicate Evidence IDs Test
console.log("\n3. Testing Duplicate Evidence IDs:");
{
  const seenIds = new Set(["P001", "C001"]);
  const duplicateProd = validateProductRecord(
    {
      id: "PROD-2",
      evidenceId: "P001", // Duplicate!
      brand: "Dot & Key",
      productName: "Another Product",
      category: "Sunscreen",
      sourceUrl: "https://dotandkey.com",
    },
    seenIds
  );
  assert(
    !duplicateProd.isValid && duplicateProd.errors.some((e) => e.includes("Duplicate evidence ID")),
    "Duplicate evidence ID is caught and flagged as an error"
  );

  const uniqueProd = validateProductRecord(
    {
      id: "PROD-3",
      evidenceId: "C002",
      brand: "Dr. Sheth's",
      productName: "Ceramide Sunscreen",
      category: "Sunscreen",
      sourceUrl: "https://drsheths.com",
    },
    seenIds
  );
  assert(
    uniqueProd.isValid,
    "Unique evidence ID passes without collision"
  );
}

// 4. Invalid CSV and JSON Test
console.log("\n4. Testing Invalid CSV and JSON Parsing:");
{
  const brokenJSON = "{ invalid_json_syntax: 123 ";
  const jsonResult = parseAndValidateJSON(brokenJSON);
  assert(
    !jsonResult.success && jsonResult.errors[0].includes("JSON Syntax Error"),
    "Malformed JSON string returns error rather than throwing an uncaught exception"
  );

  const brokenCSV = "not_enough_columns\nvalue1";
  const csvResult = parseAndValidateCSVReviews(brokenCSV);
  assert(
    !csvResult.success && csvResult.errors.some((e) => e.includes("missing required column")),
    "CSV missing required schema columns returns clear validation error"
  );

  const validCSV = `id,targetProductId,brand,productName,reviewer,date,rating,sentiment,category,verbatimQuote,sourcePlatform,sourceUrl
R100,DK-01,Dot & Key,Sunscreen,Test User,2026-11-21,5,positive,Texture,"Water-light texture, zero cast.",Nykaa,https://nykaa.com`;
  const validCsvResult = parseAndValidateCSVReviews(validCSV);
  assert(
    validCsvResult.success && validCsvResult.reviews.length === 1,
    "Valid CSV properly parses into typed review record"
  );
}

// 5. Incompatible Pack Units Test
console.log("\n5. Testing Incompatible Pack Units:");
{
  const sameUnits = checkUnitCompatibility("g", "g");
  assert(
    sameUnits.isCompatible && sameUnits.warning === null,
    "Identical units (g vs g) are compatible"
  );

  const crossUnits = checkUnitCompatibility("g", "ml");
  assert(
    !crossUnits.isCompatible && crossUnits.warning.includes("requires liquid density verification"),
    "Comparing mass (g) against volume (ml) generates explicit incompatibility warning"
  );
}

// 6. Empty Dataset Test
console.log("\n6. Testing Empty Dataset Handling:");
{
  const emptyDatasetResult = validateDataset({});
  assert(
    emptyDatasetResult.isValid && emptyDatasetResult.summary.totalEvidenceRecords === 0,
    "Empty dataset object is safely handled with zero records summary"
  );

  const nullDatasetResult = validateDataset(null);
  assert(
    !nullDatasetResult.isValid,
    "Null dataset returns invalid status gracefully without crashing"
  );
}

// 7. Missing Reviews Test
console.log("\n7. Testing Missing Reviews in Dataset:");
{
  const datasetWithoutReviews = {
    primaryProduct: {
      id: "DK-01",
      evidenceId: "P001",
      brand: "Dot & Key",
      productName: "Sunscreen",
      category: "Sunscreen",
      sourceUrl: "https://dotandkey.com",
    },
    competitors: [],
    reviews: [], // empty reviews array
  };
  const result = validateDataset(datasetWithoutReviews);
  assert(
    result.isValid && result.summary.reviewsCount === 0,
    "Dataset with empty reviews array remains valid with count 0"
  );
}

// 8. Broken or Invalid Source URLs Test
console.log("\n8. Testing Broken or Invalid Source URLs:");
{
  assert(
    !isValidSourceUrl("not-a-valid-url"),
    "Malformed URL string fails validation"
  );
  assert(
    !isValidSourceUrl("ftp://insecure-ftp.com"),
    "Non-HTTP/HTTPS protocol fails source URL validation"
  );
  assert(
    isValidSourceUrl("https://www.dotandkey.com/products/sunscreen"),
    "Valid HTTPS URL passes validation"
  );
}

console.log("\n========================================================");
console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${totalTests})`);
console.log("========================================================\n");

if (failedTests > 0) {
  process.exit(1);
}
