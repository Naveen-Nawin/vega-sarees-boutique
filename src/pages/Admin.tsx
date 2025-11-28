// src/pages/Admin.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

type DbProduct = {
  id: number;
  name: string;
  price: number;
  old_price: number | null;
  discount: number | null;
  size: string | null;
  fabric: string | null;
  colour: string | null;
  occasion: string | null;
  tag: string | null;
  description: string | null;
  images: string[] | null;
  created_at?: string;
};

const Admin: React.FC = () => {
  // ---------- FORM STATE ----------
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [size, setSize] = useState("");
  const [fabric, setFabric] = useState("");
  const [colour, setColour] = useState("");
  const [occasion, setOccasion] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [imagesCsv, setImagesCsv] = useState("");

  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ---------- LIST / UI STATE ----------
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");

  // ---------- RESET DATABASE (DELETE ALL + RESET ID) ----------
  const resetDatabase = async () => {
    const confirmReset = confirm(
      "⚠ Are you sure?\n\nThis will DELETE ALL products and RESET ID to 1."
    );
    if (!confirmReset) return;

    const { error } = await supabase.rpc("reset_products_table");

    if (error) {
      console.error("Reset error:", error);
      alert("Failed to reset database!");
      return;
    }

    alert("🔥 Database reset successfully!");
    loadProducts();
  };

  // ---------- LOAD PRODUCTS ----------
  const loadProducts = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load products error:", error);
    } else {
      setProducts((data as DbProduct[]) || []);
    }
    setLoadingList(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ---------- RESET FORM ----------
  const resetForm = () => {
    setName("");
    setPrice("");
    setOldPrice("");
    setDiscount("");
    setSize("");
    setFabric("");
    setColour("");
    setOccasion("");
    setTag("");
    setDescription("");
    setImagesCsv("");
    setEditingId(null);
  };

  // ---------- DERIVED VALUES ----------
  const imagesPreview = useMemo(
    () =>
      imagesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [imagesCsv]
  );

  const allTags = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => (p.tag || "").trim())
            .filter((t) => t.length > 0)
        )
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.tag || "").toLowerCase().includes(q);

      const matchesTag =
        tagFilter === "all" || (p.tag || "").toLowerCase() === tagFilter;

      return matchesSearch && matchesTag;
    });
  }, [products, search, tagFilter]);

  // ---------- SUBMIT (ADD / UPDATE) ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price.trim()) {
      alert("Name and Price are required");
      return;
    }

    const priceNum = Number(price);
    const oldPriceNum = oldPrice ? Number(oldPrice) : null;
    const discountNum = discount ? Number(discount) : 0;

    if (Number.isNaN(priceNum)) {
      alert("Price must be numeric");
      return;
    }

    const imagesArray = imagesCsv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      price: priceNum,
      old_price: oldPriceNum,
      discount: discountNum,
      size: size || null,
      fabric: fabric || null,
      colour: colour || null,
      occasion: occasion || null,
      tag: tag || null,
      description: description || null,
      images: imagesArray,
    };

    setSaving(true);
    let error = null;

    if (editingId) {
      const { error: updateErr } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);

      error = updateErr;
    } else {
      const { error: insertErr } = await supabase
        .from("products")
        .insert([payload]);

      error = insertErr;
    }

    setSaving(false);

    if (error) {
      console.error("Supabase save error:", error);
      alert("Failed to save product");
      return;
    }

    alert("Product saved successfully!");
    resetForm();
    loadProducts();
  };

  // ---------- DELETE ----------
  const deleteProduct = async (id: number) => {
    if (!confirm("Delete product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("Delete failed");
    } else {
      loadProducts();
    }
  };

  // ---------- EDIT ----------
  const editProduct = (p: DbProduct) => {
    setEditingId(p.id);
    setName(p.name || "");
    setPrice(String(p.price ?? ""));
    setOldPrice(p.old_price != null ? String(p.old_price) : "");
    setDiscount(p.discount != null ? String(p.discount) : "");
    setSize(p.size || "");
    setFabric(p.fabric || "");
    setColour(p.colour || "");
    setOccasion(p.occasion || "");
    setTag(p.tag || "");
    setDescription(p.description || "");
    setImagesCsv((p.images || []).join(", "));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===================================================================
  //                               UI
  // ===================================================================
  return (
    <div className="min-h-screen bg-[#f5f2ee] px-4 py-6 md:px-8 lg:px-12">
      {/* TOP BAR / TITLE */}
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3a2e2e]">Admin Panel</h1>
          <p className="text-sm text-gray-500">
            Manage your product catalog, images and pricing.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* 🔥 RESET BUTTON */}
          <button
            onClick={resetDatabase}
            className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold shadow hover:bg-red-700 active:scale-95 transition"
          >
            🔥 Reset Products
          </button>

          {/* Small stats */}
          <div className="rounded-xl bg-white px-4 py-2 shadow-sm border border-[#ecd9c4]">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Total Products
            </p>
            <p className="text-xl font-semibold text-[#8b1538]">
              {products.length}
            </p>
          </div>
        </div>
      </header>

      {/* GRID: LEFT FORM / RIGHT LIST */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
        {/* ===================== FORM CARD ===================== */}
        <section className="bg-white rounded-2xl shadow-md border border-[#ecd9c4] p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#3a2e2e]">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              {editingId && (
                <p className="text-xs text-gray-500">
                  Editing product ID{" "}
                  <span className="font-semibold">{editingId}</span>.{" "}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="underline text-[#8b1538] ml-1"
                  >
                    Cancel edit
                  </button>
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name *"
              className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
            />

            {/* Price / Old Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price (₹) *"
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
              />
              <input
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="Old Price (₹)"
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
              />
            </div>

            {/* Discount / Tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Discount %"
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
              />
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Tag (e.g., New Arrivals)"
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
              />
            </div>

            {/* Size / Fabric */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Size (e.g., S / M / L)"
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
              />
              <input
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="Fabric (e.g., Cotton, Silk)"
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
              />
            </div>

            {/* Colour / Occasion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                placeholder="Colour"
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
              />
              <input
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Occasion (Casual / Office / Festive)"
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm"
              />
            </div>

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short Description"
              className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm min-h-[80px]"
            />

            {/* Images Textarea */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Image URLs (comma separated)
              </label>
              <textarea
                value={imagesCsv}
                onChange={(e) => setImagesCsv(e.target.value)}
                placeholder="https://... , https://..."
                className="border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] p-3 w-full rounded-lg text-sm min-h-[80px]"
              />
              {imagesPreview.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {imagesPreview.map((url, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-20 rounded-md overflow-hidden border border-[#e2d5c7] bg-gray-50"
                    >
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#8b1538] text-white px-6 py-2.5 rounded-full text-sm font-medium shadow hover:shadow-md active:scale-[0.98] disabled:opacity-70"
              >
                {saving ? "Saving…" : editingId ? "Update Product" : "Add Product"}
              </button>

              {!saving && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-gray-500 underline"
                >
                  Clear Form
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ===================== PRODUCTS LIST ===================== */}
        <section className="space-y-4">
          {/* Search / Filters */}
          <div className="bg-white rounded-2xl shadow-md border border-[#ecd9c4] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or tag…"
                  className="w-full border border-[#e2d5c7] focus:border-[#8b1538] focus:ring-1 focus:ring-[#8b1538] rounded-full px-4 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Tag Filter
                </span>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="border border-[#e2d5c7] rounded-full px-3 py-1.5 text-xs"
                >
                  <option value="all">All</option>
                  {allTags.map((t) => (
                    <option key={t} value={t.toLowerCase()}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {loadingList && (
              <div className="text-center text-sm text-gray-500 py-4">
                Loading products…
              </div>
            )}

            {!loadingList && filteredProducts.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-10 bg-white rounded-2xl border border-dashed border-[#e2d5c7]">
                No products found with current filters.
              </div>
            )}

            {!loadingList &&
              filteredProducts.map((p, index) => {
                const cover = (p.images && p.images[0]) || "";
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-4 rounded-2xl bg-white border px-4 py-3 shadow-sm ${
                      editingId === p.id
                        ? "border-[#8b1538] ring-1 ring-[#8b1538]/40"
                        : "border-[#ecd9c4]"
                    }`}
                  >
                    {/* Cover image */}
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-100 border border-[#e2d5c7] flex-shrink-0">
                      {cover ? (
                        <img
                          src={cover}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm text-[#3a2e2e] truncate max-w-[240px]">
                          #{index + 1} • ID: {p.id} · {p.name}
                        </p>
                        {p.tag && (
                          <span className="px-2 py-0.5 rounded-full bg-[#fcefe8] text-[10px] uppercase tracking-wide text-[#8b1538]">
                            {p.tag}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span className="font-semibold text-[#1a1a1a]">
                          ₹{p.price}
                        </span>
                        {p.old_price && (
                          <span className="line-through text-gray-400">
                            ₹{p.old_price}
                          </span>
                        )}
                        {p.discount && p.discount > 0 && (
                          <span className="text-[#d32f2f] font-semibold">
                            {p.discount}% OFF
                          </span>
                        )}
                        {p.size && <span>Size: {p.size}</span>}
                        {p.fabric && <span>{p.fabric}</span>}
                      </div>

                      {p.created_at && (
                        <p className="mt-1 text-[11px] text-gray-400">
                          Added: {new Date(p.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => editProduct(p)}
                        className="px-3 py-1 rounded-full text-xs bg-[#f6e4ec] text-[#8b1538] font-medium hover:bg-[#f2d3e2]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="px-3 py-1 rounded-full text-xs bg-red-50 text-red-700 font-medium hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
