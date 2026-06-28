import { useUIStore } from "../../store/uiStore";
import { NAV_ITEMS } from "../../lib/constants";

export function SidebarNav() {
  const activeView = useUIStore((s) => s.activeView);
  const setActiveView = useUIStore((s) => s.setActiveView);

  return (
    <nav className="sidebar-nav flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-btn flex items-center gap-2 w-full px-2.5 py-2 rounded-lg border-none text-[13px] font-medium cursor-pointer text-left transition-[background,color] duration-150 [&_svg]:shrink-0 ${
            activeView === item.id
              ? "bg-(--accent-sub) text-(--accent) [&_svg]:opacity-100"
              : "bg-transparent text-(--text-2) hover:bg-(--bg-hover) hover:text-(--text-1) [&_svg]:opacity-60"
          }`}
          data-view={item.id}
          onClick={() => setActiveView(item.id)}
        >
          <svg
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            dangerouslySetInnerHTML={{ __html: item.icon }}
          />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
