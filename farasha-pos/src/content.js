// All copy and business facts live here. Sourced from farashapos.com.

export const SITE = {
  name: "Farasha",
  arabic: "فراشة",
  tagline: "Every counter, kiosk and online order, in one place.",
  contactEmail: "contactus@farashapos.com",
  quotesEmail: "quotes@farashapos.com",
  liveOrdering: "https://order.farashapos.com",
  parent: "Nebula Webtech LLC",
};

export const NAV = [
  { label: "Wings", href: "#wings" },
  { label: "Back office", href: "#back-office" },
  { label: "Loyalty", href: "#loyalty" },
  { label: "Pilot", href: "#pilot" },
  { label: "FAQ", href: "#faq" },
];

// The four wings: four ways to order, one body.
export const WINGS = [
  {
    key: "counter",
    wing: "Upper left",
    title: "Counter register",
    body: "Large tap tiles, required milk and size choices, and every way to pay at the till.",
    points: ["Cash & card", "Split payment", "Tips", "Gift cards"],
  },
  {
    key: "kiosk",
    wing: "Upper right",
    title: "Self-order kiosk",
    body: "Guests customize and pay on their own, and can join rewards right there on the spot.",
    points: ["Customize", "Pay", "Join rewards"],
  },
  {
    key: "kitchen",
    wing: "Lower left",
    title: "Kitchen display",
    body: "Tickets route to the right station, with timers and one-tap ready alerts.",
    points: ["Station routing", "Timers", "Ready alerts"],
  },
  {
    key: "online",
    wing: "Lower right",
    title: "Online ordering",
    body: "A branded site for pickup or delivery that opens on the guest’s nearest shop.",
    points: ["Pickup", "Delivery", "Nearest shop"],
  },
];

export const BACK_OFFICE = [
  { title: "Products & prices", body: "Manage the menu and prices across every location at once." },
  { title: "Sales views", body: "By channel, payment type, order type and employee." },
  { title: "Staff roles", body: "Give each person exactly the access their job needs." },
  { title: "Time clock", body: "Clock in and out, with manager corrections." },
];

export const PROMOTIONS = [
  "Percent off",
  "Dollar off",
  "Buy one, get one",
  "Combo pricing",
];

export const PROMO_LIMITS = ["Day", "Hours", "Item", "Menu section", "Location"];

export const LOYALTY = [
  "Points on every order",
  "Sign-up & birthday bonuses",
  "Double-points happy hours",
  "Gift cards",
];

export const WHY = [
  { title: "One menu, many shops.", body: "Change a price once and every counter, kiosk and online menu follows." },
  { title: "Your website, not a marketplace.", body: "Orders come through your own branded site — no middleman between you and your regulars." },
  { title: "Your data, always.", body: "You own your menu, customer, order and sales data, and can export it anytime." },
];

export const ROLES = [
  { title: "Cashier", body: "Rings up orders and takes payment." },
  { title: "Shift manager", body: "Everything a cashier does, plus refunds." },
  { title: "Manager", body: "Runs one location." },
  { title: "Admin", body: "Oversees every location." },
];

export const PILOT = [
  { weeks: "Weeks 1–2", start: 0, end: 2, title: "Set up", body: "Menu, branding, staff, payments and hardware." },
  { weeks: "Week 3", start: 2, end: 3, title: "Train", body: "Your team learns the register, kiosk and kitchen display." },
  { weeks: "Weeks 4–12", start: 3, end: 12, title: "Run live", body: "Real service, with weekly check-ins." },
  { weeks: "Week 12", start: 11.6, end: 12, title: "Decide", body: "Continue, expand, or stop. Your call." },
];

export const FAQ = [
  {
    q: "What equipment do I need?",
    a: "Farasha runs in a web browser on the tablets, laptops or PCs you already have. We test your hardware together during the pilot.",
  },
  {
    q: "How are payments handled?",
    a: "Payments go through a third-party processor. Card data is entered into the processor’s own secure fields or terminal — Farasha never stores it.",
  },
  {
    q: "How long does setup take?",
    a: "About two weeks to set up, plus one week of training, for one or two locations.",
  },
  {
    q: "Who is Farasha for?",
    a: "Coffee houses with more than one shop, and multi-location food service that wants one menu and one view of the business.",
  },
];
