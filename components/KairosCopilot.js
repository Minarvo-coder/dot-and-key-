"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  RotateCcw,
  ArrowUp,
  ExternalLink,
  Loader2,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { getProducts, getHero } from "@/lib/data";

const TRY_NEXT_CHIPS = [
  "What do reviewers like?",
  "Write 3 Instagram captions",
  "Show the SWOT",
];

const PACK_PRODUCTS = [
  {
    id: "DK-VITC-80",
    name: "Dot & Key Vitamin C + E Sunscreen SPF 50+ PA++++",
  },
  {
    id: "DK-WATER-80",
    name: "Dot & Key Watermelon Cooling Sunscreen SPF 50+ PA++++",
  },
  {
    id: "DK-CICA-80",
    name: "Dot & Key Cica + Niacinamide Mattifying Gel Sunscreen SPF 50+ PA++++",
  },
];

export default function KairosCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("DK-VITC-80");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [lastFailedQuestion, setLastFailedQuestion] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, errorState, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  async function handleSend(questionText) {
    const q = (questionText || inputValue || "").trim();
    if (!q || isLoading) return;

    setErrorState(null);
    setInputValue("");

    const userMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          productId: selectedProductId,
        }),
      });

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      const answer = await res.json();

      const assistantMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        answer: {
          takeaway: answer.takeaway || "That isn't in the data I have.",
          cards: Array.isArray(answer.cards) ? answer.cards : [],
          detail: answer.detail || "",
          caveat: answer.caveat || undefined,
          sources: Array.isArray(answer.sources) ? answer.sources : [],
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setLastFailedQuestion(q);
      setErrorState("Couldn't get an answer. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessages([]);
    setErrorState(null);
    setInputValue("");
    setLastFailedQuestion("");
  }

  function handleRetry() {
    if (lastFailedQuestion) {
      handleSend(lastFailedQuestion);
    }
  }

  return (
    <>
      {/* Floating Launcher Pill (Closed State) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-ink-primary hover:bg-black text-ink-inverted shadow-clay-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-terracotta"
          title="Open Copilot Assistant"
        >
          <div className="w-5 h-5 rounded-md bg-terracotta text-white font-serif font-bold text-xs flex items-center justify-center">
            K
          </div>
          <span className="text-xs font-semibold">Copilot</span>
        </button>
      )}

      {/* Main Copilot Panel (Open State) */}
      {isOpen && (
        <div
          role="complementary"
          aria-label="KAIROS Copilot Panel"
          className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 z-50 w-full sm:w-[420px] max-w-full bg-white border border-line-subtle sm:rounded-2xl shadow-clay-lg flex flex-col h-[90vh] sm:h-[620px] max-h-[100vh] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* a) Header */}
          <div className="p-3.5 sm:p-4 border-b border-line-subtle bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-terracotta text-white font-serif font-bold text-xs flex items-center justify-center shrink-0">
                K
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-sm font-bold text-ink-primary leading-tight">
                  Copilot
                </h3>
                <p className="text-xs text-ink-muted leading-tight truncate">
                  Answers from collected data only
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-neutral-100 transition-colors"
                title="New chat"
                aria-label="New chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-neutral-100 transition-colors"
                title="Close"
                aria-label="Close copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* b) Product Selector */}
          <div className="px-3.5 sm:px-4 py-2 border-b border-line-subtle bg-neutral-50/70 flex items-center gap-2 shrink-0">
            <label
              htmlFor="copilot-product-selector"
              className="text-xs font-semibold text-ink-muted uppercase font-mono shrink-0"
            >
              Product
            </label>
            <select
              id="copilot-product-selector"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-line-subtle rounded-lg px-2.5 py-1.5 text-ink-primary focus:outline-none focus:border-terracotta cursor-pointer"
            >
              {PACK_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          {/* c) & d) & e) Conversation Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 custom-scrollbar bg-white">
            {/* Empty State */}
            {messages.length === 0 && !isLoading && !errorState && (
              <div className="py-6 space-y-4">
                <p className="text-sm text-ink-muted text-center max-w-xs mx-auto">
                  Ask about competitors, reviews, or ad copy for this product.
                </p>

                {/* f) "Try next" chips */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono uppercase font-bold text-ink-muted block text-center">
                    Try next
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {TRY_NEXT_CHIPS.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="text-left text-xs font-medium px-3 py-2 rounded-xl border border-line-subtle bg-neutral-50 hover:bg-neutral-100 text-ink-primary hover:border-terracotta/40 transition-all shadow-sm"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message Thread */}
            {messages.map((msg) => {
              if (msg.role === "user") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] bg-neutral-100 text-ink-primary text-sm p-3 rounded-2xl rounded-tr-sm border border-line-subtle">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              // Assistant Answer
              const { takeaway, cards, detail, caveat, sources } = msg.answer || {};
              return (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-2xl bg-white border border-line-subtle shadow-sm space-y-2.5"
                >
                  {/* Takeaway */}
                  <div className="text-sm font-medium text-ink-primary leading-snug">
                    {takeaway}
                  </div>

                  {/* 2-column cards grid */}
                  {cards && cards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {cards.map((card, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2.5 rounded-xl bg-neutral-50 border border-line-subtle/80 space-y-1"
                        >
                          <div className="text-xs font-semibold text-terracotta uppercase font-mono tracking-wider">
                            {card.label}
                          </div>
                          <div className="space-y-0.5 text-[13px] text-ink-primary">
                            {(card.rows || []).map((row, rIdx) => (
                              <div key={rIdx}>{row}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Detail Context */}
                  {detail && (
                    <div className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                      {detail}
                    </div>
                  )}

                  {/* Caveat */}
                  {caveat && (
                    <div className="text-xs text-neutral-500 italic">
                      {caveat}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-line-subtle pt-2" />

                  {/* Sources Row */}
                  {sources && sources.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-medium text-ink-muted">
                        Sources
                      </span>
                      {sources.map((s, sIdx) => (
                        <a
                          key={sIdx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border border-line-subtle bg-white hover:bg-neutral-50 text-ink-primary hover:border-terracotta transition-colors"
                        >
                          <span>{s.label}</span>
                          <ExternalLink className="w-3 h-3 text-terracotta shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading State */}
            {isLoading && (
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-line-subtle flex items-center gap-2.5 text-xs text-ink-muted">
                <Loader2 className="w-4 h-4 animate-spin text-terracotta shrink-0" />
                <span>Reading the data…</span>
              </div>
            )}

            {/* Error State */}
            {errorState && (
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-line-subtle flex items-center justify-between gap-2 text-xs">
                <span className="text-ink-primary">{errorState}</span>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-2.5 py-1 rounded-lg bg-terracotta text-white font-semibold text-xs hover:bg-terracotta-hover transition-colors shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Active Thread "Try next" chips */}
            {messages.length > 0 && !isLoading && (
              <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-mono text-ink-muted mr-1">Try next:</span>
                {TRY_NEXT_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(chip)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-line-subtle bg-neutral-50 hover:bg-neutral-100 text-ink-primary hover:border-terracotta/40 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* g) Input and Provenance Footer */}
          <div className="p-3 sm:p-3.5 border-t border-line-subtle bg-white shrink-0 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about competitors, reviews, or ad copy"
                disabled={isLoading}
                className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 border border-line-subtle text-xs sm:text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-terracotta focus:bg-white transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-terracotta text-white flex items-center justify-center hover:bg-terracotta-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                title="Send question"
                aria-label="Send question"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </form>

            {/* Provenance Footer */}
            <div className="text-[11px] text-neutral-500 leading-tight">
              Data from public Nykaa and dotandkey.com pages, 21 Nov 2026. Ratings show attention, not sales.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
