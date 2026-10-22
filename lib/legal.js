// Legal pages. A plain-language starting point: have counsel review before relying on it.
import { OWNER, SITE } from "./content";

const ADDRESS = `${OWNER.address.street}, ${OWNER.address.city}, ${OWNER.address.region} ${OWNER.address.postal}`;
const CONTACT = `${SITE.contactEmail}, ${OWNER.phone}, or by mail at ${OWNER.name}, ${ADDRESS}`;

export const LEGAL_UPDATED = "October 22, 2026";

export const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refunds", href: "/refunds" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

export const PRIVACY = [
  {
    h: "Who we are",
    p: [
      `Farasha POS Solutions (“Farasha”, “we”, “us”) is owned and operated by ${OWNER.name}, ${ADDRESS}. This policy explains what we collect through farashapos.com and how we use it.`,
    ],
  },
  {
    h: "What we collect",
    p: [
      "Information you give us: when you request a quote, contact us or arrange a donation, we collect what you enter — such as your name, email, phone number, business name, locations, devices and message.",
      "Payment details: donations and payments are completed on a third-party payment provider’s page. Card numbers are entered there and are never sent to or stored by this website.",
      "Technical information: like most websites, our hosting servers log basic request data such as IP address, browser type and pages visited, which we use for security and to keep the site running. We do not use advertising cookies.",
    ],
  },
  {
    h: "How we use it",
    p: [
      "To reply to you, prepare quotes, plan pilots, provide and support Farasha, acknowledge donations, keep the site secure, and meet legal obligations. We only contact you about what you asked for, and you can ask us to stop at any time.",
    ],
  },
  {
    h: "Who we share it with",
    p: [
      "We do not sell or rent your personal information. We share it only with service providers who help us run the site and the business — for example email delivery, hosting and payment processing — under obligations to protect it, or when the law requires it.",
    ],
  },
  {
    h: "Restaurant and guest data",
    p: [
      "Menus, orders, customer profiles and sales that a restaurant stores in Farasha belong to that restaurant. We process that data on the restaurant’s behalf under its service agreement, keep each business separate from every other, and provide exports on request.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "We keep enquiry and donation records for as long as needed to respond and to meet accounting and legal requirements, then delete or anonymise them.",
    ],
  },
  {
    h: "Your choices",
    p: [
      `You can ask to see, correct or delete the personal information we hold about you, or to stop receiving messages from us. Contact us at ${SITE.contactEmail} and we will respond within 30 days. Depending on where you live, you may have additional rights under local law.`,
    ],
  },
  {
    h: "Security",
    p: [
      "We use reasonable technical and organisational measures to protect your information, including encrypted connections. No method of transmission or storage is completely secure.",
    ],
  },
  {
    h: "Children",
    p: ["This site is meant for businesses and is not directed to children under 13. We do not knowingly collect their information."],
  },
  {
    h: "Changes and contact",
    p: [
      "We may update this policy; the date at the top shows the latest version.",
      `Questions? Reach us at ${CONTACT}.`,
    ],
  },
];

export const TERMS = [
  {
    h: "Using this website",
    p: [
      `These terms cover your use of farashapos.com, operated by ${OWNER.name}. By using the site you agree to them. If you do not agree, please do not use the site.`,
    ],
  },
  {
    h: "Farasha services",
    p: [
      "Information on this site describes our products in general terms. Your use of Farasha itself — including any pilot, subscription, setup or support — is governed by the quote or service agreement you sign with us, which takes precedence over this page.",
    ],
  },
  {
    h: "Demo ordering site",
    p: [
      `${SITE.demoOrdering.replace("https://", "")} is a demonstration. Orders placed there are not real orders and are not fulfilled or charged.`,
    ],
  },
  {
    h: "Acceptable use",
    p: [
      "Do not misuse the site: no attempts to break or overload it, gain unauthorised access, scrape it at scale, or submit false or harmful information through its forms.",
    ],
  },
  {
    h: "Our content",
    p: [
      "The Farasha name, butterfly emblem, logos, text, images and design on this site belong to us or our licensors. You may not copy or reuse them without written permission, except to share links to the site.",
    ],
  },
  {
    h: "Third-party links",
    p: [
      "The site links to services we do not control, such as payment providers. Their own terms and privacy policies apply when you use them.",
    ],
  },
  {
    h: "No warranty; limitation of liability",
    p: [
      "The site is provided “as is”. We work to keep it accurate and available, but we do not guarantee that it is error-free or uninterrupted. To the extent the law allows, we are not liable for indirect or consequential losses arising from your use of the site.",
    ],
  },
  {
    h: "Governing law",
    p: [`These terms are governed by the laws of the State of Illinois, USA.`],
  },
  {
    h: "Changes and contact",
    p: ["We may update these terms; the date at the top shows the latest version.", `Questions? Reach us at ${CONTACT}.`],
  },
];

export const REFUNDS = [
  {
    h: "Pilots and subscriptions",
    p: [
      "Prices, billing periods and cancellation terms for Farasha are set out in your quote or service agreement, and those terms govern any refund. There is no long-term commitment during the 90-day pilot.",
      "If your pilot does not continue, the one-time setup fee is not refundable, but you keep a full export of your menu, customers, orders and sales.",
    ],
  },
  {
    h: "Hardware",
    p: [
      "Hardware bought through us follows the manufacturer’s or reseller’s return and warranty terms, which we share with your quote. We help you test devices during the pilot so you only buy what works with your setup.",
    ],
  },
  {
    h: "Donations",
    p: [
      "Donations are voluntary and generally non-refundable. If a donation was made in error — a wrong amount, a duplicate, or an unauthorised charge — contact us within 30 days and we will refund it through the original payment provider.",
      "To change or cancel a monthly gift, contact us or use the link in your payment provider’s receipt. Cancelling stops future payments; past payments are not refunded.",
      "Donations are not tax-deductible unless your receipt states otherwise.",
    ],
  },
  {
    h: "How to request a refund",
    p: [
      `Email ${SITE.contactEmail} with your name, the date and amount, and the reason. We reply within one business day (${OWNER.hours}). Approved refunds go back to the original payment method; your bank may take 5–10 business days to show them.`,
    ],
  },
  {
    h: "Contact",
    p: [`Questions? Reach us at ${CONTACT}.`],
  },
];
