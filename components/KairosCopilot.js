"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import {
  Compass,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Database,
  Layers,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  BookmarkPlus,
} from "lucide-react";

const CORE_SUGGESTED_QUESTIONS = [
  "Analyze our current sunscreen's market position.",
  "What are the biggest competitor opportunities?",
  "Explain the current review sentiment.",
  "Which evidence supports our marketing strategy?",
  "Help me create a campaign from our findings.",
];

const PAGE_SPECIFIC_PROMPTS = {
  "/overview": "What are the active ingredients and finish of this product?",
  "/products": "What are the active ingredients and finish of this product?",
  "/competitors": "How do we compare against Dr. Sheth's or The Derma Co?",
  "/reviews": "What is the main customer watchpoint in humid weather?",
  "/opportunities": "Which competitor defect gives us the strongest hook?",
  "/swot": "Summarize the 4-quadrant SWOT and supporting evidence.",
  "/marketing-studio": "Adapt our campaign hook into Hinglish.",
  "/brand-voice": "What are our Brand Voice guidelines and forbidden words?",
  "/exports": "Create an executive summary brief ready for export.",
};

const ROUTE_LABELS = {
  "/overview": "Overview Dashboard",
  "/products": "Product Library",
  "/competitors": "Competitor Analysis",
  "/reviews": "Review Insights",
  "/opportunities": "Market Opportunities",
  "/swot": "SWOT Analysis",
  "/marketing-studio": "Marketing Studio",
  "/brand-voice": "Brand Voice",
  "/exports": "Export History",
};

const STORAGE_KEY = "kairos_copilot_messages_v1";

/**
 * Renders text while turning inline bracketed evidence IDs like [P001] or [EVD-REV-DK001]
 * into interactive EvidenceBadge components that open the Evidence Drawer.
 */
function renderInlineWithBadges(text) {
  if (!text || typeof text !== "string") return null;

  const tokenRegex = /(\*\*[^*]+\*\*|\[[A-Za-z0-9_-]{3,25}\])/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-ink-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("[") && part.endsWith("]") && part.length >= 4) {
      const evId = part.slice(1, -1).trim();
      return (
        <EvidenceBadge
          key={idx}
          id={evId}
          className="mx-0.5 align-baseline"
        />
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function KairosCopilot() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    selectedLanguage,
    activeAngleId,
    selectedAudienceId,
    addExportRecord,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpandedWidth, setIsExpandedWidth] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState("");
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [savedExportMsgId, setSavedExportMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentPageLabel = ROUTE_LABELS[pathname] || "Overview Dashboard";
  const pageContextualPrompt =
    PAGE_SPECIFIC_PROMPTS[pathname] ||
    "What are the active ingredients and finish of this product?";

  // Load persisted session conversation on mount
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore storage read errors in restricted environments
    }
  }, []);

  // Save conversation to sessionStorage when messages update
  useEffect(() => {
    try {
      if (messages.length > 0) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage write errors
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive or panel opens
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, errorState, isOpen]);

  // Focus input when opening panel
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key closes panel
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  async function sendPrompt(promptText) {
    const cleanPrompt = (promptText || "").trim();
    if (!cleanPrompt || isLoading) return;

    setErrorState(null);
    setLastFailedPrompt(cleanPrompt);

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: cleanPrompt,
      timestamp: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      productContext: selectedProduct?.productName,
      pageContext: currentPageLabel,
    };

    const priorHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setShowQuickPrompts(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanPrompt,
          selectedProductId: selectedProduct?.id,
          currentPath: pathname || "/overview",
          activeAngleId,
          selectedAudienceId,
          selectedLanguage,
          history: priorHistory,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Received an unreadable response from the assistant endpoint."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Assistant request failed with HTTP status ${response.status}.`
        );
      }

      const assistantMsg = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        promptQuestion: cleanPrompt,
        content: data.reply || "",
        sections: data.sections || null,
        citations: Array.isArray(data.citations) ? data.citations : [],
        suggestedRoutes: Array.isArray(data.suggestedRoutes)
          ? data.suggestedRoutes
          : [],
        followUpQuestions: Array.isArray(data.followUpQuestions)
          ? data.followUpQuestions
          : [],
        contextSummary: data.contextSummary || null,
        provider: data.provider || "KAIROS Grounded Intelligence Engine",
        timestamp: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setLastFailedPrompt("");
    } catch (err) {
      setErrorState(
        err?.message ||
          "Unable to reach KAIROS Copilot. Please verify your connection and retry."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    sendPrompt(inputValue);
  }

  function handleKeyDownInput(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        sendPrompt(inputValue);
      }
    }
  }

  function handleRetry() {
    if (!lastFailedPrompt || isLoading) return;
    setMessages((prev) => {
      if (
        prev.length > 0 &&
        prev[prev.length - 1].role === "user" &&
        prev[prev.length - 1].content === lastFailedPrompt
      ) {
        return prev.slice(0, -1);
      }
      return prev;
    });
    sendPrompt(lastFailedPrompt);
  }

  function handleResetConversation() {
    setMessages([]);
    setErrorState(null);
    setLastFailedPrompt("");
    setShowQuickPrompts(false);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  function handleNavigateRoute(routePath) {
    if (!routePath) return;
    router.push(routePath);
  }

  function handleCopyMessage(msg) {
    if (!msg) return;
    const formatted = msg.sections
      ? [
          `KAIROS Copilot Intelligence Brief: ${
            msg.contextSummary?.productName || selectedProduct?.productName
          }`,
          "",
          "FACTS:",
          ...(msg.sections.facts || []).map((f) => `- ${f}`),
          "",
          "INFERENCES:",
          ...(msg.sections.inferences || []).map((inf) => `- ${inf}`),
          "",
          "RECOMMENDATIONS:",
          ...(msg.sections.recommendations || []).map((rec) => `- ${rec}`),
          "",
          `Verified Citations: ${(msg.citations || [])
            .map((c) => `[${c.id}]`)
            .join(", ")}`,
        ].join("\n")
      : msg.content;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(formatted);
    }
    setCopiedMsgId(msg.id);
    setTimeout(() => {
      setCopiedMsgId((prev) => (prev === msg.id ? null : prev));
    }, 2000);
  }

  function handleSaveToExports(msg) {
    if (!msg || !addExportRecord) return;
    addExportRecord({
      title: `Copilot Brief: ${
        msg.promptQuestion
          ? msg.promptQuestion.slice(0, 48)
          : msg.contextSummary?.productName || "Market Analysis"
      }`,
      productName:
        msg.contextSummary?.productName || selectedProduct?.productName,
      productId: msg.contextSummary?.productId || selectedProduct?.id,
      angleName: `KAIROS Copilot (${msg.contextSummary?.currentPage || currentPageLabel})`,
      audienceLabel: `${selectedLanguage} Workspace Brief`,
      format: "Markdown (.md)",
      size: "2.4 KB",
      status: "Completed",
      downloadFileName: `kairos-copilot-${(
        msg.contextSummary?.productId || "brief"
      ).toLowerCase()}.md`,
    });
    setSavedExportMsgId(msg.id);
    setTimeout(() => {
      setSavedExportMsgId((prev) => (prev === msg.id ? null : prev));
    }, 2500);
  }

  function handleProductChange(e) {
    const newId = e.target.value;
    const found = products?.find((p) => String(p.id) === String(newId));
    if (found && setSelectedProduct) {
      setSelectedProduct(found);
    }
  }

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end"
      aria-live="polite"
    >
      {/* Expanded Chat Panel */}
      {isOpen && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="KAIROS Copilot Market Intelligence Assistant"
          className={`w-[calc(100vw-2rem)] ${
            isExpandedWidth ? "sm:w-[540px]" : "sm:w-[410px]"
          } h-[80vh] max-h-[660px] min-h-[430px] mb-3 bg-app-card border border-line-strong rounded-2xl shadow-clay-lg flex flex-col overflow-hidden transition-all duration-150`}
        >
          {/* 1. Panel Header */}
          <header className="px-4 py-3 bg-ink-primary text-ink-inverted border-b border-line-subtle flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-terracotta text-ink-inverted flex items-center justify-center shrink-0 font-serif font-bold text-base shadow-sm">
                K
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-bold text-ink-inverted tracking-tight truncate">
                    KAIROS Copilot
                  </h2>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-terracotta text-ink-inverted font-semibold">
                    Grounded
                  </span>
                </div>
                <p className="text-[11px] text-sand truncate">
                  Market Intelligence Assistant • {currentPageLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsExpandedWidth((prev) => !prev)}
                aria-label={
                  isExpandedWidth
                    ? "Switch to compact chat width"
                    : "Expand chat panel width"
                }
                title={isExpandedWidth ? "Compact width" : "Expand width"}
                className="hidden sm:inline-flex p-2 rounded-lg text-sand hover:text-ink-inverted hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none"
              >
                {isExpandedWidth ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetConversation}
                  aria-label="Clear conversation history"
                  title="Clear conversation history"
                  className="p-2 rounded-lg text-sand hover:text-ink-inverted hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close KAIROS Copilot panel"
                title="Close KAIROS Copilot"
                className="p-2 rounded-lg text-sand hover:text-ink-inverted hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* 2. Interactive Workspace Context Bar with Product Switcher */}
          <div className="px-3.5 py-2 bg-app-subtle border-b border-line-subtle flex items-center justify-between gap-2 text-[11px] shrink-0">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Database className="w-3.5 h-3.5 text-terracotta shrink-0" />
              <label
                htmlFor="copilot-product-switcher"
                className="text-ink-muted shrink-0 font-medium"
              >
                Subject:
              </label>
              <select
                id="copilot-product-switcher"
                value={selectedProduct?.id || ""}
                onChange={handleProductChange}
                className="min-w-0 flex-1 bg-app-card text-ink-primary font-semibold text-[11px] px-2 py-1 rounded-lg border border-line-subtle focus:border-terracotta focus:outline-none truncate cursor-pointer"
                title="Switch active Dot & Key product context"
              >
                {(products || []).map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.productName} ({prod.evidenceId || prod.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {selectedProduct?.evidenceId && (
                <EvidenceBadge id={selectedProduct.evidenceId} />
              )}
            </div>
          </div>

          {/* 3. Message Feed / Empty State */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-app-bg/50 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="space-y-3.5">
                {/* Welcome Card */}
                <div className="p-3.5 rounded-xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta">
                      <Compass className="w-4 h-4 shrink-0" />
                      <span>Context-Aware Intelligence Active</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sage-soft text-sage-dark font-mono text-[10px] font-semibold">
                      {selectedProduct?.unitMetricLabel ||
                        (selectedProduct?.pricePerML
                          ? `₹${selectedProduct.pricePerML}/ml`
                          : `₹${selectedProduct?.retailPriceINR}`)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-primary leading-relaxed">
                    Auditing{" "}
                    <strong className="font-semibold">
                      {selectedProduct?.brand} {selectedProduct?.productName}
                    </strong>{" "}
                    on the <strong>{currentPageLabel}</strong> view (
                    {selectedLanguage} mode). Every answer separates verified
                    facts, analytical inferences, and recommendations with
                    clickable evidence citations.
                  </p>
                  <div className="pt-0.5 text-[10px] font-mono text-ink-muted flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sage-dark shrink-0" />
                    <span>Zero fabricated claims • Click any [ID] to inspect</span>
                  </div>
                </div>

                {/* Page-Specific Highlight Prompt */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider font-semibold text-terracotta px-1">
                    Recommended for {currentPageLabel}
                  </span>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => sendPrompt(pageContextualPrompt)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-sand-light/70 hover:bg-terracotta/10 border border-terracotta/30 text-xs text-ink-primary font-semibold transition-all flex items-center justify-between gap-2 group cursor-pointer disabled:opacity-50 shadow-clay-sm focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none"
                  >
                    <span className="leading-snug">{pageContextualPrompt}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  </button>
                </div>

                {/* Core 5 Suggested Initial Questions */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider font-semibold text-ink-muted px-1">
                    Core Intelligence Inquiries
                  </span>
                  <div className="space-y-1.5">
                    {CORE_SUGGESTED_QUESTIONS.map((question, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={isLoading}
                        onClick={() => sendPrompt(question)}
                        className="w-full text-left px-3.5 py-2 rounded-xl bg-app-card hover:bg-app-subtle border border-line-subtle hover:border-terracotta/50 text-xs text-ink-primary font-medium transition-all flex items-center justify-between gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-clay-sm focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none"
                      >
                        <span className="leading-snug">{question}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-terracotta shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, msgIndex) => {
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="flex flex-col items-end">
                      <div className="max-w-[86%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-terracotta text-ink-inverted text-xs leading-relaxed shadow-clay-sm">
                        {msg.content}
                      </div>
                      <span className="text-[10px] font-mono text-ink-muted mt-1 px-1">
                        You • {msg.timestamp}
                      </span>
                    </div>
                  );
                }

                const hasStructuredSections =
                  msg.sections &&
                  ((msg.sections.facts && msg.sections.facts.length > 0) ||
                    (msg.sections.inferences &&
                      msg.sections.inferences.length > 0) ||
                    (msg.sections.recommendations &&
                      msg.sections.recommendations.length > 0));

                const isLatestAssistant = msgIndex === messages.length - 1;

                return (
                  <div key={msg.id} className="flex flex-col items-start">
                    <div className="w-full p-3.5 rounded-2xl rounded-tl-sm bg-app-card border border-line-subtle shadow-clay-sm space-y-3 text-xs text-ink-primary">
                      {/* Context & Action Toolbar */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-line-subtle/70 text-[10px] font-mono text-ink-muted">
                        <span className="truncate font-semibold text-ink-primary">
                          {msg.contextSummary?.productName ||
                            selectedProduct?.productName}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg)}
                            aria-label="Copy intelligence brief"
                            title="Copy intelligence brief"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-app-subtle hover:bg-sand-light text-ink-primary border border-line-subtle transition-colors cursor-pointer"
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-status-success" />
                                <span className="text-status-success font-semibold">
                                  Copied!
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveToExports(msg)}
                            aria-label="Save brief to Export History"
                            title="Log this analysis to Export History"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-app-subtle hover:bg-sand-light text-ink-primary border border-line-subtle transition-colors cursor-pointer"
                          >
                            {savedExportMsgId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-status-success" />
                                <span className="text-status-success font-semibold">
                                  Logged!
                                </span>
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="w-3 h-3 text-terracotta" />
                                <span>Export</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Structured FACTS / INFERENCES / RECOMMENDATIONS or full formatted text */}
                      {hasStructuredSections ? (
                        <div className="space-y-3">
                          {msg.content &&
                            !msg.content.trim().startsWith("**FACTS") && (
                              <p className="text-xs text-ink-primary leading-relaxed">
                                {renderInlineWithBadges(
                                  msg.content.split(/\*\*FACTS:?\*\*/i)[0].trim()
                                )}
                              </p>
                            )}

                          {/* FACTS Block */}
                          {msg.sections.facts &&
                            msg.sections.facts.length > 0 && (
                              <div className="p-2.5 rounded-xl bg-status-success-bg/60 border border-sage/30 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-status-success">
                                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                  <span>FACTS (Supported by Records)</span>
                                </div>
                                <ul className="space-y-1 text-xs text-ink-primary leading-relaxed">
                                  {msg.sections.facts.map((item, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-sage-dark font-bold mt-0.5">
                                        •
                                      </span>
                                      <span className="flex-1">
                                        {renderInlineWithBadges(item)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {/* INFERENCES Block */}
                          {msg.sections.inferences &&
                            msg.sections.inferences.length > 0 && (
                              <div className="p-2.5 rounded-xl bg-app-subtle border border-line-subtle space-y-1.5">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-primary">
                                  <Layers className="w-3.5 h-3.5 text-terracotta shrink-0" />
                                  <span>INFERENCES (Analytical Interpretation)</span>
                                </div>
                                <ul className="space-y-1 text-xs text-ink-primary leading-relaxed">
                                  {msg.sections.inferences.map((item, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-terracotta font-bold mt-0.5">
                                        •
                                      </span>
                                      <span className="flex-1">
                                        {renderInlineWithBadges(item)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {/* RECOMMENDATIONS Block */}
                          {msg.sections.recommendations &&
                            msg.sections.recommendations.length > 0 && (
                              <div className="p-2.5 rounded-xl bg-sand-light/60 border border-terracotta/25 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta">
                                  <Compass className="w-3.5 h-3.5 shrink-0" />
                                  <span>RECOMMENDATIONS (Suggested Actions)</span>
                                </div>
                                <ul className="space-y-1 text-xs text-ink-primary leading-relaxed">
                                  {msg.sections.recommendations.map((item, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-terracotta font-bold mt-0.5">
                                        •
                                      </span>
                                      <span className="flex-1">
                                        {renderInlineWithBadges(item)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="space-y-2 whitespace-pre-wrap leading-relaxed">
                          {renderInlineWithBadges(msg.content)}
                        </div>
                      )}

                      {/* Verified Evidence Citations Bar */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-line-subtle/70 space-y-1.5">
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                            Verified Source Records (Click to Inspect):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.citations.map((cit) => (
                              <EvidenceBadge key={cit.id} id={cit.id} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contextual Follow-Up Question Chips (shown on latest message) */}
                      {isLatestAssistant &&
                        msg.followUpQuestions &&
                        msg.followUpQuestions.length > 0 && (
                          <div className="pt-2 border-t border-line-subtle/70 space-y-1.5">
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                              Follow-Up Questions:
                            </span>
                            <div className="flex flex-col gap-1">
                              {msg.followUpQuestions.map((followQ, fIdx) => (
                                <button
                                  key={fIdx}
                                  type="button"
                                  disabled={isLoading}
                                  onClick={() => sendPrompt(followQ)}
                                  className="text-left px-2.5 py-1.5 rounded-lg bg-app-subtle/70 hover:bg-sand-light text-[11px] text-ink-primary font-medium border border-line-subtle flex items-center justify-between gap-2 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <span className="truncate">{followQ}</span>
                                  <ArrowUpRight className="w-3 h-3 text-terracotta shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Allowlisted Navigation Suggestions */}
                      {msg.suggestedRoutes && msg.suggestedRoutes.length > 0 && (
                        <div className="pt-2 border-t border-line-subtle/70 space-y-1.5">
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                            Navigate Workspace:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedRoutes.map((routeObj) => (
                              <button
                                key={routeObj.route}
                                type="button"
                                onClick={() =>
                                  handleNavigateRoute(routeObj.route)
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-app-subtle hover:bg-terracotta text-ink-primary hover:text-ink-inverted border border-line-subtle text-[11px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none"
                              >
                                <span>{routeObj.label}</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dataset Scope & Provenance Note */}
                      {msg.contextSummary?.datasetLimitationNote && (
                        <div className="pt-2 border-t border-line-subtle/50 text-[10px] text-ink-muted leading-snug">
                          <strong>Scope Notice:</strong>{" "}
                          {msg.contextSummary.datasetLimitationNote}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-ink-muted mt-1 px-1">
                      KAIROS Copilot • {msg.timestamp}
                    </span>
                  </div>
                );
              })
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div
                role="status"
                aria-label="Generating grounded response"
                className="p-3.5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm flex items-center gap-3 text-xs text-ink-primary"
              >
                <div className="w-4 h-4 rounded-full border-2 border-terracotta/30 border-t-terracotta animate-spin shrink-0" />
                <div>
                  <div className="font-semibold">
                    Auditing verified KAIROS records...
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    Cross-checking citations for{" "}
                    {selectedProduct?.productName || "selected product"}
                  </div>
                </div>
              </div>
            )}

            {/* Error and Retry Banner */}
            {errorState && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-status-error-bg border border-status-error/30 text-xs text-status-error space-y-2.5"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-semibold">
                      Assistant Request Error
                    </div>
                    <p className="text-ink-primary leading-relaxed">
                      {errorState}
                    </p>
                  </div>
                </div>
                {lastFailedPrompt && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-primary text-ink-inverted hover:bg-black text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry Request</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4. Collapsible Quick Prompts Drawer (when conversation is active) */}
          {messages.length > 0 && (
            <div className="bg-app-subtle/80 border-t border-line-subtle px-3 py-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowQuickPrompts((prev) => !prev)}
                className="w-full flex items-center justify-between text-[11px] font-mono text-ink-muted hover:text-ink-primary py-0.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none rounded"
              >
                <span>
                  Quick Inquiries ({CORE_SUGGESTED_QUESTIONS.length + 1})
                </span>
                {showQuickPrompts ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>

              {showQuickPrompts && (
                <div className="pt-1.5 pb-1 space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => sendPrompt(pageContextualPrompt)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-sand-light hover:bg-terracotta hover:text-ink-inverted text-[11px] font-semibold text-ink-primary border border-terracotta/30 transition-colors cursor-pointer truncate"
                  >
                    ★ {pageContextualPrompt}
                  </button>
                  {CORE_SUGGESTED_QUESTIONS.map((qText, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isLoading}
                      onClick={() => sendPrompt(qText)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg bg-app-card hover:bg-terracotta hover:text-ink-inverted text-[11px] text-ink-primary border border-line-subtle transition-colors cursor-pointer truncate"
                    >
                      {qText}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Message Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-app-card border-t border-line-subtle shrink-0"
          >
            <label htmlFor="kairos-copilot-input" className="sr-only">
              Ask KAIROS Copilot a market intelligence question
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id="kairos-copilot-input"
                ref={inputRef}
                rows={2}
                maxLength={1000}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDownInput}
                disabled={isLoading}
                placeholder={`Ask about ${
                  selectedProduct?.productName || "Dot & Key"
                }, competitors, SWOT, or copy...`}
                className="flex-1 resize-none rounded-xl bg-app-subtle border border-line-subtle px-3 py-2 text-xs text-ink-primary placeholder-ink-muted focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message to KAIROS Copilot"
                className="h-11 w-11 rounded-xl bg-terracotta hover:bg-terracotta-hover disabled:bg-line-subtle text-ink-inverted flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-clay-sm focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-ink-muted font-mono">
              <span>Enter to send • Shift+Enter for new line</span>
              <span>{inputValue.length}/1000</span>
            </div>
          </form>
        </section>
      )}

      {/* Floating Circular / Pill Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={
          isOpen
            ? "Close KAIROS Copilot Market Intelligence Assistant"
            : "Open KAIROS Copilot Market Intelligence Assistant"
        }
        className={`min-h-[52px] min-w-[52px] px-4 py-3 rounded-full shadow-clay-lg border transition-all duration-150 flex items-center gap-2.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracotta focus:outline-none ${
          isOpen
            ? "bg-ink-primary text-ink-inverted border-line-strong"
            : "bg-terracotta hover:bg-terracotta-hover text-ink-inverted border-terracotta/30"
        }`}
      >
        {isOpen ? (
          <>
            <X className="w-5 h-5 shrink-0" />
            <span className="text-xs font-serif font-bold tracking-wide hidden sm:inline">
              Close Copilot
            </span>
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-full bg-ink-inverted/15 flex items-center justify-center font-serif font-bold text-xs shrink-0">
              K
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xs font-bold leading-none">
                  KAIROS Copilot
                </span>
                {selectedProduct?.evidenceId && (
                  <span className="px-1 py-0.2 rounded bg-ink-inverted/20 font-mono text-[9px]">
                    {selectedProduct.evidenceId}
                  </span>
                )}
              </div>
              <span className="block text-[10px] text-sand-light/90 leading-tight mt-0.5">
                Intelligence Assistant
              </span>
            </div>
            <MessageSquare className="w-4 h-4 shrink-0 sm:ml-0.5" />
          </>
        )}
      </button>
    </div>
  );
}
