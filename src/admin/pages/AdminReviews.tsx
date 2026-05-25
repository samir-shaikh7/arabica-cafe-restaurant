import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit2, CheckCircle2, X, Search, Star, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminModal } from "@/admin/components/AdminModal";
import { ImageUpload } from "@/admin/components/ImageUpload";

const DEFAULT_FORM = {
  author_name: "",
  author_image: "",
  rating: 5,
  content: "",
  is_active: true,
};

export function AdminReviews() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reviews_site2").select("*").order("created_at", { ascending: false });
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
        author_name: item.author_name,
        author_image: item.author_image || "",
        rating: item.rating ?? 5,
        content: item.content || "",
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
      author_name: formData.author_name,
      author_image: formData.author_image,
      content: formData.content,
      is_active: formData.is_active,
      rating: parseFloat(formData.rating.toString()),
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("reviews_site2").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Review updated");
      } else {
        const { error } = await supabase.from("reviews_site2").insert([payload]);
        if (error) throw error;
        toast.success("Review added");
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
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews_site2").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted successfully");
      setItems(items.filter(i => i.id !== id));
    }
  };

  const filteredItems = items.filter(i => 
    i.author_name?.toLowerCase().includes(search.toLowerCase()) || 
    i.content?.toLowerCase().includes(search.toLowerCase())
  );

  // Star rating component
  const StarRating = ({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) => (
    <div className="admin-star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`admin-star-rating__star ${star <= rating ? "admin-star-rating__star--filled" : ""}`}
        >
          <Star className="h-6 w-6" />
        </button>
      ))}
    </div>
  );

  return (
    <div className="admin-page">
      {/* Search + Add */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search className="admin-search__icon" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search__input"
          />
        </div>
        <button onClick={() => openModal()} className="admin-btn admin-btn--primary">
          <Plus className="h-4 w-4" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-inline">
            <div className="admin-loading-spinner" />
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>REVIEW TEXT</th>
                  <th>RATING</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-table__customer-cell">
                        {item.author_image ? (
                          <img src={item.author_image} alt={item.author_name} className="admin-table__avatar" />
                        ) : (
                          <div className="admin-table__avatar-placeholder">
                            {item.author_name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span className="admin-table__customer-name">{item.author_name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-table__review-text">{item.content}</div>
                    </td>
                    <td>
                      <div className="admin-table__rating">
                        <Star className="h-4 w-4" style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                        <span>{item.rating}</span>
                      </div>
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
                          HIDDEN
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
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="admin-empty">
                        <p>No reviews found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Review" : "Add New Review"}
      >
        <form onSubmit={handleSave} className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">CUSTOMER NAME</label>
            <input
              required
              value={formData.author_name}
              onChange={e => setFormData({...formData, author_name: e.target.value})}
              placeholder="e.g. Liza M."
              className="admin-form__input"
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">RATING (1-5)</label>
            <StarRating rating={formData.rating} onChange={(r) => setFormData({...formData, rating: r})} />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">REVIEW TEXT</label>
            <textarea
              required
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              placeholder="Write the customer's feedback..."
              rows={4}
              className="admin-form__textarea"
            />
          </div>

          <label className="admin-form__toggle admin-form__toggle--boxed">
            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
            <span className="admin-form__toggle-dot" />
            Display on Website
          </label>

          <button type="submit" disabled={saving} className="admin-btn admin-btn--primary admin-btn--full">
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : editingId ? "Update Review" : "Save Review"}</span>
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
