import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        toast({ title: "Đăng nhập thành công!" });
        navigate("/profile");
      } else if (mode === "signup") {
        await signUp(email, password, displayName);
        toast({ title: "Đăng ký thành công!", description: "Kiểm tra email để xác nhận tài khoản." });
        setMode("login");
      } else {
        await resetPassword(email);
        toast({ title: "Đã gửi email", description: "Kiểm tra hộp thư để đặt lại mật khẩu." });
        setMode("login");
      }
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <header className="px-4 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <img src={logo} alt="melodiQ" className="h-16 mb-6" />

        <h1 className="text-2xl font-bold font-display text-foreground mb-1">
          {mode === "login" ? "Đăng nhập" : mode === "signup" ? "Đăng ký" : "Quên mật khẩu"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {mode === "login"
            ? "Chào mừng trở lại melodiQ"
            : mode === "signup"
            ? "Tạo tài khoản mới"
            : "Nhập email để nhận link đặt lại mật khẩu"}
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-foreground">Tên hiển thị</Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nhập tên hiển thị"
                  className="pl-10 bg-secondary border-border"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10 bg-secondary border-border"
                required
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Mật khẩu</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-secondary border-border"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-xs text-primary hover:underline"
            >
              Quên mật khẩu?
            </button>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full gradient-red-bg text-primary-foreground font-bold rounded-full h-12 shadow-lg box-glow-red hover:scale-[1.02] transition-transform"
          >
            {submitting && <Loader2 size={18} className="animate-spin mr-2" />}
            {mode === "login" ? "Đăng nhập" : mode === "signup" ? "Đăng ký" : "Gửi email"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Chưa có tài khoản?{" "}
              <button onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button onClick={() => setMode("login")} className="text-primary font-medium hover:underline">
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
