"use client";

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: "map" | "about" | "ranking") => void;
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function DrawerMenu({ open, onClose, onNavigate }: DrawerMenuProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose} />
      <div className="drawer-enter fixed top-0 right-0 bottom-0 z-[70] w-72 bg-white shadow-xl flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <span className="text-base font-medium">Gongca로 점메추 😋</span>
          <button
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface)]"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex-1 px-3 py-3">
          <button
            onClick={() => {
              onNavigate("map");
              onClose();
            }}
            className="w-full text-left px-3 py-3 rounded-lg hover:bg-[var(--color-surface)] flex items-center gap-3"
          >
            <span className="text-lg leading-none">🌏</span>
            <span className="text-sm">법카 사용처 맵</span>
          </button>

          <button
            onClick={() => {
              onNavigate("ranking");
              onClose();
            }}
            className="w-full text-left px-3 py-3 rounded-lg hover:bg-[var(--color-surface)] flex items-center gap-3"
          >
            <span className="text-lg leading-none">🏆</span>
            <span className="text-sm">법카 Top Ranking</span>
          </button>

          <div className="w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 opacity-45 cursor-not-allowed select-none">
            <span className="text-lg leading-none">🍔</span>
            <span className="text-sm">오늘의 점메추!</span>
            <span className="ml-auto text-[10px] font-medium bg-[#FF6600] text-white px-2 py-0.5 rounded-full">
              Beta
            </span>
          </div>

          <button
            onClick={() => {
              onNavigate("about");
              onClose();
            }}
            className="w-full text-left px-3 py-3 rounded-lg hover:bg-[var(--color-surface)] flex items-center gap-3"
          >
            <span className="text-lg leading-none">📂</span>
            <span className="text-sm">About 공카</span>
          </button>
        </nav>
      </div>
    </>
  );
}
