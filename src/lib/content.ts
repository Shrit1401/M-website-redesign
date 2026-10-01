export const SITE = {
  url: "https://macrosoftwaresolution.com",
  name: "Macro Software Solution LLC",
  email: "hello@macrosoftwaresolution.com",
  phone: "+1 (224) 298-4659",
  phoneHref: "tel:+12242984659",
  hours: "Mon–Fri, 9AM–5PM CST",
  address: { street: "424 N Lake Shore Dr", city: "Palatine", region: "IL", postal: "60067", country: "US" },
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Start a project", href: "/contact" },
      { label: "General inquiry", href: "/contact?tab=inquiry" },
    ],
  },
];

export const PILLARS = [
  { icon: "cube", label: "Scalable architecture" },
  { icon: "shield", label: "Security by design" },
  { icon: "nodes", label: "Connected systems" },
  { icon: "database", label: "Ongoing support" },
] as const;

// Copy from the live About page.
export const ABOUT = {
  intro:
    "Macro Software Solution LLC is a technology services company focused on helping businesses build, scale, and manage digital solutions with confidence. We specialize in SaaS development, cloud solutions, custom software, mobile applications, and IT services that support long-term growth and operational efficiency.",
  story: [
    "Founded with the vision of simplifying technology for businesses, Macro Software Solution LLC started as a small IT consultancy.",
    "Over time, it has grown into a trusted provider of advanced SaaS tools and tailored IT solutions, supporting clients across various industries.",
  ],
  mission:
    "Our mission is to help businesses simplify complex technology and turn it into a driver for growth. We focus on building reliable software, cloud solutions, and digital systems that improve efficiency and support long-term scalability.",
  quote:
    "Innovation isn’t just about technology—it’s about creating smarter, seamless solutions that empower businesses to thrive in a digital world.",
  values: [
    { title: "Scalable", body: "Our solutions grow with your business and adapt to changing requirements without disruption." },
    { title: "Secure", body: "We apply enterprise-grade security practices to protect data, systems, and users at every level." },
    { title: "User-friendly", body: "We design intuitive interfaces and smooth integrations that improve adoption and usability." },
    { title: "Efficient", body: "Our solutions optimize workflows and reduce complexity to improve overall productivity." },
  ],
  impact: [
    { title: "Businesses transformed", body: "Supporting companies worldwide with scalable software and IT solutions designed for real-world use." },
    { title: "Reliable uptime", body: "Delivering reliable and uninterrupted systems that businesses can depend on for critical operations." },
    { title: "Users supported", body: "Enhancing productivity and workflows for users across platforms." },
    { title: "Successful integrations", body: "Connecting systems seamlessly through secure and scalable technology implementations." },
  ],
};

// Copy from the live Careers page.
export const CAREERS = {
  intro: "Build your career with Macro Software Solution LLC and shape the next generation of IT solutions.",
  perks: [
    { icon: "sparkles", title: "Work-life balance", body: "We support flexible schedules and remote options." },
    { icon: "layers", title: "Continuous learning", body: "Access to certifications and mentorship programs." },
    { icon: "globe", title: "Flexible work", body: "Collaborate on projects pushing SaaS boundaries." },
    { icon: "nodes", title: "Team culture", body: "Regular team-building activities and hackathons." },
  ],
} as const;

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

export type Faq = { q: string; a: string; category: FaqCategory };
export type FaqCategory = "Getting started" | "Services" | "AI & AEO" | "Security & support";
export const FAQ_CATEGORIES: FaqCategory[] = ["Getting started", "Services", "AI & AEO", "Security & support"];

// Live-site FAQs merged with answers for the custom-quote model and AEO. Rendered with FAQPage schema.
export const FAQS: Faq[] = [
  {
    category: "Getting started",
    q: "How much does a project with Macro Software Solution cost?",
    a: "Every engagement is custom-quoted. We scope your requirements first, then send a clear proposal with timeline and cost. Standard package pricing will be revealed shortly — until then, submit the requirement form and we’ll respond with a custom quote.",
  },
  {
    category: "Getting started",
    q: "Do you offer custom solutions or fixed packages?",
    a: "Custom solutions. Every project is scoped around your business goals and technical requirements, and quoted individually. Packaged plans will be announced soon.",
  },
  {
    category: "Getting started",
    q: "How do I get started?",
    a: "Fill in the requirement form on our contact page. We review it, schedule a short discovery call, and send a custom quote — usually within one to two business days.",
  },
  {
    category: "Getting started",
    q: "Can we do the marketing ourselves?",
    a: "Absolutely. With the Career Platform engagement we set up the platform and guide your team through 1:1 sessions, while you run marketing in-house. If you’d prefer, we can also handle digital marketing for you.",
  },
  {
    category: "Services",
    q: "What industries do you work with?",
    a: "We work with businesses across technology, healthcare, finance, education, retail, and professional services. Our solutions are tailored to meet industry-specific requirements and compliance needs.",
  },
  {
    category: "Services",
    q: "Can you work with existing systems and tools?",
    a: "Yes. We specialize in integrating new solutions with existing infrastructure, applications, and third-party platforms to ensure smooth operations and minimal disruption.",
  },
  {
    category: "Services",
    q: "Can you modify or upgrade our existing website or software?",
    a: "Yes. We take on modifications, feature additions, redesigns, performance fixes and integrations for systems that are already live — including ones built by other teams.",
  },
  {
    category: "Services",
    q: "Do you build both web and mobile apps?",
    a: "Yes. We build fast, SEO-ready websites and web apps, and native-quality iOS and Android apps with secure backends and API integrations.",
  },
  {
    category: "AI & AEO",
    q: "What is answer engine optimization (AEO)?",
    a: "AEO is the practice of structuring your website so AI answer engines — ChatGPT, Gemini, Perplexity and Google AI Overviews — can understand and cite your business. We add structured data, answer-ready service pages and FAQ schema so you show up when customers ask AI for recommendations.",
  },
  {
    category: "AI & AEO",
    q: "How is AEO different from SEO?",
    a: "SEO helps you rank in a list of links; AEO helps you become the answer an AI assistant gives. They overlap — both need fast, well-structured pages — but AEO focuses on clear, quotable answers, consistent business information and machine-readable schema.",
  },
  {
    category: "AI & AEO",
    q: "Can you add AI to our existing workflows?",
    a: "Yes. We build AI assistants on your own documentation, automate inquiry intake and triage, and connect AI steps into the tools you already use — scoped around measurable time savings and your data-security requirements.",
  },
  {
    category: "Security & support",
    q: "How do you ensure security and data protection?",
    a: "Security is integrated into every stage of our work. We follow enterprise security practices including access control, encryption, regular updates, and continuous monitoring.",
  },
  {
    category: "Security & support",
    q: "What support do you provide after project delivery?",
    a: "We offer ongoing support, maintenance, and optimization services to ensure long-term performance, scalability, and reliability as business needs evolve.",
  },
];
