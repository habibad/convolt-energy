export interface BusinessProcessStep {
  index: string;
  num: string;
  title: string;
  media: string;
  description: string;
}

export type BusinessId = "solar" | "power" | "data" | "recycling";

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
    cameraPose: {
      target: [-0.35, 0.1, 7.6],
      lookAt: [-0.4, 0.0, 0.0],
    },
    processSteps: [
      {
        index: "01",
        num: "01",
        title: "Raw Materials",
        media: "/media/service/05-raw-materials.png",
        description: "Ethical sourcing of high-purity silicon and critical minerals adhering to responsible supply chain benchmarks.",
      },
      {
        index: "02",
        num: "02",
        title: "Wafer Production",
        media: "/media/service/06-wafer-production.png",
        description: "Precision ingot slicing and ultra-thin crystalline wafer fabrication with minimal kerf loss and optimized crystal structures.",
      },
      {
        index: "03",
        num: "03",
        title: "Cell Manufacturing",
        media: "/media/service/07-cell-manufacturing.png",
        description: "High-efficiency N-type TOPCon and heterojunction cell architecture delivering superior quantum efficiency.",
      },
      {
        index: "04",
        num: "04",
        title: "Module Assembly",
        media: "/media/service/08-module-assembly.png",
        description: "Fully automated robotic lamination, glass encapsulation, and rigorous climate stress testing for 30+ year lifespans.",
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
    cameraPose: {
      target: [0.35, 0.15, 7.6],
      lookAt: [0.4, 0.05, 0.0],
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
    cameraPose: {
      target: [0.4, -0.2, 7.6],
      lookAt: [0.45, -0.25, 0.0],
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
    cameraPose: {
      target: [-0.35, -0.25, 7.6],
      lookAt: [-0.4, -0.3, 0.0],
    },
  },
};

export const BUSINESS_LIST = [
  BUSINESS_DATA.solar,
  BUSINESS_DATA.power,
  BUSINESS_DATA.data,
  BUSINESS_DATA.recycling,
];
