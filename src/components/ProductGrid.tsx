import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  oldPrice?: number; // for compatibility
  discount?: number | null;
  tag?: string | null;
  images: string[];
  created_at?: string;
};

export default function ProductGrid({ limit }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Fetch ALL PRODUCTS – unlimited, ordered
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading products:", error);
        setLoading(false);
        return;
      }

      const safeProducts: Product[] = (data || []).map((p: any) => ({
        ...p,
        oldPrice:
          typeof p.old_price === "number" ? p.old_price : Number(p.old_price) || undefined,
        images: Array.isArray(p.images) ? p.images : [],
      }));

      setProducts(safeProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const paginatedProducts = products.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pro pagination logic (with "...")
  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }

    return pages;
  };

  // Helper: decide badges for each product
  const getBadges = (p: Product): string[] => {
    const badges: string[] = [];

    const isNewTag = (p.tag || "").toLowerCase().includes("new");
    const discount = (p.discount ?? 0) as number;

    if (isNewTag) badges.push("New");
    if (discount >= 40) badges.push("Best Offer");
    else if (discount >= 20) badges.push(`${discount}% OFF`);

    // created_at based "New Arrival"
    if (p.created_at) {
      const created = new Date(p.created_at);
      const daysDiff =
        (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff <= 7 && !badges.includes("New")) {
        badges.push("New Arrival");
      }
    }

    return badges;
  };

  return (
    <section className="max-w-7xl mx-auto py-10 px-6">
      <h2 className="font-['Playfair_Display'] text-3xl text-center mb-3 text-[#8b1538]">
        Featured Products
      </h2>
      <p className="text-center text-sm text-gray-600 mb-10">
        Curated handpicked sarees & tops from Vega Sarees Boutique.
      </p>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-[320px] rounded-xl"
            ></div>
          ))}
        </div>
      ) : (
        <>
          {/* PRODUCTS GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {paginatedProducts.map((p) => {
              const badges = getBadges(p);
              const imageSrc = p.images[0] || "/placeholder.png";

              return (
                <Link
                  to={`/product/${p.id}`}
                  key={p.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  {/* Image wrapper with hover zoom */}
                  <div className="relative w-full h-72 overflow-hidden">
                    <img
                      loading="lazy"
                      src={imageSrc}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={p.name}
                    />

                    {/* Gradient overlay bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {badges.map((b) => (
                        <span
                          key={b}
                          className="px-2 py-0.5 text-[10px] uppercase tracking-wide rounded-full bg-[#fef4f7] text-[#8b1538] font-semibold shadow-sm"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 text-center">
                    <h4 className="font-medium text-sm text-gray-800 line-clamp-2 min-h-[40px]">
                      {p.name}
                    </h4>

                    <div className="mt-2 flex items-center justify-center gap-2">
                      <p className="text-[#8b1538] font-semibold text-base">
                        ₹{p.price}
                      </p>
                      {p.oldPrice && (
                        <span className="text-gray-400 line-through text-xs">
                          ₹{p.oldPrice}
                        </span>
                      )}
                    </div>

                    {p.discount ? (
                      <p className="text-[11px] text-green-700 mt-1">
                        Save {p.discount}% today
                      </p>
                    ) : null}

                    {/* subtle bottom bar on hover */}
                    <div className="mt-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#8b1538]">
                      <span className="px-3 py-1 rounded-full border border-[#f0cdda] bg-[#fef4f7]">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {/* First */}
              {page !== 1 && (
                <button
                  onClick={() => changePage(1)}
                  className="px-3 py-2 text-xs md:text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  « First
                </button>
              )}

              {/* Prev */}
              {page > 1 && (
                <button
                  onClick={() => changePage(page - 1)}
                  className="px-3 py-2 text-xs md:text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  ‹ Prev
                </button>
              )}

              {/* Page numbers with dots */}
              {getPages().map((pItem, i) =>
                pItem === "..." ? (
                  <span key={i} className="px-2 md:px-3 py-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => changePage(pItem as number)}
                    className={`px-3 py-2 text-xs md:text-sm rounded-lg ${
                      pItem === page
                        ? "bg-[#8b1538] text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pItem}
                  </button>
                )
              )}

              {/* Next */}
              {page < totalPages && (
                <button
                  onClick={() => changePage(page + 1)}
                  className="px-3 py-2 text-xs md:text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Next ›
                </button>
              )}

              {/* Last */}
              {page !== totalPages && (
                <button
                  onClick={() => changePage(totalPages)}
                  className="px-3 py-2 text-xs md:text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Last »
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
