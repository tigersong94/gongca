"use client";

import { useState, useMemo } from "react";
import { Restaurant } from "@/types/restaurant";

interface RankingPageProps {
  restaurants: Restaurant[];
  onBack: () => void;
}

function formatWon(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + "억원";
  if (n >= 10000) return Math.round(n / 10000) + "만원";
  return n.toLocaleString("ko-KR") + "원";
}

const INSTITUTIONS = ["전체", "국회의원", "통일부", "외교부", "종로구청", "종로구의회"] as const;
type Institution = (typeof INSTITUTIONS)[number];

const INSTITUTION_COLORS: Record<string, string> = {
  국회의원: "#C0392B",
  외교부: "#185FA5",
  통일부: "#0F6E56",
  종로구청: "#D87E1A",
  종로구의회: "#534AB7",
};

const TOP_N = 30;

export default function RankingPage({ restaurants, onBack }: RankingPageProps) {
  const [institution, setInstitution] = useState<Institution>("전체");

  const ranked = useMemo(() => {
    let list = restaurants;
    if (institution !== "전체") {
      list = restaurants.filter(
        (r) => r.institutionCounts && r.institutionCounts[institution] !== undefined
      );
    }
    return list
      .slice()
      .sort((a, b) => {
        if (institution === "전체") return b.visitCount - a.visitCount;
        return (b.institutionCounts[institution] || 0) - (a.institutionCounts[institution] || 0);
      })
      .slice(0, TOP_N);
  }, [restaurants, institution]);

  const maxCount = ranked[0]
    ? institution === "전체"
      ? ranked[0].visitCount
      : ranked[0].institutionCounts[institution] || 1
    : 1;

  const accentColor = institution === "전체" ? "#0a1f44" : (INSTITUTION_COLORS[institution] || "#0a1f44");

  return (
    <div className="w-full h-full overflow-y-auto bg-white">
      <div className="max-w-xl mx-auto px-5 py-6">
        {/* 헤더 */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          지도로 돌아가기
        </button>

        <h1 className="text-xl font-medium mb-1">🏆 법카 Top Ranking</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-5">결제건수 기준 상위 {TOP_N}위</p>

        {/* 기관 필터 탭 */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-6 pb-0.5">
          {INSTITUTIONS.map((inst) => {
            const active = institution === inst;
            const color = inst === "전체" ? "#0a1f44" : (INSTITUTION_COLORS[inst] || "#0a1f44");
            return (
              <button
                key={inst}
                onClick={() => setInstitution(inst)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 whitespace-nowrap border"
                style={
                  active
                    ? { backgroundColor: color, color: "#fff", borderColor: color }
                    : { backgroundColor: "#fff", color: "#555", borderColor: "#e5e7eb" }
                }
              >
                {inst}
              </button>
            );
          })}
        </div>

        {/* 랭킹 리스트 */}
        <div className="space-y-3">
          {ranked.map((r, i) => {
            const count = institution === "전체"
              ? r.visitCount
              : (r.institutionCounts[institution] || 0);
            const amount = institution === "전체"
              ? r.totalAmount
              : (r.institutionAmounts[institution] || 0);
            const barPct = (count / maxCount) * 100;
            const rank = i + 1;
            const rankLabel = rank <= 3
              ? ["🥇", "🥈", "🥉"][rank - 1]
              : `${rank}위`;

            return (
              <div key={r.id} className="relative">
                {/* 막대 배경 */}
                <div
                  className="absolute inset-y-0 left-0 rounded-lg opacity-10 transition-all"
                  style={{ width: `${barPct}%`, backgroundColor: accentColor }}
                />
                {/* 내용 */}
                <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[var(--color-border)]">
                  <span className="text-sm w-7 shrink-0 text-center font-medium">{rankLabel}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">{r.address}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold" style={{ color: accentColor }}>{count.toLocaleString()}건</div>
                    <div className="text-[11px] text-[var(--color-text-muted)]">{formatWon(amount)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
