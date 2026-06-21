export type Tier = "A" | "B" | "C" | "D";

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  visitCount: number;
  totalAmount: number;
  avgAmount: number;
  tier: Tier;
  institutionAmounts: Record<string, number>;
  institutionCounts: Record<string, number>;
}

declare global {
  interface Window {
    kakao: any;
  }
}
