export const SITE = {
  url: "https://macrosoftwaresolution.com",
  name: "Macro Software Solution LLC",
  email: "hello@macrosoftwaresolution.com",
};

export const NAV = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Engagements", href: "#engagements" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#start" },
];

export const PILLARS = [
  { icon: "cube", label: "Scalable architecture" },
  { icon: "shield", label: "Security by design" },
  { icon: "nodes", label: "Connected systems" },
  { icon: "database", label: "Ongoing support" },
] as const;

export const SERVICES = [
  { icon: "cloud", title: "SaaS development", body: "Platforms built to evolve." },
  { icon: "layers", title: "Cloud & integration", body: "Connect tools and infrastructure." },
  { icon: "code", title: "Custom software", body: "Built around your workflows." },
  { icon: "server", title: "IT infrastructure", body: "Keep your operations resilient." },
  { icon: "globe", title: "Web development", body: "Fast, responsive digital experiences." },
  { icon: "gear", title: "Website maintenance", body: "Keep your website running smoothly." },
  { icon: "chart", title: "Digital marketing", body: "Reach the right audience." },
  { icon: "phone", title: "Mobile development", body: "Connected experiences on the go." },
] as const;

export const AI_SERVICE = {
  title: "AI optimization & Answer Engine Optimization",
  body: "Get found — and cited — by ChatGPT, Gemini, Perplexity and Google AI Overviews. We structure your content, schema and FAQs so answer engines understand your services, and we add AI automation where it saves your team real time.",
  points: ["Structured data & FAQ schema", "Answer-ready service content", "AI assistants & workflow automation", "AI visibility monitoring"],
};

export const PROCESS = [
  { title: "Discover & scope", body: "We learn about your goals and define the right approach." },
  { title: "Set up & integrate", body: "We build and connect the tools and infrastructure you need." },
  { title: "Automate & optimize", body: "We streamline your operations for greater efficiency." },
  { title: "Scale with confidence", body: "We support your growth with ongoing partnership." },
];

export type EngagementId = "career" | "hire" | "modify" | "unsure";

export const ENGAGEMENTS: {
  id: Exclude<EngagementId, "unsure">;
  name: string;
  tagline: string;
  points: string[];
  cta: string;
  featured?: boolean;
}[] = [
  {
    id: "career",
    name: "Career Platform",
    tagline: "A launch-ready platform with 1:1 guidance. You run the marketing.",
    points: [
      "Branded career / hiring platform",
      "1:1 onboarding & setup sessions",
      "You handle marketing in-house",
      "Hosting, security & updates",
    ],
    cta: "Discuss Career Platform",
  },
  {
    id: "hire",
    name: "Hire Macro",
    tagline: "Our team designs, develops and launches it for you.",
    points: [
      "End-to-end development",
      "Dedicated project lead",
      "Web, mobile, SaaS & integrations",
      "Optional marketing & AI optimization",
      "Post-launch support",
    ],
    cta: "Hire Macro",
    featured: true,
  },
  {
    id: "modify",
    name: "Modifications & Upgrades",
    tagline: "Changes to software or websites you already have.",
    points: [
      "Feature additions & fixes",
      "Redesigns & performance work",
      "Integrations with existing systems",
      "Maintenance on your schedule",
    ],
    cta: "Request changes",
  },
];

export const ENGAGEMENT_LABELS: Record<EngagementId, string> = {
  career: "Career Platform (1:1, we market ourselves)",
  hire: "Hire Macro for development",
  modify: "Modifications / upgrades to an existing system",
  unsure: "Not sure yet — help me decide",
};

export const REQUIREMENT_SERVICES = [
  "SaaS development",
  "Custom software",
  "Web development",
  "Mobile development",
  "Cloud & integration",
  "IT infrastructure",
  "Website maintenance",
  "Digital marketing",
  "AI optimization / AEO",
  "Career platform",
];

export const FAQS = [
  {
    q: "How much does a project with Macro Software Solution cost?",
    a: "Every engagement is custom-quoted. We scope your requirements first, then send a clear proposal with timeline and cost. Standard package pricing will be revealed shortly — until then, submit the requirement form and we'll respond with a custom quote.",
  },
  {
    q: "Do you offer custom solutions?",
    a: "Yes. Most of our work is custom software, SaaS platforms, websites and mobile apps built around your workflows. Tell us what you need through the requirement form and we'll scope it together.",
  },
  {
    q: "Can we do the marketing ourselves?",
    a: "Absolutely. With the Career Platform engagement we set up the platform and guide your team through 1:1 sessions, while you run marketing in-house. If you'd prefer, we can also handle digital marketing for you.",
  },
  {
    q: "What is answer engine optimization (AEO)?",
    a: "AEO is the practice of structuring your website so AI answer engines — ChatGPT, Gemini, Perplexity and Google AI Overviews — can understand and cite your business. We add structured data, answer-ready service pages and FAQ schema so you show up when customers ask AI for recommendations.",
  },
  {
    q: "Can you modify or upgrade our existing website or software?",
    a: "Yes. We take on modifications, feature additions, redesigns, performance fixes and integrations for systems that are already live — including ones built by other teams.",
  },
  {
    q: "Can you work with our existing systems?",
    a: "Yes. We integrate new solutions with your current applications and infrastructure instead of forcing a rebuild.",
  },
  {
    q: "What happens after launch?",
    a: "We stay on as a partner: monitoring, maintenance, security updates and continuous improvements, so your product keeps pace with your growth.",
  },
  {
    q: "Which industries do you work with?",
    a: "We work with startups, small businesses and enterprises across professional services, recruitment and careers, retail, healthcare, finance and technology.",
  },
  {
    q: "How do I get started?",
    a: "Fill in the requirement form on this page. We review it, schedule a short discovery call, and send a custom quote — usually within one to two business days.",
  },
];
