"use client";

import { useState, useCallback, useEffect } from "react";
import KakaoMap from "@/components/KakaoMap";
import BottomSheet from "@/components/BottomSheet";
import DrawerMenu from "@/components/DrawerMenu";
import AboutPage from "@/components/AboutPage";
import { Restaurant } from "@/types/restaurant";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState<"map" | "about">("map");

  useEffect(() => {
    fetch("/data/restaurants.json")
      .then((res) => res.json())
      .then((data: Restaurant[]) => setRestaurants(data))
      .catch((err) => console.error("식당 데이터 로드 실패:", err));
  }, []);

  const handleSelect = useCallback((r: Restaurant) => {
    setSelected(r);
  }, []);

  return (
    <main className="w-full h-dvh relative">
      {page === "map" ? (
        <>
          <KakaoMap restaurants={restaurants} onSelectRestaurant={handleSelect} />

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="메뉴 열기"
            className="absolute top-4 right-4 z-30 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 transition-transform text-[var(--color-text)]"
          >
            <MenuIcon />
          </button>

          <div className="absolute top-4 left-4 z-30 bg-white shadow-md rounded-full px-4 py-2">
            <span className="text-sm font-medium">공무원 법카 맛집</span>
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