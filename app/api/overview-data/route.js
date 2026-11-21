import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || "";
    const productTitle = searchParams.get("productTitle") || "";

    const dataDir = path.join(process.cwd(), "data");

    // 1. Catalogue stats from raw products
    let catalogueCount = 0;
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    const rawProductsPath = path.join(dataDir, "raw", "dotandkey-products.json");

    if (fs.existsSync(rawProductsPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(rawProductsPath, "utf-8"));
        const standalone = (raw.products || []).filter((p) => {
          const t = (p.product_type || "").toLowerCase().trim();
          return t !== "free" && t !== "combo";
        });
        catalogueCount = standalone.length;
        standalone.forEach((p) => {
          (p.variants || []).forEach((v) => {
            const pr = parseFloat(v.price) || 0;
            if (pr > 0) {
              if (pr < minPrice) minPrice = pr;
              if (pr > maxPrice) maxPrice = pr;
            }
          });
        });
      } catch (e) {
        console.error("Error reading raw products:", e);
      }
    }
    if (minPrice === Infinity) minPrice = 0;
    if (maxPrice === -Infinity) maxPrice = 0;

    // 2. Reviews from data/reviews.json
    let reviewsCount = null;
    let sentiment = null;
    let topInsights = [];
    const reviewsPath = path.join(dataDir, "reviews.json");

    if (fs.existsSync(reviewsPath)) {
      try {
        const fileContent = fs.readFileSync(reviewsPath, "utf-8").trim();
        if (fileContent) {
          const parsed = JSON.parse(fileContent);
          const rawReviews = Array.isArray(parsed)
            ? parsed
            : parsed.reviews || [];

          // Filter by active product if product identifiers match
          const productReviews = rawReviews.filter((r) => {
            if (!productId && !productTitle) return true;
            if (r.productId && String(r.productId) === String(productId)) return true;
            if (r.product_id && String(r.product_id) === String(productId)) return true;
            if (r.productTitle && productTitle && r.productTitle.toLowerCase().includes(productTitle.toLowerCase().slice(0, 15))) return true;
            if (r.productName && productTitle && r.productName.toLowerCase().includes(productTitle.toLowerCase().slice(0, 15))) return true;
            return false;
          });

          const activeReviews = productReviews.length > 0 ? productReviews : (rawReviews.length > 0 ? rawReviews : []);

          if (activeReviews.length > 0) {
            reviewsCount = activeReviews.length;
            let pos = 0;
            let neu = 0;
            let crit = 0;

            activeReviews.forEach((r) => {
              const stars = Number(r.rating || r.stars || 5);
              if (stars >= 4) pos++;
              else if (stars === 3) neu++;
              else crit++;
            });

            const total = activeReviews.length;
            sentiment = {
              positivePercent: Math.round((pos / total) * 100),
              neutralPercent: Math.round((neu / total) * 100),
              criticalPercent: Math.round((crit / total) * 100),
              pos,
              neu,
              crit,
              total,
            };

            // Top insights: up to 3 shortest snippets
            const sortedByLength = [...activeReviews]
              .filter((r) => (r.reviewText || r.body || r.text || r.verbatimQuote || "").trim().length > 10)
              .sort((a, b) => {
                const lenA = (a.reviewText || a.body || a.text || a.verbatimQuote || "").length;
                const lenB = (b.reviewText || b.body || b.text || b.verbatimQuote || "").length;
                return lenA - lenB;
              });

            topInsights = sortedByLength.slice(0, 3).map((r) => ({
              id: r.id || r._id || Math.random().toString(),
              stars: Number(r.rating || r.stars || 5),
              text: r.reviewText || r.body || r.text || r.verbatimQuote || "",
              sourceName: r.source || r.platform || r.sourcePlatform || "Nykaa / Amazon",
              sourceUrl: r.url || r.sourceUrl || null,
            }));
          }
        }
      } catch (e) {
        console.error("Error reading reviews.json:", e);
      }
    }

    // 3. Competitors from data/competitors.json
    let competitorsCount = null;
    let competitorNames = [];
    const competitorsPath = path.join(dataDir, "competitors.json");

    if (fs.existsSync(competitorsPath)) {
      try {
        const fileContent = fs.readFileSync(competitorsPath, "utf-8").trim();
        if (fileContent) {
          const parsed = JSON.parse(fileContent);
          const rawCompetitors = Array.isArray(parsed)
            ? parsed
            : parsed.competitors || [];

          const activeCompetitors = rawCompetitors.filter((c) => {
            if (!productId) return true;
            if (c.forProductId && String(c.forProductId) === String(productId)) return true;
            return true;
          });

          if (activeCompetitors.length > 0) {
            competitorsCount = activeCompetitors.length;
            competitorNames = activeCompetitors.map(
              (c) => c.brand || c.name || c.productName || "Competitor"
            );
          }
        }
      } catch (e) {
        console.error("Error reading competitors.json:", e);
      }
    }

    return NextResponse.json({
      catalogue: {
        count: catalogueCount,
        minPrice,
        maxPrice,
        priceRange: `₹${minPrice} - ₹${maxPrice}`,
      },
      reviews: {
        count: reviewsCount,
        sentiment,
        topInsights,
      },
      competitors: {
        count: competitorsCount,
        names: competitorNames,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
