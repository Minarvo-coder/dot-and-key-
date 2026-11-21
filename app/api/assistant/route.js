/**
 * POST /api/assistant
 * KAIROS Copilot Secure Chat Endpoint (Next.js App Router)
 */

import { NextResponse } from "next/server";
import { handleAssistantRequest } from "@/data/research/copilotContext";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Malformed JSON request body.",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    const result = await handleAssistantRequest(body);
    return NextResponse.json(result.payload, { status: result.status });
  } catch {
    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred in KAIROS Copilot. Please retry.",
        code: "INTERNAL_SERVER_ERROR",
        retryable: true,
      },
      { status: 500 }
    );
  }
}
