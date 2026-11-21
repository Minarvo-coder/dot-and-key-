"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/components/AppContext";
import {
  Menu,
  ChevronDown,
  Check,
  Package,
  User,
  Key,
  Shield,
  Database,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  LogIn,
} from "lucide-react";

export default function TopNav() {
  const {
    selectedProduct,
    setSelectedProduct,
    products,
    setIsMobileSidebarOpen,
  } = useApp();

  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Account State (Stored in component, ready for database connection)
  const [account, setAccount] = useState({
    name: "Brand Lead",
    email: "lead@dotandkey.com",
    role: "Brand Growth Director",
    password: "Kairos@DotKey2026",
    accountId: "ACC-DK-2026-081",
    workspace: "Dot & Key Flagship Intelligence",
    status: "Active Session",
  });

  // Modal form states
  const [formName, setFormName] = useState(account.name);
  const [formEmail, setFormEmail] = useState(account.email);
  const [formRole, setFormRole] = useState(account.role);
  const [formPassword, setFormPassword] = useState(account.password);
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const productRef = useRef(null);
  const accountRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (productRef.current && !productRef.current.contains(e.target)) {
        setIsProductMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSaveAccount(e) {
    if (e) e.preventDefault();
    setAccount({
      ...account,
      name: formName,
      email: formEmail,
      role: formRole,
      password: formPassword,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsLoginModalOpen(false);
    }, 1200);
  }

  return (
    <>
      <header className="sticky top-0 z-20 bg-app-card/95 backdrop-blur-md border-b border-line-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Mobile Toggle + Product Selector */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-app-subtle border border-line-subtle"
                title="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Current Product Selector Dropdown */}
              <div className="relative" ref={productRef}>
                <button
                  type="button"
                  onClick={() => setIsProductMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-app-subtle hover:bg-app-card border border-line-subtle hover:border-terracotta/40 transition-all text-left shadow-clay-sm group"
                  title="Change active product"
                >
                  <div className="w-7 h-7 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-terracotta group-hover:text-ink-inverted transition-colors">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 max-w-[140px] sm:max-w-[220px] lg:max-w-[280px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-terracotta">
                        {selectedProduct?.brand || "Dot & Key"}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-ink-primary truncate leading-tight">
                      {selectedProduct?.productName || "Select Product"}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted shrink-0 transition-transform ${
                      isProductMenuOpen ? "rotate-180 text-terracotta" : ""
                    }`}
                  />
                </button>

                {/* Product Selector Dropdown Menu */}
                {isProductMenuOpen && (
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-app-card border border-line-subtle shadow-clay-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-line-subtle/70 flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase font-bold text-ink-muted">
                        Select Flagship Product
                      </span>
                      <span className="text-[11px] font-mono text-terracotta">
                        {products.length} Products
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto py-1 custom-scrollbar">
                      {products.map((p) => {
                        const isSelected = selectedProduct?.id === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsProductMenuOpen(false);
                            }}
                            className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                              isSelected
                                ? "bg-terracotta/10 text-ink-primary font-semibold"
                                : "hover:bg-app-subtle text-ink-primary"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                                isSelected
                                  ? "bg-terracotta text-ink-inverted"
                                  : "bg-app-subtle text-ink-muted border border-line-subtle"
                              }`}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : "•"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-ink-primary truncate">
                                  {p.productName}
                                </span>
                                <span className="text-[11px] font-semibold text-terracotta shrink-0">
                                  ₹{p.retailPriceINR}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-muted">
                                <span>{p.category}</span>
                                <span>•</span>
                                <span>★ {p.rating} ({p.reviewCount?.toLocaleString()})</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Account Dropdown with Login Details */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-app-subtle hover:bg-app-card border border-line-subtle hover:border-terracotta/40 transition-all text-left shadow-clay-sm group"
                title="Account and login details"
              >
                {/* User Avatar with Active Dot */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-terracotta text-ink-inverted font-serif font-bold text-xs flex items-center justify-center shadow-sm">
                    {account.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "DK"}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-status-success border-2 border-app-card" />
                </div>

                {/* User Text Info */}
                <div className="hidden sm:block text-left min-w-0">
                  <div className="text-xs font-bold text-ink-primary leading-tight truncate">
                    {account.name}
                  </div>
                  <div className="text-[10px] text-ink-muted leading-tight truncate font-mono">
                    {account.email}
                  </div>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-ink-muted shrink-0 transition-transform ${
                    isAccountMenuOpen ? "rotate-180 text-terracotta" : ""
                  }`}
                />
              </button>

              {/* Account Details Dropdown */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-app-card border border-line-subtle shadow-clay-lg p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-3">
                  {/* Account Header */}
                  <div className="p-3 rounded-xl bg-app-subtle border border-line-subtle space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta">
                        Authenticated Account
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-status-success-bg text-status-success text-[10px] font-semibold">
                        {account.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-ink-primary">
                      {account.name}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {account.role}
                    </div>
                  </div>

                  {/* Login Credentials Summary Card */}
                  <div className="p-3 rounded-xl bg-app-bg border border-line-subtle space-y-2 text-xs">
                    <div className="text-[10px] font-mono font-bold uppercase text-ink-muted flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-terracotta" />
                      <span>Current Login Credentials</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-ink-muted">Login Email:</span>
                        <span className="font-mono font-semibold text-ink-primary">{account.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-ink-muted">Password:</span>
                        <span className="font-mono text-ink-primary">••••••••••••</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-ink-muted">Account ID:</span>
                        <span className="font-mono text-terracotta">{account.accountId}</span>
                      </div>
                    </div>

                    {/* Database status note */}
                    <div className="pt-2 mt-2 border-t border-line-subtle text-[11px] text-ink-muted flex items-start gap-1.5">
                      <Database className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                      <span>Database: Ready for backend database connection (schema prepared).</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setFormName(account.name);
                        setFormEmail(account.email);
                        setFormRole(account.role);
                        setFormPassword(account.password);
                        setIsAccountMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-colors shadow-clay-sm"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Manage Login & Credentials</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-app-subtle text-ink-primary hover:bg-app-card border border-line-subtle text-xs font-medium transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-ink-muted" />
                      <span>Switch Account / Sign In</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login & Account Details Modal */}
      {isLoginModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Account Login Details"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-app-card rounded-2xl border border-line-subtle shadow-clay-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line-subtle bg-app-subtle/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-ink-primary">
                    Account & Login Credentials
                  </h2>
                  <span className="text-[11px] text-ink-muted">
                    Dot & Key KAIROS Intelligence Platform
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-app-subtle transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAccount} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-ink-muted mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none transition-all"
                  placeholder="e.g. Brand Lead"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-ink-muted mb-1">
                  Login Email
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none transition-all font-mono"
                  placeholder="e.g. lead@dotandkey.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-ink-muted mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none transition-all"
                  placeholder="e.g. Brand Growth Director"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-ink-muted mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none transition-all font-mono"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Database Placeholder Callout */}
              <div className="p-3.5 rounded-xl bg-app-subtle border border-line-subtle space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-terracotta">
                  <Database className="w-3.5 h-3.5 shrink-0" />
                  <span>Database Ready</span>
                </div>
                <p className="text-ink-muted leading-relaxed">
                  These login details are active in this workspace. You can connect your database (PostgreSQL, Supabase, Prisma, or MongoDB) later — the state handler is pre-configured.
                </p>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-ink-muted hover:text-ink-primary hover:bg-app-subtle transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-colors shadow-clay-sm"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Updated & Logged In!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
