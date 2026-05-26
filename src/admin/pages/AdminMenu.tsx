import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit2, CheckCircle2, X, Search, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminModal } from "@/admin/components/AdminModal";
import { ImageUpload } from "@/admin/components/ImageUpload";

const DEFAULT_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  image_url: "",
  is_available: true,
  veg: false,
  spice_level: 1,
  rating: 5,
  is_bestseller: false,
  is_featured: false,
};

export function AdminMenu() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    const [menuRes, catRes] = await Promise.all([
      supabase.from("menu_items_site2").select("*").order("name"),
      supabase.from("categories_site2").select("*").order("order_index")
    ]);
    if (menuRes.data) setItems(menuRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        description: item.description || "",
        price: item.price?.toString() || "",
        category: item.category || item.section_id || "",
        image_url: item.image_url || item.image || "",
        is_available: item.is_available ?? true,
        veg: item.veg ?? false,
        spice_level: item.spice_level ?? 1,
        rating: item.rating ?? 5,
        is_bestseller: item.is_bestseller ?? false,
        is_featured: item.is_featured ?? item.featured ?? false,
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
      name: formData.name,
      description: formData.description,
      category: formData.category,
      is_available: formData.is_available,
      veg: formData.veg,
      is_bestseller: formData.is_bestseller,
      is_featured: formData.is_featured,
      image_url: formData.image_url,
      price: parseFloat(formData.price),
      spice_level: parseInt(formData.spice_level.toString()),
      rating: parseFloat(formData.rating.toString()),
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("menu_items_site2").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Item updated");
      } else {
        const { error } = await supabase.from("menu_items_site2").insert([payload]);
        if (error) throw error;
        toast.success("Item created");
      }
      setIsModalOpen(false);
      fetchMenu();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item completely?")) return;
    const { error } = await supabase.from("menu_items_site2").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted successfully");
      setItems(items.filter(i => i.id !== id));
    }
  };

  const filteredItems = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "all" || i.category === activeCategory || i.section_id === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="admin-page">
      {/* Category Tabs - matching reference design horizontal pill layout */}
      <div className="admin-category-tabs">
        <button
          onClick={() => setActiveCategory("all")}
          className={`admin-category-tab ${activeCategory === "all" ? "admin-category-tab--active" : ""}`}
        >
          ALL DISHES
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`admin-category-tab ${activeCategory === cat.id ? "admin-category-tab--active" : ""}`}
          >
            {cat.name?.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search + Add Button */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search className="admin-search__icon" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search__input"
          />
        </div>
        <button onClick={() => openModal()} className="admin-btn admin-btn--primary">
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
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
                  <th>ITEM</th>
                  <th>PRICE</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-table__item-cell">
                        <div className="admin-table__item-img">
                          {(item.image_url || item.image) ? (
                            <img src={item.image_url || item.image} alt={item.name} />
                          ) : (
                            <div className="admin-table__item-img-placeholder">
                              <X className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="admin-table__item-name">{item.name}</div>
                          <div className="admin-table__item-category">
                            {categories.find(c => c.id === item.category || c.id === item.section_id)?.name || "Uncategorized"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-table__price">KD {item.price?.toFixed(3) || "0.000"}</span>
                    </td>
                    <td>
                      {item.is_available ? (
                        <span className="admin-badge admin-badge--success">
                          <span className="admin-badge__dot" />
                          IN STOCK
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge--danger">
                          <span className="admin-badge__dot" />
                          SOLD OUT
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
                    <td colSpan={4}>
                      <div className="admin-empty">
                        <p>No menu items found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Item" : "Add New Item"}
        maxWidth="560px"
      >
        <form onSubmit={handleSave} className="admin-form">
          <div className="admin-form__group">
            <label className="admin-form__label">ITEM NAME</label>
            <input
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Chicken Inasal"
              className="admin-form__input"
            />
          </div>

          <div className="admin-form__row">
            <div className="admin-form__group">
              <label className="admin-form__label">PRICE (KD)</label>
              <input
                type="number"
                step="0.001"
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="admin-form__input"
              />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">RATING (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})}
                className="admin-form__input"
              />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">CATEGORY</label>
              <select
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="admin-form__select"
              >
                <option value="" disabled>Select...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the dish..."
              rows={3}
              className="admin-form__textarea"
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">ITEM IMAGE</label>
            <ImageUpload 
              value={formData.image_url} 
              onChange={(url) => setFormData({...formData, image_url: url})} 
            />
          </div>

          <div className="admin-form__toggles">
            <label className="admin-form__toggle">
              <input type="checkbox" checked={formData.is_available} onChange={e => setFormData({...formData, is_available: e.target.checked})} />
              <span className="admin-form__toggle-dot" />
              Available
            </label>
            <label className="admin-form__toggle">
              <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
              <span className="admin-form__toggle-dot" />
              Featured
            </label>
            <label className="admin-form__toggle">
              <input type="checkbox" checked={formData.veg} onChange={e => setFormData({...formData, veg: e.target.checked})} />
              <span className="admin-form__toggle-dot" />
              Vegetarian
            </label>
          </div>

          <button type="submit" disabled={saving} className="admin-btn admin-btn--primary admin-btn--full">
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : editingId ? "Update Item" : "Create Item"}</span>
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
