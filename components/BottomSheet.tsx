"use client";

import { Restaurant } from "@/types/restaurant";

interface BottomSheetProps {
  restaurant: Restaurant | null;
  onClose: () => void;
}

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

const INSTITUTION_COLORS: Record<string, string> = {
  국회의원: "#C0392B",
  외교부: "#185FA5",
  통일부: "#0F6E56",
  종로구청: "#D87E1A",
  종로구의회: "#534AB7",
};

export default function BottomSheet({ restaurant, onClose }: BottomSheetProps) {
  if (!restaurant) return null;

const kakaoMapSearchUrl = `https://map.kakao.com/?q=${encodeURIComponent(restaurant.name)}`;
  const totalForBar = Object.values(restaurant.institutionAmounts).reduce((a, b) => a + b, 0);
  const institutionEntries = Object.entries(restaurant.institutionAmounts).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <>
      {/* 오버레이 (모바일에서 바깥 탭하면 닫힘) */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      <div className="sheet-enter fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] max-h-[75vh] overflow-y-auto">
        <div className="mx-auto max-w-xl px-5 pt-3 pb-6">
          {/* 드래그 핸들 */}
          <div className="flex justify-center mb-3">
            <div className="w-10 h-1 rounded-full bg-[var(--color-border)]" />
          </div>

          {/* 상단: 식당명 / 주소 / 카카오맵 버튼 */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h2 className="text-lg font-medium truncate">{restaurant.name}</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5 truncate">
                {restaurant.address}
              </p>
            </div>
            <a
              href={kakaoMapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="카카오맵에서 보기"
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#FEE500] active:scale-95 transition-transform"
            >
              <span className="text-[15px] font-bold text-[#3C1E1E]">K</span>
            </a>
          </div>

          {/* 중단: 결제건수 / 총액 / 평균액 */}
          <div className="grid grid-cols-3 gap-2 mb-5 py-3 border-y border-[var(--color-border)]">
            <div className="text-center">
              <div className="text-[11px] text-[var(--color-text-muted)] mb-1">결제건수</div>
              <div className="text-base font-medium">{restaurant.visitCount.toLocaleString()}건</div>
            </div>
            <div className="text-center border-x border-[var(--color-border)]">
              <div className="text-[11px] text-[var(--color-text-muted)] mb-1">총 결제금액</div>
              <div className="text-base font-medium">{formatWon(restaurant.totalAmount)}</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-[var(--color-text-muted)] mb-1">평균 결제금액</div>
              <div className="text-base font-medium">{formatWon(restaurant.avgAmount)}</div>
            </div>
          </div>

          {/* 하단: 기관별 비중 데이터스택 */}
          <div>
            <div className="text-[11px] text-[var(--color-text-muted)] mb-2">기관별 비중</div>
            <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-3">
              {institutionEntries.map(([inst, amt]) => (
                <div
                  key={inst}
                  style={{
                    width: `${(amt / totalForBar) * 100}%`,
                    backgroundColor: INSTITUTION_COLORS[inst] || "#999",
                  }}
                />
              ))}
            </div>
            <div className="space-y-2">
              {institutionEntries.map(([inst, amt]) => {
                const count = restaurant.institutionCounts[inst] || 0;
                const pct = ((amt / totalForBar) * 100).toFixed(0);
                return (
                  <div key={inst} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: INSTITUTION_COLORS[inst] || "#999" }}
                      />
                      <span className="truncate">{inst}</span>
                    </div>
                    <div className="text-[var(--color-text-muted)] shrink-0 text-xs">
                      {count}건 · {formatWon(amt)} · {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
