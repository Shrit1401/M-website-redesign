// Policy text from the live nebulawebtech.com pages.

export type LegalSection = { title: string; body?: string[]; list?: string[]; after?: string[] };

export const PRIVACY: { intro: string[]; sections: LegalSection[] } = {
  intro: [
    "Nebula Webtech LLC (“Company,” “we,” “our,” or “us”) operates the website https://nebulawebtech.com/. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
    "By using our website, you agree to the practices described in this Privacy Policy.",
  ],
  sections: [
    {
      title: "Information We Collect",
      body: ["We may collect personal information that you voluntarily provide when you:"],
      list: [
        "Fill out a contact form",
        "Request a quote or consultation",
        "Subscribe to newsletters or updates",
        "Communicate with us via email or phone",
      ],
      after: [
        "The information collected may include full name, email address, phone number, business information, and project details or service requests.",
        "We may also automatically collect certain technical information such as IP address, browser type, device information, website usage data, and cookies and analytics data.",
      ],
    },
    {
      title: "How We Use Your Information",
      body: ["We use collected information for the following purposes:"],
      list: [
        "Respond to inquiries and service requests",
        "Provide website development, maintenance, and digital marketing services",
        "Improve website performance and user experience",
        "Send updates, promotions, or service notifications",
        "Maintain security and prevent fraud",
      ],
    },
    {
      title: "Cookies and Tracking Technologies",
      body: ["Our website may use cookies, analytics tools, and similar technologies to:"],
      list: ["Understand visitor behavior", "Improve website functionality", "Measure marketing effectiveness"],
      after: ["Users may choose to disable cookies through their browser settings."],
    },
    {
      title: "Third-Party Services",
      body: ["We may use third-party tools such as:"],
      list: ["Website analytics providers", "Email marketing platforms", "Payment processors", "Hosting providers"],
      after: ["These services may collect information according to their own privacy policies."],
    },
    {
      title: "Data Security",
      body: [
        "We implement reasonable security measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no internet transmission is completely secure.",
      ],
    },
    {
      title: "Data Retention",
      body: [
        "We retain personal information only as long as necessary to provide services, comply with legal obligations, and resolve disputes.",
      ],
    },
    {
      title: "Your Privacy Rights",
      body: ["Depending on your location, you may have the right to:"],
      list: [
        "Access the personal data we hold about you",
        "Request correction of inaccurate information",
        "Request deletion of your personal data",
        "Opt out of marketing communications",
      ],
      after: ["Requests can be sent to the contact email listed below."],
    },
    {
      title: "Children’s Information",
      body: [
        "Our website and services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children.",
      ],
    },
    {
      title: "Changes to This Policy",
      body: [
        "We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised “Last Updated” date.",
      ],
    },
  ],
};

export const TERMS: { intro: string[]; sections: LegalSection[] } = {
  intro: [
    "These Terms and Conditions govern your use of the Nebula Webtech LLC website and services.",
    "By accessing or using this website, you agree to these Terms.",
  ],
  sections: [
    {
      title: "Use of the Website",
      body: ["You agree to use this website only for lawful purposes and in accordance with these Terms. You must not:"],
      list: [
        "Attempt to gain unauthorized access to the website",
        "Use the website for fraudulent or harmful activities",
        "Distribute malware or malicious code",
      ],
    },
    {
      title: "Services",
      body: ["Nebula Webtech LLC provides services including but not limited to:"],
      list: [
        "Website design and development",
        "Website maintenance and support",
        "Digital marketing services",
        "SEO and online presence optimization",
      ],
      after: ["Service agreements, pricing, and deliverables may be governed by separate contracts."],
    },
    {
      title: "Intellectual Property",
      body: ["All content on this website including:"],
      list: ["Text", "Graphics", "Logos", "Website design", "Software and code"],
      after: [
        "is the intellectual property of Nebula Webtech LLC unless otherwise stated.",
        "You may not reproduce, distribute, or reuse website content without written permission.",
      ],
    },
    {
      title: "Payments and Refunds",
      body: [
        "Payments for services must be made according to the agreed invoice or contract.",
        "Refunds are subject to the terms defined in the service agreement or project contract.",
      ],
    },
    {
      title: "Third-Party Links",
      body: [
        "Our website may contain links to external websites. We are not responsible for the content, privacy practices, or policies of those third-party sites.",
      ],
    },
    {
      title: "Limitation of Liability",
      body: ["Nebula Webtech LLC shall not be liable for:"],
      list: ["Indirect or consequential damages", "Loss of profits or data", "Website downtime or service interruptions"],
      after: ["To the fullest extent permitted by law."],
    },
    {
      title: "Indemnification",
      body: [
        "You agree to indemnify and hold harmless Nebula Webtech LLC from any claims, damages, or legal actions resulting from your use of the website or violation of these Terms.",
      ],
    },
    {
      title: "Governing Law",
      body: [
        "These Terms shall be governed by and interpreted in accordance with the laws of the State of Illinois, United States.",
      ],
    },
    {
      title: "Changes to Terms",
      body: ["We reserve the right to modify these Terms at any time. Changes will be posted on this page."],
    },
  ],
};
