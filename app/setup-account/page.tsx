"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface PasswordStrength {
  level: "weak" | "medium" | "strong";
  score: number;
}

export default function SetupAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    level: "weak",
    score: 0,
  });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      const storedEmail = sessionStorage.getItem("verificationEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        router.push("/signup");
      }
    }
  }, [searchParams, router]);

  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;

    let level: "weak" | "medium" | "strong" = "weak";
    if (score <= 2) level = "weak";
    else if (score <= 4) level = "medium";
    else level = "strong";

    return { level, score };
  };

  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength({ level: "weak", score: 0 });
    }
  }, [password]);

  const getPasswordLabel = () => {
    if (passwordStrength.level === "weak") return "Weak";
    if (passwordStrength.level === "medium") return "Medium";
    return "Very strong";
  };

  const getPasswordLabelColor = () => {
    if (passwordStrength.level === "weak") return "text-red-600";
    if (passwordStrength.level === "medium") return "text-yellow-600";
    return "text-green-600";
  };

  // 5 bars matching the real Atlassian UI
  const getBarColor = (index: number) => {
    const filledBars =
      passwordStrength.level === "weak"
        ? 1
        : passwordStrength.level === "medium"
        ? 3
        : 5;

    if (index >= filledBars) return "bg-[hsl(216,12%,77%)]";
    if (passwordStrength.level === "weak") return "bg-red-500";
    if (passwordStrength.level === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.setItem("trello_user", JSON.stringify({ email, fullName }));
      router.push("/board");
    } catch (err: any) {
      setError(err.message || "Account setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,97%)] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Left decorative illustration */}
      <div className="hidden lg:block absolute left-0 bottom-0 w-[320px] h-[420px]">
        <svg viewBox="0 0 320 420" fill="none" className="w-full h-full">
          <ellipse cx="160" cy="390" rx="130" ry="16" fill="hsl(220,15%,90%)" />
          {/* Desk surface */}
          <rect x="60" y="270" width="200" height="10" rx="5" fill="hsl(210,25%,78%)" />
          <rect x="80" y="280" width="6" height="110" rx="3" fill="hsl(210,25%,78%)" />
          <rect x="234" y="280" width="6" height="110" rx="3" fill="hsl(210,25%,78%)" />
          {/* Laptop base */}
          <rect x="100" y="245" width="120" height="10" rx="2" fill="hsl(210,20%,70%)" />
          {/* Laptop screen */}
          <rect x="105" y="200" width="110" height="45" rx="4" fill="hsl(210,60%,82%)" />
          <rect x="111" y="206" width="98" height="33" rx="2" fill="hsl(210,80%,94%)" />
          {/* Screen content lines */}
          <rect x="117" y="212" width="50" height="4" rx="2" fill="hsl(210,60%,70%)" />
          <rect x="117" y="220" width="35" height="3" rx="1.5" fill="hsl(210,40%,80%)" />
          <rect x="117" y="226" width="42" height="3" rx="1.5" fill="hsl(210,40%,80%)" />
          {/* Person body */}
          <rect x="148" y="220" width="24" height="40" rx="8" fill="hsl(210,70%,55%)" />
          {/* Person head */}
          <circle cx="160" cy="205" r="17" fill="hsl(25,55%,52%)" />
          {/* Person hair */}
          <path d="M143 200 Q160 185 177 200" fill="hsl(20,40%,30%)" />
          {/* Person arms */}
          <path d="M148 235 Q130 245 125 265" stroke="hsl(25,55%,52%)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M172 235 Q190 245 195 265" stroke="hsl(25,55%,52%)" strokeWidth="8" strokeLinecap="round" fill="none" />

          {/* Floating chart card */}
          <rect x="20" y="130" width="80" height="70" rx="8" fill="white" stroke="hsl(210,20%,88%)" strokeWidth="1.5" />
          <rect x="30" y="178" width="12" height="16" rx="2" fill="hsl(210,75%,60%)" />
          <rect x="46" y="165" width="12" height="29" rx="2" fill="hsl(160,55%,52%)" />
          <rect x="62" y="170" width="12" height="24" rx="2" fill="hsl(340,65%,62%)" />
          {/* Chart line */}
          <polyline points="30,168 46,158 62,162 78,148" stroke="hsl(210,75%,60%)" strokeWidth="1.5" fill="none" />
          <text x="32" y="148" fontSize="8" fill="hsl(213,20%,45%)" fontFamily="sans-serif">Sales</text>

          {/* Floating tag */}
          <rect x="195" y="115" width="70" height="28" rx="6" fill="hsl(180,50%,88%)" />
          <rect x="203" y="123" width="40" height="4" rx="2" fill="hsl(180,50%,55%)" />
          <rect x="203" y="131" width="28" height="3" rx="1.5" fill="hsl(180,40%,65%)" />

          {/* Floating circles */}
          <circle cx="255" cy="160" r="10" fill="hsl(45,90%,65%)" opacity="0.85" />
          <circle cx="50" cy="105" r="14" fill="hsl(150,40%,68%)" opacity="0.6" />
          <circle cx="290" cy="220" r="6" fill="hsl(270,50%,72%)" opacity="0.7" />
        </svg>
      </div>

      {/* Right decorative illustration */}
      <div className="hidden lg:block absolute right-0 bottom-0 w-[320px] h-[420px]">
        <svg viewBox="0 0 320 420" fill="none" className="w-full h-full">
          <ellipse cx="160" cy="390" rx="130" ry="16" fill="hsl(220,15%,90%)" />

          {/* Monitor stand */}
          <rect x="175" y="248" width="8" height="30" fill="hsl(210,20%,75%)" />
          <rect x="160" y="278" width="38" height="6" rx="3" fill="hsl(210,20%,75%)" />
          {/* Monitor */}
          <rect x="120" y="170" width="118" height="80" rx="8" fill="hsl(180,40%,82%)" />
          <rect x="128" y="178" width="102" height="64" rx="4" fill="hsl(180,50%,93%)" />
          {/* Monitor content */}
          <rect x="136" y="186" width="50" height="5" rx="2" fill="hsl(210,60%,60%)" />
          <rect x="136" y="195" width="38" height="4" rx="2" fill="hsl(210,30%,75%)" />
          <rect x="136" y="203" width="44" height="4" rx="2" fill="hsl(210,30%,75%)" />
          <rect x="136" y="211" width="30" height="4" rx="2" fill="hsl(210,30%,75%)" />
          <rect x="136" y="222" width="55" height="12" rx="3" fill="hsl(210,70%,55%)" />

          {/* Character - robot/mascot */}
          <rect x="60" y="240" width="80" height="90" rx="12" fill="hsl(350,55%,72%)" />
          {/* Head */}
          <rect x="70" y="205" width="60" height="42" rx="10" fill="hsl(350,55%,72%)" />
          {/* Eyes */}
          <circle cx="85" cy="222" r="6" fill="white" />
          <circle cx="115" cy="222" r="6" fill="white" />
          <circle cx="87" cy="224" r="3" fill="hsl(213,30%,25%)" />
          <circle cx="117" cy="224" r="3" fill="hsl(213,30%,25%)" />
          {/* Antenna */}
          <line x1="100" y1="205" x2="100" y2="192" stroke="hsl(350,55%,72%)" strokeWidth="3" />
          <circle cx="100" cy="189" r="5" fill="hsl(45,85%,65%)" />
          {/* Arms */}
          <path d="M60 260 Q40 270 35 290" stroke="hsl(350,55%,72%)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M140 260 Q160 270 165 290" stroke="hsl(350,55%,72%)" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* Legs */}
          <rect x="75" y="328" width="22" height="55" rx="8" fill="hsl(213,30%,25%)" />
          <rect x="103" y="328" width="22" height="55" rx="8" fill="hsl(213,30%,25%)" />

          {/* Moon */}
          <circle cx="265" cy="85" r="22" fill="hsl(45,80%,72%)" />
          <circle cx="274" cy="78" r="18" fill="hsl(220,20%,97%)" />

          {/* Stars */}
          <circle cx="210" cy="65" r="3" fill="hsl(45,80%,72%)" />
          <circle cx="290" cy="50" r="2.5" fill="hsl(45,80%,72%)" />
          <circle cx="240" cy="45" r="2" fill="hsl(45,80%,72%)" />

          {/* Floating card top right */}
          <rect x="220" y="130" width="72" height="32" rx="6" fill="white" stroke="hsl(210,20%,88%)" strokeWidth="1.5" />
          <rect x="229" y="139" width="30" height="4" rx="2" fill="hsl(270,50%,72%)" />
          <rect x="229" y="147" width="44" height="3" rx="1.5" fill="hsl(210,20%,82%)" />
        </svg>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[400px] mx-4 bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.12)] z-10">
        <div className="px-10 pt-10 pb-6">
          {/* Trello Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-7">
            <div className="w-9 h-9 bg-[hsl(212,100%,42%)] rounded-lg flex items-center justify-center shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="3" width="8" height="18" rx="1.5" />
                <rect x="13" y="3" width="8" height="11" rx="1.5" />
              </svg>
            </div>
            <span className="text-[28px] font-bold text-[hsl(213,30%,22%)] tracking-tight">Trello</span>
          </div>

          {/* Verified status */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-[15px] font-bold text-[hsl(213,30%,20%)]">Email address verified</span>
              <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500 stroke-white" />
            </div>
            <p className="text-sm text-[hsl(213,20%,42%)]">Finish setting up your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email display */}
            <div>
              <label className="text-xs font-semibold text-[hsl(213,20%,40%)] block mb-0.5">
                Email address
              </label>
              <p className="text-sm font-semibold text-[hsl(213,30%,20%)] mt-0.5">{email}</p>
            </div>

            {/* Full name */}
            <div>
              <label className="text-xs font-semibold text-[hsl(213,20%,40%)] block mb-1.5">
                Full name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="h-11 px-3 border-[hsl(216,12%,82%)] rounded focus:border-[hsl(212,100%,42%)] focus:ring-1 focus:ring-[hsl(212,100%,42%)] text-sm text-[hsl(213,30%,20%)] bg-white placeholder:text-[hsl(213,15%,65%)]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-[hsl(213,20%,40%)] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="h-11 px-3 pr-11 border-[hsl(216,12%,82%)] rounded focus:border-[hsl(212,100%,42%)] focus:ring-1 focus:ring-[hsl(212,100%,42%)] text-sm text-[hsl(213,30%,20%)] bg-white placeholder:text-[hsl(213,15%,65%)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(213,15%,48%)] hover:text-[hsl(213,30%,20%)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Strength bars */}
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                        password ? getBarColor(i) : "bg-[hsl(216,12%,82%)]"
                      }`}
                    />
                  ))}
                </div>
                {password ? (
                  <p className={`text-xs text-center mt-1.5 font-medium ${getPasswordLabelColor()}`}>
                    {getPasswordLabel()}
                  </p>
                ) : (
                  <p className="text-xs text-center mt-1.5 text-[hsl(213,15%,52%)]">
                    Password must have at least 8 characters
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-[hsl(213,15%,42%)] leading-relaxed pt-0.5">
              By signing up, I accept the Atlassian{" "}
              <a href="#" className="text-[hsl(212,100%,40%)] hover:underline">
                Cloud Terms of Service ↗
              </a>{" "}
              and acknowledge the{" "}
              <a href="#" className="text-[hsl(212,100%,40%)] hover:underline">
                Privacy Policy ↗
              </a>
              .
            </p>

            <Button
              type="submit"
              disabled={loading || !fullName || password.length < 8}
              className="w-full h-11 bg-[hsl(212,100%,42%)] hover:bg-[hsl(212,100%,36%)] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          {/* Divider + Atlassian */}
          <div className="border-t border-[hsl(216,12%,90%)] mt-8 pt-5">
            <div className="flex items-center justify-center gap-2 text-[hsl(213,15%,45%)]">
              {/* Atlassian mountain logo */}
              <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
                <path d="M5.7 15.5c-.3-.4-.8-.3-1 .1L.2 25.7c-.2.4 0 .9.5.9h8.8c.3 0 .5-.1.7-.4 1.4-2.8 1-6.6-4.5-10.7zM15.9 1.2c-4.2 7.4-4.5 14.5-1.8 19.7l4.1 7.9c.1.2.4.4.7.4H28c.4 0 .7-.5.5-.9L17.1 1.4c-.3-.4-.9-.6-1.2-.2z" />
              </svg>
              <span className="text-sm font-bold tracking-widest uppercase">Atlassian</span>
            </div>
            <p className="text-xs text-center text-[hsl(213,15%,52%)] mt-2">
              One account for Trello, Jira, Confluence and{" "}
              <a href="#" className="text-[hsl(212,100%,40%)] hover:underline">more ↗</a>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 pb-7 pt-1">
          <p className="text-[10.5px] text-center text-[hsl(213,15%,58%)] leading-relaxed">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="#" className="text-[hsl(212,100%,40%)] hover:underline">Privacy Policy ↗</a>{" "}
            and{" "}
            <a href="#" className="text-[hsl(212,100%,40%)] hover:underline">Terms of Service ↗</a>{" "}
            apply.
          </p>
        </div>
      </div>
    </div>
  );
}