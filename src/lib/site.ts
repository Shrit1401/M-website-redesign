// Business details and shared copy, taken from nebulawebtech.com.

export const SITE = {
  name: "Nebula Webtech LLC",
  shortName: "Nebula Webtech",
  url: "https://nebulawebtech.com",
  tagline: "Empowering Your Digital Presence",
  phone: "(224) 457-0242",
  phoneHref: "tel:+1-224-457-0242",
  email: "info@nebulawebtech.com",
  address: {
    street: "424 N Lake Shore Dr",
    city: "Palatine",
    region: "IL",
    postal: "60067",
    country: "US",
  },
  hours: "Monday – Friday, 9 am – 5 pm CST",
  mapsUrl:
    "https://www.google.com/maps/place/Nebula+Webtech+LLC/@42.1186991,-88.070353,17z/data=!3m1!4b1!4m6!3m5!1s0x880fa56cb32c9b3d:0xfb7ee4c62ae5e039!8m2!3d42.1186951!4d-88.0677781!16s%2Fg%2F11y5tcwcqw",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/NebulaWebtech.LLC" },
    { label: "Instagram", href: "https://www.instagram.com/nebulawebtechllc/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/nebula-webtech-llc/" },
  ],
} as const;

/** Primary navigation (header and mobile menu). The logo links home, so Home isn't listed. */
export const NAV = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact-us" },
] as const;

export const ABOUT = {
  statement:
    "A website development and digital marketing agency that crafts online success — blending code with creativity, strategy with clicks, illuminating brands in the digital cosmos.",
  intro: [
    "Welcome to Nebula Webtech LLC, where we craft captivating online experiences. Our team specializes in website design, development, maintenance and digital marketing. From stunning visuals to seamless e-commerce functionality, we make sure your website leaves an unforgettable first impression.",
    "But we don't stop at building websites. We offer digital marketing tailored to your brand — SEO, PPC advertising, social media management and content marketing — dedicated to growing your online presence and driving measurable results.",
  ],
  long: [
    "Nebula Webtech LLC is a full-service digital agency specializing in website design, development, maintenance, digital marketing, web applications and mobile applications. We help businesses establish a strong online presence through technology-driven solutions.",
    "A website is more than a platform. It's your brand's identity, your virtual storefront and how customers connect with you. That's why we build sites that are dynamic, user-friendly and visually compelling — sites that drive engagement and results, backed by digital marketing that brings the right people to them.",
    "Nebula Webtech was founded by seasoned professionals with deep experience in web technology and digital strategy, on a foundation of creativity, technical expertise and a commitment to excellence. Our mission is to stay ahead of digital trends and put new ideas to work for our clients.",
    "Beyond the website itself, we believe in complete digital strategy: intuitive interfaces, robust marketing campaigns, and continuous optimization for performance, engagement and conversions.",
  ],
};

export const STATS = [
  { value: 100, suffix: "%", label: "Customer satisfaction" },
  { value: 250, suffix: "+", label: "Organic search traffic" },
];

export const STRENGTHS = [
  { label: "Execution", value: 99 },
  { label: "Marketing", value: 95 },
  { label: "Communication", value: 90 },
  { label: "Design", value: 78 },
];

export const PROCESS = [
  {
    title: "Discover",
    body: "We learn your business, your audience and what success looks like, so every decision after this has a reason behind it.",
  },
  {
    title: "Plan & design",
    body: "Sitemap, wireframes and a visual design built around your brand — reviewed with you before a line of code is written.",
  },
  {
    title: "Build",
    body: "Fast, responsive front-end, a robust back-end, and the CMS or e-commerce setup your team will actually use.",
  },
  {
    title: "Launch",
    body: "Testing across devices and browsers, speed and SEO checks, analytics in place — then we go live together.",
  },
  {
    title: "Grow & maintain",
    body: "Updates, security and backups, plus SEO and marketing campaigns that keep new customers finding you.",
  },
];

export const WHY = [
  {
    icon: "spark",
    title: "Expertise & insight",
    body: "A team that keeps up with current industry practice, so your site is built the way the web works today.",
  },
  {
    icon: "users",
    title: "Customer-centric approach",
    body: "Personalized solutions shaped around your goals, your audience and your budget — not a template.",
  },
  {
    icon: "rocket",
    title: "Innovative solutions",
    body: "Emerging technologies and fresh ideas, used where they genuinely move your business forward.",
  },
  {
    icon: "lifebuoy",
    title: "Ongoing support",
    body: "Maintenance and support after launch, so your site stays fast, secure and up to date.",
  },
] as const;

export const CAPABILITIES = [
  "Web design",
  "Web development",
  "E-commerce",
  "WordPress",
  "UI/UX",
  "Web maintenance",
  "Security & backups",
  "SEO",
  "SEM / PPC",
  "Social media",
  "Content marketing",
  "Analytics",
];
