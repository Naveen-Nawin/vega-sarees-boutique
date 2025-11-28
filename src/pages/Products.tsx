// src/pages/Products.tsx
import { useEffect, useState } from "react";
import { Range } from "react-range";
import CategoryCards from "../components/CategoryCards";
import { useShop } from "../context/ShopContext";
import { supabase } from "../lib/supabaseClient";

// ---- Type from Supabase row ----
type ProductRow = {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  discount?: number | null;
  size?: string | null;
  fabric?: string | null;
  colour?: string | null;
  occasion?: string | null;
  tag?: string | null;
  images?: string[] | null;
};

// ---- Normalized type we use in UI ----
type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discount: number;
  size: string;
  fabric: string;
  colour: string;
  occasion: string;
  tag: string;
  images: string[];
};

export default function Products() {
  const {
    productFilters,
    updateProductFilters,
    resetProductFilters,
  } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🔥 FETCH PRODUCTS FROM SUPABASE
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setApiError(null);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id,name,price,old_price,discount,size,fabric,colour,occasion,tag,images"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setApiError("Unable to load products right now.");
        setLoading(false);
        return;
      }

      const normalized: Product[] =
        (data as ProductRow[] | null)?.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          oldPrice: p.old_price ? Number(p.old_price) : undefined,
          discount: p.discount ?? 0,
          size: p.size ?? "",
          fabric: p.fabric ?? "",
          colour: p.colour ?? "",
          occasion: p.occasion ?? "",
          tag: p.tag ?? "",
          images: p.images ?? [],
        })) ?? [];

      setProducts(normalized);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // 🔍 FILTER + SORT LOGIC (local, on fetched data)
  const filteredProducts = products
    .filter((p) => {
      return (
        p.price >= productFilters.priceRange[0] &&
        p.price <= productFilters.priceRange[1] &&
        p.discount >= productFilters.discount &&
        (!productFilters.size || p.size === productFilters.size) &&
        (!productFilters.fabric || p.fabric === productFilters.fabric) &&
        (!productFilters.colour || p.colour === productFilters.colour) &&
        (!productFilters.occasion || p.occasion === productFilters.occasion)
      );
    })
    .sort((a, b) => {
      if (productFilters.sortBy === "priceLow") return a.price - b.price;
      if (productFilters.sortBy === "priceHigh") return b.price - a.price;
      return 0; // "new" – already ordered by created_at desc at fetch time
    });

  // Smooth scroll to top when filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productFilters]);

  return (
    <div id="products" className="bg-[#fffaf7] py-16 scroll-mt-20">
      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-10 px-6 md:px-10 rounded-xl shadow-sm bg-[#fefaf6] border border-[#e0d7cf]">
        {/* ============== DESKTOP SIDEBAR FILTERS ============== */}
        <aside className="hidden lg:block w-full lg:w-1/4 border-r border-[#e6ddd2] pr-6 py-10">
          <FiltersPanel
            productFilters={productFilters}
            updateProductFilters={updateProductFilters}
            resetProductFilters={resetProductFilters}
          />
        </aside>

        {/* ============== MAIN SECTION ============== */}
        <main className="w-full lg:w-3/4 py-10">
          {/* TITLE + SORT */}
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-2xl font-playfair text-gray-800">
              Short Tops For Women
            </h2>

            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-[#8b1538] text-white text-xs shadow-md active:scale-95 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h18M6 8h12M9 12h6m-3 4h0"
                  />
                </svg>
                Filters
              </button>

              {/* Sort dropdown */}
              <select
                value={
                  productFilters.sortBy === "priceLow"
                    ? "low"
                    : productFilters.sortBy === "priceHigh"
                    ? "high"
                    : "new"
                }
                onChange={(e) =>
                  updateProductFilters({
                    sortBy:
                      e.target.value === "low"
                        ? "priceLow"
                        : e.target.value === "high"
                        ? "priceHigh"
                        : "new",
                  })
                }
                className="border rounded-md px-2 py-1 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b1538]/40"
              >
                <option value="new">New Arrivals</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS */}
          <div className="mb-6 flex flex-wrap gap-3 px-2">
            {productFilters.discount !== 0 && (
              <Chip
                label={`${productFilters.discount}%+ Off`}
                onClear={() => updateProductFilters({ discount: 0 })}
              />
            )}
            {productFilters.size && (
              <Chip
                label={`Size: ${productFilters.size}`}
                onClear={() => updateProductFilters({ size: "" })}
              />
            )}
            {productFilters.fabric && (
              <Chip
                label={`Fabric: ${productFilters.fabric}`}
                onClear={() => updateProductFilters({ fabric: "" })}
              />
            )}
            {productFilters.colour && (
              <Chip
                label={`Colour: ${productFilters.colour}`}
                onClear={() => updateProductFilters({ colour: "" })}
              />
            )}
            {productFilters.occasion && (
              <Chip
                label={`Occasion: ${productFilters.occasion}`}
                onClear={() => updateProductFilters({ occasion: "" })}
              />
            )}
            {(productFilters.discount ||
              productFilters.size ||
              productFilters.fabric ||
              productFilters.colour ||
              productFilters.occasion) && (
              <button
                onClick={resetProductFilters}
                className="text-xs text-gray-500 underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* API ERROR STATE */}
          {apiError && (
            <p className="text-center text-red-500 mb-6">{apiError}</p>
          )}

          {/* LOADING / PRODUCTS GRID */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-[420px] bg-gray-200 rounded-xl"
                ></div>
              ))}
            </div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-2">
              {filteredProducts.map((p, index) => (
                <div
                  key={p.id}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="animate-fadeInUp"
                >
                  <CategoryCards
                    id={p.id}
                    name={p.name}
                    price={p.price}
                    oldPrice={p.oldPrice}
                    image={p.images[0] ?? ""}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 col-span-full py-20">
              No products match your filters.
            </p>
          )}
        </main>
      </div>

      {/* ============== MOBILE FILTER DRAWER ============== */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-[82%] max-w-sm bg-white shadow-2xl z-50 animate-slideInRight flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#8b1538]">
                Filters
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#fbe9ef] flex items-center justify-center text-[#8b1538] font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FiltersPanel
                productFilters={productFilters}
                updateProductFilters={updateProductFilters}
                resetProductFilters={resetProductFilters}
                isMobile
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =============== FILTERS PANEL COMPONENT (shared for desktop + mobile) =============== */
type FiltersPanelProps = {
  productFilters: ReturnType<typeof useShop>["productFilters"];
  updateProductFilters: (patch: Partial<typeof productFilters>) => void;
  resetProductFilters: () => void;
  isMobile?: boolean;
};

function FiltersPanel({
  productFilters,
  updateProductFilters,
  resetProductFilters,
  isMobile,
}: FiltersPanelProps) {
  return (
    <div className={isMobile ? "" : ""}>
      <h3 className="font-playfair text-lg font-semibold mb-4 text-[#8b1538]">
        FILTER BY
      </h3>

      <button
        onClick={resetProductFilters}
        className="text-sm text-gray-500 underline mb-6"
      >
        Reset All
      </button>

      {/* Price */}
      <details className="border-t border-gray-200 py-3" open>
        <summary className="cursor-pointer flex justify-between items-center text-gray-800">
          Price Range
          <span className="text-[#8b1538]">▼</span>
        </summary>

        <div className="mt-3 space-y-3">
          <div className="flex justify-between text-xs text-gray-600">
            <span>₹{productFilters.priceRange[0]}</span>
            <span>₹{productFilters.priceRange[1]}</span>
          </div>
          <Range
            step={500}
            min={0}
            max={60000}
            values={productFilters.priceRange}
            onChange={(values) =>
              updateProductFilters({
                priceRange: values as [number, number],
              })
            }
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-1.5 bg-[#f3d9da] rounded-full"
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="h-4 w-4 bg-[#8b1538] rounded-full shadow-md"
              />
            )}
          />
        </div>
      </details>

      {/* Discount */}
      <details className="border-t border-gray-200 py-3">
        <summary className="cursor-pointer flex justify-between text-gray-800">
          Discount
          <span className="text-[#8b1538]">▼</span>
        </summary>

        <div className="mt-3 space-y-2 text-sm">
          {[5, 10, 20, 30, 50].map((d) => (
            <label key={d} className="flex items-center gap-3">
              <input
                type="radio"
                checked={productFilters.discount === d}
                onChange={() => updateProductFilters({ discount: d })}
                className="accent-[#8b1538]"
              />
              <span>{d}% & above</span>
            </label>
          ))}
        </div>
      </details>

      {/* Size */}
      <details className="border-t border-gray-200 py-3">
        <summary className="cursor-pointer flex justify-between text-gray-800">
          Size
          <span className="text-[#8b1538]">▼</span>
        </summary>

        <div className="mt-3 flex flex-wrap gap-2">
          {["S", "M", "L", "XL"].map((s) => (
            <button
              key={s}
              onClick={() =>
                updateProductFilters({
                  size: productFilters.size === s ? "" : s,
                })
              }
              className={`border px-3 py-1 rounded-md text-sm ${
                productFilters.size === s
                  ? "bg-[#8b1538] text-white border-[#8b1538]"
                  : "text-gray-700 hover:border-[#8b1538]"
              } transition-all duration-300`}
            >
              {s}
            </button>
          ))}
        </div>
      </details>

      {/* Fabric */}
      <details className="border-t border-gray-200 py-3">
        <summary className="cursor-pointer flex justify-between text-gray-800">
          Fabric
          <span className="text-[#8b1538]">▼</span>
        </summary>

        <div className="mt-3 space-y-2 text-sm">
          {["Cotton", "Silk", "Viscose"].map((f) => (
            <label key={f} className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={productFilters.fabric === f}
                onChange={() =>
                  updateProductFilters({
                    fabric: productFilters.fabric === f ? "" : f,
                  })
                }
                className="accent-[#8b1538]"
              />
              <span>{f}</span>
            </label>
          ))}
        </div>
      </details>

      {/* Colour */}
      <details className="border-t border-gray-200 py-3">
        <summary className="cursor-pointer flex justify-between text-gray-800">
          Colour
          <span className="text-[#8b1538]">▼</span>
        </summary>

        <div className="mt-3 space-y-2 text-sm">
          {["Black", "Blue", "Orange"].map((c) => (
            <label key={c} className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={productFilters.colour === c}
                onChange={() =>
                  updateProductFilters({
                    colour: productFilters.colour === c ? "" : c,
                  })
                }
                className="accent-[#8b1538]"
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </details>

      {/* Occasion */}
      <details className="border-t border-gray-200 py-3">
        <summary className="cursor-pointer flex justify-between text-gray-800">
          Occasion
          <span className="text-[#8b1538]">▼</span>
        </summary>

        <div className="mt-3 space-y-2 text-sm">
          {["Casual", "Office", "Festive"].map((o) => (
            <label key={o} className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={productFilters.occasion === o}
                onChange={() =>
                  updateProductFilters({
                    occasion: productFilters.occasion === o ? "" : o,
                  })
                }
                className="accent-[#8b1538]"
              />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}

/* =============== CHIP COMPONENT =============== */
function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="px-3 py-1 bg-[#f7e8ed] text-[#8b1538] rounded-full text-xs flex items-center gap-2">
      {label}
      <button onClick={onClear} className="font-bold text-sm">
        ×
      </button>
    </span>
  );
}
