/**
 * Form options and validators shared by the browser forms and the /api route handlers,
 * so both sides check exactly the same rules.
 */

export const DEVICES = [
  { key: "registers", label: "Counter registers", hint: "Tablets or PCs at the till" },
  { key: "kiosks", label: "Self-order kiosks", hint: "Guest-facing screens" },
  { key: "kitchenDisplays", label: "Kitchen displays", hint: "One per station is typical" },
  { key: "printers", label: "Receipt / ticket printers", hint: "Optional" },
  { key: "terminals", label: "Card terminals", hint: "Optional" },
];

export const PRODUCTS = [
  { value: "register", label: "Counter register" },
  { value: "kiosk", label: "Self-order kiosk" },
  { value: "kitchen", label: "Kitchen display" },
  { value: "online", label: "Online ordering" },
  { value: "promotions", label: "Promotions & loyalty" },
  { value: "back-office", label: "Back Office & reports" },
];

export const HARDWARE = [
  { value: "have", label: "Use hardware we already own" },
  { value: "recommend", label: "We need hardware recommendations" },
  { value: "mix", label: "A mix of both" },
  { value: "unsure", label: "Not sure yet" },
];

export const CURRENT_SYSTEMS = [
  { value: "square", label: "Square" },
  { value: "toast", label: "Toast" },
  { value: "clover", label: "Clover" },
  { value: "lightspeed", label: "Lightspeed" },
  { value: "other", label: "Something else" },
  { value: "none", label: "Nothing yet — new shop" },
];

export const TIMELINES = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3", label: "In 1–3 months" },
  { value: "3-6", label: "In 3–6 months" },
  { value: "exploring", label: "Just exploring" },
];

export const TOPICS = [
  { value: "general", label: "General question" },
  { value: "sales", label: "Sales & pricing" },
  { value: "pilot", label: "Pilot program" },
  { value: "support", label: "Support for an existing shop" },
  { value: "partnership", label: "Partnerships" },
  { value: "other", label: "Something else" },
];

export const MAX_LOCATIONS = 200;
export const MAX_DEVICES = 50;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;
const trim = (v) => (typeof v === "string" ? v.trim() : "");
const isInt = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
const oneOf = (list, v) => list.some((o) => o.value === v);

function check(errors, field, ok, message) {
  if (!ok && !errors[field]) errors[field] = message;
}

function checkPerson(e, input) {
  const name = trim(input.name);
  const phone = trim(input.phone);
  check(e, "name", name.length >= 2, "Please enter your name.");
  check(e, "name", name.length <= 120, "Name is too long.");
  check(e, "email", EMAIL_RE.test(trim(input.email)) && trim(input.email).length <= 254, "Please enter a valid email address.");
  check(e, "phone", !phone || PHONE_RE.test(phone), "Please enter a valid phone number.");
}

/** Devices are per location; returns the total across every location. */
export function deviceTotals(input) {
  const locations = Number(input.locations) || 0;
  const perLocation = DEVICES.reduce((sum, d) => sum + (Number(input.devices?.[d.key]) || 0), 0);
  return { perLocation, total: perLocation * locations };
}

export function validateQuote(input) {
  const e = {};
  checkPerson(e, input);
  check(e, "business", trim(input.business).length >= 2, "Please enter your business name.");
  check(e, "business", trim(input.business).length <= 160, "Business name is too long.");
  check(e, "locations", isInt(input.locations, 1, MAX_LOCATIONS), `Enter between 1 and ${MAX_LOCATIONS} locations.`);
  for (const d of DEVICES) {
    check(e, `devices.${d.key}`, isInt(input.devices?.[d.key], 0, MAX_DEVICES), `Enter 0–${MAX_DEVICES}.`);
  }
  const { registers = 0, kiosks = 0, kitchenDisplays = 0 } = input.devices ?? {};
  check(
    e,
    "devices",
    registers + kiosks + kitchenDisplays > 0,
    "Add at least one register, kiosk or kitchen display per location.",
  );
  check(e, "products", Array.isArray(input.products) && input.products.length > 0, "Choose at least one product.");
  check(e, "products", (input.products ?? []).every((p) => oneOf(PRODUCTS, p)), "Choose from the listed products.");
  check(e, "hardware", oneOf(HARDWARE, input.hardware), "Tell us about your hardware.");
  check(e, "currentSystem", oneOf(CURRENT_SYSTEMS, input.currentSystem), "Tell us what you use today.");
  check(e, "timeline", oneOf(TIMELINES, input.timeline), "Choose a timeline.");
  check(e, "message", trim(input.message).length <= 3000, "Please keep this under 3,000 characters.");
  return e;
}

export function validateContact(input) {
  const e = {};
  checkPerson(e, input);
  check(e, "business", trim(input.business).length <= 160, "Business name is too long.");
  check(e, "topic", oneOf(TOPICS, input.topic), "Choose what this is about.");
  check(e, "message", trim(input.message).length >= 10, "Tell us a little more (at least 10 characters).");
  check(e, "message", trim(input.message).length <= 5000, "Please keep your message under 5,000 characters.");
  return e;
}

export const labelOf = (list, value) => list.find((o) => o.value === value)?.label ?? value;
