import { useUIStore } from "../../store/uiStore";
import { NAV_ITEMS } from "../../lib/constants";

export function SidebarNav() {
  const activeView = useUIStore((s) => s.activeView);
  const setActiveView = useUIStore((s) => s.setActiveView);

  return (
    <nav className="sidebar-nav" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-btn${activeView === item.id ? " active" : ""}`}
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
