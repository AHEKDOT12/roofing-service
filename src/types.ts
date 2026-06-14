export interface ServiceCardData {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  positions: { x: number; y: number; s: number }[]; // square positions for magnetic animation
}

export interface MarqueeItem {
  name: string;
  iconId: "roof" | "layers" | "arrow" | "grid" | "rope" | "lines" | "wave" | "plus";
}

export interface CalculationRequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  area: number;
  tier: "standard" | "elite" | "premium";
  tierLabel: string;
  estimatedCost: number;
  clientName: string;
  clientPhone: string;
  submittedAt: string;
  status: "pending" | "approved" | "processed";
}
