import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { Save, Palette, Phone, Globe } from "lucide-react";

export function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("settings_site2").select("*").eq("id", "main_config").maybeSingle();
    if (data) setSettings(data);
    else if (!error) {
      // Create default
      const defaultSettings = { id: "main_config", whatsapp_number: "", call_number: "", support_email: "" };
      setSettings(defaultSettings);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("settings_site2").upsert({ ...settings, id: "main_config" });
    if (error) toast.error(error.message);
    else toast.success("Settings saved successfully");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="admin-loading-inline">
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page admin-page--narrow">
      <form onSubmit={handleSave}>
        {/* Branding Section */}
        <div className="admin-settings-card">
          <div className="admin-settings-card__header">
            <Palette className="h-5 w-5" style={{ color: "#f59e0b" }} />
            <h2>Branding Assets</h2>
          </div>
          <div className="admin-settings-card__body">
            <div className="admin-form__group">
              <label className="admin-form__label">SITE LOGO (NAVBAR & FOOTER)</label>
              <div className="admin-settings__logo-area flex items-center gap-6">
                {settings?.logo_url && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 shadow-soft bg-white">
                    <img 
                      src={settings.logo_url} 
                      alt="Brand Logo" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="admin-settings__logo-controls flex-1 max-w-sm">
                  <ImageUpload 
                    value={settings?.logo_url || ""} 
                    onChange={url => setSettings({...settings, logo_url: url})} 
                  />
                </div>
              </div>
              <p className="admin-form__hint">RECOMMENDED: SQUARE PNG/JPEG WITH WHITE OR TRANSPARENT BACKGROUND.</p>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="admin-settings-card">
          <div className="admin-settings-card__header">
            <Phone className="h-5 w-5" style={{ color: "#f59e0b" }} />
            <h2>Contact Info</h2>
          </div>
          <div className="admin-settings-card__body">
            <div className="admin-form__row">
              <div className="admin-form__group">
                <label className="admin-form__label">WHATSAPP NUMBER</label>
                <input
                  value={settings?.whatsapp_number || ""}
                  onChange={e => setSettings({...settings, whatsapp_number: e.target.value})}
                  placeholder="+1234567890"
                  className="admin-form__input"
                />
              </div>
              <div className="admin-form__group">
                <label className="admin-form__label">CALL NUMBER</label>
                <input
                  value={settings?.call_number || ""}
                  onChange={e => setSettings({...settings, call_number: e.target.value})}
                  placeholder="+1234567890"
                  className="admin-form__input"
                />
              </div>
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">SUPPORT EMAIL</label>
              <input
                type="email"
                value={settings?.support_email || ""}
                onChange={e => setSettings({...settings, support_email: e.target.value})}
                placeholder="support@example.com"
                className="admin-form__input"
              />
            </div>


          </div>
        </div>



        <button type="submit" disabled={saving} className="admin-btn admin-btn--primary admin-btn--save-all">
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save All Changes"}</span>
        </button>
      </form>
    </div>
  );
}
