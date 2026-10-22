// Copy and facts, from farashapos.com and the Farasha POS Solutions brand guidelines (2026).

export const SITE = {
  name: "Farasha POS Solutions",
  arabic: "فراشة",
  idea: "One order. Every screen.",
  positioning: "From first tap to final plate.",
  contactEmail: "contactus@farashapos.com",
  quotesEmail: "quotes@farashapos.com",
  demoOrdering: "https://order.farashapos.com",
  parent: "Nebula Webtech LLC",
  // Site-wide meta description and footer blurb — keep it at 160 characters or fewer.
  description: "Farasha POS Solutions connects your counter, self-order kiosk and kitchen display on one menu and one order stream, so every team sees the same order.",
};

export const QUOTE_HREF = "/request-quote";

export const NAV = [
  { label: "Apps", href: "/apps" },
  { label: "Features", href: "/features" },
  { label: "Pilot", href: "/pilot" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// Home page signposts to the other pages.
export const EXPLORE = [
  { href: "/apps", kicker: "Product", title: "Three apps. One service.", body: "Follow one order from counter to kiosk to kitchen." },
  { href: "/features", kicker: "Beyond the counter", title: "Everything that runs the restaurant.", body: "Online ordering, back office, promotions, loyalty and staff." },
  { href: "/pilot", kicker: "Pilot program", title: "Ninety days. Your decision.", body: "Set up in two weeks, trained in one, live in your shops." },
  { href: "/faq", kicker: "Questions", title: "Asked and answered.", body: "Equipment, offline service, payments and setup time." },
];

// Brand foundation pillars.
export const PILLARS = [
  { title: "Always ready", body: "Offline-first behaviour keeps service moving when connectivity does not." },
  { title: "Instantly connected", body: "Orders flow from kiosk or counter directly to kitchen displays." },
  { title: "Operationally clear", body: "Payments, menus, reporting and fulfilment share one calm system." },
];

// Three apps, one service — in the order the walkthrough plays them.
export const APPS = [
  { kicker: "Front of house", title: "Counter POS", body: "Take the order, attach the guest’s profile and loyalty, and accept payment." },
  { kicker: "Guest", title: "Self-order kiosk", body: "The guest’s profile, points and order sync here instantly, so every screen knows them." },
  { kicker: "Back of house", title: "Kitchen display", body: "Receive tickets by station, track timing, and mark items complete." },
];

// Sample order used in the product walkthrough.
export const ORDER = {
  no: 1042,
  guest: { name: "Sara M.", first: "Sara", points: 240 },
  items: [
    { qty: 2, name: "Burger", price: 9 },
    { qty: 1, name: "Fries", price: 4 },
    { qty: 2, name: "Cola", price: 3 },
  ],
  kitchen: [
    [2, "Burger", "Fire"],
    [1, "Fries", "Prep"],
  ],
  kiosk: [
    { name: "House burger", img: "/images/service-counter.jpg", pos: "40% 85%" },
    { name: "Crispy chicken", img: "/images/service-kiosk.jpg", pos: "70% 40%" },
    { name: "Garden bowl", img: "/images/service-kitchen.jpg", pos: "30% 50%" },
    { name: "Cold drinks" },
  ],
};

export const FEATURES = [
  {
    kicker: "Online ordering",
    title: "Your own branded site.",
    body: "Pickup or delivery, opening on the guest’s nearest shop. Orders come through your website, not a marketplace.",
  },
  {
    kicker: "Back office",
    title: "One menu, many shops.",
    body: "Manage products and prices across locations. See sales by channel, payment type, order type and employee.",
  },
  {
    kicker: "Promotions",
    title: "Offers that run themselves.",
    body: "Percent off, dollar off, buy-one-get-one and combos — limited by day, hours, item, section or location, with a QR poster for each. They end on their own.",
  },
  {
    kicker: "Loyalty",
    title: "Reasons to come back.",
    body: "Points, sign-up and birthday bonuses, double-points happy hours and gift cards. Guests can join right at the kiosk.",
  },
  {
    kicker: "Staff & time",
    title: "The right access for every role.",
    body: "Cashier, shift manager (adds refunds), manager (one location) and admin (every location), plus a time clock with manager corrections.",
  },
  {
    kicker: "Your data",
    title: "Yours to keep.",
    body: "You own your menu, customer, order and sales data, and can export it anytime.",
  },
];

// Deep-dive on each app (Apps page). `id` doubles as the in-page anchor; `channel` marks the ways customers order.
export const APP_DETAILS = [
  {
    id: "register",
    channel: true,
    kicker: "Counter register",
    title: "Built for the morning rush.",
    body: "Big tap tiles grouped the way your menu is laid out. An item can’t be rung up without its required choices, like a burger without its doneness.",
    points: ["Dine in or take out in one tap", "Cash, card, split payment, tips and gift cards", "Loyalty points at checkout", "Staff clock in and out right on the register"],
    img: "/images/service-counter.jpg",
  },
  {
    id: "kiosk",
    channel: true,
    kicker: "Self-order kiosk",
    title: "Shorter lines, bigger tickets.",
    body: "Customers browse, customise and pay on their own. The order lands on the kitchen display automatically.",
    points: ["Same menu and prices as the register", "Join rewards with a phone number or a QR code", "Promotions apply by themselves"],
    img: "/images/service-kiosk.jpg",
  },
  {
    id: "kitchen",
    kicker: "Kitchen display",
    title: "Every order, at the right station.",
    body: "Grill, fryer and bar each see only their own items, with a timer on every ticket.",
    points: ["Tickets coloured by where the order came from", "One tap to mark an order ready", "Scheduled orders appear when it’s time to start"],
    img: "/images/service-kitchen.jpg",
  },
  {
    id: "online",
    channel: true,
    kicker: "Online ordering",
    title: "Your own ordering website.",
    body: "Not a marketplace. Your name, your colours, your customers, with no one else’s logo in the way.",
    points: ["Opens on the closest location, and switches in one tap", "Pickup or delivery, now or scheduled", "Customer accounts, favourites and live order tracking"],
  },
  {
    id: "back-office",
    kicker: "Back Office",
    title: "Change it once, it’s changed everywhere.",
    body: "Add a seasonal drink or adjust a price in one place and every location has it, with local differences where you want them.",
    points: ["Sales by channel, payment type, order type and employee", "Staff roles from cashier to admin", "Time clock with manager corrections"],
  },
];

export const PROMO_POINTS = [
  "Percent off, dollars off, buy-one-get-one and combo prices",
  "Limit by day, hours, item, menu section or a single location",
  "A QR code and printable poster for every promotion",
  "Points, sign-up and birthday bonuses, double-points happy hours, gift cards",
];

export const ROLES = [
  { title: "Cashier", body: "Rings up sales and applies discounts." },
  { title: "Shift manager", body: "Everything a cashier does, plus refunds at the register." },
  { title: "Manager", body: "Runs one location." },
  { title: "Admin", body: "Oversees every location." },
];

export const WHY = [
  { title: "One menu, many shops", body: "A new dish, a price change, a sold-out item: handle it once and every location follows. Managers see only their own shop." },
  { title: "Orders from your own site", body: "Online orders come from your branded website, not a marketplace. The customer is yours, and so is the relationship." },
  { title: "Your data stays yours", body: "Menu, customers, orders and sales belong to you, and you can export them any time. Each business is kept separate from every other." },
];

// Short version for the home page.
export const PILOT = [
  { weeks: "Weeks 1–2", title: "Set up", body: "We load your menu, branding and staff, and connect payments and hardware." },
  { weeks: "Week 3", title: "Train", body: "Hands-on practice with real orders, refunds and end-of-day." },
  { weeks: "Weeks 4–12", title: "Run live", body: "Go live at your pilot location with weekly check-ins and quick fixes." },
  { weeks: "Week 12", title: "Decide", body: "Review the results against goals you set. Continue, expand or stop." },
];

// Full version for the Pilot page.
export const PILOT_DETAIL = [
  { weeks: "Weeks 1–2", title: "Set up", body: "We enter your menu and modifiers, add your branding and hours, create staff accounts and loyalty rules, and connect payments and the hardware you choose. You review everything before your team sees it." },
  { weeks: "Week 3", title: "Train and test", body: "Hands-on training with practice orders, refunds and end-of-day. A dry run with your staff before real customers." },
  { weeks: "Weeks 4–12", title: "Run live", body: "Go live at the pilot location, ideally alongside your current system for the first week. Weekly check-ins, and we fix and tune quickly." },
  { weeks: "Week 12", title: "Decide", body: "We review results against your goals. Continue, expand to more locations, or stop. Your data is exportable either way." },
];

export const PILOT_GOALS = [
  "Counter speed is as good as or better than today",
  "Staff are comfortable running a shift unaided within two weeks of go-live",
  "Kiosk and online orders reach the kitchen reliably",
  "Reports match your own sales totals",
];

export const PILOT_NEEDS = [
  "Your menu, prices and photos (an export from your current system is fine)",
  "Your logo, colours and hours",
  "A payment-processor account and the hardware you’d like to use",
  "One point of contact and time for staff training",
];

export const PILOT_FAQ = [
  { q: "What does the pilot cost?", a: "We price per location, with a one-time setup that is credited toward your first year if you continue. Request a quote and we’ll send clear numbers for your situation. There’s no long-term commitment during the pilot." },
  { q: "Do we have to stop using our current system?", a: "No. We suggest running both side by side for the first week, so your team can compare without risk." },
  { q: "What happens to our data if we stop?", a: "It’s yours. We provide an export of your menu, customers, orders and sales." },
  { q: "Is the software finished?", a: "The register, kiosk, kitchen display, online ordering and Back Office all work end to end. The pilot is where we connect your live payment processor, test your printers and card terminals on site, and tailor the system to your shop. You’ll get a plain account of what’s done and what we’re finishing together." },
];

// Businesses Farasha serves (home page and FAQ).
export const INDUSTRIES = [
  { id: "restaurants", kicker: "Food service", title: "Restaurants & cafés", body: "Counter, self-order kiosk, kitchen display and online ordering, all on one menu." },
  { id: "liquor", kicker: "Retail", title: "Liquor stores", body: "Quick counter checkout with scanners, one price list across stores, and loyalty for regulars." },
  { id: "convenience", kicker: "Retail", title: "Convenience stores", body: "Fast checkout at the till, promotions that run themselves, and sales by hour and by employee." },
  { id: "salons", kicker: "Services", title: "Beauty & hair salons", body: "Ring up services and retail products together, with tips, gift cards and loyalty for returning clients." },
];

export const FAQ = [
  { q: "Who is Farasha for?", a: "Restaurants and cafés, liquor stores, convenience stores, and beauty and hair salons — any business that takes orders or payments at a counter and wants one system across its screens and locations." },
  { q: "What equipment do I need?", a: "Farasha runs in a web browser, so tablets, laptops and PCs you already own can work. We help you pick and test receipt printers, card terminals and scanners during the pilot, so you only buy what has been proven with your setup." },
  { q: "What happens if the internet drops?", a: "Farasha is built offline-first: orders are saved on the device and sync automatically when the connection comes back." },
  { q: "How does payment processing work?", a: "Card payments go through a payment processor, and card numbers are entered into the processor’s own secure fields or terminal rather than stored by us. During setup we connect your processor account. Ask us which processors we support today." },
  { q: "Can I try it before I commit?", a: "Yes. That’s what the pilot is for: one or two locations, 90 days, with success goals agreed up front. You can also open our demo ordering site at order.farashapos.com right now." },
  { q: "Who owns my menu and customer data?", a: "You do. You can export it whenever you like, and it stays separate from every other business on the platform." },
  { q: "How long does setup take?", a: "For one or two locations, about two weeks to set up and a week of training before you go live. A large menu or many staff accounts can add time. We’ll tell you up front." },
];

// Farasha POS Solutions is owned and operated by Nebula Webtech LLC (details from nebulawebtech.com).
export const OWNER = {
  name: "Nebula Webtech LLC",
  url: "https://nebulawebtech.com",
  phone: "(224) 457-0242",
  phoneHref: "tel:+1-224-457-0242",
  address: { street: "424 N Lake Shore Dr", city: "Palatine", region: "IL", postal: "60067" },
  hours: "Monday – Friday, 9 am – 5 pm CST",
  mapsUrl:
    "https://www.google.com/maps/place/Nebula+Webtech+LLC/@42.1186991,-88.070353,17z/data=!3m1!4b1!4m6!3m5!1s0x880fa56cb32c9b3d:0xfb7ee4c62ae5e039!8m2!3d42.1186951!4d-88.0677781!16s%2Fg%2F11y5tcwcqw",
};

// Footer: four short columns of three links each. `external` opens in a new tab.
export const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      { label: "Apps", href: "/apps" },
      { label: "Features", href: "/features" },
      { label: "Pilot", href: "/pilot" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Board", href: "/board" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    title: "Quick links",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Request a quote", href: QUOTE_HREF },
      { label: "Demo ordering site ↗", href: SITE.demoOrdering, external: true },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: SITE.contactEmail, href: `mailto:${SITE.contactEmail}` },
      { label: SITE.quotesEmail, href: `mailto:${SITE.quotesEmail}` },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

// ───────── Pricing ─────────
// No list prices are published: every plan is quoted per location (see PILOT_FAQ).
export const PRICING_PLANS = [
  {
    kicker: "Start here",
    title: "90-day pilot",
    price: "Per location",
    note: "One-time setup, credited toward your first year if you continue.",
    points: ["One or two locations", "Setup, menu entry and staff training", "Weekly check-ins while you run live", "No long-term commitment"],
    cta: { label: "Plan a pilot", href: "/pilot" },
  },
  {
    kicker: "One shop",
    title: "Single location",
    price: "Per location",
    note: "Sized to the registers, kiosks and kitchen displays you run.",
    points: ["Counter register, kiosk and kitchen display", "Online ordering on your own site", "Promotions, loyalty and gift cards", "Back Office reports and data export"],
    cta: { label: "Request a quote", href: QUOTE_HREF },
    featured: true,
  },
  {
    kicker: "Growing",
    title: "Multi-location",
    price: "Custom",
    note: "Volume pricing across every shop, with a rollout plan.",
    points: ["One menu and price list for every shop", "Reports across locations", "Roles that span locations", "Staged rollout, one shop at a time"],
    cta: { label: "Talk to us", href: "/contact" },
  },
];

export const PRICING_FACTORS = [
  { title: "Locations", body: "Pricing is per location, so you only pay for the shops that run Farasha." },
  { title: "Devices", body: "How many registers, kiosks and kitchen displays each location needs." },
  { title: "Products", body: "Which parts you turn on: online ordering, promotions, loyalty, Back Office." },
  { title: "Hardware", body: "Use what you own, or let us recommend and test printers and terminals." },
];

export const PRICING_FAQ = [
  PILOT_FAQ[0],
  { q: "How are card fees handled?", a: "Card payments run through your own payment-processor account, so processing fees are set by your processor. During setup we connect it for you. Ask us which processors we support today." },
  { q: "Do I need to buy new hardware?", a: "Not necessarily. Farasha runs in a web browser on tablets, laptops and PCs you may already own. We help you test printers and card terminals before you buy anything." },
  PILOT_FAQ[2],
];

// ───────── Board ─────────
// Placeholder seats: replace `name`, `bio` and (optionally) `photo` with the real board members.
export const BOARD = [
  { role: "Chair", name: null, bio: null },
  { role: "Vice chair", name: null, bio: null },
  { role: "Treasurer", name: null, bio: null },
  { role: "Secretary", name: null, bio: null },
  { role: "Advisor · Restaurant operations", name: null, bio: null },
  { role: "Advisor · Payments & technology", name: null, bio: null },
];

// ───────── Donations ─────────
// `payUrl` is the hosted payment page for each type (Stripe, PayPal, Zeffy…), set in .env.local.
// A type without one sends the donor to the contact form to arrange it with the team.
export const DONATION_TYPES = [
  {
    value: "general",
    label: "General support",
    body: "Support Farasha’s work wherever it’s needed most.",
    payUrl: process.env.NEXT_PUBLIC_DONATE_GENERAL_URL,
  },
  {
    value: "monthly",
    label: "Monthly giving",
    body: "A recurring gift each month, which you can change or cancel any time.",
    payUrl: process.env.NEXT_PUBLIC_DONATE_MONTHLY_URL,
  },
  {
    value: "restaurant-fund",
    label: "Independent restaurant fund",
    body: "Helps an independent, family-run shop with setup and training costs.",
    payUrl: process.env.NEXT_PUBLIC_DONATE_RESTAURANT_FUND_URL,
  },
  {
    value: "tribute",
    label: "In honour or memory",
    body: "Give in someone’s name. We’ll acknowledge the gift on your behalf.",
    payUrl: process.env.NEXT_PUBLIC_DONATE_TRIBUTE_URL,
  },
  {
    value: "hardware",
    label: "Hardware (in-kind)",
    body: "Donate tablets, printers or card terminals. We’ll arrange pickup or shipping with you.",
    payUrl: null,
  },
];
