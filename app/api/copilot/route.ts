import { NextRequest, NextResponse } from "next/server";
import { getGroundedCopilotAnswer, checkRateLimit, CopilotAnswer } from "@/lib/copilotEngine";

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (10 req/min)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const allowed = checkRateLimit(ip, 10, 60000);
    if (!allowed) {
      return NextResponse.json(
        {
          takeaway: "Rate limit reached. Please wait a minute before asking another question.",
          cards: [],
          detail: "The copilot allows up to 10 queries per minute to ensure reliable service.",
          sources: [
            {
              label: "dotandkey.com: Official Store",
              url: "https://www.dotandkey.com",
            },
          ],
        } satisfies CopilotAnswer,
        { status: 429 }
      );
    }

    // 2. Parse request body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          takeaway: "Invalid request format.",
          cards: [],
          detail: "Please provide a valid JSON body with { question, productId }.",
          sources: [],
        },
        { status: 400 }
      );
    }

    const question = String(body?.question || "").trim();
    const productId = String(body?.productId || "DK-VITC-80").trim();

    if (!question) {
      return NextResponse.json(
        {
          takeaway: "That isn't in the data I have.",
          cards: [],
          detail: "Please enter a question about competitors, reviews, or ad copy.",
          sources: [
            {
              label: "dotandkey.com: Products",
              url: "https://www.dotandkey.com",
            },
          ],
        } satisfies CopilotAnswer,
        { status: 200 }
      );
    }

    // 3. Process through grounded answer pipeline
    const answer = await getGroundedCopilotAnswer(question, productId);
    return NextResponse.json(answer, { status: 200 });
  } catch (error) {
    // Clean fallback, never raw stack trace
    return NextResponse.json(
      {
        takeaway: "Couldn't get an answer. Try again.",
        cards: [],
        detail: "A temporary processing error occurred. Please retry your inquiry.",
        sources: [
          {
            label: "Nykaa: Reviews listing",
            url: "https://www.nykaa.com",
          },
        ],
      } satisfies CopilotAnswer,
      { status: 200 }
    );
  }
}
