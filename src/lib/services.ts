import type { IconName } from "@/components/Icon";

export type Service = {
  /** Slugs match the live WordPress URLs so existing links and rankings keep working. */
  slug: string;
  icon: IconName;
  title: string;
  fullTitle: string;
  summary: string;
  intro: string;
  approach: string;
  groups: { title: string; items: { title: string; body: string }[] }[];
};

export const SERVICES: Service[] = [
  {
    slug: "premier-web-design-and-development-solutions",
    icon: "code",
    title: "Web Design & Development",
    fullTitle: "Premier Web Design and Development Solutions",
    summary:
      "Top-tier web design and development tailored to your needs — innovative solutions with seamless user experiences and optimal functionality.",
    intro:
      "Customized web design and development that strengthens your digital presence with innovative, functional websites and a great user experience.",
    approach:
      "We start by understanding your business objectives and your target audience, then create a site that reflects your brand identity and is built to achieve measurable outcomes.",
    groups: [
      {
        title: "Web design",
        items: [
          { title: "Custom web design", body: "Unique, visually appealing layouts that reflect your brand's identity." },
          { title: "Responsive design", body: "Sites that look and work great on phones, tablets and desktops." },
          { title: "UI/UX design", body: "Intuitive interfaces that make it easy for visitors to find what they need." },
          { title: "Brand integration", body: "Your colors, type and visual language applied consistently everywhere." },
        ],
      },
      {
        title: "Web development",
        items: [
          { title: "Front-end development", body: "Fast, responsive interfaces built with modern, standards-based code." },
          { title: "Back-end development", body: "Robust, scalable systems that keep your site and data dependable." },
          { title: "E-commerce solutions", body: "Online stores with shopping carts and secure payment processing." },
          { title: "Content management", body: "WordPress, Joomla or custom CMS builds your team can update with ease." },
        ],
      },
      {
        title: "Built for search",
        items: [
          { title: "SEO optimization", body: "Keywords, meta tags and clean structure from day one." },
          { title: "Content marketing", body: "Content that engages your audience and supports your rankings." },
          { title: "Social media integration", body: "Connect your site with the channels your customers use." },
          { title: "Analytics & reporting", body: "Tracking in place so you can see what's working." },
        ],
      },
    ],
  },
  {
    slug: "comprehensive-web-maintenance-services",
    icon: "shield",
    title: "Web Maintenance",
    fullTitle: "Comprehensive Web Maintenance Services",
    summary:
      "Keep your website updated, secure and optimized with comprehensive maintenance. Focus on growth, not glitches.",
    intro:
      "A well-maintained website prevents glitches, strengthens your brand's reputation and builds customer confidence through reliability and speed.",
    approach:
      "We take care of the routine work that keeps a site healthy — updates, security, backups and performance — so you can focus on running your business.",
    groups: [
      {
        title: "Kept up to date",
        items: [
          { title: "Core & plugin updates", body: "CMS, theme and plugin updates applied and tested safely." },
          { title: "Content updates", body: "New pages, products, images and copy changes when you need them." },
          { title: "Compatibility checks", body: "Your site keeps working across new browsers and devices." },
          { title: "Bug fixes", body: "Broken layouts, links and forms found and fixed quickly." },
        ],
      },
      {
        title: "Kept secure",
        items: [
          { title: "Security monitoring", body: "Watching for vulnerabilities, malware and suspicious activity." },
          { title: "Regular backups", body: "Scheduled backups with quick restores if something goes wrong." },
          { title: "SSL & hardening", body: "Certificates, access controls and best-practice configuration." },
          { title: "Uptime monitoring", body: "Alerts when your site goes down, so it doesn't stay down." },
        ],
      },
      {
        title: "Kept fast",
        items: [
          { title: "Performance tuning", body: "Image, caching and code optimization for faster load times." },
          { title: "SEO health", body: "Ongoing checks so technical issues don't cost you rankings." },
          { title: "Analytics review", body: "Regular look at traffic and behavior to spot problems early." },
          { title: "Support when you need it", body: "A team to call for changes, questions and emergencies." },
        ],
      },
    ],
  },
  {
    slug: "strategic-digital-marketing-solutions",
    icon: "megaphone",
    title: "Digital Marketing",
    fullTitle: "Strategic Digital Marketing Solutions",
    summary:
      "Boost your online presence with strategic digital marketing. Maximize reach, engagement and conversions across platforms.",
    intro:
      "Digital marketing designed to maximize your reach, engagement and conversions across platforms — combining data-driven insights with creative execution.",
    approach:
      "In today's market, simply having a website or a social media account isn't enough. Whether your goal is brand awareness, lead generation or sales growth, we focus on measurable results.",
    groups: [
      {
        title: "Search (SEO & SEM)",
        items: [
          { title: "Search engine optimization", body: "On-page, technical and local SEO that helps customers find you." },
          { title: "Keyword strategy", body: "Research into the searches that bring buyers, not just visitors." },
          { title: "PPC advertising", body: "Paid search campaigns built to convert, managed against your budget." },
          { title: "Landing pages", body: "Focused pages that turn ad clicks into calls and leads." },
        ],
      },
      {
        title: "Social (SMO & SMM)",
        items: [
          { title: "Social media optimization", body: "Profiles set up and optimized to reflect your brand." },
          { title: "Social media management", body: "Consistent posting and community engagement." },
          { title: "Social campaigns", body: "Targeted campaigns to grow awareness and drive traffic." },
          { title: "Social integration", body: "Your website and social channels working together." },
        ],
      },
      {
        title: "Content & insight",
        items: [
          { title: "Content marketing", body: "Articles and content that engage your audience and build trust." },
          { title: "Analytics & tracking", body: "Conversion tracking so every campaign is measured." },
          { title: "Performance reporting", body: "Clear reports on what's working and what we'll do next." },
          { title: "Ongoing optimization", body: "Campaigns refined continuously based on real results." },
        ],
      },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
