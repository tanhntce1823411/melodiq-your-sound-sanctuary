import { Home, Search, Library, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Trang chủ", path: "/" },
  { icon: Search, label: "Tìm kiếm", path: "/search" },
  { icon: Library, label: "Thư viện", path: "/library" },
  { icon: User, label: "Hồ sơ", path: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
      <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} className={active ? "drop-shadow-[0_0_8px_hsl(1,98%,44%)]" : ""} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
