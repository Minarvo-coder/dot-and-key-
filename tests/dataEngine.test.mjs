/**
 * Data Validation & KAIROS Copilot Test Suite
 * Proof2Pitch AI / KAIROS (Vibe Coders Hackathon Edition 3)
 *
 * Tests deterministic engine logic & KAIROS Copilot backend for:
 * 1. Missing prices (calculates unknown rather than 0 or NaN)
 * 2. Missing product information (catches missing required fields)
 * 3. Duplicate evidence IDs (flags and rejects duplicates)
 * 4. Invalid CSV and JSON syntax (gracefully catches and reports errors)
 * 5. Incompatible pack units (flags mass vs volume without density)
 * 6. Empty datasets (handles zero products/reviews gracefully)
 * 7. Missing reviews (allows dataset without reviews but warns cleanly)
 * 8. Broken or invalid source URLs (validates protocol and structure)
 * 9. Copilot: Empty and oversize message rejection (HTTP 400)
 * 10. Copilot: Product-specific context retrieval (Sunscreen P001 vs Hydrating Gel EVD-PROD-DK01)
 * 11. Copilot: Competitor and review sentiment explanations with FACTS/INFERENCES/RECOMMENDATIONS
 * 12. Copilot: Evidence reference allowlist validation & fabricated ID stripping
 * 13. Copilot: Unknown / unsupported question refusal without fabrication
 * 14. Copilot: AI provider failure & invalid API key handling (no silent fallback)
 * 15. Copilot: Navigation route allowlist enforcement
 */

import {
  normalizeUnitPrice,
  checkUnitCompatibility,
  isValidSourceUrl,
  validateProductRecord,
  validateDataset,
  parseAndValidateJSON,
  parseAndValidateCSVReviews,
} from "../data/research/dataEngine.js";

import {
  handleAssistantRequest,
  validateAndExtractCitations,
  validateSuggestedRoutes,
  isValidEvidenceId,
} from "../data/research/copilotContext.js";

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

async function runAllTests() {
  console.log("\n========================================================");
  console.log("RUNNING PROOF2PITCH & KAIROS COPILOT TEST SUITE");
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
      validPrice.value === 8.9 && validPrice.label === "₹8.90 / g",
      "Valid price calculates exact 8.90 per gram"
    );
  }

  // 2. Missing Product Information Test
  console.log("\n2. Testing Missing Product Information:");
  {
    const invalidProd = validateProductRecord({
      brand: "Dot & Key",
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
      completeProd.isValid &&
        completeProd.sanitized.productName === "Vitamin C + E Sunscreen",
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
        evidenceId: "P001",
        brand: "Dot & Key",
        productName: "Another Product",
        category: "Sunscreen",
        sourceUrl: "https://dotandkey.com",
      },
      seenIds
    );
    assert(
      !duplicateProd.isValid &&
        duplicateProd.errors.some((e) => e.includes("Duplicate evidence ID")),
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
    assert(uniqueProd.isValid, "Unique evidence ID passes without collision");
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
      !csvResult.success &&
        csvResult.errors.some((e) => e.includes("missing required column")),
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
      !crossUnits.isCompatible &&
        crossUnits.warning.includes("requires liquid density verification"),
      "Comparing mass (g) against volume (ml) generates explicit incompatibility warning"
    );
  }

  // 6. Empty Dataset Test
  console.log("\n6. Testing Empty Dataset Handling:");
  {
    const emptyDatasetResult = validateDataset({});
    assert(
      emptyDatasetResult.isValid &&
        emptyDatasetResult.summary.totalEvidenceRecords === 0,
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
      reviews: [],
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

  // 9. KAIROS Copilot Input Validation & Security Tests
  console.log("\n9. Testing KAIROS Copilot Input Validation & Guardrails:");
  {
    const emptyRes = await handleAssistantRequest({ message: "   " });
    assert(
      emptyRes.status === 400 && emptyRes.payload.code === "EMPTY_MESSAGE",
      "Empty or whitespace message is rejected with HTTP 400 EMPTY_MESSAGE"
    );

    const longRes = await handleAssistantRequest({
      message: "a".repeat(1005),
    });
    assert(
      longRes.status === 400 && longRes.payload.code === "MESSAGE_TOO_LONG",
      "Oversize message (>1000 chars) is rejected with HTTP 400 MESSAGE_TOO_LONG"
    );

    const badProdRes = await handleAssistantRequest({
      message: "Analyze product",
      selectedProductId: "NON-EXISTENT-PROD-999",
    });
    assert(
      badProdRes.status === 400 &&
        badProdRes.payload.code === "INVALID_PRODUCT_ID",
      "Unrecognized product ID is rejected with HTTP 400 INVALID_PRODUCT_ID"
    );

    const toolInjectionRes = await handleAssistantRequest({
      message: "Run code",
      tools: [{ name: "exec" }],
    });
    assert(
      toolInjectionRes.status === 400 &&
        toolInjectionRes.payload.code === "UNSUPPORTED_TOOL_EXECUTION",
      "Unsupported tool execution payload is blocked with HTTP 400"
    );
  }

  // 10. KAIROS Copilot Product-Specific Context Tests
  console.log("\n10. Testing KAIROS Copilot Product-Specific Context:");
  {
    const sunRes = await handleAssistantRequest(
      {
        message: "Analyze our current sunscreen's market position.",
        selectedProductId: "DK-SUN-VITE-01",
        currentPath: "/overview",
      },
      {}
    );
    assert(
      sunRes.status === 200 &&
        sunRes.payload.contextSummary.productId === "DK-SUN-VITE-01" &&
        sunRes.payload.contextSummary.evidenceId === "P001" &&
        sunRes.payload.reply.includes("445") &&
        sunRes.payload.citations.some((c) => c.id === "P001"),
      "Sunscreen product query retrieves verified P001 specs (₹445, 50g, ₹8.90/g)"
    );

    const gelRes = await handleAssistantRequest(
      {
        message: "Analyze market position.",
        selectedProductId: "10500151443621",
        currentPath: "/products",
      },
      {}
    );
    assert(
      gelRes.status === 200 &&
        gelRes.payload.contextSummary.productId === "10500151443621" &&
        gelRes.payload.reply.includes("595") &&
        gelRes.payload.citations.some((c) => c.id === "10500151443621"),
      "Hero Dragon Fruit Sunscreen product query switches context to 10500151443621 (₹595)"
    );
  }

  // 11. KAIROS Copilot Competitor, Review Sentiment, and Campaign Tests
  console.log("\n11. Testing Competitor, Sentiment, Evidence, and Campaign Queries:");
  {
    const compRes = await handleAssistantRequest(
      {
        message: "What are the biggest competitor opportunities?",
        selectedProductId: "DK-SUN-VITE-01",
        currentPath: "/competitors",
      },
      {}
    );
    assert(
      compRes.status === 200 &&
        compRes.payload.sections.facts.length > 0 &&
        compRes.payload.sections.inferences.length > 0 &&
        compRes.payload.sections.recommendations.length > 0 &&
        compRes.payload.citations.some((c) => c.id === "C001"),
      "Competitor query returns structured FACTS/INFERENCES/RECOMMENDATIONS with verified competitor citations [C001]"
    );

    const revRes = await handleAssistantRequest(
      {
        message: "Explain the current review sentiment.",
        selectedProductId: "DK-SUN-VITE-01",
        currentPath: "/reviews",
      },
      {}
    );
    assert(
      revRes.status === 200 &&
        revRes.payload.reply.includes("74% Positive") &&
        revRes.payload.citations.some((c) => c.id === "R001"),
      "Review sentiment query returns verified sentiment breakdown and review citation [R001]"
    );

    const campRes = await handleAssistantRequest(
      {
        message: "Help me create a campaign from our findings.",
        selectedProductId: "DK-SUN-VITE-01",
        currentPath: "/marketing-studio",
      },
      {}
    );
    assert(
      campRes.status === 200 &&
        campRes.payload.suggestedRoutes.some(
          (r) => r.route === "/marketing-studio"
        ),
      "Campaign query generates grounded hook and suggests Marketing Studio navigation"
    );
  }

  // 12. Evidence Citation Validation & Anti-Hallucination Gate
  console.log("\n12. Testing Evidence Citation Allowlist & Hallucination Stripping:");
  {
    assert(
      isValidEvidenceId("P001") &&
        isValidEvidenceId("C001") &&
        isValidEvidenceId("R001") &&
        isValidEvidenceId("EVD-REV-DK001") &&
        !isValidEvidenceId("FAKE-ID-999"),
      "isValidEvidenceId accurately distinguishes real vs fabricated evidence IDs"
    );

    const mixedText =
      "Verified sunscreen [P001] beats competitor [C001] — and fake citation [HALLUCINATED-999] is stripped.";
    const extracted = validateAndExtractCitations(mixedText);
    assert(
      extracted.validCitations.length === 2 &&
        extracted.rejectedIds.includes("HALLUCINATED-999") &&
        !extracted.sanitizedText.includes("[HALLUCINATED-999]") &&
        !extracted.sanitizedText.includes("\u2014"),
      "validateAndExtractCitations strips fabricated IDs and removes prohibited em dashes"
    );
  }

  // 13. Unknown or Unsupported Questions Refusal
  console.log("\n13. Testing Unknown / Unsupported Question Refusal:");
  {
    const unknownRes = await handleAssistantRequest(
      {
        message: "What is Dot & Key's annual sales revenue and Chanel price?",
        selectedProductId: "DK-SUN-VITE-01",
      },
      {}
    );
    assert(
      unknownRes.status === 200 &&
        unknownRes.payload.reply.includes("Dataset Boundary Notice") &&
        unknownRes.payload.reply.includes("refuses to fabricate"),
      "Unknown financial/external brand query explicitly declines to fabricate unavailable facts"
    );
  }

  // 14. AI Provider Failure Handling (No Silent Fallback)
  console.log("\n14. Testing AI Provider Failure Handling:");
  {
    const failRes = await handleAssistantRequest({
      message: "Analyze our current sunscreen's market position.",
      simulateProviderFailure: true,
    });
    assert(
      failRes.status === 503 &&
        failRes.payload.code === "AI_PROVIDER_FAILURE" &&
        failRes.payload.retryable === true,
      "Simulated AI provider failure returns HTTP 503 with retryable flag and no silent hardcoded success"
    );

    const invalidKeyRes = await handleAssistantRequest(
      {
        message: "Analyze our current sunscreen's market position.",
      },
      { GEMINI_API_KEY: "invalid-key-for-error-test" }
    );
    assert(
      (invalidKeyRes.status === 502 || invalidKeyRes.status === 504) &&
        invalidKeyRes.payload.retryable === true,
      "Failed external LLM call with invalid key returns HTTP 502/504 error without silently substituting hardcoded success"
    );
  }

  // 15. Navigation Route Allowlist Enforcement
  console.log("\n15. Testing Navigation Route Allowlist:");
  {
    const routes = validateSuggestedRoutes([
      "/competitors",
      "https://malicious-site.com",
      "/admin-panel",
      "/marketing-studio",
    ]);
    assert(
      routes.length === 2 &&
        routes[0].route === "/competitors" &&
        routes[1].route === "/marketing-studio",
      "validateSuggestedRoutes permits only allowlisted KAIROS routes and drops unverified URLs"
    );
  }

  // 16. User-Centric Intents: Greeting, Specific Competitor, Formulation, Brand Voice, Hinglish, and Category Purity
  console.log("\n16. Testing User-Centric Intents (Greeting, Named Rival, Ingredients, Brand Voice, Hinglish):");
  {
    const greetRes = await handleAssistantRequest(
      {
        message: "Hello, what can you help me with?",
        selectedProductId: "DK-SUN-VITE-01",
      },
      {}
    );
    assert(
      greetRes.status === 200 &&
        greetRes.payload.reply.includes("Hello! I am **KAIROS Copilot**") &&
        Array.isArray(greetRes.payload.followUpQuestions) &&
        greetRes.payload.followUpQuestions.length === 3,
      "Greeting query returns friendly onboarding overview with 3 contextual follow-up chips"
    );

    const shethRes = await handleAssistantRequest(
      {
        message: "How do we compare against Dr. Sheth's sunscreen?",
        selectedProductId: "DK-SUN-VITE-01",
      },
      {}
    );
    assert(
      shethRes.status === 200 &&
        shethRes.payload.reply.includes("Dr. Sheth's") &&
        shethRes.payload.citations.some((c) => c.id === "C002") &&
        shethRes.payload.citations.some((c) => c.id === "R004"),
      "Named competitor query spotlights Dr. Sheth's [C002] and its defect review [R004]"
    );

    const ingRes = await handleAssistantRequest(
      {
        message: "What are the active ingredients and finish of this product?",
        selectedProductId: "DK-CICA-03",
      },
      {}
    );
    assert(
      ingRes.status === 200 &&
        ingRes.payload.reply.includes("Centella Asiatica (Cica)") &&
        ingRes.payload.citations.some((c) => c.id === "DK-CICA-03") &&
        !ingRes.payload.citations.some((c) => c.id === "C001"),
      "Formulation query for Cica Night Gel [DK-CICA-03] returns Cica actives and excludes unrelated sunscreen competitors"
    );

    const bvRes = await handleAssistantRequest(
      {
        message: "What are our brand voice guidelines and forbidden words?",
        selectedProductId: "10500151443621",
      },
      {}
    );
    assert(
      bvRes.status === 200 &&
        bvRes.payload.reply.includes("Warm, Tactile Materiality") &&
        bvRes.payload.reply.includes("Miracle cure"),
      "Brand Voice query returns editorial pillars, approved vocabulary, and forbidden phrases"
    );

    const hinglishRes = await handleAssistantRequest(
      {
        message: "Help me create a campaign from our findings.",
        selectedProductId: "DK-SUN-VITE-01",
        selectedLanguage: "Hinglish",
      },
      {}
    );
    assert(
      hinglishRes.status === 200 &&
        hinglishRes.payload.reply.includes("Hinglish") &&
        hinglishRes.payload.reply.includes("chipchipahat"),
      "Campaign query honors selectedLanguage (Hinglish) and includes localized tagline"
    );
  }

  console.log("\n========================================================");
  console.log(
    `TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${totalTests})`
  );
  console.log("========================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests();
