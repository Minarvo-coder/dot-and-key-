/**
 * Shared Research Data Schema
 * Proof2Pitch AI (Vibe Coders Hackathon Edition 3)
 * Team: kairos
 * 
 * Defines the canonical data contract for primary products,
 * competitor products, customer reviews, and verification manifests.
 */

export const SCHEMA_VERSION = "3.0.0";

/**
 * Expected unit types for cosmetics packaging.
 */
export const VALID_UNITS = ["g", "ml", "kg", "l"];

/**
 * Data status types representing verification confidence.
 */
export const DATA_STATUS = {
  VERIFIED_SNAPSHOT: "verified_snapshot",
  SAMPLE_FIXTURE: "sample_fixture",
  IMPORTED_USER_DATA: "imported_user_data",
  UNVERIFIED: "unverified",
};

/**
 * Source types for evidence provenance.
 */
export const SOURCE_TYPES = {
  OFFICIAL_BRAND_STORE: "official_brand_store",
  PUBLIC_ECOMMERCE: "public_ecommerce",
  COMMUNITY_AGGREGATOR: "community_aggregator",
  USER_SUPPLIED: "user_supplied",
};

/**
 * Canonical product record structure validator specification.
 */
export const REQUIRED_PRODUCT_FIELDS = [
  "id",
  "evidenceId",
  "brand",
  "productName",
  "category",
  "sourceUrl",
];

export const REQUIRED_REVIEW_FIELDS = [
  "id",
  "targetProductId",
  "verbatimQuote",
  "sourcePlatform",
];

export const REQUIRED_MANIFEST_FIELDS = [
  "evidenceId",
  "sourceUrl",
  "verifiedStatus",
  "lastCheckedAt",
];
