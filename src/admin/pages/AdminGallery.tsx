import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit2, Image as ImageIcon, Search, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminModal } from "@/admin/components/AdminModal";
import { ImageUpload } from "@/admin/components/ImageUpload";

const DEFAULT_FORM = {
  title: "",
  image_url: "",
  order_index: 0,
};

export function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("gallery_site2").select("*").order("order_index");
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
        title: item.title || "",
        image_url: item.image_url || "",
        order_index: item.order_index ?? 0,
      });
    } else {
      setEditingId(null);
      setFormData({ ...DEFAULT_FORM, order_index: items.length });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error("Please upload an image");
      return;
    }

    setSaving(true);
    const payload = {
      ...formData,
      order_index: parseInt(formData.order_index.toString()),
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("gallery_site2").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Image updated");
      } else {
        const { error } = await supabase.from("gallery_site2").insert([payload]);
        if (error) throw error;
        toast.success("Image added to gallery");
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
    if (!confirm("Delete this image from gallery?")) return;
    const { error } = await supabase.from("gallery_site2").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted successfully");
      setItems(items.filter(i => i.id !== id));
    }
  };

  const filteredItems = items.filter(i => 
    !search || (i.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      {/* Search + Add */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search className="admin-search__icon" />
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search__input"
          />
        </div>
        <button onClick={() => openModal()} className="admin-btn admin-btn--primary">
          <Plus className="h-4 w-4" />
          <span>Add Image</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="admin-loading-inline">
          <div className="admin-loading-spinner" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="admin-empty-state">
          <ImageIcon className="admin-empty-state__icon" />
          <h3>No images</h3>
          <p>Upload images to show in your gallery section.</p>
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="admin-gallery-card">
              <div className="admin-gallery-card__img">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title || "Gallery"} />
                ) : (
                  <ImageIcon className="admin-gallery-card__placeholder" />
                )}
                <div className="admin-gallery-card__overlay">
                  <button onClick={() => openModal(item)} className="admin-gallery-card__btn admin-gallery-card__btn--edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="admin-gallery-card__btn admin-gallery-card__btn--delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Image" : "Add to Gallery"}
      >
        <form onSubmit={handleSave} className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">TITLE (OPTIONAL)</label>
            <input
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Fresh Inasal Grilling"
              className="admin-form__input"
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">GALLERY IMAGE</label>
            <ImageUpload 
              value={formData.image_url} 
              onChange={(url) => setFormData({...formData, image_url: url})} 
            />
          </div>

          <button type="submit" disabled={saving} className="admin-btn admin-btn--primary admin-btn--full">
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : editingId ? "Update Image" : "Add to Gallery"}</span>
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
