export const hero = {
  headline: "This is what digital looks like.",
  subline:
    "A full-service digital studio building the work people actually remember.",
  meta: "07 services · 01 standard",
  intro:
    "We build websites, applications, and intelligent systems for brands that refuse to blend in.",
};

export const stats = [
  { value: 40, suffix: "+", label: "Projects delivered" },
  { value: 97, suffix: "%", label: "Client satisfaction" },
  { value: 24, suffix: "/7", label: "Support" },
  { value: 7, suffix: "", label: "Disciplines" },
];

export const services = [
  {
    number: "01",
    title: "Website Design & Development",
    short: "Websites",
    description:
      "High-craft marketing sites engineered for speed, motion, and conversion — designed to the pixel, shipped to last.",
    tags: ["Design", "Front-end", "CMS"],
  },
  {
    number: "02",
    title: "Web & Mobile Applications",
    short: "Software",
    description:
      "Product-grade web and mobile apps with robust architecture, clean interfaces, and scalable foundations.",
    tags: ["Product", "React", "API"],
  },
  {
    number: "03",
    title: "Social Media Management",
    short: "Social Media",
    description:
      "Always-on content, art direction, and growth strategy that keeps your brand sharp across every feed.",
    tags: ["Content", "Strategy", "Growth"],
  },
  {
    number: "04",
    title: "eCommerce Experiences",
    short: "eCommerce",
    description:
      "Storefronts that sell — fast, frictionless checkout flows built on platforms that scale with your catalogue.",
    tags: ["Shopify", "Checkout", "CRO"],
  },
  {
    number: "05",
    title: "AI Agents & Automation",
    short: "Automation",
    description:
      "Intelligent agents and workflow automation that remove busywork and put your operations on autopilot.",
    tags: ["LLM", "Workflows", "Ops"],
  },
  {
    number: "06",
    title: "CRM & Business Systems",
    short: "Systems",
    description:
      "Custom CRM and internal systems that connect your tools, data, and teams into one source of truth.",
    tags: ["CRM", "Integrations", "Data"],
  },
  {
    number: "07",
    title: "Brand Design & Identity",
    short: "Branding",
    description:
      "Distinctive identity systems — logo, type, motion, and guidelines — that make brands impossible to ignore.",
    tags: ["Identity", "Systems", "Guidelines"],
  },
];

export const serviceLabels = services.map((service) => service.short);

export const approach = [
  {
    number: "01",
    title: "Strategy first",
    description:
      "Every engagement starts with the business goal, not the design tool. We map the problem before we touch a pixel.",
  },
  {
    number: "02",
    title: "Designed to the pixel",
    description:
      "Obsessive craft in type, spacing, and motion. The details are the difference between forgettable and unforgettable.",
  },
  {
    number: "03",
    title: "Engineered to scale",
    description:
      "Clean, maintainable code and architecture that holds up as your traffic, team, and ambitions grow.",
  },
  {
    number: "04",
    title: "AI-ready by default",
    description:
      "We build with intelligence baked in: automation, agents, and data flows that keep you ahead of the curve.",
  },
  {
    number: "05",
    title: "A partnership after launch",
    description:
      "Launch is the start, not the finish. We stay on as a long-term partner to iterate, measure, and grow.",
  },
];

export const work = [
  {
    name: "Studio Melisa",
    description:
      "Nail salon booking platform with multi-worker scheduling.",
    tags: ["Booking System", "Web App", "Supabase"],
    link: "https://studiomelisa.com",
    image: "/work/studio-melisa-v3.jpg",
  },
  {
    name: "InnTrack",
    description:
      "Motel reservation SaaS with real-time availability and housekeeping.",
    tags: ["SaaS", "PWA", "Next.js"],
    link: "https://inntrackpage.vercel.app",
    image: "/work/inntrack-v3.jpg",
  },
  {
    name: "Popoff",
    description: "Online Shop.",
    tags: ["E-Commerce", "Web Store", "Web App"],
    link: "https://popoff.mk",
    image: "/work/popoff-v3.jpg",
  },
  {
    name: "Motion",
    description:
      "Fitness brand site with immersive WebGL visuals and a bold landing experience.",
    tags: ["Fitness", "WebGL", "Landing Page"],
    link: "https://motionfitness.vercel.app",
    image: "/work/motion-v3.jpg",
  },
];

export const contact = {
  heading: "Let's build something worth showing.",
  successMessage: "Message received. We'll be in touch within 24 hours.",
};

export const footer = {
  logo: "High Level",
  blurb:
    "A full-service digital studio in Skopje, North Macedonia. We build the work people actually remember.",
  links: [
    { label: "Work", href: "#work" },
    { label: "Approach", href: "#approach" },
    { label: "Start a project", href: "#contact" },
    { label: "Instagram", href: "https://instagram.com/highlevel.mk" },
  ],
  contactLines: [
    "mkhighlevel@gmail.com",
    "@highlevel.mk",
    "Skopje, North Macedonia",
  ],
  copyright: "© 2026 High Level",
  legalLinks: [
    { label: "Privacy", key: "privacy" },
    { label: "Terms", key: "terms" },
    { label: "Cookies", key: "cookies" },
  ] as const,
};

export const legalPolicies = {
  privacy: {
    title: "Privacy Policy",
    paragraphs: [
      "We respect your privacy. This site collects only the information you choose to share with us.",
      "When you submit the contact form, we receive your email address so we can respond to your inquiry. We do not sell or share your data with third parties.",
      "We may use privacy-respecting analytics to understand how the site is used. No personally identifying information is stored.",
      "You can request access to, correction of, or deletion of your data at any time by emailing mkhighlevel@gmail.com.",
    ],
  },
  terms: {
    title: "Terms of Service",
    paragraphs: [
      "By using this website, you agree to the following terms.",
      "All content, design, and code on this site are the property of High Level unless otherwise stated. You may not reproduce it without written permission.",
      "Project work is governed by a separate signed agreement. Nothing on this site constitutes a binding offer of services.",
      "This site is provided \"as is\". We are not liable for any damages arising from its use.",
    ],
  },
  cookies: {
    title: "Cookie Policy",
    paragraphs: [
      "We use a minimal set of cookies to keep the site functional and to understand aggregate usage.",
      "Required for the site to operate correctly. These cannot be switched off.",
      "Help us measure performance anonymously. You can block these in your browser settings at any time.",
    ],
  },
} as const;
