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
    
    // Sanitize payload to only include valid columns (removes cached state fields like about_text_1)
    const payload = {
      id: "main_config",
      whatsapp_number: settings?.whatsapp_number,
      call_number: settings?.call_number,
      support_email: settings?.support_email,
      about_heading: settings?.about_heading,
      about_description: settings?.about_description,
      about_image_url: settings?.about_image_url,
      logo_url: settings?.logo_url,
      address: settings?.address,
      opening_hours: settings?.opening_hours,
      delivery_hours: settings?.delivery_hours,
      instagram_url: settings?.instagram_url,
      facebook_url: settings?.facebook_url,
      tiktok_url: settings?.tiktok_url,
      restaurant_name: settings?.restaurant_name
    };

    const { error } = await supabase.from("settings_site2").upsert(payload);
    if (error) toast.error(error.message);
    else toast.success("Settings saved successfully");
    setSaving(false);
  };;

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

        {/* About Section */}
        <div className="admin-settings-card">
          <div className="admin-settings-card__header">
            <Globe className="h-5 w-5" style={{ color: "#f59e0b" }} />
            <h2>About Section</h2>
          </div>
          <div className="admin-settings-card__body">
            <div className="admin-form__group">
              <label className="admin-form__label">ABOUT IMAGE</label>
              <div className="admin-settings__logo-area flex items-center gap-6">
                {settings?.about_image_url && (
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-primary/20 shadow-soft bg-white">
                    <img 
                      src={settings.about_image_url} 
                      alt="About Image" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="admin-settings__logo-controls flex-1 max-w-sm">
                  <ImageUpload 
                    value={settings?.about_image_url || ""} 
                    onChange={url => setSettings({...settings, about_image_url: url})} 
                  />
                </div>
              </div>
            </div>

            <div className="admin-form__group">
              <label className="admin-form__label">ABOUT HEADING (HTML Allowed)</label>
              <textarea
                value={settings?.about_heading || ""}
                onChange={e => setSettings({...settings, about_heading: e.target.value})}
                placeholder="Where coffee culture meets the modern table"
                className="admin-form__input"
                rows={2}
              />
            </div>
            
            <div className="admin-form__group">
              <label className="admin-form__label">ABOUT DESCRIPTION</label>
              <textarea
                value={settings?.about_description || ""}
                onChange={e => setSettings({...settings, about_description: e.target.value})}
                placeholder="Arabica isn't just a coffee house..."
                className="admin-form__input"
                rows={5}
              />
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

            <div className="admin-form__group">
              <label className="admin-form__label">OPENING TIMING</label>
              <input
                value={settings?.opening_hours || ""}
                onChange={e => setSettings({...settings, opening_hours: e.target.value})}
                placeholder="10:00 AM - 12:00 AM"
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
