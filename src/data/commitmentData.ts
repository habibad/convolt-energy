export interface CommitmentImpactItem {
  id: string;
  icon: "sun" | "home" | "co2" | "leaf";
  stat: string;
  title: string;
  description: string;
  qualitativeTitle: string;
  qualitativeDescription: string;
}

export interface CommitmentData {
  eyebrow: string;
  headline: [string, string, string];
  body: string;
  cta: {
    labelLine1: string;
    labelLine2: string;
    href: string;
  };
  principles: string[];
  manifesto: [string, string, string];
  impactItems: CommitmentImpactItem[];
  footer: {
    brand: string;
    tagline: string[];
    action: string;
  };
}

export const COMMITMENT_DATA: CommitmentData = {
  eyebrow: "OUR COMMITMENT",
  headline: ["A Cleaner", "Tomorrow,", "Together."],
  body: "We’re building an integrated energy future — combining innovation, scale and circularity to power people, industries and communities for generations to come.",
  cta: {
    labelLine1: "LET’S BUILD",
    labelLine2: "A CLEANER TOMORROW",
    href: "#contact",
  },
  principles: ["PEOPLE", "INNOVATION", "CIRCULARITY", "LASTING IMPACT"],
  manifesto: ["CLEAN ENERGY", "FOR A BRIGHTER", "TOMORROW"],
  impactItems: [
    {
      id: "capacity",
      icon: "sun",
      stat: "1.2 GW+",
      title: "Renewable Capacity",
      description: "(Operational & In Pipeline)",
      qualitativeTitle: "CLEAN POWER",
      qualitativeDescription: "Scalable renewable generation",
    },
    {
      id: "homes",
      icon: "home",
      stat: "2.5M+",
      title: "Homes Powered",
      description: "Clean electricity delivering reliable impact",
      qualitativeTitle: "RESILIENT INFRASTRUCTURE",
      qualitativeDescription: "Built for long-term performance",
    },
    {
      id: "co2",
      icon: "co2",
      stat: "3.2M+",
      title: "Tonnes of CO₂ Avoided",
      description: "Annually through integrated generation",
      qualitativeTitle: "CIRCULAR SYSTEMS",
      qualitativeDescription: "Materials designed for continued value",
    },
    {
      id: "commitment",
      icon: "leaf",
      stat: "100%",
      title: "Committed to",
      description: "Clean Energy & Circular Systems",
      qualitativeTitle: "LOWER-CARBON FUTURE",
      qualitativeDescription: "Connecting energy and infrastructure",
    },
  ],
  footer: {
    brand: "CONVALT",
    tagline: [
      "CLEANER ENERGY",
      "STRONGER COMMUNITIES",
      "A MORE RESILIENT TOMORROW",
    ],
    action: "SCROLL TO DISCOVER",
  },
};
