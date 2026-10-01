import type { IconName } from "@/components/Icon";

export type Service = {
  slug: string;
  title: string;
  icon: IconName;
  summary: string;
  headline: string;
  sub: string;
  gets: string[];
  body: string[];
};

// Copy sourced from macrosoftwaresolution.com service pages (typos fixed); AI optimization is new.
export const SERVICES: Service[] = [
  {
    slug: "saas-product-development",
    title: "SaaS Product Development",
    icon: "cloud",
    summary: "We design and develop robust SaaS products that help you engage your audience and streamline operations.",
    headline: "We design and build scalable SaaS products",
    sub: "Scalable SaaS platforms built for long-term growth, with security, performance and user experience at the core",
    gets: ["Agile development process", "User-friendly interface", "Scalable architecture", "Continuous support"],
    body: [
      "SaaS product development goes beyond building functional software. It is about creating a dependable digital product that users trust, adopt, and continue to pay for over time. At Macro Software Solution LLC, we focus on scalability, security, and measurable business impact. Every SaaS solution we deliver is designed to support growth, manage complexity, and provide long-term value to both users and stakeholders.",
      "Our SaaS development process begins with a clear understanding of your business goals, market positioning, and customer expectations. We work closely with founders, product leaders, and enterprise teams to define requirements and align technical decisions with strategic objectives. This early clarity ensures the product architecture supports current needs while remaining flexible for future expansion.",
      "We build SaaS platforms using cloud native architecture that enables seamless scaling as usage grows. Multi tenant design allows efficient resource utilization while maintaining strong data isolation and security for each customer. Performance optimization is embedded from the start to ensure responsiveness under varying workloads.",
      "Security is treated as a foundational requirement. We implement secure authentication, role based access control, and encrypted data handling to protect sensitive information. Our development practices follow enterprise security standards to reduce risk and support compliance, making our SaaS solutions suitable for regulated industries.",
      "User experience is central to SaaS success. We design intuitive workflows and clean interfaces that reduce friction and encourage engagement. A strong user experience improves retention, lowers support costs, and increases overall product value. Our design and engineering teams collaborate closely to balance usability and performance.",
      "Integration and extensibility are also key priorities. We develop APIs and integration layers that allow SaaS platforms to connect easily with third party tools, enterprise systems, and analytics solutions. This flexibility helps businesses adapt quickly without extensive redevelopment.",
      "Quality assurance is integrated throughout the development lifecycle to ensure reliability and consistency. After launch, we provide ongoing support, enhancements, and optimization so the product evolves with market demands. Our goal is to build SaaS platforms that function as reliable business engines and support sustainable growth over time.",
    ],
  },
  {
    slug: "cloud-solution-integration",
    title: "Cloud Solution & Integration",
    icon: "layers",
    summary:
      "We integrate and optimize cloud platforms to streamline operations, reduce costs, and enhance productivity across your organization.",
    headline: "Cloud environments aligned with business objectives",
    sub: "Secure, scalable and future-ready cloud systems",
    gets: ["Secure cloud migration", "Seamless system integration", "Cost-efficient solutions", "24/7 support"],
    body: [
      "Cloud solutions and integration are not just about moving systems to the cloud. They are about creating a flexible, secure, and scalable technology foundation that supports business growth. At Macro Software Solution LLC, we design cloud environments that align with operational goals while improving performance, reliability, and efficiency.",
      "Our cloud engagement begins with a thorough assessment of your existing infrastructure, applications, and workflows. This allows us to define a cloud strategy that fits your business needs, whether public, private, or hybrid. We focus on architectures that support scalability, resilience, and cost efficiency while minimizing disruption during transition.",
      "Cloud migration is executed with precision and careful planning. We ensure applications and data are moved securely with minimal downtime and without compromising system integrity. Legacy systems are modernized to operate efficiently in cloud environments, enabling greater agility and reduced operational overhead.",
      "Integration is a critical component of successful cloud adoption. Enterprises rely on multiple platforms and services to operate effectively. We build secure integration layers and APIs that connect cloud platforms with enterprise systems, third party tools, and data services. This creates unified workflows, improves data visibility, and supports faster decision making.",
      "Security is embedded at every level of our cloud solutions. We implement strong identity management, access control, encryption, and continuous monitoring to protect sensitive business data. Our cloud environments are designed to support compliance and enterprise security requirements.",
      "After deployment, we provide ongoing monitoring, optimization, and support. Cloud environments evolve as business needs change, and we ensure your infrastructure remains efficient, secure, and ready to scale. Our goal is to deliver cloud solutions that strengthen operational stability and enable long-term digital growth.",
    ],
  },
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    icon: "code",
    summary:
      "Our custom development process focuses on delivering solutions that are not only functional but also aligned with your strategic goals.",
    headline: "Software solutions built around your processes",
    sub: "Custom software built for business needs",
    gets: ["Bespoke software solutions", "Cutting-edge technology", "Comprehensive management", "Post-launch strategy"],
    body: [
      "Custom software development is about creating systems that fit your business processes rather than forcing your teams to adapt to generic tools. At Macro Software Solution LLC, we design and develop software solutions tailored to your operational requirements, scalability goals, and long-term strategy.",
      "Our process begins with a deep understanding of your business workflows, challenges, and objectives. We collaborate closely with stakeholders to define clear requirements and translate them into reliable software architecture. This alignment ensures the solution supports both current operations and future growth.",
      "We build custom software using modern development frameworks and scalable architectures that allow systems to evolve over time. Our focus on modular design enables easier updates, feature expansion, and integration with existing platforms. This reduces technical debt and ensures long-term maintainability.",
      "Security and performance are treated as core priorities throughout development. We implement secure authentication, data protection, and access control to safeguard sensitive information. Performance optimization ensures applications remain responsive even as usage and data volumes increase.",
      "User experience plays a key role in adoption and productivity. We design intuitive interfaces and efficient workflows that improve usability and reduce training effort. Well designed software helps teams work more effectively and minimizes operational friction.",
      "Integration is an essential part of enterprise software. We ensure custom applications connect seamlessly with internal systems, third party tools, and data services. This creates unified workflows and improves visibility across business operations.",
      "Quality assurance is embedded throughout the development lifecycle to ensure reliability and consistency. After deployment, we provide ongoing support and enhancements to keep the software aligned with evolving business needs. Our goal is to deliver custom software that strengthens operational efficiency and provides lasting business value.",
    ],
  },
  {
    slug: "it-infrastructure-management",
    title: "IT Infrastructure Management",
    icon: "server",
    summary:
      "We focus on proactive monitoring, robust security, and efficient resource management to minimize downtime and maximize performance.",
    headline: "Stable infrastructure for uninterrupted operations",
    sub: "Reliable IT infrastructure management and development",
    gets: ["Proactive monitoring", "Robust security management", "Scalable IT solutions", "Cost-effective management"],
    body: [
      "IT infrastructure is the foundation that supports every digital operation within an organization. At Macro Software Solution LLC, we provide infrastructure management and development services that ensure systems remain stable, secure, and ready to support business growth.",
      "Our approach begins with a detailed evaluation of your existing infrastructure, including servers, networks, cloud resources, and applications. This assessment helps us identify performance gaps, security risks, and scalability limitations. Based on these insights, we design infrastructure strategies that align with business objectives and operational requirements.",
      "We manage infrastructure environments proactively to prevent disruptions and downtime. Continuous monitoring allows us to identify issues early and address them before they impact critical operations. This proactive approach improves system reliability and ensures consistent performance across your technology landscape.",
      "Security is integrated into every aspect of infrastructure management. We implement access controls, system hardening, regular updates, and monitoring to protect systems and data. Our infrastructure solutions are designed to meet enterprise security standards and support compliance requirements where needed.",
      "Infrastructure development focuses on building environments that can scale efficiently. We design and implement modern infrastructure architectures that support virtualization, automation, and cloud integration. This enables organizations to adapt quickly to changing demands while maintaining cost control.",
      "We also prioritize backup and recovery planning to protect business continuity. Reliable backup strategies and tested recovery processes ensure critical systems and data can be restored quickly in the event of unexpected incidents.",
      "After implementation, we provide ongoing support, optimization, and strategic guidance. Our goal is to maintain a resilient infrastructure that supports performance, security, and long-term operational stability while allowing your teams to focus on core business initiatives.",
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    icon: "globe",
    summary: "We build fast, modern websites that help brands grow and convert users.",
    headline: "High-performance websites for modern businesses",
    sub: "High-performance web development solutions",
    gets: ["Custom-built website", "Mobile-friendly design", "Fast-loading pages", "SEO-ready structure"],
    body: [
      "Web development plays a critical role in how businesses present their brand, engage users, and support digital operations. At Macro Software Solution LLC, we build websites and web platforms that are secure, scalable, and designed to deliver strong user experiences across devices.",
      "Our web development process begins with understanding your business goals, target audience, and functional requirements. This allows us to design website structures that support clear navigation, consistent branding, and effective communication. Every project is planned to ensure usability and long-term maintainability.",
      "We focus on creating responsive and accessible designs that perform well across desktops, tablets, and mobile devices. User experience is prioritized to ensure visitors can easily find information and interact with your platform. Clean layouts and intuitive workflows help build trust and improve engagement.",
      "Our development teams use modern technologies to build fast and reliable web solutions. Performance optimization is integrated into every stage of development, ensuring quick load times and smooth interactions. Secure development practices protect your website and user data from common threats.",
      "Search engine visibility is supported through SEO friendly site architecture and clean code. We ensure websites are structured for easy indexing and long-term organic performance. This technical foundation supports content visibility and discoverability.",
      "Integration is a key part of enterprise web development. We connect websites with content management systems, analytics tools, customer platforms, and third party services. These integrations enhance functionality and streamline business workflows.",
      "After launch, we provide ongoing support and enhancements to ensure the website continues to perform as business needs evolve. Our goal is to deliver web solutions that strengthen brand credibility, improve engagement, and support digital growth.",
    ],
  },
  {
    slug: "website-maintenance",
    title: "Website Maintenance",
    icon: "gear",
    summary: "We keep your website secure, updated, and running smoothly at all times.",
    headline: "Keep your website secure and reliable",
    sub: "Proactive care that keeps your site fast, secure and current",
    gets: ["Regular updates", "Security checks", "Speed monitoring", "Content support"],
    body: [
      "A website requires continuous attention to remain secure, functional, and effective. At Macro Software Solution LLC, we provide website maintenance services that ensure your digital presence stays reliable, up to date, and aligned with business needs. Our maintenance approach begins with understanding your website structure, technologies, and usage patterns.",
      "This allows us to create a maintenance plan that addresses security, performance, and usability while minimizing risk and downtime. Regular monitoring helps identify potential issues before they impact users.",
      "Security is a critical component of website maintenance. We apply timely updates, monitor vulnerabilities, and implement protective measures to reduce exposure to threats. Keeping frameworks, plugins, and dependencies current helps protect sensitive data and maintain trust with users.",
      "Performance optimization ensures your website remains fast and responsive. We monitor load times, uptime, and functionality to maintain a smooth user experience. A well maintained website reduces bounce rates and supports consistent engagement across devices.",
      "Content accuracy and functionality are essential for credibility. We manage updates, fix broken links, and test forms and interactive elements to ensure everything works as intended. These routine checks prevent disruptions and maintain a professional appearance.",
      "Backup and recovery planning are integral to website reliability. We implement regular backups and recovery processes to protect data and enable quick restoration in case of unexpected issues. This supports business continuity and reduces risk.",
      "After implementation, we provide ongoing support, reporting, and optimization. Our goal is to ensure your website remains a dependable asset that supports brand reputation, customer engagement, and long-term digital performance.",
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    icon: "chart",
    summary: "We grow your online presence and help you reach the right audience.",
    headline: "Strategic marketing for measurable growth",
    sub: "Data-driven digital marketing solutions",
    gets: ["SEO optimization", "Social media growth", "Paid ads support", "Performance tracking"],
    body: [
      "Digital marketing is essential for businesses that want to build visibility, attract qualified audiences, and drive measurable growth. At Macro Software Solution LLC, we deliver digital marketing services that align strategy, execution, and analytics to achieve consistent business outcomes.",
      "Our digital marketing approach begins with understanding your business goals, target market, and competitive landscape. This allows us to develop strategies that position your brand effectively and connect with the right audience. Every campaign is designed with clear objectives and performance metrics in mind.",
      "Search engine optimization plays a key role in long-term digital success. We improve search visibility through technical optimization, keyword alignment, and content strategies that support organic growth. A strong SEO foundation helps businesses generate sustainable traffic and build authority over time.",
      "Paid digital advertising supports faster reach and targeted engagement. We plan and manage advertising campaigns that focus on qualified leads and efficient budget usage. Continuous performance tracking allows us to refine targeting and improve return on investment.",
      "Content marketing strengthens brand credibility and customer trust. We help create valuable content that educates audiences and supports the buyer journey. Well structured content improves engagement and reinforces consistent brand messaging across platforms.",
      "Social media and email marketing enable ongoing communication with audiences. We design structured campaigns that support awareness, lead nurturing, and customer retention. Analytics and reporting provide insight into performance and guide ongoing optimization.",
      "Our focus is on measurable results and long-term value. Through continuous analysis and refinement, we ensure digital marketing efforts remain aligned with business growth goals and evolving market conditions.",
    ],
  },
  {
    slug: "mobile-development",
    title: "Mobile Development",
    icon: "phone",
    summary: "We design and build high performance mobile applications to extend your digital reach.",
    headline: "High-performance mobile apps for businesses",
    sub: "Scalable mobile application development services",
    gets: [
      "iOS and Android app development",
      "Secure and scalable architecture",
      "Backend and API integration",
      "Regular updates and support",
    ],
    body: [
      "Mobile applications play a critical role in how businesses engage users, deliver services, and extend their digital capabilities. At Macro Software Solution LLC, we provide mobile application development services that focus on performance, security, and long-term usability across platforms.",
      "Our mobile development process begins with understanding your business objectives, target users, and functional requirements. This allows us to design mobile applications that align with user expectations and business workflows. Every application is planned to support growth and adaptability from the start.",
      "We develop mobile applications using modern frameworks and proven development practices to ensure stability and scalability. Our solutions are designed to perform consistently across devices and operating systems while maintaining a high standard of security. Performance optimization ensures smooth interactions and responsive user experiences.",
      "User experience is a key priority in mobile development. We focus on intuitive navigation, clean interfaces, and efficient workflows that enhance usability. Well designed mobile applications encourage engagement, improve retention, and strengthen customer satisfaction.",
      "Security is integrated throughout the development lifecycle. We implement secure authentication, data protection, and access controls to safeguard sensitive information. Our mobile solutions are designed to meet enterprise security standards and support compliance requirements.",
      "Integration with backend systems and third party services is essential for mobile applications. We ensure seamless connectivity with APIs, cloud platforms, and enterprise systems to enable real time data exchange and operational efficiency.",
      "After launch, we provide ongoing support, updates, and optimization. Mobile applications evolve as user needs change, and we ensure your solution remains reliable, secure, and aligned with business goals. Our objective is to deliver mobile applications that create lasting value and support digital growth.",
    ],
  },
  {
    slug: "ai-optimization",
    title: "AI Optimization & AEO",
    icon: "sparkles",
    summary:
      "Get found and cited by ChatGPT, Gemini, Perplexity and Google AI Overviews — and put AI to work inside your operations.",
    headline: "Be the answer when customers ask AI",
    sub: "Answer engine optimization, structured data and practical AI automation",
    gets: [
      "Structured data & FAQ schema",
      "Answer-ready service content",
      "AI assistants & workflow automation",
      "AI visibility monitoring",
    ],
    body: [
      "More of your customers now start with a question to an AI assistant instead of a search box. Answer engines like ChatGPT, Gemini, Perplexity and Google AI Overviews read the web, decide which businesses to trust, and summarize them in a single answer. If your site isn’t structured for that, you simply don’t appear.",
      "Answer engine optimization (AEO) makes your business easy for those systems to understand and cite. We audit how AI tools currently describe you, then restructure your service pages so each one clearly answers the questions buyers actually ask — what you do, who it’s for, where you operate and how to get started.",
      "We add machine-readable structured data (Organization, Service and FAQPage schema), consistent entity information across your site and listings, and FAQ content written as direct, quotable answers. We also make sure AI crawlers are allowed to read your site and publish an llms.txt summary that points them to the right pages.",
      "Beyond visibility, we help you use AI where it saves real time: assistants trained on your own documentation, automated intake and triage for inquiries, and workflow automation that connects the tools you already use. Every implementation is scoped around measurable outcomes and built with your data security in mind.",
      "AEO is not a one-off task. We monitor how AI assistants mention your brand over time, track which pages get cited, and keep content and schema current as your services evolve — so you stay the answer as the platforms change.",
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
