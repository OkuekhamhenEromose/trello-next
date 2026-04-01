"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────────────────────────────────────

function TrelloIcon() {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: "linear-gradient(180deg, #2684FF 0%, #0052CC 100%)",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2.5" y="2.5" width="7" height="13" rx="1.5" fill="white" />
        <rect x="12.5" y="2.5" width="7" height="8.5" rx="1.5" fill="white" />
      </svg>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" className="flex-shrink-0">
      <rect x="0" y="0" width="10" height="10" fill="#F25022" />
      <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
      <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
      <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 814 1000"
      className="flex-shrink-0"
      fill="#000"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.5 269-317.5 70.6 0 129.5 46.4 173.1 46.4 42.8 0 109.8-49 192.9-49 31.2 0 113.7 2.6 168.2 98.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 122.8 122.8"
      className="flex-shrink-0"
    >
      <path
        d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
        fill="#E01E5A"
      />
      <path
        d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
        fill="#36C5F0"
      />
      <path
        d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
        fill="#2EB67D"
      />
      <path
        d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
        fill="#ECB22E"
      />
    </svg>
  );
}

function AtlassianLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Atlassian diamond */}
      <svg width="16" height="20" viewBox="0 0 32 40" fill="none">
        <path
          d="M14.5 18.5c-.8-1.2-1.6-2.6-2.1-4.2C10.5 8.8 9 4 9 4L1 22h9.5l4-3.5z"
          fill="url(#atl-g1)"
        />
        <path
          d="M17.5 18.5c.8-1.2 1.6-2.6 2.1-4.2C21.5 8.8 23 4 23 4l8 18h-9.5l-4-3.5z"
          fill="url(#atl-g2)"
        />
        <defs>
          <linearGradient
            id="atl-g1"
            x1="14.5"
            y1="4"
            x2="1"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2684FF" />
            <stop offset="1" stopColor="#0052CC" />
          </linearGradient>
          <linearGradient
            id="atl-g2"
            x1="17.5"
            y1="4"
            x2="23"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2684FF" />
            <stop offset="1" stopColor="#0052CC" />
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          color: "#253858",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.12em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        ATLASSIAN
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Left Illustration  (matches the screenshot: robot + person + dog + UI panels)
// ─────────────────────────────────────────────────────────────────────────────
function LeftIllustration() {
  return (
    <div
      className="hidden lg:block absolute pointer-events-none select-none"
      style={{ left: 0, bottom: 0, width: 310, zIndex: 1 }}
    >
      <svg viewBox="0 0 310 430" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ── UI screen panels ── */}
        <rect x="18" y="70" width="185" height="148" rx="8" fill="#e8ecf4" />
        <rect x="18" y="70" width="185" height="20" rx="8" fill="#d5daea" />
        {/* window dots */}
        <circle cx="32" cy="80" r="4" fill="#ff7875" opacity=".7" />
        <circle cx="44" cy="80" r="4" fill="#ffd666" opacity=".7" />
        <circle cx="56" cy="80" r="4" fill="#73d13d" opacity=".7" />
        {/* chart area */}
        <rect x="28" y="100" width="80" height="55" rx="4" fill="#dce3f5" />
        <polyline
          points="34,145 48,128 62,137 76,118 90,130 100,120"
          stroke="#5b7fd4"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* content lines */}
        <rect x="120" y="102" width="70" height="8" rx="3" fill="#c8d2e8" />
        <rect x="120" y="116" width="55" height="8" rx="3" fill="#c8d2e8" />
        <rect x="120" y="130" width="65" height="8" rx="3" fill="#c8d2e8" />
        {/* toggle */}
        <rect x="120" y="148" width="36" height="14" rx="7" fill="#c5cfe8" />
        <circle cx="148" cy="155" r="6" fill="white" />
        {/* right mini panel */}
        <rect x="215" y="108" width="88" height="68" rx="6" fill="#eef1f8" />
        <rect x="222" y="118" width="74" height="8" rx="3" fill="#c8d2e8" />
        <rect x="222" y="132" width="56" height="8" rx="3" fill="#c8d2e8" />
        <rect x="222" y="146" width="64" height="8" rx="3" fill="#c8d2e8" />

        {/* ── Robot character ── */}
        {/* body */}
        <rect x="42" y="258" width="54" height="64" rx="9" fill="#5e4db2" />
        {/* head */}
        <rect x="47" y="220" width="44" height="42" rx="9" fill="#7c6adb" />
        {/* eye screens */}
        <rect
          x="53"
          y="230"
          width="13"
          height="10"
          rx="3"
          fill="#00e5ff"
          opacity=".9"
        />
        <rect
          x="72"
          y="230"
          width="13"
          height="10"
          rx="3"
          fill="#00e5ff"
          opacity=".9"
        />
        {/* mouth */}
        <rect x="56" y="248" width="26" height="5" rx="2.5" fill="#4a3ca0" />
        {/* light bulb */}
        <circle cx="69" cy="207" r="13" fill="#ffd666" />
        <path d="M65 218 h8 v4 h-8z" fill="#e6b800" />
        <line
          x1="69"
          y1="194"
          x2="69"
          y2="191"
          stroke="#ffd666"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="59"
          y1="197"
          x2="57"
          y2="195"
          stroke="#ffd666"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="79"
          y1="197"
          x2="81"
          y2="195"
          stroke="#ffd666"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* arms */}
        <rect
          x="14"
          y="264"
          width="30"
          height="13"
          rx="6.5"
          fill="#5e4db2"
          transform="rotate(-10 28 270)"
        />
        <rect
          x="93"
          y="262"
          width="32"
          height="13"
          rx="6.5"
          fill="#5e4db2"
          transform="rotate(12 108 268)"
        />
        {/* item in left hand */}
        <rect x="4" y="274" width="18" height="26" rx="3" fill="#a0b4d8" />
        <rect x="7" y="278" width="12" height="3" rx="1" fill="#7890b8" />
        <rect x="7" y="284" width="12" height="3" rx="1" fill="#7890b8" />
        <rect x="7" y="290" width="8" height="3" rx="1" fill="#7890b8" />
        {/* legs */}
        <rect x="51" y="320" width="16" height="34" rx="7" fill="#3d2f9a" />
        <rect x="73" y="320" width="16" height="34" rx="7" fill="#3d2f9a" />
        <ellipse cx="59" cy="354" rx="14" ry="7" fill="#2d2278" />
        <ellipse cx="81" cy="354" rx="14" ry="7" fill="#2d2278" />

        {/* ── Human figure (woman) ── */}
        {/* body / dress */}
        <rect x="172" y="288" width="52" height="62" rx="8" fill="#1e5a8a" />
        <path
          d="M168 326 Q198 352 228 326 L228 358 Q198 374 168 358 Z"
          fill="#2474a8"
        />
        {/* head */}
        <ellipse cx="198" cy="262" rx="24" ry="26" fill="#f4b49a" />
        {/* hair */}
        <path d="M175 256 Q182 236 198 234 Q214 236 221 256" fill="#8b1a1a" />
        <path
          d="M221 256 Q228 268 224 280 Q215 258 198 256 Q181 258 172 280 Q168 268 175 256 Z"
          fill="#8b1a1a"
        />
        {/* eyes */}
        <ellipse cx="190" cy="264" rx="3.5" ry="4" fill="#2d3436" />
        <ellipse cx="206" cy="264" rx="3.5" ry="4" fill="#2d3436" />
        <ellipse cx="190.8" cy="263" rx="1.2" ry="1.5" fill="white" />
        <ellipse cx="206.8" cy="263" rx="1.2" ry="1.5" fill="white" />
        {/* smile */}
        <path
          d="M191 275 Q198 281 205 275"
          stroke="#c06040"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* arms */}
        <rect
          x="148"
          y="294"
          width="26"
          height="12"
          rx="6"
          fill="#1e5a8a"
          transform="rotate(-18 160 300)"
        />
        <rect
          x="222"
          y="294"
          width="26"
          height="12"
          rx="6"
          fill="#1e5a8a"
          transform="rotate(18 235 300)"
        />
        {/* pointing hand */}
        <circle cx="148" cy="306" r="6" fill="#f4b49a" />
        {/* legs */}
        <rect x="181" y="350" width="16" height="38" rx="7" fill="#1a3a50" />
        <rect x="203" y="350" width="16" height="38" rx="7" fill="#1a3a50" />
        <ellipse cx="189" cy="388" rx="13" ry="6" fill="#102030" />
        <ellipse cx="211" cy="388" rx="13" ry="6" fill="#102030" />
        {/* shoes teal */}
        <ellipse cx="189" cy="390" rx="9" ry="4" fill="#00b8a9" />
        <ellipse cx="211" cy="390" rx="9" ry="4" fill="#00b8a9" />

        {/* ── Dog / white fluffy ── */}
        <ellipse cx="28" cy="393" rx="26" ry="16" fill="#ddd" />
        <circle cx="14" cy="378" r="14" fill="#ccc" />
        <ellipse
          cx="8"
          cy="368"
          rx="6"
          ry="9"
          fill="#ccc"
          transform="rotate(-20 8 368)"
        />
        <ellipse
          cx="20"
          cy="366"
          rx="5"
          ry="8"
          fill="#ccc"
          transform="rotate(15 20 366)"
        />
        <ellipse cx="13" cy="380" rx="4" ry="3" fill="#aaa" />
        <circle cx="11" cy="379" r="1.5" fill="#333" />
        <circle cx="16" cy="379" r="1.5" fill="#333" />
        <ellipse cx="14" cy="384" rx="2.5" ry="1.5" fill="#ffaaaa" />
        {/* tail */}
        <path
          d="M52 386 Q60 376 66 382"
          stroke="#ccc"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Right Illustration  (matches screenshot: screen panels + tall robot + orange blob + ladder)
// ─────────────────────────────────────────────────────────────────────────────
function RightIllustration() {
  return (
    <div
      className="hidden lg:block absolute pointer-events-none select-none"
      style={{ right: 0, bottom: 0, width: 360, zIndex: 1 }}
    >
      <svg viewBox="0 0 360 430" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ── Large UI panel ── */}
        <rect x="30" y="30" width="240" height="175" rx="8" fill="#e8ecf4" />
        <rect x="30" y="30" width="240" height="22" rx="8" fill="#d5daea" />
        <circle cx="46" cy="41" r="4" fill="#ff7875" opacity=".7" />
        <circle cx="58" cy="41" r="4" fill="#ffd666" opacity=".7" />
        <circle cx="70" cy="41" r="4" fill="#73d13d" opacity=".7" />
        {/* content lines */}
        <rect x="42" y="64" width="210" height="9" rx="3" fill="#c8d2e8" />
        <rect x="42" y="80" width="168" height="9" rx="3" fill="#c8d2e8" />
        <rect x="42" y="96" width="188" height="9" rx="3" fill="#c8d2e8" />
        {/* Bar chart */}
        <rect x="42" y="116" width="135" height="75" rx="5" fill="#dce3f5" />
        <rect x="52" y="158" width="14" height="28" rx="2" fill="#5b7fd4" />
        <rect x="72" y="144" width="14" height="42" rx="2" fill="#3a5ca8" />
        <rect x="92" y="150" width="14" height="36" rx="2" fill="#5b7fd4" />
        <rect x="112" y="136" width="14" height="50" rx="2" fill="#2a4898" />
        <rect x="132" y="148" width="14" height="38" rx="2" fill="#5b7fd4" />
        {/* Moon */}
        <circle cx="285" cy="120" r="34" fill="#c8d4e8" opacity=".7" />
        <circle cx="274" cy="112" r="26" fill="#eef1f8" opacity=".9" />

        {/* ── Ladder ── */}
        <rect x="290" y="100" width="9" height="240" rx="3.5" fill="#b0bece" />
        <rect x="318" y="100" width="9" height="240" rx="3.5" fill="#b0bece" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect
            key={i}
            x="290"
            y={128 + i * 28}
            width="37"
            height="7"
            rx="2.5"
            fill="#96acbc"
          />
        ))}

        {/* ── Tall person (dark techie) ── */}
        {/* body */}
        <rect x="168" y="238" width="52" height="72" rx="7" fill="#1a2b3c" />
        {/* head */}
        <ellipse cx="194" cy="218" rx="23" ry="25" fill="#e8b490" />
        {/* dark hair */}
        <path d="M172 212 Q179 192 194 190 Q209 192 216 212" fill="#111" />
        <path
          d="M216 212 Q222 224 218 238 Q208 214 194 212 Q180 214 170 238 Q166 224 172 212 Z"
          fill="#111"
        />
        {/* glasses */}
        <rect
          x="181"
          y="214"
          width="12"
          height="9"
          rx="3"
          fill="none"
          stroke="#333"
          strokeWidth="1.5"
        />
        <rect
          x="199"
          y="214"
          width="12"
          height="9"
          rx="3"
          fill="none"
          stroke="#333"
          strokeWidth="1.5"
        />
        <line
          x1="193"
          y1="218.5"
          x2="199"
          y2="218.5"
          stroke="#333"
          strokeWidth="1.5"
        />
        {/* smile */}
        <path
          d="M187 230 Q194 236 201 230"
          stroke="#c07050"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* arms */}
        <rect
          x="144"
          y="244"
          width="26"
          height="12"
          rx="6"
          fill="#1a2b3c"
          transform="rotate(-15 156 250)"
        />
        <rect
          x="218"
          y="244"
          width="26"
          height="12"
          rx="6"
          fill="#1a2b3c"
          transform="rotate(15 230 250)"
        />
        <circle cx="144" cy="254" r="8" fill="#e8b490" />
        {/* legs */}
        <rect x="176" y="308" width="17" height="48" rx="7" fill="#0d1a26" />
        <rect x="200" y="308" width="17" height="48" rx="7" fill="#0d1a26" />
        <ellipse cx="184.5" cy="356" rx="14" ry="7" fill="#060e14" />
        <ellipse cx="208.5" cy="356" rx="14" ry="7" fill="#060e14" />
        {/* teal sneakers */}
        <ellipse cx="184.5" cy="358" rx="10" ry="4.5" fill="#00b8a9" />
        <ellipse cx="208.5" cy="358" rx="10" ry="4.5" fill="#00b8a9" />

        {/* ── Orange/pink blob character ── */}
        {/* body blob */}
        <ellipse cx="316" cy="300" rx="36" ry="48" fill="#ff9f7f" />
        {/* belly */}
        <ellipse
          cx="316"
          cy="308"
          rx="20"
          ry="26"
          fill="#ffb89a"
          opacity=".7"
        />
        {/* head */}
        <circle cx="316" cy="244" r="32" fill="#ffb89a" />
        {/* teal headband */}
        <rect x="287" y="230" width="58" height="11" rx="5.5" fill="#00b894" />
        {/* eyes */}
        <circle cx="305" cy="242" r="5.5" fill="#2d3436" />
        <circle cx="327" cy="242" r="5.5" fill="#2d3436" />
        <circle cx="306" cy="240" r="2.2" fill="white" />
        <circle cx="328" cy="240" r="2.2" fill="white" />
        {/* big smile */}
        <path
          d="M302 256 Q316 268 330 256"
          stroke="#c05a30"
          strokeWidth="2.5"
          fill="#ff7043"
          strokeLinecap="round"
        />
        {/* arms */}
        <path
          d="M280 280 Q262 274 256 288"
          stroke="#ff9f7f"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M352 280 Q370 280 374 268"
          stroke="#ff9f7f"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        {/* legs */}
        <rect x="298" y="344" width="17" height="40" rx="8" fill="#e07858" />
        <rect x="320" y="344" width="17" height="40" rx="8" fill="#e07858" />
        <ellipse cx="306.5" cy="384" rx="14" ry="7" fill="#c05840" />
        <ellipse cx="328.5" cy="384" rx="14" ry="7" fill="#c05840" />
        {/* teal shoe dots */}
        <circle cx="306" cy="386" r="4.5" fill="#00cec9" />
        <circle cx="328" cy="386" r="4.5" fill="#00cec9" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Social Button
// ─────────────────────────────────────────────────────────────────────────────
function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 transition-colors"
      style={{
        height: 44,
        background: "white",
        border: "1px solid #dfe1e6",
        borderRadius: 3,
        fontSize: 14,
        fontWeight: 500,
        color: "#172b4d",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#f4f5f7";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "white";
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.startRegistration(email);
      sessionStorage.setItem("verificationEmail", email);
      sessionStorage.setItem("verificationToken", response.token);
      router.push("/verify-email");
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { error?: string } } };
      setError(
        apiError.response?.data?.error ||
          "Failed to start registration. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    /*
     * Page background: very light grey — exactly #f4f5f7
     * Illustrations are fixed to left/bottom and right/bottom of viewport
     */
    <div
      className="min-h-screen relative flex flex-col items-center overflow-x-hidden"
      style={{ background: "#f4f5f7", paddingTop: 40, paddingBottom: 40 }}
    >
      {/* Fixed side illustrations */}
      <LeftIllustration />
      <RightIllustration />

      {/* ── White card — centered, z above illustrations ── */}
      <div
        className="relative z-10 w-full"
        style={{ maxWidth: 400, padding: "0 16px" }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 3 /* nearly square corners */,
            boxShadow:
              "0 4px 16px rgba(9,30,66,0.10), 0 0 1px rgba(9,30,66,0.08)",
            overflow: "hidden",
          }}
        >
          {/* ────────── Main form section ────────── */}
          <div style={{ padding: "40px 40px 32px" }}>
            {/* Logo row */}
            <div
              className="flex items-center justify-center gap-3"
              style={{ marginBottom: 24 }}
            >
              <TrelloIcon />
              <span
                style={{
                  color: "#172b4d",
                  fontWeight: 700,
                  fontSize: 27,
                  letterSpacing: "-0.5px",
                  fontFamily:
                    '"Charlie Display", system-ui, -apple-system, sans-serif',
                  lineHeight: 1,
                }}
              >
                Trello
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-center"
              style={{
                color: "#172b4d",
                fontWeight: 600,
                fontSize: 20,
                marginBottom: 24,
                fontFamily:
                  '"Charlie Display", system-ui, -apple-system, sans-serif',
                lineHeight: 1.3,
              }}
            >
              Sign up to continue
            </h1>

            {/* Error banner */}
            {error && (
              <div
                style={{
                  background: "#ffebe6",
                  border: "1px solid #ffbdad",
                  color: "#bf2600",
                  borderRadius: 3,
                  padding: "10px 12px",
                  fontSize: 13,
                  lineHeight: 1.5,
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email label + input */}
              <div style={{ marginBottom: 8 }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    color: "#172b4d",
                    fontWeight: 700,
                    fontSize: 12,
                    marginBottom: 6,
                    letterSpacing: "0.01em",
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    display: "block",
                    width: "100%",
                    height: 40,
                    padding: "0 10px",
                    fontSize: 14,
                    color: "#172b4d",
                    background: "#fafbfc",
                    border: "2px solid #dfe1e6",
                    borderRadius: 3,
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#4c9aff";
                    e.currentTarget.style.background = "white";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#dfe1e6";
                    e.currentTarget.style.background = "#fafbfc";
                  }}
                />
              </div>

              {/* Terms text */}
              <p
                style={{
                  fontSize: 12,
                  color: "#172b4d",
                  lineHeight: 1.65,
                  marginBottom: 20,
                  marginTop: 8,
                }}
              >
                By signing up, I accept the Atlassian{" "}
                <a
                  href="#"
                  style={{ color: "#0052cc", textDecoration: "underline" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#0065ff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#0052cc";
                  }}
                >
                  Cloud Terms of Service
                </a>{" "}
                and acknowledge the{" "}
                <a
                  href="#"
                  style={{ color: "#0052cc", textDecoration: "underline" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#0065ff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#0052cc";
                  }}
                >
                  Privacy Policy
                </a>
                .
              </p>

              {/* Sign up button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  height: 40,
                  background: loading ? "#0052cc" : "#0052cc",
                  color: "white",
                  border: "none",
                  borderRadius: 3,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                  opacity: loading ? 0.85 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#0065ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#0052cc";
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending verification…</span>
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            {/* Or continue with */}
            <p
              className="text-center"
              style={{ fontSize: 13, color: "#5e6c84", margin: "22px 0 14px" }}
            >
              Or continue with:
            </p>

            {/* Social buttons — 1-column stacked */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SocialButton icon={<GoogleIcon />} label="Google" />
              <SocialButton icon={<MicrosoftIcon />} label="Microsoft" />
              <SocialButton icon={<AppleIcon />} label="Apple" />
              <SocialButton icon={<SlackIcon />} label="Slack" />
            </div>

            {/* Already have account */}
            <div className="text-center" style={{ marginTop: 22 }}>
              <Link
                href="/login"
                style={{
                  color: "#0052cc",
                  fontSize: 14,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "underline";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "none";
                }}
              >
                Already have an Atlassian account? Log in
              </Link>
            </div>
          </div>
          {/* end main form section */}

          {/* ── Horizontal divider ── */}
          <div style={{ height: 1, background: "#dfe1e6", margin: "0 0" }} />

          {/* ── Atlassian footer ── */}
          <div
            style={{
              padding: "22px 40px 24px",
              textAlign: "center",
            }}
          >
            <AtlassianLogo />

            <p
              style={{
                color: "#5e6c84",
                fontSize: 12,
                marginTop: 8,
                lineHeight: 1.6,
              }}
            >
              One account for Trello, Jira, Confluence and{" "}
              <a
                href="#"
                style={{ color: "#0052cc", textDecoration: "none" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "underline";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "none";
                }}
              >
                more
              </a>
              .
            </p>

            <p
              style={{
                color: "#5e6c84",
                fontSize: 11.5,
                marginTop: 10,
                lineHeight: 1.65,
              }}
            >
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="#"
                style={{ color: "#0052cc", textDecoration: "none" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "underline";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "none";
                }}
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="#"
                style={{ color: "#0052cc", textDecoration: "none" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "underline";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "none";
                }}
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
        </div>
        {/* end white card */}
      </div>
      {/* end max-width wrapper */}
    </div>
  );
}
