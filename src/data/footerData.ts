export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterData {
  brand: {
    name: string;
    tagline: string[];
    socials: {
      platform: "linkedin" | "youtube" | "instagram";
      url: string;
      label: string;
    }[];
  };
  columns: FooterColumn[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    consentText: string;
  };
  bottomBar: {
    brand: string;
    motto: string;
    links: FooterLink[];
  };
}

export const FOOTER_DATA: FooterData = {
  brand: {
    name: "CONVALT",
    tagline: ["Clean Energy for", "a Brighter Tomorrow."],
    socials: [
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/company/convalt-energy",
        label: "LinkedIn",
      },
      {
        platform: "youtube",
        url: "https://www.youtube.com/@convaltenergy",
        label: "YouTube",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/convaltenergy",
        label: "Instagram",
      },
    ],
  },
  columns: [
    {
      id: "explore",
      title: "EXPLORE",
      links: [
        { label: "Home", href: "#" },
        { label: "Our Approach", href: "#our-approach" },
        { label: "Our Commitment", href: "#our-commitment" },
      ],
    },
    {
      id: "business-areas",
      title: "BUSINESS AREAS",
      links: [
        { label: "Solar Manufacturing", href: "#solar-manufacturing" },
        { label: "Power Generation", href: "#power-generation" },
        { label: "Data Centers", href: "#data-centers" },
        { label: "Recycling", href: "#recycling" },
      ],
    },
    {
      id: "company",
      title: "COMPANY",
      links: [
        { label: "About Us", href: "#about-us" },
        { label: "Sustainability", href: "#sustainability" },
        { label: "Careers", href: "#careers" },
        { label: "News & Insights", href: "#news" },
        { label: "Contact", href: "#contact" },
      ],
    },
  ],
  newsletter: {
    title: "STAY IN TOUCH",
    description:
      "Get the latest updates on our journey toward a cleaner, more resilient future.",
    placeholder: "Your email address",
    consentText: "I agree to receive updates from Convalt.",
  },
  bottomBar: {
    brand: "CONVALT",
    motto: "A CLEANER TOMORROW, TOGETHER.",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Use", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
    ],
  },
};
