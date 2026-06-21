"use client";

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: "map" | "about") => void;
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M5 9a3 3 0 0 1-3-3V5h3" />
      <path d="M19 9a3 3 0 0 0 3-3V5h-3" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
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
          <span className="text-base font-medium">공무원 법카 맛집</span>
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
            <MapIcon />
            <span className="text-sm">법카 맵</span>
          </button>

          <div className="w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 opacity-45 cursor-not-allowed select-none">
            <TrophyIcon />
            <span className="text-sm">법카 Top Ranking</span>
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
            <InfoIcon />
            <span className="text-sm">About 공카</span>
          </button>
        </nav>
      </div>
    </>
  );
}