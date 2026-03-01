import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [valid, setValid] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setValid(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Lỗi", description: "Mật khẩu không khớp", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Đặt lại mật khẩu thành công!" });
      navigate("/profile");
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <img src={logo} alt="melodiQ" className="h-16 mx-auto mb-4" />
          <p className="text-muted-foreground">Link không hợp lệ hoặc đã hết hạn.</p>
          <Button variant="link" className="mt-4 text-primary" onClick={() => navigate("/auth")}>
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
      <img src={logo} alt="melodiQ" className="h-16 mb-6" />
      <h1 className="text-2xl font-bold font-display text-foreground mb-2">Đặt lại mật khẩu</h1>
      <p className="text-sm text-muted-foreground mb-8">Nhập mật khẩu mới cho tài khoản của bạn</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Mật khẩu mới</Label>
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

        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-foreground">Xác nhận mật khẩu</Label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="pl-10 bg-secondary border-border"
              required
              minLength={6}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full gradient-red-bg text-primary-foreground font-bold rounded-full h-12 shadow-lg box-glow-red"
        >
          {submitting && <Loader2 size={18} className="animate-spin mr-2" />}
          Đặt lại mật khẩu
        </Button>
      </form>
    </div>
  );
}
