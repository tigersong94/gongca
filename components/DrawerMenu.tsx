"use client";

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: "map" | "about") => void;
}

export default function DrawerMenu({ open, onClose, onNavigate }: DrawerMenuProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose} />
      <div className="drawer-enter fixed top-0 left-0 bottom-0 z-[70] w-72 bg-white shadow-xl flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <span className="text-base font-medium">공무원 법카 맛집</span>
          <button
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface)]"
          >
            <i className="ti ti-x text-lg" aria-hidden="true" />
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
            <i className="ti ti-map text-lg" aria-hidden="true" />
            <span className="text-sm">법카 맵</span>
          </button>
          <button
            onClick={() => {
              onNavigate("about");
              onClose();
            }}
            className="w-full text-left px-3 py-3 rounded-lg hover:bg-[var(--color-surface)] flex items-center gap-3"
          >
            <i className="ti ti-info-circle text-lg" aria-hidden="true" />
            <span className="text-sm">About 공카</span>
          </button>
        </nav>
      </div>
    </>
  );
}
