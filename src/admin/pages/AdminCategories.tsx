import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit2, Search, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminModal } from "@/admin/components/AdminModal";

const DEFAULT_FORM = {
  name: "",
  slug: "",
  icon: "",
  order_index: 0,
};

export function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("categories_site2").select("*").order("order_index");
    if (data) setCategories(data);
    if (error) toast.error(error.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        slug: item.slug || generateSlug(item.name),
        icon: item.icon || "",
        order_index: item.order_index ?? 0,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", slug: "", icon: "", order_index: categories.length });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      icon: formData.icon,
      order_index: parseInt(formData.order_index.toString()),
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("categories_site2").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Category updated");
      } else {
        const { error } = await supabase.from("categories_site2").insert([payload]);
        if (error) throw error;
        toast.success("Category created");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category completely? Associated items may lose their category.")) return;
    const { error } = await supabase.from("categories_site2").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted successfully");
      setCategories(categories.filter(i => i.id !== id));
    }
  };

  const filteredCategories = categories.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">
      {/* Search + Add */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search className="admin-search__icon" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search__input"
          />
        </div>
        <button onClick={() => openModal()} className="admin-btn admin-btn--primary">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
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
                  <th>ICON</th>
                  <th>NAME</th>
                  <th>SLUG</th>
                  <th>ORDER</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="admin-table__emoji">{item.icon || "📁"}</span>
                    </td>
                    <td>
                      <span className="admin-table__item-name">{item.name}</span>
                    </td>
                    <td>
                      <span className="admin-table__slug">{item.slug || generateSlug(item.name)}</span>
                    </td>
                    <td>
                      <span className="admin-table__order">{item.order_index}</span>
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
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="admin-empty">
                        <p>No categories found.</p>
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
        title={editingId ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSave} className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">CATEGORY NAME</label>
            <input
              required
              value={formData.name}
              onChange={e => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: editingId ? formData.slug : generateSlug(e.target.value),
                });
              }}
              placeholder="e.g. Main Courses"
              className="admin-form__input"
            />
          </div>

          <div className="admin-form__row">
            <div className="admin-form__group" style={{ flex: 2 }}>
              <label className="admin-form__label">SLUG (URL FRIENDLY)</label>
              <input
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                placeholder="e.g. main-courses"
                className="admin-form__input"
              />
            </div>
            <div className="admin-form__group" style={{ flex: 1 }}>
              <label className="admin-form__label">ICON (EMOJI)</label>
              <input
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
                placeholder="🍽️"
                className="admin-form__input"
              />
            </div>
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">ORDER INDEX</label>
            <input
              type="number"
              required
              value={formData.order_index}
              onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})}
              className="admin-form__input"
            />
          </div>

          <button type="submit" disabled={saving} className="admin-btn admin-btn--primary admin-btn--full">
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}</span>
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
