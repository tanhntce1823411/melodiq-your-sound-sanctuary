import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";
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

        {mode !== "forgot" && (
          <div className="w-full max-w-sm mt-4">
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-background px-3 text-xs text-muted-foreground">hoặc</span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-full border-border font-medium"
              onClick={async () => {
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) {
                  toast({ title: "Lỗi", description: error.message, variant: "destructive" });
                }
              }}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Đăng nhập với Google
            </Button>
          </div>
        )}

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
