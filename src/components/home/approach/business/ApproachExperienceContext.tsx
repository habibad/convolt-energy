"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";
import { BUSINESS_DATA, BusinessId, BusinessItem } from "./businessData";

export type ApproachMode =
  | "overview"
  | "transitioning-in"
  | "business"
  | "transitioning-between"
  | "transitioning-out";

export interface ApproachExperienceContextType {
  mode: ApproachMode;
  activeBusiness: BusinessId | null;
  pendingBusiness: BusinessId | null;
  activeProcessStep: number;
  transitionProgressRef: React.MutableRefObject<number>;
  setActiveProcessStep: (step: number) => void;
  enterBusiness: (id: BusinessId) => void;
  switchBusiness: (id: BusinessId) => void;
  exitToOverview: () => void;
  setMode: (mode: ApproachMode) => void;
  currentBusinessData: BusinessItem | null;
}

// Re-export type BusinessId for convenience
export type { BusinessId };

const ApproachExperienceContext = createContext<ApproachExperienceContextType | null>(null);

export const useApproachExperience = () => {
  const ctx = useContext(ApproachExperienceContext);
  if (!ctx) {
    throw new Error("useApproachExperience must be used within an ApproachExperienceProvider");
  }
  return ctx;
};
