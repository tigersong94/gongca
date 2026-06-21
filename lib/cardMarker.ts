import { Tier } from "@/types/restaurant";

const TIER_CONFIG: Record<Tier, { fill: string; dark: string; cardCount: number }> = {
  D: { fill: "#5DCAA5", dark: "#0F6E56", cardCount: 1 },
  C: { fill: "#FFD23F", dark: "#A8790A", cardCount: 2 },
  B: { fill: "#FF6600", dark: "#A84500", cardCount: 3 }, // 한화 오렌지
  A: { fill: "#C0392B", dark: "#641C13", cardCount: 4 },
};

const CARD_W = 20;
const CARD_H = 13;
const GAP_X = 1;
const GAP_Y = 1.7;

function singleCard(x: number, y: number, fill: string, dark: string): string {
  return `
    <g transform="translate(${x},${y})">
      <rect x="0" y="0" width="${CARD_W}" height="${CARD_H}" rx="2" fill="${fill}" fill-opacity="0.78" stroke="${dark}" stroke-width="0.5"/>
      <rect x="0" y="2.7" width="${CARD_W}" height="2.2" fill="${dark}" fill-opacity="0.55"/>
      <rect x="1.7" y="7" width="11.5" height="2" rx="0.5" fill="#ffffff" fill-opacity="0.6"/>
    </g>
  `;
}

/** 카드스택 SVG 마커 문자열을 생성. 우상단으로 쌓임 */
export function buildCardStackSVG(tier: Tier): { svg: string; width: number; height: number } {
  const { fill, dark, cardCount } = TIER_CONFIG[tier];
  const totalW = CARD_W + GAP_X * (cardCount - 1) + 6;
  const totalH = CARD_H + GAP_Y * (cardCount - 1) + 6;

  let cards = "";
  for (let i = 0; i < cardCount; i++) {
    const x = 3 + i * GAP_X;
    const y = totalH - CARD_H - 3 - i * GAP_Y;
    cards += singleCard(x, y, fill, dark);
  }

  const svg = `
    <svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
      ${cards}
    </svg>
  `;

  return { svg, width: totalW, height: totalH };
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case "A": return "상위 5%";
    case "B": return "상위 5~20%";
    case "C": return "상위 20~50%";
    case "D": return "그 외";
  }
}
