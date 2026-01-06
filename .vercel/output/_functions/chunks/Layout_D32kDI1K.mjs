import { e as createAstro, f as createComponent, m as maybeRenderHead, l as renderScript, h as addAttribute, r as renderTemplate, k as renderComponent, am as renderSlot, o as renderHead, u as unescapeHTML } from './astro/server_DgYwtGrl.mjs';
/* empty css                         */

const $$Astro$1 = createAstro("https://logoprompt.pro");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const user = Astro2.locals?.user;
  const navLinks = [
    { href: "/", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="site-header" data-astro-cid-3ef6ksr2> <nav class="nav-container" data-astro-cid-3ef6ksr2> <a href="/" class="nav-logo" data-astro-cid-3ef6ksr2> <img src="/logo.png" alt="LogoPrompt.pro" class="logo-image" data-astro-cid-3ef6ksr2> <span class="logo-text" data-astro-cid-3ef6ksr2>Logo<span class="logo-accent" data-astro-cid-3ef6ksr2>Prompt</span></span> <span class="logo-badge" data-astro-cid-3ef6ksr2>.pro</span> </a> <div class="nav-links" data-astro-cid-3ef6ksr2> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="nav-link" data-astro-cid-3ef6ksr2>${link.label}</a>`)} </div> <div class="auth-section" data-astro-cid-3ef6ksr2> ${user ? renderTemplate`<a href="/profile" class="user-btn" data-astro-cid-3ef6ksr2> ${user.image ? renderTemplate`<img${addAttribute(user.image, "src")} alt="" class="user-avatar" data-astro-cid-3ef6ksr2>` : renderTemplate`<span class="user-avatar-placeholder" data-astro-cid-3ef6ksr2>${user.name?.charAt(0).toUpperCase() || "U"}</span>`} <span class="user-name" data-astro-cid-3ef6ksr2>${user.name?.split(" ")[0] || "Profile"}</span> </a>` : renderTemplate`<a href="/login" class="signin-btn" data-astro-cid-3ef6ksr2>Sign In</a>`} </div> <button class="mobile-menu-btn" type="button" aria-label="Toggle menu" data-astro-cid-3ef6ksr2> <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3ef6ksr2> <line x1="3" y1="6" x2="21" y2="6" data-astro-cid-3ef6ksr2></line> <line x1="3" y1="12" x2="21" y2="12" data-astro-cid-3ef6ksr2></line> <line x1="3" y1="18" x2="21" y2="18" data-astro-cid-3ef6ksr2></line> </svg> <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3ef6ksr2> <line x1="18" y1="6" x2="6" y2="18" data-astro-cid-3ef6ksr2></line> <line x1="6" y1="6" x2="18" y2="18" data-astro-cid-3ef6ksr2></line> </svg> </button> </nav> <div class="mobile-menu" data-astro-cid-3ef6ksr2> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="mobile-link" data-astro-cid-3ef6ksr2>${link.label}</a>`)} <div class="mobile-auth" data-astro-cid-3ef6ksr2> ${user ? renderTemplate`<a href="/profile" class="mobile-link user-mobile" data-astro-cid-3ef6ksr2> ${user.image ? renderTemplate`<img${addAttribute(user.image, "src")} alt="" class="mobile-avatar" data-astro-cid-3ef6ksr2>` : renderTemplate`<span class="mobile-avatar-placeholder" data-astro-cid-3ef6ksr2>${user.name?.charAt(0).toUpperCase() || "U"}</span>`} <span data-astro-cid-3ef6ksr2>Profile</span> </a>` : renderTemplate`<a href="/login" class="mobile-link signin-mobile" data-astro-cid-3ef6ksr2>Sign In</a>`} </div> </div> </header>  ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const footerLinks = [
    { label: "About Us", href: "/about" },
    { label: "Partner Program", href: "/partners" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" }
  ];
  const socialLinks = [
    {
      label: "Twitter/X",
      href: "https://x.com",
      icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    },
    {
      label: "GitHub",
      href: "https://github.com",
      icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="site-footer" data-astro-cid-sz7xmlte> <div class="footer-glow" data-astro-cid-sz7xmlte></div> <div class="footer-content" data-astro-cid-sz7xmlte> <div class="footer-main" data-astro-cid-sz7xmlte> <div class="footer-brand" data-astro-cid-sz7xmlte> <a href="/" class="footer-logo" data-astro-cid-sz7xmlte> <span class="logo-text" data-astro-cid-sz7xmlte>Logo<span class="logo-accent" data-astro-cid-sz7xmlte>Prompt</span></span> <span class="logo-badge" data-astro-cid-sz7xmlte>.pro</span> </a> <p class="footer-tagline" data-astro-cid-sz7xmlte>
Discover AI-generated logo concepts and prompts.<br data-astro-cid-sz7xmlte>
One prompt, many creative possibilities.
</p> <div class="footer-social" data-astro-cid-sz7xmlte> ${socialLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} target="_blank" rel="noopener noreferrer" class="social-link"${addAttribute(link.label, "aria-label")} data-astro-cid-sz7xmlte> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-sz7xmlte> <path${addAttribute(link.icon, "d")} data-astro-cid-sz7xmlte></path> </svg> </a>`)} </div> </div> <nav class="footer-nav" data-astro-cid-sz7xmlte> <h4 class="nav-title" data-astro-cid-sz7xmlte>Quick Links</h4> <ul class="nav-list" data-astro-cid-sz7xmlte> ${footerLinks.map((link) => renderTemplate`<li data-astro-cid-sz7xmlte> <a${addAttribute(link.href, "href")} class="nav-link" data-astro-cid-sz7xmlte> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-sz7xmlte> <polyline points="9 18 15 12 9 6" data-astro-cid-sz7xmlte></polyline> </svg> ${link.label} </a> </li>`)} </ul> </nav> <div class="footer-cta" data-astro-cid-sz7xmlte> <h4 class="cta-title" data-astro-cid-sz7xmlte>Ready to create?</h4> <p class="cta-text" data-astro-cid-sz7xmlte>Browse our collection and start generating unique logos today.</p> <a href="/" class="cta-btn" data-astro-cid-sz7xmlte> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-sz7xmlte> <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" data-astro-cid-sz7xmlte></polygon> </svg>
Explore Gallery
</a> </div> </div> <div class="footer-bottom" data-astro-cid-sz7xmlte> <p class="footer-copyright" data-astro-cid-sz7xmlte>
&copy; ${currentYear} LogoPrompt.pro. All rights reserved.
</p> <p class="footer-made" data-astro-cid-sz7xmlte>
Made with
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="rgb(239, 68, 68)" stroke="none" data-astro-cid-sz7xmlte> <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-astro-cid-sz7xmlte></path> </svg>
for designers everywhere
</p> </div> </div> </footer> `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://logoprompt.pro");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Discover AI-generated logo concepts and prompts. Copy prompts to use with Ideogram, Google Gemini, and other AI image generators. One prompt, many creative possibilities.",
    image = "https://logoprompt.pro/og-image.png"
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, "https://logoprompt.pro");
  const siteName = "LogoPrompt.pro";
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><!-- Google Fonts - Inter --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><!-- Primary Meta Tags --><title>', '</title><meta name="title"', '><meta name="description"', '><meta name="keywords" content="AI logo generator, logo prompts, AI image prompts, Ideogram prompts, Gemini prompts, logo design, AI art, logo concepts, creative prompts, brand design, logo inspiration"><meta name="author" content="LogoPrompt.pro"><meta name="robots" content="index, follow"><link rel="canonical"', '><!-- Favicon --><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><!-- PWA Manifest --><link rel="manifest" href="/manifest.webmanifest"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name"', '><meta property="og:locale" content="en_US"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Additional SEO --><meta name="theme-color" content="#13151a"><meta name="generator"', '><!-- iOS PWA Support --><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="LogoPrompt"><link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png"><link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png"><!-- Structured Data --><script type="application/ld+json">', '<\/script><script type="application/ld+json">', '<\/script><script type="application/ld+json">', '<\/script><!-- Google AdSense --><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2092470205166235" crossorigin="anonymous"><\/script>', "</head> <body> ", " ", " ", " <!-- PWA Service Worker Registration --> <script>\n      if ('serviceWorker' in navigator) {\n        window.addEventListener('load', () => {\n          navigator.serviceWorker.register('/pwa-sw.js', { scope: '/' })\n            .then(reg => console.log('PWA SW registered:', reg.scope))\n            .catch(err => console.error('PWA SW registration failed:', err));\n        });\n      }\n    <\/script> </body> </html> "])), title, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute(siteName, "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute(Astro2.generator, "content"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": "https://logoprompt.pro",
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://logoprompt.pro/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  })), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": "https://logoprompt.pro",
    "logo": "https://logoprompt.pro/favicon.svg",
    "sameAs": []
  })), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AI Logo Prompts Gallery",
    "description": "Browse and discover AI-generated logo concepts. Copy prompts to create your own unique logos with AI image generators.",
    "url": "https://logoprompt.pro",
    "isPartOf": {
      "@type": "WebSite",
      "name": siteName,
      "url": "https://logoprompt.pro"
    }
  })), renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
