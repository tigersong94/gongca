"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import KakaoMap from "@/components/KakaoMap";
import BottomSheet from "@/components/BottomSheet";
import DrawerMenu from "@/components/DrawerMenu";
import AboutPage from "@/components/AboutPage";
import { Restaurant, Tier } from "@/types/restaurant";
import { buildCardStackSVG } from "@/lib/cardMarker";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

const TIER_LEGEND: { tier: Tier; label: string }[] = [
  { tier: "A", label: "결제건수 상위 5%" },
  { tier: "B", label: "결제건수 상위 5~20%" },
  { tier: "C", label: "결제건수 상위 20~50%" },
  { tier: "D", label: "그 외" },
];

const INSTITUTIONS = ["전체", "국회의원", "통일부", "외교부", "종로구청", "종로구의회"] as const;
type Institution = (typeof INSTITUTIONS)[number];

function TierLegend() {
  return (
    <div className="bg-white/95 shadow-md rounded-xl px-3 py-2 space-y-1">
      {TIER_LEGEND.map(({ tier, label }) => {
        const { svg, width, height } = buildCardStackSVG(tier);
        return (
          <div key={tier} className="flex items-center gap-2">
            <div
              style={{ width: 22, height: 18 }}
              className="flex items-end justify-center shrink-0"
              dangerouslySetInnerHTML={{
                __html: svg.replace(
                  "<svg",
                  `<svg style="width:${Math.min(width, 22)}px;height:auto;max-height:18px"`
                ),
              }}
            />
            <span className="text-[10px] text-[var(--color-text-muted)] leading-none">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function InstitutionFilter({
  selected,
  onChange,
}: {
  selected: Institution;
  onChange: (v: Institution) => void;
}) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-140px)] max-w-sm">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-1 pb-0.5">
        {INSTITUTIONS.map((inst) => {
          const active = selected === inst;
          return (
            <button
              key={inst}
              onClick={() => onChange(inst)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 whitespace-nowrap ${
                active
                  ? "bg-[#0a1f44] text-[#FFD23F]"
                  : "bg-white/95 text-[var(--color-text)] hover:bg-gray-100"
              }`}
            >
              {inst}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState<"map" | "about">("map");
  const [institution, setInstitution] = useState<Institution>("전체");

  useEffect(() => {
    fetch("/data/restaurants.json")
      .then((res) => res.json())
      .then((data: Restaurant[]) => setRestaurants(data))
      .catch((err) => console.error("식당 데이터 로드 실패:", err));
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (institution === "전체") return restaurants;
    return restaurants.filter(
      (r) => r.institutionCounts && r.institutionCounts[institution] !== undefined
    );
  }, [restaurants, institution]);

  const handleSelect = useCallback((r: Restaurant) => {
    setSelected(r);
  }, []);

  return (
    <main className="w-full h-dvh relative">
      {page === "map" ? (
        <>
          <KakaoMap restaurants={filteredRestaurants} onSelectRestaurant={handleSelect} />

          {/* 상단 중앙 기관 필터 */}
          <InstitutionFilter selected={institution} onChange={setInstitution} />

          {/* 우상단 메뉴 버튼 */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="메뉴 열기"
            className="absolute top-4 right-4 z-30 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 transition-transform text-[var(--color-text)]"
          >
            <MenuIcon />
          </button>

          {/* 좌상단 브랜드 + 레전드 */}
          <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
            <div className="bg-[#0a1f44] shadow-md rounded-full px-4 py-2 inline-flex w-fit">
              <span className="text-sm font-bold text-[#FFD23F]">공카 by Qho</span>
            </div>
            <TierLegend />
          </div>

          <BottomSheet restaurant={selected} onClose={() => setSelected(null)} />
        </>
      ) : (
        <AboutPage onBack={() => setPage("map")} />
      )}

      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(p) => setPage(p)}
      />
    </main>
  );
}
