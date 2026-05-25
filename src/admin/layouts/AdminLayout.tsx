import "../admin.css";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, LogOut, Settings, Utensils, Grid, Image as ImageIcon, Star, Megaphone, Menu as MenuIcon, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const NAV_ITEMS = [
  { label: "Menu", path: "/admin/menu", icon: Utensils },
  { label: "Categories", path: "/admin/categories", icon: Grid },
  { label: "Promotions", path: "/admin/promotions", icon: Megaphone },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Gallery", path: "/admin/gallery", icon: ImageIcon },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin/menu": "Menu Management",
  "/admin/categories": "Category Management",
  "/admin/promotions": "Promotion Management",
  "/admin/reviews": "Review Management",
  "/admin/gallery": "Gallery Management",
  "/admin/settings": "Settings",
};

export function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isLoginPage = window.location.pathname === "/admin/login";
  const currentPath = window.location.pathname;
  const pageTitle = PAGE_TITLES[currentPath] || "Dashboard";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !isLoginPage) {
        router.navigate({ to: "/admin/login" });
      } else if (session && isLoginPage) {
        router.navigate({ to: "/admin/menu" });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isLoginPage) {
        router.navigate({ to: "/admin/login" });
      } else if (session && isLoginPage) {
        router.navigate({ to: "/admin/menu" });
      }
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        <span>Loading admin panel...</span>
      </div>
    );
  }

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="admin-shell">
      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <span className="admin-sidebar__logo-icon">A</span>
            <span className="admin-sidebar__logo-text">Arabica</span>
          </div>
          <button className="admin-sidebar__close-mobile" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}
              >
                <Icon className="admin-sidebar__link-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <button onClick={handleLogout} className="admin-sidebar__logout">
            <LogOut className="admin-sidebar__link-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__left">
            <button className="admin-header__menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon className="h-5 w-5" />
            </button>
            <div className="admin-header__breadcrumb">
              <span className="admin-header__breadcrumb-root">ADMIN</span>
              <ChevronRight className="admin-header__breadcrumb-sep" />
              <span className="admin-header__breadcrumb-page">{pageTitle.toUpperCase()}</span>
            </div>
          </div>
          <div className="admin-header__right">
            <div className="admin-header__avatar">
              <span>A</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
