export interface HeroChapter {
  id: string;
  slug: string;
  navLabel: string;
  titleLine1: string;
  titleLine2?: string;
  eyebrow: string;
  headline: [string, string, string];
  body: string;
  image: string;
  theme: "dark-ui" | "light-ui";
  cta: {
    primary: string;
    secondary?: string;
  };
  gradient: string;
  mobileFocus: string;
}

export const HERO_CHAPTERS: HeroChapter[] = [
  {
    id: "01",
    slug: "cleaner-tomorrow",
    navLabel: "A CLEANER TOMORROW",
    titleLine1: "A CLEANER",
    titleLine2: "TOMORROW",
    eyebrow: "Clean Energy. Brighter Tomorrow.",
    headline: ["Powering", "a Cleaner", "Tomorrow"],
    body: "From solar manufacturing to power generation, data centers and recycling — Convalt Energy builds a more sustainable world through innovation and scale.",
    image: "/media/hero/chapters/01-cleaner-tomorrow.webp",
    theme: "dark-ui",
    cta: {
      primary: "Explore Our Story",
      secondary: "Watch Full Video",
    },
    gradient:
      "linear-gradient(90deg, rgba(245,244,239,0.85) 0%, rgba(245,244,239,0.40) 38%, rgba(245,244,239,0) 70%)",
    mobileFocus: "center 60%",
  },
  {
    id: "02",
    slug: "solar-manufacturing",
    navLabel: "SOLAR MANUFACTURING",
    titleLine1: "SOLAR",
    titleLine2: "MANUFACTURING",
    eyebrow: "SOLAR MANUFACTURING",
    headline: ["Engineered", "for a Brighter", "Planet"],
    body: "Advanced solar technology designed around performance, durability and the infrastructure needed for a cleaner energy future.",
    image: "/media/hero/chapters/02-solar-manufacturing.webp",
    theme: "light-ui",
    cta: {
      primary: "Learn More",
    },
    gradient:
      "linear-gradient(90deg, rgba(16,26,29,0.88) 0%, rgba(16,26,29,0.48) 42%, rgba(16,26,29,0) 75%)",
    mobileFocus: "center center",
  },
  {
    id: "03",
    slug: "power-generation",
    navLabel: "POWER GENERATION",
    titleLine1: "POWER",
    titleLine2: "GENERATION",
    eyebrow: "POWER GENERATION",
    headline: ["Clean Energy", "for a Stronger", "Tomorrow"],
    body: "Utility-scale energy infrastructure designed to support resilient communities and growing energy demand.",
    image: "/media/hero/chapters/03-power-generation.webp",
    theme: "light-ui",
    cta: {
      primary: "Learn More",
    },
    gradient:
      "linear-gradient(90deg, rgba(16,26,29,0.82) 0%, rgba(16,26,29,0.42) 40%, rgba(16,26,29,0) 72%)",
    mobileFocus: "65% center",
  },
  {
    id: "04",
    slug: "data-centers",
    navLabel: "DATA CENTERS",
    titleLine1: "DATA",
    titleLine2: "CENTERS",
    eyebrow: "DATA CENTERS",
    headline: ["Powering", "a Digital", "Future"],
    body: "Connecting digital infrastructure with cleaner, more resilient energy systems built for scale.",
    image: "/media/hero/chapters/04-data-centers.webp",
    theme: "light-ui",
    cta: {
      primary: "Learn More",
    },
    gradient:
      "linear-gradient(90deg, rgba(10,18,28,0.88) 0%, rgba(10,18,28,0.48) 42%, rgba(10,18,28,0) 75%)",
    mobileFocus: "68% center",
  },
  {
    id: "05",
    slug: "recycling",
    navLabel: "RECYCLING",
    titleLine1: "RECYCLING",
    eyebrow: "RECYCLING",
    headline: ["Giving Materials", "a Second", "Life"],
    body: "Recovering valuable materials and supporting a more circular clean-energy value chain.",
    image: "/media/hero/chapters/05-recycling.webp",
    theme: "dark-ui",
    cta: {
      primary: "Learn More",
    },
    gradient:
      "linear-gradient(90deg, rgba(245,244,239,0.85) 0%, rgba(245,244,239,0.40) 38%, rgba(245,244,239,0) 70%)",
    mobileFocus: "60% center",
  },
];
