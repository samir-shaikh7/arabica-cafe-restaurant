import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit2, CheckCircle2, X, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminModal } from "@/admin/components/AdminModal";
import { ImageUpload } from "@/admin/components/ImageUpload";

const DEFAULT_FORM = {
  title: "",
  subtitle: "",
  image_url: "",
  cta_text: "",
  cta_link: "",
  is_active: true,
};

export function AdminPromotions() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("promotions_site2").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
    if (error) toast.error(error.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        subtitle: item.subtitle || "",
        image_url: item.image_url || "",
        cta_text: item.cta_text || "",
        cta_link: item.cta_link || "",
        is_active: item.is_active ?? true,
      });
    } else {
      setEditingId(null);
      setFormData(DEFAULT_FORM);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      image_url: formData.image_url,
      cta_text: formData.cta_text,
      is_active: formData.is_active,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("promotions_site2").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Promotion updated");
      } else {
        const { error } = await supabase.from("promotions_site2").insert([payload]);
        if (error) throw error;
        toast.success("Promotion created");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promotion?")) return;
    const { error } = await supabase.from("promotions_site2").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted successfully");
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="admin-page">
      {/* Section Header */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-header__title">ACTIVE POP-UPS</h2>
          <p className="admin-section-header__subtitle">Manage special offers that appear to users</p>
        </div>
        <button onClick={() => openModal()} className="admin-btn admin-btn--primary">
          <Plus className="h-4 w-4" />
          <span>New Promotion</span>
        </button>
      </div>

      {/* Promotions List */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-inline">
            <div className="admin-loading-spinner" />
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty admin-empty--large">
            <p>No promotions found. Create one to get started.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>TITLE</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="admin-table__promo-img" />
                      ) : (
                        <div className="admin-table__promo-img-placeholder">
                          <X className="h-4 w-4" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="admin-table__item-name">{item.title}</div>
                      <div className="admin-table__item-category">{item.subtitle}</div>
                    </td>
                    <td>
                      {item.is_active ? (
                        <span className="admin-badge admin-badge--success">
                          <span className="admin-badge__dot" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge--muted">
                          <span className="admin-badge__dot" />
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="admin-table__actions">
                        <button onClick={() => openModal(item)} className="admin-table__action-btn admin-table__action-btn--edit" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="admin-table__action-btn admin-table__action-btn--delete" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Promotion" : "New Promotion"}
      >
        <form onSubmit={handleSave} className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">TITLE</label>
            <input
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Weekend Special Feast"
              className="admin-form__input"
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">DESCRIPTION</label>
            <textarea
              value={formData.subtitle}
              onChange={e => setFormData({...formData, subtitle: e.target.value})}
              placeholder="What's the special offer?"
              rows={3}
              className="admin-form__textarea"
            />
          </div>

          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">BUTTON TEXT</label>
              <input
                value={formData.cta_text}
                onChange={e => setFormData({...formData, cta_text: e.target.value})}
                placeholder="Order Now"
                className="admin-form__input"
              />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">LINK URL (OPTIONAL)</label>
              <input
                value={formData.cta_link}
                onChange={e => setFormData({...formData, cta_link: e.target.value})}
                placeholder="e.g. /#menu"
                className="admin-form__input"
              />
            </div>
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">PROMOTION IMAGE</label>
            <ImageUpload 
              value={formData.image_url} 
              onChange={(url) => setFormData({...formData, image_url: url})} 
            />
          </div>

          <label className="admin-form__toggle admin-form__toggle--boxed">
            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
            <span className="admin-form__toggle-dot" />
            Active (Visible to users)
          </label>

          <button type="submit" disabled={saving} className="admin-btn admin-btn--primary admin-btn--full">
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : editingId ? "Update Promotion" : "Create Promotion"}</span>
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
