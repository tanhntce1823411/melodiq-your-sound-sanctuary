import { Settings, ChevronRight, LogIn, Upload, Shield } from "lucide-react";
import logo from "@/assets/logo.png";

const menuItems = [
  { icon: LogIn, label: "Đăng nhập / Đăng ký" },
  { icon: Upload, label: "Upload nhạc" },
  { icon: Shield, label: "Quản trị (Admin)" },
  { icon: Settings, label: "Cài đặt" },
];

export default function ProfilePage() {
  return (
    <div className="pb-32 animate-fade-in">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground">Hồ sơ</h1>
      </header>

      {/* Guest state */}
      <section className="px-4 mt-4">
        <div className="flex flex-col items-center rounded-2xl bg-secondary/60 p-8">
          <img src={logo} alt="melodiQ" className="h-20 mb-4" />
          <h2 className="text-lg font-bold font-display text-foreground">Chào mừng đến melodiQ</h2>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Đăng nhập để trải nghiệm đầy đủ tính năng
          </p>
          <button className="mt-6 gradient-red-bg px-8 py-3 rounded-full text-sm font-bold text-primary-foreground shadow-lg box-glow-red transition-transform hover:scale-105">
            Đăng nhập ngay
          </button>
        </div>
      </section>

      {/* Menu */}
      <section className="px-4 mt-6 space-y-1">
        {menuItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-secondary"
          >
            <Icon size={20} className="text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium text-foreground">{label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </section>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-12">
        melodiQ v1.0 • Made with ❤️
      </p>
    </div>
  );
}
