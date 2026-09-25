export interface BusinessProcessStep {
  index: string;
  num: string;
  title: string;
  media: string;
  description: string;
  range: [number, number]; // [startProgress, endProgress]
}

export type BusinessId = "solar" | "power" | "data" | "recycling";
export type StoryChapterId = "overview" | "solar" | "power" | "data" | "recycling" | "conclusion";

export interface CameraPose {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface BusinessItem {
  id: BusinessId;
  zoneIndex: number;
  index: string;
  label: string;
  navLabel: string;
  eyebrow: string;
  headline: string[];
  body: string;
  media: string;
  accentColor: string;
  safeArea: "left" | "right" | "center";
  cameraPose: {
    target: [number, number, number];
    lookAt: [number, number, number];
  };
  processSteps?: BusinessProcessStep[];
}

export const BUSINESS_DATA: Record<"solar" | "power" | "data" | "recycling", BusinessItem> = {
  solar: {
    id: "solar",
    zoneIndex: 0,
    index: "01",
    label: "Solar Manufacturing",
    navLabel: "SOLAR",
    eyebrow: "01 / SOLAR MANUFACTURING",
    headline: ["Manufacturing", "a Cleaner", "Tomorrow."],
    body: "Advanced solar manufacturing designed to connect responsible production, high-performance components and a resilient clean-energy ecosystem.",
    media: "/media/service/01-solar-manufacturing.png",
    accentColor: "#3D9E32",
    safeArea: "left",
    cameraPose: {
      target: [-0.4, 0.15, 6.2],
      lookAt: [-0.44, 0.05, 0.0],
    },
    processSteps: [
      {
        index: "01",
        num: "01",
        title: "Raw Materials",
        media: "/media/service/05-raw-materials.png",
        description: "Ethical sourcing of high-purity silicon and critical minerals adhering to responsible supply chain benchmarks.",
        range: [0.25, 0.285],
      },
      {
        index: "02",
        num: "02",
        title: "Wafer Production",
        media: "/media/service/06-wafer-production.png",
        description: "Precision ingot slicing and ultra-thin crystalline wafer fabrication with minimal kerf loss and optimized crystal structures.",
        range: [0.285, 0.32],
      },
      {
        index: "03",
        num: "03",
        title: "Cell Manufacturing",
        media: "/media/service/07-cell-manufacturing.png",
        description: "High-efficiency N-type TOPCon and heterojunction cell architecture delivering superior quantum efficiency.",
        range: [0.32, 0.355],
      },
      {
        index: "04",
        num: "04",
        title: "Module Assembly",
        media: "/media/service/08-module-assembly.png",
        description: "Fully automated robotic lamination, glass encapsulation, and rigorous climate stress testing for 30+ year lifespans.",
        range: [0.355, 0.395],
      },
    ],
  },
  power: {
    id: "power",
    zoneIndex: 1,
    index: "02",
    label: "Power Generation",
    navLabel: "POWER",
    eyebrow: "02 / POWER GENERATION",
    headline: ["Clean Energy", "at Scale."],
    body: "Utility-scale renewable energy infrastructure designed to generate reliable, high-capacity clean power that fuels regional grids and digital operations.",
    media: "/media/service/02-power-generation.png",
    accentColor: "#4DA860",
    safeArea: "right",
    cameraPose: {
      target: [0.45, 0.22, 7.4],
      lookAt: [0.42, 0.08, 0.0],
    },
  },
  data: {
    id: "data",
    zoneIndex: 2,
    index: "03",
    label: "Data Centers",
    navLabel: "DATA",
    eyebrow: "03 / DATA CENTERS",
    headline: ["Powering", "Digital Infrastructure."],
    body: "Next-generation data infrastructure engineered to seamlessly integrate with dedicated renewable power sources for low-carbon compute.",
    media: "/media/service/03-data-centers.png",
    accentColor: "#57C088",
    safeArea: "left",
    cameraPose: {
      target: [0.38, -0.16, 6.3],
      lookAt: [0.42, -0.22, 0.0],
    },
  },
  recycling: {
    id: "recycling",
    zoneIndex: 3,
    index: "04",
    label: "Recycling",
    navLabel: "RECYCLING",
    eyebrow: "04 / RECYCLING",
    headline: ["Giving Materials", "a Second Life."],
    body: "Closed-loop circular recovery designed to reclaim high-value solar components and raw elements, completing the sustainable ecosystem.",
    media: "/media/service/04-recycling.png",
    accentColor: "#3D9E32",
    safeArea: "left",
    cameraPose: {
      target: [-0.36, -0.22, 6.2],
      lookAt: [-0.40, -0.26, 0.0],
    },
  },
};

export const CONCLUSION_DATA = {
  id: "conclusion" as const,
  eyebrow: "THE CONNECTED ECOSYSTEM",
  headline: ["One Connected", "Value Chain."],
  body: "From raw silicon to power generation, high-efficiency data infrastructure, and circular recycling — Convalt unites the entire clean-energy lifecycle into a single resilient future.",
  media: "/media/approach/05-integrated-ecosystem.png",
  cameraPose: {
    target: [0.0, 0.12, 8.8] as [number, number, number],
    lookAt: [0.0, -0.16, 0.0] as [number, number, number],
  },
};

export const BUSINESS_LIST = [
  BUSINESS_DATA.solar,
  BUSINESS_DATA.power,
  BUSINESS_DATA.data,
  BUSINESS_DATA.recycling,
];

export interface StoryChapterMeta {
  id: StoryChapterId;
  label: string;
  navLabel: string;
  num: string;
  start: number;
  end: number;
  peak: number;
  seekTarget: number;
}

export const STORY_CHAPTERS: StoryChapterMeta[] = [
  {
    id: "overview",
    label: "Overview",
    navLabel: "OVERVIEW",
    num: "00",
    start: 0.0,
    end: 0.16,
    peak: 0.06,
    seekTarget: 0.04,
  },
  {
    id: "solar",
    label: "Solar Manufacturing",
    navLabel: "SOLAR",
    num: "01",
    start: 0.16,
    end: 0.40,
    peak: 0.23,
    seekTarget: 0.22,
  },
  {
    id: "power",
    label: "Power Generation",
    navLabel: "POWER",
    num: "02",
    start: 0.40,
    end: 0.58,
    peak: 0.49,
    seekTarget: 0.48,
  },
  {
    id: "data",
    label: "Data Centers",
    navLabel: "DATA",
    num: "03",
    start: 0.58,
    end: 0.76,
    peak: 0.67,
    seekTarget: 0.66,
  },
  {
    id: "recycling",
    label: "Recycling",
    navLabel: "RECYCLING",
    num: "04",
    start: 0.76,
    end: 0.92,
    peak: 0.84,
    seekTarget: 0.83,
  },
  {
    id: "conclusion",
    label: "Connected Value Chain",
    navLabel: "ECOSYSTEM",
    num: "05",
    start: 0.92,
    end: 1.0,
    peak: 0.96,
    seekTarget: 0.96,
  },
];
