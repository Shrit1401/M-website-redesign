// Copy and facts, from farashapos.com and the Farasha POS Solutions brand guidelines (2026).

export const SITE = {
  name: "Farasha POS Solutions",
  arabic: "فراشة",
  idea: "One order. Every screen.",
  positioning: "From first tap to final plate.",
  contactEmail: "contactus@farashapos.com",
  quotesEmail: "quotes@farashapos.com",
  liveOrdering: "https://order.farashapos.com",
  parent: "Nebula Webtech LLC",
};

export const NAV = [
  { label: "Apps", href: "#apps" },
  { label: "Features", href: "#features" },
  { label: "Pilot", href: "#pilot" },
  { label: "FAQ", href: "#faq" },
];

// Brand foundation pillars.
export const PILLARS = [
  { title: "Always ready", body: "Offline-first behaviour keeps service moving when connectivity does not." },
  { title: "Instantly connected", body: "Orders flow from kiosk or counter directly to kitchen displays." },
  { title: "Operationally clear", body: "Payments, menus, reporting and fulfilment share one calm system." },
];

// Three apps, one service.
export const APPS = [
  { kicker: "Guest", title: "Self-order kiosk", body: "Browse, customise, pay, and join loyalty without waiting." },
  { kicker: "Front of house", title: "Counter POS", body: "Take orders, manage tables, accept payment, and keep service moving." },
  { kicker: "Back of house", title: "Kitchen display", body: "Receive tickets by station, track timing, and mark items complete." },
];

// Sample order used in the product walkthrough.
export const ORDER = {
  no: 1042,
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

export const PILOT = [
  { weeks: "Weeks 1–2", title: "Set up", body: "Menu, branding, staff, payments and hardware." },
  { weeks: "Week 3", title: "Train", body: "Your team learns the kiosk, counter and kitchen display." },
  { weeks: "Weeks 4–12", title: "Run live", body: "Real service in one or two locations, with weekly check-ins." },
  { weeks: "Week 12", title: "Decide", body: "Continue, expand, or stop. Your call." },
];

export const FAQ = [
  {
    q: "What equipment do I need?",
    a: "Farasha runs in a web browser on the tablets, laptops or PCs you already have. We test your hardware together during the pilot.",
  },
  {
    q: "What happens if the internet drops?",
    a: "Farasha is built offline-first: orders are saved on the device and sync automatically when the connection comes back.",
  },
  {
    q: "How are payments handled?",
    a: "Payments go through a third-party processor. Card data is entered into the processor’s own secure fields or terminal — Farasha never stores it.",
  },
  {
    q: "How long does setup take?",
    a: "About two weeks to set up, plus one week of training, for one or two locations.",
  },
];
