export interface SceneCameraConfig {
  start: [number, number, number];
  end: [number, number, number];
  startTarget: [number, number, number];
  endTarget: [number, number, number];
  pointerStrength: { x: number; y: number };
  idleStrength: { x: number; y: number; speed: number };
}

export interface SceneParallaxConfig {
  foreground: number;
  midground: number;
  background: number;
}

export interface SceneUvMotionConfig {
  scaleStart: number;
  scaleEnd: number;
  panXStart: number;
  panXEnd: number;
  panYStart: number;
  panYEnd: number;
}

export interface SceneAtmosphereConfig {
  fogColor: [number, number, number]; // Normalized RGB 0-1
  fogOpacity: number;
  fogDriftSpeed: number;
  particleCount: number;
  particleColor: string;
  particleSize: number;
  particleSpeed: number;
  sunGlow: number;
  ambientIntensity: number;
  ambientColor: string;
}

export interface HeroSceneEffectConfig {
  id: number;
  slug: string;
  name: string;
  camera: SceneCameraConfig;
  parallax: SceneParallaxConfig;
  uvMotion: SceneUvMotionConfig;
  atmosphere: SceneAtmosphereConfig;
  shaderEffect: {
    type: "scene01_facility" | "scene02_exploded_panel" | "scene03_power_landscape" | "scene04_data_campus" | "scene05_recycling_plant";
    sweepCycleDuration: number;
    sweepIntensity: number;
    breathingAmplitude: number;
    depthSeparation: number;
  };
}

export const HERO_SCENE_EFFECTS: HeroSceneEffectConfig[] = [
  // Chapter 01 — A Cleaner Tomorrow (Establishing wide shot -> cinematic push-in zoom into clean tech facility)
  {
    id: 0,
    slug: "cleaner-tomorrow",
    name: "A Cleaner Tomorrow",
    camera: {
      start: [0.0, 0.0, 5.15],
      end: [0.04, -0.015, 4.35],
      startTarget: [0.0, 0.02, 0.0],
      endTarget: [0.035, 0.005, 0.0],
      pointerStrength: { x: 0.12, y: 0.06 },
      idleStrength: { x: 0.015, y: 0.009, speed: 0.35 },
    },
    parallax: {
      foreground: 1.0,
      midground: 0.5,
      background: -0.04,
    },
    uvMotion: {
      scaleStart: 1.0,
      scaleEnd: 1.06,
      panXStart: 0.0,
      panXEnd: 0.01,
      panYStart: 0.0,
      panYEnd: 0.0,
    },
    atmosphere: {
      fogColor: [0.96, 0.94, 0.90],
      fogOpacity: 0.26,
      fogDriftSpeed: 0.012,
      particleCount: 45,
      particleColor: "#FFF4D0",
      particleSize: 0.035,
      particleSpeed: 0.0018,
      sunGlow: 0.85,
      ambientIntensity: 1.1,
      ambientColor: "#FFFBF0",
    },
    shaderEffect: {
      type: "scene01_facility",
      sweepCycleDuration: 10.0,
      sweepIntensity: 0.28,
      breathingAmplitude: 0.015,
      depthSeparation: 1.0,
    },
  },

  // Chapter 02 — Solar Manufacturing (Exploded panel technical reveal -> cinematic pull-back zoom out revealing full module architecture)
  {
    id: 1,
    slug: "solar-manufacturing",
    name: "Solar Manufacturing",
    camera: {
      start: [0.04, -0.015, 4.38],
      end: [0.10, -0.045, 5.18],
      startTarget: [0.025, -0.01, 0.0],
      endTarget: [0.06, -0.03, 0.0],
      pointerStrength: { x: 0.15, y: 0.08 },
      idleStrength: { x: 0.012, y: 0.008, speed: 0.30 },
    },
    parallax: {
      foreground: 0.85,
      midground: 0.45,
      background: -0.035,
    },
    uvMotion: {
      scaleStart: 1.06,
      scaleEnd: 1.0,
      panXStart: 0.0,
      panXEnd: 0.015,
      panYStart: 0.0,
      panYEnd: -0.008,
    },
    atmosphere: {
      fogColor: [0.88, 0.91, 0.94],
      fogOpacity: 0.10,
      fogDriftSpeed: 0.008,
      particleCount: 22,
      particleColor: "#94A3B8",
      particleSize: 0.022,
      particleSpeed: 0.0012,
      sunGlow: 0.0,
      ambientIntensity: 1.0,
      ambientColor: "#E2E8F0",
    },
    shaderEffect: {
      type: "scene02_exploded_panel",
      sweepCycleDuration: 8.5,
      sweepIntensity: 0.24,
      breathingAmplitude: 0.025,
      depthSeparation: 0.85,
    },
  },

  // Chapter 03 — Power Generation (Horizontal cinematic glide -> push-in zoom gliding over utility solar fields)
  {
    id: 2,
    slug: "power-generation",
    name: "Power Generation",
    camera: {
      start: [-0.07, 0.02, 5.16],
      end: [0.06, -0.005, 4.35],
      startTarget: [-0.035, 0.01, 0.0],
      endTarget: [0.035, 0.00, 0.0],
      pointerStrength: { x: 0.13, y: 0.06 },
      idleStrength: { x: 0.014, y: 0.007, speed: 0.28 },
    },
    parallax: {
      foreground: 1.0,
      midground: 0.65,
      background: 0.25,
    },
    uvMotion: {
      scaleStart: 1.0,
      scaleEnd: 1.06,
      panXStart: -0.02,
      panXEnd: 0.025,
      panYStart: 0.0,
      panYEnd: -0.005,
    },
    atmosphere: {
      fogColor: [0.95, 0.93, 0.89],
      fogOpacity: 0.28,
      fogDriftSpeed: 0.015,
      particleCount: 35,
      particleColor: "#FDE68A",
      particleSize: 0.030,
      particleSpeed: 0.0020,
      sunGlow: 0.35,
      ambientIntensity: 1.15,
      ambientColor: "#FEF3C7",
    },
    shaderEffect: {
      type: "scene03_power_landscape",
      sweepCycleDuration: 9.0,
      sweepIntensity: 0.20,
      breathingAmplitude: 0.028,
      depthSeparation: 0.70,
    },
  },

  // Chapter 04 — Data Centers (Campus approach -> pull-back zoom out unveiling gigawatt sustainable compute scale)
  {
    id: 3,
    slug: "data-centers",
    name: "Data Centers",
    camera: {
      start: [0.03, -0.01, 4.38],
      end: [0.085, -0.035, 5.16],
      startTarget: [0.015, -0.01, 0.0],
      endTarget: [0.05, -0.02, 0.0],
      pointerStrength: { x: 0.12, y: 0.06 },
      idleStrength: { x: 0.010, y: 0.006, speed: 0.24 },
    },
    parallax: {
      foreground: 0.90,
      midground: 0.55,
      background: 0.18,
    },
    uvMotion: {
      scaleStart: 1.06,
      scaleEnd: 1.0,
      panXStart: -0.01,
      panXEnd: 0.012,
      panYStart: 0.0,
      panYEnd: -0.006,
    },
    atmosphere: {
      fogColor: [0.82, 0.88, 0.94],
      fogOpacity: 0.30,
      fogDriftSpeed: 0.010,
      particleCount: 18,
      particleColor: "#7DD3FC",
      particleSize: 0.020,
      particleSpeed: 0.0010,
      sunGlow: 0.0,
      ambientIntensity: 0.95,
      ambientColor: "#CBD5E1",
    },
    shaderEffect: {
      type: "scene04_data_campus",
      sweepCycleDuration: 11.0,
      sweepIntensity: 0.18,
      breathingAmplitude: 0.032,
      depthSeparation: 0.60,
    },
  },

  // Chapter 05 — Recycling (Wide facility overview -> push-in zoom into circular sorting and recycling machinery)
  {
    id: 4,
    slug: "recycling",
    name: "Recycling",
    camera: {
      start: [-0.025, 0.01, 5.15],
      end: [0.04, -0.018, 4.35],
      startTarget: [-0.01, 0.01, 0.0],
      endTarget: [0.025, -0.01, 0.0],
      pointerStrength: { x: 0.12, y: 0.06 },
      idleStrength: { x: 0.009, y: 0.006, speed: 0.25 },
    },
    parallax: {
      foreground: 0.95,
      midground: 0.60,
      background: 0.20,
    },
    uvMotion: {
      scaleStart: 1.0,
      scaleEnd: 1.06,
      panXStart: 0.015,
      panXEnd: -0.01,
      panYStart: 0.0,
      panYEnd: 0.0,
    },
    atmosphere: {
      fogColor: [0.88, 0.90, 0.92],
      fogOpacity: 0.14,
      fogDriftSpeed: 0.010,
      particleCount: 26,
      particleColor: "#F1F5F9",
      particleSize: 0.024,
      particleSpeed: 0.0016,
      sunGlow: 0.12,
      ambientIntensity: 1.05,
      ambientColor: "#E2E8F0",
    },
    shaderEffect: {
      type: "scene05_recycling_plant",
      sweepCycleDuration: 9.5,
      sweepIntensity: 0.22,
      breathingAmplitude: 0.020,
      depthSeparation: 0.75,
    },
  },
];
