"use client";

interface AboutPageProps {
  onBack: () => void;
}

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

const SOURCES = [
  {
    name: "국회의원 정치자금",
    period: "2020년 ~ 2024년",
    count: 33429,
    amount: 4712143000,
    note: "오마이뉴스 GitHub(KA-money) 공개 데이터. 간담회_식대 / 사무실_식대비 / 언론_기자식대등 카테고리. 법인카드가 아닌 정치자금 계좌 지출.",
  },
  {
    name: "통일부 업무추진비",
    period: "2020년 ~ 2022년",
    count: 1950,
    amount: 292719800,
    note: "data.go.kr 공개 데이터.",
  },
  {
    name: "외교부 업무추진비",
    period: "2025년 4월 ~ 9월",
    count: 1203,
    amount: 234971500,
    note: "장차관급·실국장급. 4·5월은 장차관급 자료 미수령.",
  },
  {
    name: "종로구의회 업무추진비",
    period: "2025년 3월 ~ 2026년 5월",
    count: 1015,
    amount: 87352990,
    note: "12개월치 수집(일부 월 누락).",
  },
  {
    name: "종로구청 업무추진비",
    period: "2026년 5월",
    count: 86,
    amount: 4571290,
    note: "부서별·월별 개별 공시 자료. 10개 부서 수집.",
  },
];

const TOTAL_COUNT = SOURCES.reduce((sum, s) => sum + s.count, 0);
const TOTAL_AMOUNT = SOURCES.reduce((sum, s) => sum + s.amount, 0);

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="w-full h-full overflow-y-auto bg-white">
      <div className="max-w-xl mx-auto px-5 py-6">
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

        <h1 className="text-xl font-medium mb-2">About 공카</h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-3">
          광화문, 시청 인근 공무원/국회의원 법카 데이터 기반 식당 아카이브입니다.
          공개된 업무추진비 및 정치자금 지출 내역을 지도 위에 시각화했습니다.
          광고 없이, 공공데이터를 객관적으로 분석한 아카이브를 지향합니다.
        </p>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
          공카는{" "}
          
            href="https://restaurant.coroke.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            공직자 법인카드 식당 맛집 지도
          </a>{" "}
          기사를 보고 영감을 받아 시작됐습니다. 해당 데이터를 바탕으로 광화문, 시청 인근 공공기관의 업무추진비 데이터를 별도로 수집, 정리해 함께 통합했습니다.
        </p>

        <h2 className="text-sm font-medium mb-3 text-[var(--color-text-muted)]">데이터 출처</h2>
        <div className="space-y-4 mb-3">
          {SOURCES.map((s) => (
            <div key={s.name} className="border border-[var(--color-border)] rounded-lg p-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{s.period}</span>
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mb-2">
                {s.count.toLocaleString()}건 · {formatWon(s.amount)}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="flex items-baseline justify-between border-t border-[var(--color-border)] pt-3 mb-8 text-sm">
          <span className="font-medium">합계</span>
          <span className="text-[var(--color-text-muted)]">
            {TOTAL_COUNT.toLocaleString()}건 · {formatWon(TOTAL_AMOUNT)}
          </span>
        </div>

        <h2 className="text-sm font-medium mb-3 text-[var(--color-text-muted)]">안내</h2>
        <ul className="text-xs text-[var(--color-text-muted)] leading-relaxed space-y-1.5 mb-8 list-disc pl-4">
          <li>식당명은 카카오맵 검색 결과를 기준으로 정규화했으며, 일부 오매칭이 있을 수 있습니다.</li>
          <li>기관별 데이터 확보 기간이 달라 절대 비교에는 한계가 있습니다.</li>
          <li>지도 표시 범위는 서울/수도권으로 제한되어 있습니다.</li>
        </ul>

        <h2 className="text-sm font-medium mb-3 text-[var(--color-text-muted)]">문의</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          비즈니스 문의: <span className="underline">contact@gongca.org</span>
        </p>
      </div>
    </div>
  );
}