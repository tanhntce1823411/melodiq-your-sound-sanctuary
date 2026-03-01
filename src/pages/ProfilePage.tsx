import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, ChevronRight, LogIn, Upload, Shield, LogOut, Edit2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const guestMenuItems = [
  { icon: LogIn, label: "Đăng nhập / Đăng ký", action: "auth" },
  { icon: Settings, label: "Cài đặt", action: "settings" },
];

export default function ProfilePage() {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleMenuClick = (action: string) => {
    if (action === "auth") navigate("/auth");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: "Đã đăng xuất" });
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ display_name: newName.trim() });
      setEditing(false);
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // Logged in state
  if (user && profile) {
    const initials = (profile.display_name || user.email || "U")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="pb-32 animate-fade-in">
        <header className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold font-display text-foreground">Hồ sơ</h1>
        </header>

        <section className="px-4 mt-4">
          <div className="flex flex-col items-center rounded-2xl bg-secondary/60 p-8">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {editing ? (
              <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Tên hiển thị mới"
                  className="bg-secondary border-border text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveName} disabled={saving} className="gradient-red-bg text-primary-foreground">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : "Lưu"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Huỷ</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display text-foreground">
                  {profile.display_name || "Người dùng"}
                </h2>
                <button
                  onClick={() => { setNewName(profile.display_name || ""); setEditing(true); }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
        </section>

        <section className="px-4 mt-6 space-y-1">
          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-secondary">
            <Upload size={20} className="text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium text-foreground">Upload nhạc</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-secondary">
            <Shield size={20} className="text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium text-foreground">Quản trị (Admin)</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-secondary">
            <Settings size={20} className="text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium text-foreground">Cài đặt</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-destructive/10"
          >
            <LogOut size={20} className="text-destructive" />
            <span className="flex-1 text-left text-sm font-medium text-destructive">Đăng xuất</span>
          </button>
        </section>

        <p className="text-center text-xs text-muted-foreground mt-12">melodiQ v1.0 • Made with ❤️</p>
      </div>
    );
  }

  // Guest state
  return (
    <div className="pb-32 animate-fade-in">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground">Hồ sơ</h1>
      </header>

      <section className="px-4 mt-4">
        <div className="flex flex-col items-center rounded-2xl bg-secondary/60 p-8">
          <img src={logo} alt="melodiQ" className="h-20 mb-4" />
          <h2 className="text-lg font-bold font-display text-foreground">Chào mừng đến melodiQ</h2>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Đăng nhập để trải nghiệm đầy đủ tính năng
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="mt-6 gradient-red-bg px-8 py-3 rounded-full text-sm font-bold text-primary-foreground shadow-lg box-glow-red transition-transform hover:scale-105"
          >
            Đăng nhập ngay
          </button>
        </div>
      </section>

      <section className="px-4 mt-6 space-y-1">
        {guestMenuItems.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={() => handleMenuClick(action)}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-secondary"
          >
            <Icon size={20} className="text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium text-foreground">{label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </section>

      <p className="text-center text-xs text-muted-foreground mt-12">melodiQ v1.0 • Made with ❤️</p>
    </div>
  );
}
