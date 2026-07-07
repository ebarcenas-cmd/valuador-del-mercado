export interface MarketSegment {
  name: string;
  value: number;
  definition: string;
  explanation?: string;
  sources?: string[];
}

export interface MarketData {
  currency: string;
  tam: MarketSegment;
  sam: MarketSegment;
  som: MarketSegment;
  trampa_1_percent?: string;
  miopia_advice?: string;
  investigador_checklist?: string[];
  lider_checklist?: string[];
  validation_strategy?: string;
}

export interface IndustryPreset {
  id: string;
  name: string;
  category: string;
  icon: string;
  idea: string;
  target: string;
  region: string;
  pricing: string;
  data: MarketData;
}

export interface MyopiaQuizItem {
  company: string;
  statement: string;
  classification: "miopia" | "estrecha" | "balanceada";
  explanation: string;
  badgeText: string;
}

export interface SimYearData {
  year: number;
  somRevenue: number;
  penetration: number;
  accumulatedProfit: number;
  customers: number;
}
