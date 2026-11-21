/**
 * Unified Data Loader
 * Proof2Pitch AI / KAIROS (Vibe Coders Hackathon Edition 3)
 *
 * Bridges Phase 3 verified market research datasets with
 * Phase 2 sample demonstration fixtures.
 */

import {
  VERIFIED_SUNSCREEN_OBJECT as verifiedData,
  VERIFIED_MANIFEST_OBJECT as manifestData,
} from "./verifiedSunscreenRecord.js";
import {
  PRODUCTS as PHASE2_PRODUCTS,
  COMPETITORS as PHASE2_COMPETITORS,
  EVIDENCE_REVIEWS as PHASE2_REVIEWS,
  RESEARCH_METADATA as PHASE2_METADATA,
} from "../researchFixtures.js";

export const VERIFIED_SUNSCREEN_DATA = verifiedData;
export const VERIFIED_MANIFEST = manifestData;

/**
 * Standardized Phase 3 Verified Dataset Bundle
 */
export function getVerifiedSunscreenDataset() {
  return {
    id: "verified-sunscreen",
    name: "Sunscreen Market Intelligence",
    isVerified: true,
    metadata: verifiedData.metadata,
    primaryProduct: verifiedData.primaryProduct,
    allProducts: [
      verifiedData.primaryProduct,
      ...PHASE2_PRODUCTS,
    ],
    competitors: verifiedData.competitors,
    reviews: verifiedData.reviews,
  };
}

/**
 * Standardized Phase 2 Demonstration Fixture Bundle
 */
export function getPhase2SampleDataset() {
  return {
    id: "sample-fixtures",
    name: "Demonstration Archive (Phase 2 Sample Fixtures)",
    isVerified: false,
    metadata: PHASE2_METADATA,
    primaryProduct: PHASE2_PRODUCTS[0],
    allProducts: PHASE2_PRODUCTS,
    competitors: PHASE2_COMPETITORS,
    reviews: PHASE2_REVIEWS,
  };
}

/**
 * Empty Dataset Bundle for testing zero-state handling
 */
export function getEmptyTestDataset() {
  return {
    id: "empty-dataset",
    name: "Empty Dataset (Zero State Verification)",
    isVerified: false,
    metadata: {
      datasetName: "Empty Research Sandbox",
      status: "Empty Sandbox State",
      collectionTimestamp: new Date().toISOString(),
      provenanceStatement:
        "Zero-state test fixture verifying that UI elements render explicit empty states without runtime exceptions.",
    },
    primaryProduct: null,
    allProducts: [],
    competitors: [],
    reviews: [],
  };
}
