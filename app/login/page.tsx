"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

/* ════════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════════ */
type Step = "email" | "password" | "token";

interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
  token: string[];           // 6 digits
}

interface ErrorState {
  email?: string;
  password?: string;
  token?: string;
  general?: string;
  type?: "warning" | "error"; // warning = yellow banner, error = red inline
}

/* ════════════════════════════════════════════════════════════
   API  (mirrors your backend routes exactly)
════════════════════════════════════════════════════════════ */
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function apiPost<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data as T;
}

/* ════════════════════════════════════════════════════════════
   SVG ASSETS (inline — zero external deps)
════════════════════════════════════════════════════════════ */

/** The teal Trello icon — rounded square + two white rects */
function TrelloIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size, height: size,
        background: "linear-gradient(145deg,#2684ff,#0052cc)",
        borderRadius: size * 0.22,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,82,204,0.35)",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="white">
        <rect x="3"  y="3" width="8"  height="18" rx="1.5" />
        <rect x="13" y="3" width="8"  height="12" rx="1.5" />
      </svg>
    </div>
  );
}

/** Google multi-colour G */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"/>
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
    </svg>
  );
}

/** Microsoft Windows logo */
function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <rect x="1"  y="1"  width="10.5" height="10.5" fill="#F25022"/>
      <rect x="12.5" y="1"  width="10.5" height="10.5" fill="#7FBA00"/>
      <rect x="1"  y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
    </svg>
  );
}

/** Apple logo */
function AppleIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 814 1000">
      <path fill="#1a1a1a" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 454.4 0 300.3 0 158.8c0-81.3 28.3-161.6 80.2-216.3C128.4-10.3 202.6-27 267.5-27c74.9 0 141.7 46 185.1 46s88.6-47 173.5-47c36.8 0 122.3 7 182.7 72.1zm-54.1-195.2c-25.1 30-68 55-111 55-5.5 0-11-.3-16.5-1.1-2.1-57.9 25.4-118 65.5-155.3C713.1 19.4 760.7 0 806.4 0c1.2 0 2.5.1 3.8.2 2.5 57.6-22.2 116.9-76.2 145.5z"/>
    </svg>
  );
}

/** Slack colourful hash */
function SlackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 54 54">
      <path fill="#36C5F0" d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386"/>
      <path fill="#2EB67D" d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387"/>
      <path fill="#ECB22E" d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386"/>
      <path fill="#E01E5A" d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.249m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.249a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387"/>
    </svg>
  );
}

/** Passkey / fingerprint icon */
function PasskeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8"  x2="11" y2="11"/>
      <line x1="11" y1="14" x2="11.01" y2="14"/>
    </svg>
  );
}

/** Atlassian wordmark */
function AtlassianLogo() {
  return (
    <svg height="18" viewBox="0 0 230 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.52 0C5.16 0 0 5.16 0 11.52v6.96C0 24.84 5.16 30 11.52 30h6.96C24.84 30 30 24.84 30 18.48V11.52C30 5.16 24.84 0 18.48 0H11.52zM8.4 21.9l4.2-8.4 4.2 8.4H8.4z" fill="#0052CC"/>
      <text x="38" y="22" fill="#172B4D" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" fontSize="15" fontWeight="600" letterSpacing="-0.3">ATLASSIAN</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
════════════════════════════════════════════════════════════ */

/** Yellow/amber warning banner — matches screenshots 4 & 5 */
function WarningBanner({ message }: { message: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      background: "#FFFAE6",
      border: "1px solid #F5A623",
      borderRadius: 4,
      padding: "12px 14px",
      marginBottom: 20,
      animation: "slideDown .2s ease",
    }}>
      {/* orange triangle warning */}
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10 1L19 18H1L10 1z" fill="#FF8B00" stroke="#FF8B00" strokeWidth="0"/>
        <text x="10" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">!</text>
      </svg>
      <p style={{ fontSize: 14, color: "#172B4D", lineHeight: 1.5, margin: 0 }}>{message}</p>
    </div>
  );
}

/** Labelled form field wrapper */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#172B4D",
        marginBottom: 5,
      }}>
        {label}
        <span style={{ color: "#DE350B", marginLeft: 2 }}>*</span>
      </label>
      {children}
    </div>
  );
}

/** Standard input */
function Input({
  type = "text", value, onChange, placeholder, autoFocus, disabled,
  rightSlot, style: extraStyle,
}: {
  type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; autoFocus?: boolean; disabled?: boolean;
  rightSlot?: React.ReactNode; style?: React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          height: 44,
          border: `2px solid ${focused ? "#2684FF" : "#DFE1E6"}`,
          borderRadius: 4,
          padding: rightSlot ? "0 44px 0 12px" : "0 12px",
          fontSize: 15,
          color: "#172B4D",
          background: disabled ? "#F4F5F7" : "white",
          outline: "none",
          transition: "border-color .15s",
          ...extraStyle,
        }}
      />
      {rightSlot && (
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: 44, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {rightSlot}
        </div>
      )}
    </div>
  );
}

/** Blue submit / primary button */
function PrimaryButton({
  children, onClick, loading = false, type = "button",
}: {
  children: React.ReactNode; onClick?: () => void;
  loading?: boolean; type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%", height: 44,
        background: loading ? "#0065FF" : "#0052CC",
        color: "white",
        border: "none",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8,
        transition: "background .15s",
        letterSpacing: "0.01em",
      }}
      onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = "#0065FF"); }}
      onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = "#0052CC"); }}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

/** Outline button (Passkey / Google / etc.) */
function OutlineButton({
  icon, label, onClick,
}: {
  icon: React.ReactNode; label: string; onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", height: 44,
        background: hov ? "#F4F5F7" : "white",
        border: "2px solid #DFE1E6",
        borderRadius: 4,
        fontSize: 15,
        color: "#172B4D",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10,
        transition: "background .12s, border-color .12s",
        fontWeight: 500,
      }}
    >
      {icon}
      <span style={{ fontWeight: 500 }}>{label}</span>
    </button>
  );
}

/** Loading spinner */
function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/>
      </path>
    </svg>
  );
}

/** Separator with centred label */
function Divider({ label }: { label: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      margin: "20px 0",
      color: "#7A869A", fontSize: 13,
    }}>
      <div style={{ flex: 1, height: 1, background: "#DFE1E6" }} />
      {label}
      <div style={{ flex: 1, height: 1, background: "#DFE1E6" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DECORATIVE SIDE ILLUSTRATIONS
   (CSS-only interpretations of the Trello mascots)
════════════════════════════════════════════════════════════ */
function LeftIllustration() {
  return (
    <div style={{
      position: "fixed", left: 0, bottom: 0,
      width: "clamp(140px, 18vw, 280px)",
      pointerEvents: "none", userSelect: "none",
      zIndex: 0,
    }}>
      {/* Dashboard-style UI mockup */}
      <svg viewBox="0 0 280 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
        {/* large teal-blue card */}
        <rect x="20" y="60" width="160" height="110" rx="10" fill="#0052CC" opacity="0.85"/>
        <rect x="32" y="74" width="70" height="8" rx="4" fill="rgba(255,255,255,0.6)"/>
        <rect x="32" y="88" width="50" height="8" rx="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="32" y="104" width="130" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
        <rect x="32" y="116" width="110" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
        {/* toggle/switch widget */}
        <rect x="32" y="132" width="44" height="16" rx="8" fill="rgba(255,255,255,0.25)"/>
        <circle cx="44" cy="140" r="6" fill="white" opacity="0.9"/>
        {/* mini chart */}
        <rect x="110" y="80" width="10" height="26" rx="3" fill="rgba(255,255,255,0.2)"/>
        <rect x="124" y="92" width="10" height="14" rx="3" fill="rgba(255,255,255,0.35)"/>
        <rect x="138" y="86" width="10" height="20" rx="3" fill="rgba(255,255,255,0.25)"/>
        {/* small white card */}
        <rect x="52" y="150" width="110" height="70" rx="8" fill="white" opacity="0.9"/>
        <rect x="64" y="162" width="60" height="7" rx="3.5" fill="#DFE1E6"/>
        <rect x="64" y="174" width="80" height="7" rx="3.5" fill="#DFE1E6"/>
        <rect x="64" y="186" width="50" height="7" rx="3.5" fill="#DFE1E6"/>
        {/* Robot character — standing left */}
        <rect x="10" y="195" width="38" height="52" rx="6" fill="#172B4D"/>
        <rect x="14" y="200" width="30" height="20" rx="4" fill="#0065FF"/>
        {/* eyes */}
        <circle cx="22" cy="210" r="3.5" fill="white"/>
        <circle cx="32" cy="210" r="3.5" fill="white"/>
        <circle cx="22" cy="210" r="1.5" fill="#172B4D"/>
        <circle cx="32" cy="210" r="1.5" fill="#172B4D"/>
        {/* mouth */}
        <rect x="20" y="216" width="14" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
        {/* hat */}
        <rect x="12" y="188" width="34" height="10" rx="3" fill="#FFAB00"/>
        <ellipse cx="29" cy="188" rx="6" ry="3" fill="#FFAB00"/>
        {/* legs */}
        <rect x="14" y="244" width="10" height="16" rx="3" fill="#172B4D"/>
        <rect x="28" y="244" width="10" height="16" rx="3" fill="#172B4D"/>
        {/* Woman character */}
        <ellipse cx="80" cy="232" rx="14" ry="14" fill="#FF7452"/>
        <rect x="68" y="244" width="24" height="30" rx="5" fill="#403294"/>
        <rect x="70" y="258" width="8" height="20" rx="3" fill="#403294"/>
        <rect x="82" y="258" width="8" height="20" rx="3" fill="#403294"/>
        {/* hair */}
        <path d="M66 232 Q80 216 94 232" stroke="#172B4D" strokeWidth="3" fill="none"/>
        {/* arm pointing up */}
        <rect x="88" y="246" width="6" height="24" rx="3" fill="#FF7452" transform="rotate(-30 91 258)"/>
        {/* Dog */}
        <ellipse cx="136" cy="260" rx="18" ry="12" fill="#FFAB00"/>
        <ellipse cx="148" cy="252" rx="10" ry="9" fill="#FFAB00"/>
        <circle cx="152" cy="250" r="3" fill="#172B4D"/>
        <ellipse cx="154" cy="255" rx="4" ry="2.5" fill="#FF7452" opacity="0.6"/>
        <rect x="122" y="268" width="6" height="14" rx="3" fill="#FFAB00"/>
        <rect x="132" y="268" width="6" height="14" rx="3" fill="#FFAB00"/>
        <rect x="144" y="268" width="6" height="14" rx="3" fill="#FFAB00"/>
        <rect x="154" y="268" width="6" height="14" rx="3" fill="#FFAB00"/>
        {/* tail */}
        <path d="M118 260 Q108 248 116 240" stroke="#FFAB00" strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Man with glasses */}
        <ellipse cx="200" cy="228" rx="14" ry="14" fill="#172B4D"/>
        <rect x="186" y="240" width="28" height="32" rx="5" fill="#172B4D"/>
        <rect x="188" y="256" width="9" height="20" rx="3" fill="#172B4D"/>
        <rect x="201" y="256" width="9" height="20" rx="3" fill="#172B4D"/>
        {/* glasses */}
        <rect x="190" y="224" width="10" height="8" rx="3" fill="none" stroke="white" strokeWidth="1.5"/>
        <rect x="202" y="224" width="10" height="8" rx="3" fill="none" stroke="white" strokeWidth="1.5"/>
        <line x1="200" y1="228" x2="202" y2="228" stroke="white" strokeWidth="1.5"/>
        {/* arm with phone */}
        <rect x="175" y="244" width="7" height="22" rx="3" fill="#172B4D"/>
        <rect x="168" y="252" width="12" height="18" rx="3" fill="#403294"/>
        <rect x="170" y="255" width="8" height="10" rx="1" fill="#4FC3F7" opacity="0.8"/>
      </svg>
    </div>
  );
}

function RightIllustration() {
  return (
    <div style={{
      position: "fixed", right: 0, bottom: 0,
      width: "clamp(140px, 18vw, 280px)",
      pointerEvents: "none", userSelect: "none",
      zIndex: 0,
    }}>
      <svg viewBox="0 0 280 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
        {/* Dark board card */}
        <rect x="80" y="10" width="180" height="130" rx="10" fill="#253858" opacity="0.9"/>
        {/* three horizontal bars (chart lines) */}
        <rect x="100" y="30" width="140" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
        <rect x="100" y="44" width="100" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
        <rect x="100" y="58" width="120" height="8" rx="4" fill="rgba(255,255,255,0.12)"/>
        {/* white card overlay */}
        <rect x="120" y="80" width="120" height="55" rx="8" fill="white" opacity="0.95"/>
        <rect x="132" y="92" width="70" height="7" rx="3" fill="#DFE1E6"/>
        <rect x="132" y="105" width="90" height="7" rx="3" fill="#DFE1E6"/>
        {/* half-moon graphic */}
        <path d="M216 100 A16 16 0 1 1 216 132" stroke="#C0B6F2" strokeWidth="4" fill="none"/>
        {/* Mascot: large orange/red character with big eyes (like Taco) */}
        <ellipse cx="185" cy="190" rx="35" ry="40" fill="#FF7452"/>
        <ellipse cx="173" cy="182" rx="9" ry="9" fill="white"/>
        <ellipse cx="197" cy="182" rx="9" ry="9" fill="white"/>
        <circle cx="174" cy="184" r="5" fill="#172B4D"/>
        <circle cx="198" cy="184" r="5" fill="#172B4D"/>
        <circle cx="176" cy="182" r="2" fill="white"/>
        <circle cx="200" cy="182" r="2" fill="white"/>
        {/* smile */}
        <path d="M174 196 Q185 206 196 196" stroke="#172B4D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* ears */}
        <ellipse cx="150" cy="178" rx="8" ry="10" fill="#FF5630"/>
        <ellipse cx="220" cy="178" rx="8" ry="10" fill="#FF5630"/>
        {/* arms */}
        <rect x="148" y="218" width="14" height="30" rx="7" fill="#FF7452" transform="rotate(-15 155 233)"/>
        <rect x="208" y="218" width="14" height="30" rx="7" fill="#FF7452" transform="rotate(15 215 233)"/>
        {/* legs */}
        <rect x="162" y="226" width="16" height="35" rx="8" fill="#FF5630"/>
        <rect x="192" y="226" width="16" height="35" rx="8" fill="#FF5630"/>
        {/* Robot/tech guy standing right */}
        <rect x="42" y="190" width="36" height="50" rx="6" fill="#403294"/>
        <rect x="46" y="196" width="28" height="18" rx="4" fill="#6554C0"/>
        <circle cx="56" cy="205" r="4" fill="white"/>
        <circle cx="68" cy="205" r="4" fill="white"/>
        <circle cx="57" cy="205" r="2" fill="#172B4D"/>
        <circle cx="69" cy="205" r="2" fill="#172B4D"/>
        <rect x="50" y="236" width="10" height="18" rx="3" fill="#403294"/>
        <rect x="62" y="236" width="10" height="18" rx="3" fill="#403294"/>
        {/* laptop */}
        <rect x="14" y="210" width="30" height="22" rx="3" fill="#253858"/>
        <rect x="17" y="213" width="24" height="15" rx="1" fill="#4FC3F7" opacity="0.4"/>
        <rect x="10" y="232" width="38" height="3" rx="1.5" fill="#253858"/>
        {/* arm reaching for laptop */}
        <rect x="40" y="214" width="7" height="18" rx="3" fill="#403294"/>
        {/* Tall dark character */}
        <ellipse cx="238" cy="208" rx="14" ry="14" fill="#403294"/>
        <rect x="224" y="220" width="28" height="40" rx="5" fill="#403294"/>
        <rect x="226" y="252" width="9" height="22" rx="3" fill="#403294"/>
        <rect x="239" y="252" width="9" height="22" rx="3" fill="#403294"/>
        {/* glasses */}
        <rect x="228" y="204" width="9" height="7" rx="2.5" fill="none" stroke="#C0B6F2" strokeWidth="1.5"/>
        <rect x="240" y="204" width="9" height="7" rx="2.5" fill="none" stroke="#C0B6F2" strokeWidth="1.5"/>
        <line x1="237" y1="207" x2="240" y2="207" stroke="#C0B6F2" strokeWidth="1.5"/>
        {/* ladder */}
        <line x1="250" y1="60" x2="250" y2="280" stroke="#DFE1E6" strokeWidth="4"/>
        <line x1="266" y1="60" x2="266" y2="280" stroke="#DFE1E6" strokeWidth="4"/>
        <line x1="250" y1="90"  x2="266" y2="90"  stroke="#DFE1E6" strokeWidth="3"/>
        <line x1="250" y1="120" x2="266" y2="120" stroke="#DFE1E6" strokeWidth="3"/>
        <line x1="250" y1="150" x2="266" y2="150" stroke="#DFE1E6" strokeWidth="3"/>
        <line x1="250" y1="180" x2="266" y2="180" stroke="#DFE1E6" strokeWidth="3"/>
        <line x1="250" y1="210" x2="266" y2="210" stroke="#DFE1E6" strokeWidth="3"/>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   STEP 1 — EMAIL
════════════════════════════════════════════════════════════ */
interface EmailStepProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: ErrorState;
  loading: boolean;
  onContinue: () => void;
}

function EmailStep({ form, setForm, errors, loading, onContinue }: EmailStepProps) {
  return (
    <>
      <Field label="Email">
        <Input
          type="email"
          value={form.email}
          onChange={v => setForm(f => ({ ...f, email: v }))}
          placeholder="Enter your email"
          autoFocus
        />
        {errors.email && (
          <p style={{ fontSize: 12, color: "#DE350B", marginTop: 4 }}>{errors.email}</p>
        )}
      </Field>

      {/* Remember me */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.rememberMe}
          onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
          style={{ width: 16, height: 16, accentColor: "#0052CC", cursor: "pointer" }}
        />
        <span style={{ fontSize: 14, color: "#172B4D" }}>Remember me</span>
        {/* info tooltip icon */}
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 18, height: 18, borderRadius: "50%",
          background: "#6554C0", color: "white", fontSize: 11, fontWeight: 700,
          cursor: "pointer",
        }} title="Keeps you logged in for 30 days">ℹ</span>
      </label>

      <PrimaryButton loading={loading} onClick={onContinue}>Continue</PrimaryButton>

      <Divider label="Or login with:" />

      <OutlineButton
        icon={<PasskeyIcon />}
        label="Passkey"
        onClick={() => {}}
      />

      <Divider label="Or continue with:" />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <OutlineButton
          icon={<GoogleIcon />}
          label="Google"
          onClick={() => { window.location.href = `${API}/auth/google`; }}
        />
        <OutlineButton
          icon={<MicrosoftIcon />}
          label="Microsoft"
          onClick={() => {}}
        />
        <OutlineButton
          icon={<AppleIcon />}
          label="Apple"
          onClick={() => {}}
        />
        <OutlineButton
          icon={<SlackIcon />}
          label="Slack"
          onClick={() => {}}
        />
      </div>

      {/* Footer links */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, marginTop: 24, marginBottom: 8,
        fontSize: 13,
      }}>
        <Link href="/forgot-password" style={{ color: "#0052CC", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
          Can&apos;t log in?
        </Link>
        <span style={{ color: "#7A869A" }}>•</span>
        <Link href="/setup-account" style={{ color: "#0052CC", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
          Create an account
        </Link>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   STEP 2 — PASSWORD
════════════════════════════════════════════════════════════ */
interface PasswordStepProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: ErrorState;
  loading: boolean;
  onSubmit: () => void;
  onEditEmail: () => void;
}

function PasswordStep({ form, setForm, errors, loading, onSubmit, onEditEmail }: PasswordStepProps) {
  const [showPw, setShowPw] = useState(false);

  return (
    <>
      {/* Error banner */}
      {errors.general && <WarningBanner message={errors.general} />}

      {/* Email — readonly + edit pencil */}
      <Field label="Email">
        <div style={{ position: "relative" }}>
          <input
            type="email"
            value={form.email}
            readOnly
            style={{
              width: "100%", boxSizing: "border-box",
              height: 44,
              border: "2px solid #DFE1E6",
              borderRadius: 4,
              padding: "0 44px 0 12px",
              fontSize: 15,
              color: "#172B4D",
              background: "#F4F5F7",
              outline: "none",
            }}
          />
          {/* Pencil / edit icon */}
          <button
            type="button"
            onClick={onEditEmail}
            title="Edit email"
            style={{
              position: "absolute", right: 0, top: 0, bottom: 0,
              width: 44, background: "none", border: "none",
              cursor: "pointer", color: "#6B778C",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </Field>

      {/* Password */}
      <Field label="Password">
        <Input
          type={showPw ? "text" : "password"}
          value={form.password}
          onChange={v => setForm(f => ({ ...f, password: v }))}
          placeholder="Enter password"
          autoFocus
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6B778C", display: "flex" }}
            >
              {showPw ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          }
        />
        {errors.password && (
          <p style={{ fontSize: 12, color: "#DE350B", marginTop: 4 }}>{errors.password}</p>
        )}
      </Field>

      {/* Remember me */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.rememberMe}
          onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
          style={{ width: 16, height: 16, accentColor: "#0052CC" }}
        />
        <span style={{ fontSize: 14, color: "#172B4D" }}>Remember me</span>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 18, height: 18, borderRadius: "50%",
          background: "#6554C0", color: "white", fontSize: 11, fontWeight: 700,
        }}>ℹ</span>
      </label>

      <PrimaryButton loading={loading} onClick={onSubmit}>
        {loading ? undefined : "Log in"}
      </PrimaryButton>

      <Divider label="Or login with:" />
      <OutlineButton icon={<PasskeyIcon />} label="Passkey" />

      <Divider label="Or continue with:" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <OutlineButton icon={<GoogleIcon />}    label="Google"    onClick={() => { window.location.href = `${API}/auth/google`; }} />
        <OutlineButton icon={<MicrosoftIcon />} label="Microsoft" />
        <OutlineButton icon={<AppleIcon />}     label="Apple"     />
        <OutlineButton icon={<SlackIcon />}     label="Slack"     />
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, marginTop: 24, marginBottom: 8, fontSize: 13,
      }}>
        <Link href="/forgot-password" style={{ color: "#0052CC", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
          Can&apos;t log in?
        </Link>
        <span style={{ color: "#7A869A" }}>•</span>
        <Link href="/register" style={{ color: "#0052CC", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
          Create an account
        </Link>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   STEP 3 — TOKEN / MFA VERIFICATION
════════════════════════════════════════════════════════════ */
interface TokenStepProps {
  email: string;
  digits: string[];
  setDigits: (d: string[]) => void;
  errors: ErrorState;
  loading: boolean;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}

function TokenStep({
  email,
  digits,
  setDigits,
  errors,
  loading,
  onVerify,
  onResend,
  onBack,
}: TokenStepProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Moved focused state to component level (not inside map)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (idx: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (v && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (next.every((d) => d !== "") && v) {
      setTimeout(onVerify, 80);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "Enter" && digits.every((d) => d !== "")) onVerify();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(""));
      inputRefs.current[5]?.focus();
      setTimeout(onVerify, 80);
    }
    e.preventDefault();
  };

  return (
    <>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#172B4D",
          textAlign: "center",
          margin: "0 0 14px",
          letterSpacing: "-0.3px",
        }}
      >
        We&apos;ve emailed you a code
      </h1>

      <p
        style={{
          fontSize: 14,
          color: "#5E6C84",
          textAlign: "center",
          lineHeight: 1.6,
          marginBottom: 6,
        }}
      >
        We require additional verification to protect your account. Check your email to continue:
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#172B4D",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {email}
      </p>

      <div
        style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}
        onPaste={handlePaste}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            style={{
              width: 48,
              height: 52,
              textAlign: "center",
              fontSize: 22,
              fontWeight: 600,
              color: "#172B4D",
              border: `2px solid ${focusedIndex === i ? "#2684FF" : "#DFE1E6"}`,
              borderRadius: 4,
              outline: "none",
              background: "white",
              transition: "border-color .12s",
            }}
          />
        ))}
      </div>

      {errors.token && (
        <p style={{ fontSize: 13, color: "#DE350B", textAlign: "center", marginBottom: 12 }}>
          {errors.token}
        </p>
      )}

      <PrimaryButton loading={loading} onClick={onVerify}>
        Verify
      </PrimaryButton>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 20 }}>
        <button
          type="button"
          onClick={onResend}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#0052CC",
            fontSize: 14,
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Didn&apos;t receive an email? Resend email
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#0052CC",
            fontSize: 14,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Log in to a different account
        </button>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE ROOT
════════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({});

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    rememberMe: false,
    token: ["", "", "", "", "", ""],
  });

  // OAuth error redirect
  useEffect(() => {
    if (searchParams.get("error") === "oauth_failed") {
      setErrors({ general: "Google sign-in failed. Please try again." });
    }
    // OAuth success: token in query
    const oauthToken = searchParams.get("token");
    if (oauthToken) {
      localStorage.setItem("trello_token", oauthToken);
      router.replace("/board");
    }
  }, [searchParams, router]);

  /* ── Step 1: validate email & call /login/email ── */
  const handleEmailContinue = useCallback(async () => {
    setErrors({});
    // client-side validation
    if (!form.email.trim()) {
      setErrors({ email: "Email is required" }); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors({ email: "Please enter a valid email address" }); return;
    }
    setLoading(true);
    try {
      await apiPost("/auth/login/email", { email: form.email });
      setStep("password");
    } catch {
      // Per spec, always move to password (security: don't reveal user existence)
      setStep("password");
    } finally {
      setLoading(false);
    }
  }, [form.email]);

  /* ── Step 2: password submit → /login/password ── */
  const handlePasswordSubmit = useCallback(async () => {
    setErrors({});
    if (!form.password) {
      setErrors({ password: "Password is required" }); return;
    }
    setLoading(true);
    try {
      const res = await apiPost<{ nextStep: string; message: string }>(
        "/auth/login/password",
        { email: form.email, password: form.password }
      );
      if (res.nextStep === "token-verification") {
        setStep("token");
        setForm(f => ({ ...f, token: ["", "", "", "", "", ""] }));
      }
    } catch (err: any) {
      const code = err?.code;
      if (code === "INVALID_CREDENTIALS") {
        setErrors({
          general: (
            <>
              Incorrect email address and / or password. If you recently migrated your Trello account
              to an Atlassian account, you will need to use your Atlassian account password.
              Alternatively, you can get help{" "}
              <a href="/forgot-password" style={{ color: "#0052CC" }}>logging in</a>.
            </>
          ) as any,
          type: "warning",
        });
      } else {
        setErrors({
          general: "Something went wrong while attempting to validate your credentials.",
          type: "warning",
        });
      }
      // Clear password on error (Trello behaviour shown in screenshots)
      setForm(f => ({ ...f, password: "" }));
    } finally {
      setLoading(false);
    }
  }, [form]);

  /* ── Step 3: token verify → /login/verify-token ── */
  const handleTokenVerify = useCallback(async () => {
    const code = form.token.join("");
    if (code.length < 6) {
      setErrors({ token: "Please enter all 6 digits" }); return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await apiPost<{ accessToken: string; redirect: string }>(
        "/auth/login/verify-token",
        { email: form.email, token: code, rememberMe: form.rememberMe }
      );
      // Store token
      localStorage.setItem("trello_token", res.accessToken);
      // Redirect
      const next = searchParams.get("next") || res.redirect || "/boards";
      router.replace(next);
    } catch (err: any) {
      setErrors({
        token: err?.error === "Invalid or expired token"
          ? "This code has expired. Request a new one."
          : "Invalid code. Please try again.",
      });
      setForm(f => ({ ...f, token: ["", "", "", "", "", ""] }));
    } finally {
      setLoading(false);
    }
  }, [form, router, searchParams]);

  /* ── Resend token ── */
  const handleResend = useCallback(async () => {
    setErrors({});
    setLoading(true);
    try {
      // Re-submit password to trigger new token email
      await apiPost("/auth/login/password", { email: form.email, password: form.password });
      setForm(f => ({ ...f, token: ["", "", "", "", "", ""] }));
    } catch {
      setErrors({ token: "Could not resend. Please try again." });
    } finally {
      setLoading(false);
    }
  }, [form]);

  const isTokenStep = step === "token";

  return (
    <>
      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Page background ── */}
      <div style={{
        minHeight: "100vh",
        background: "#F4F5F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "40px 16px 80px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Decorative characters (hidden on small screens) */}
        <LeftIllustration />
        <RightIllustration />

        {/* ── White card ── */}
        <div
          style={{
            position: "relative", zIndex: 1,
            width: "100%", maxWidth: 400,
            background: "white",
            borderRadius: 4,
            boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
            padding: "32px 40px 28px",
            animation: "fadeIn .25s ease",
          }}
        >
          {/* Logo — always visible */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
            <TrelloIcon size={42} />
            <span style={{
              fontSize: 26, fontWeight: 600, color: "#172B4D",
              letterSpacing: "-0.3px",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}>
              Trello
            </span>
          </div>

          {/* Heading — hidden on token step (it has its own) */}
          {!isTokenStep && (
            <h1 style={{
              fontSize: 20, fontWeight: 600, color: "#172B4D",
              textAlign: "center", margin: "0 0 24px",
              letterSpacing: "-0.2px",
            }}>
              Log in to continue
            </h1>
          )}

          {/* ── Step content ── */}
          {step === "email" && (
            <EmailStep
              form={form} setForm={setForm}
              errors={errors} loading={loading}
              onContinue={handleEmailContinue}
            />
          )}

          {step === "password" && (
            <PasswordStep
              form={form} setForm={setForm}
              errors={errors} loading={loading}
              onSubmit={handlePasswordSubmit}
              onEditEmail={() => { setStep("email"); setErrors({}); setForm(f=>({...f,password:""})); }}
            />
          )}

          {step === "token" && (
            <TokenStep
              email={form.email}
              digits={form.token}
              setDigits={d => setForm(f => ({ ...f, token: d }))}
              errors={errors} loading={loading}
              onVerify={handleTokenVerify}
              onResend={handleResend}
              onBack={() => { setStep("email"); setForm(f=>({...f,email:"",password:"",token:["","","","","",""]})); setErrors({}); }}
            />
          )}

          {/* ── Atlassian footer (on email + token steps) ── */}
          {(step === "email" || step === "token") && (
            <>
              <div style={{ height: 1, background: "#DFE1E6", margin: "20px 0 16px" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <AtlassianLogo />
                </div>
                <p style={{ fontSize: 12, color: "#5E6C84", lineHeight: 1.6, margin: "0 0 6px" }}>
                  One account for Trello, Jira, Confluence and{" "}
                  <a href="https://www.atlassian.com" target="_blank" rel="noopener noreferrer"
                    style={{ color: "#0052CC" }}>more ↗</a>
                </p>
                {step === "email" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, color: "#5E6C84" }}>
                      <a href="/privacy" style={{ color: "#0052CC" }}>Privacy Policy ↗</a>
                      <span>·</span>
                      <a href="/user-notice" style={{ color: "#0052CC" }}>User Notice ↗</a>
                    </div>
                    <p style={{ fontSize: 11, color: "#7A869A", marginTop: 8, lineHeight: 1.5 }}>
                      This site is protected by reCAPTCHA and the Google{" "}
                      <a href="https://policies.google.com/privacy" style={{ color: "#0052CC" }}>Privacy Policy ↗</a>
                      {" "}and{" "}
                      <a href="https://policies.google.com/terms" style={{ color: "#0052CC" }}>Terms of Service ↗</a>
                      {" "}apply.
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}