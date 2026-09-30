export interface FinalCTAData {
  eyebrow: string;
  headline: [string, string];
  body: string;
  cta: {
    primary: string;
    secondary: string;
    href: string;
  };
  principles: string[];
}

export const FINAL_CTA_DATA: FinalCTAData = {
  eyebrow: "START A CONVERSATION",
  headline: ["Let’s Build", "What’s Next."],
  body: "Connect with Convalt to explore opportunities across clean energy, infrastructure and circular solutions.",
  cta: {
    primary: "LET’S CONNECT",
    secondary: "EXPLORE OPPORTUNITIES TOGETHER",
    href: "#contact",
  },
  principles: [
    "CLEAN ENERGY",
    "INFRASTRUCTURE",
    "INNOVATION",
    "CIRCULAR ECONOMY",
    "STRONGER COMMUNITIES",
  ],
};
