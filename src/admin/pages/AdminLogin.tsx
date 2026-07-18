import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Mail, LogIn } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Login successful");
      router.navigate({ to: "/admin/menu" });
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__logo">
            <span>A</span>
          </div>
          <h1 className="admin-login__title">Admin Login</h1>
          <p className="admin-login__subtitle">Sign in to manage your restaurant</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login__form">
          <div className="admin-form__group">
            <label className="admin-form__label">EMAIL</label>
            <div className="admin-login__input-wrap">
              <Mail className="admin-login__input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="admin-form__input admin-login__input"
              />
            </div>
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">PASSWORD</label>
            <div className="admin-login__input-wrap">
              <Lock className="admin-login__input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-form__input admin-login__input"
              />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn--primary admin-btn--full" disabled={loading}>
            <LogIn className="h-4 w-4" />
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
