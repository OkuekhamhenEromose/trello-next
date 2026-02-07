import Link from "next/link";
import {
  Globe,
  ChevronDown,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

const footerLinks = [
  {
    title: "About Trello",
    description: "What&apos;s behind the boards.",
    href: "/about",
  },
  {
    title: "Jobs",
    description: "Learn about open roles on the Trello team.",
    href: "/jobs",
  },
  {
    title: "Apps",
    description: "Download the Trello App for your Desktop or Mobile devices.",
    href: "/apps",
  },
  {
    title: "Contact us",
    description: "Need anything? Get in touch and we can help.",
    href: "/contact",
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Twitter, label: "Twitter" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-trello-navy text-white">
      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-10">
          {/* Logo Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#0052CC">
                  <rect x="3" y="3" width="7" height="18" rx="1.5" />
                  <rect x="14" y="3" width="7" height="12" rx="1.5" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider">
                  Atlassian
                </p>
                <span className="text-xl font-bold">Trello</span>
              </div>
            </Link>
            <Link
              href="/login"
              className="text-white/80 hover:text-white text-sm inline-block mt-2"
            >
              Log In
            </Link>
          </div>

          {/* Link Columns */}
          {footerLinks.map((link) => (
            <div key={link.title}>
              <h4 className="font-bold text-white mb-2">{link.title}</h4>
              <Link
                href={link.href as any}
                className="text-sm text-white/70 hover:text-white transition-colors leading-relaxed"
              >
                {link.description}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-white/20">
          {/* Language Selector */}
          <button className="flex items-center gap-2 text-white/80 hover:text-white text-sm">
            <Globe className="w-4 h-4" />
            <span>English</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-sm text-white/70">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <span>Copyright © 2025 Atlassian</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
