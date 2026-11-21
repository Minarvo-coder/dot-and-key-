"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/components/AppContext";
import {
  X,
  User,
  Shield,
  Database,
  Globe,
  Sliders,
  Check,
  Save,
} from "lucide-react";

export default function SettingsModal() {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    selectedLanguage,
    setSelectedLanguage,
    metadata,
  } = useApp();

  const [userName, setUserName] = useState("Aditi Rao");
  const [userRole, setUserRole] = useState("Brand Growth Lead");
  const [userEmail, setUserEmail] = useState("aditi.rao@dotandkey.com");
  const [autoExportMarkdown, setAutoExportMarkdown] = useState(true);
  const [includeProvenanceFooters, setIncludeProvenanceFooters] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isSettingsModalOpen) {
        setIsSettingsModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsModalOpen, setIsSettingsModalOpen]);

  function handleSave() {
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      setIsSettingsModalOpen(false);
    }, 1200);
  }

  if (!isSettingsModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="User Profile and Settings"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsSettingsModalOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-app-card rounded-2xl border border-line-subtle shadow-clay-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line-subtle bg-app-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-ink-primary">
                User Profile & Workspace Settings
              </h2>
              <span className="text-[11px] text-ink-muted">
                KAIROS Dot & Key Growth Studio
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-app-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-ink-primary custom-scrollbar">
          {/* Profile Details */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-ink-primary flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-terracotta" />
              <span>Operator Profile</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-ink-muted mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-ink-muted mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-ink-muted mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Active Dataset Ingestion */}
          <div className="p-4 rounded-xl bg-app-subtle border border-line-subtle space-y-2">
            <h3 className="font-serif text-sm font-bold text-ink-primary flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-sage-dark" />
              <span>Connected Intelligence Pipeline</span>
            </h3>
            <div className="text-ink-muted text-xs space-y-1">
              <div><strong>Dataset:</strong> {metadata?.datasetName}</div>
              <div><strong>Audited Records:</strong> {metadata?.totalReviewsAudited?.toLocaleString()} Verified Customer Reviews</div>
              <div><strong>Connected Channels:</strong> Nykaa India, Amazon.in, Purplle, Dot & Key D2C</div>
              <div><strong>Status:</strong> <span className="text-status-success font-semibold">Active & Live Synchronized</span></div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-ink-primary flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-terracotta" />
              <span>Studio Preferences</span>
            </h3>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoExportMarkdown}
                  onChange={(e) => setAutoExportMarkdown(e.target.checked)}
                  className="w-4 h-4 rounded border-line-strong text-terracotta focus:ring-terracotta accent-terracotta"
                />
                <span className="text-xs">
                  Automatically log generated campaign assets into Export History
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProvenanceFooters}
                  onChange={(e) => setIncludeProvenanceFooters(e.target.checked)}
                  className="w-4 h-4 rounded border-line-strong text-terracotta focus:ring-terracotta accent-terracotta"
                />
                <span className="text-xs">
                  Include audit provenance disclaimers in downloaded campaign briefs
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-line-subtle bg-app-subtle/30 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-ink-muted hover:text-ink-primary hover:bg-app-subtle transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-colors shadow-clay-sm"
          >
            {savedNotification ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Preferences</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
