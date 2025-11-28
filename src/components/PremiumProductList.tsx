import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function PremiumProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12); // default show 12 items

  // Fetch products from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false }); // latest → top

      if (!error) setProducts(data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <section className="max-w-[1300px] mx-auto px-4 mt-14">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#8b1538]">All Products</h2>
      </div>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-[350px] rounded-xl"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleProducts.map((p, index) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              style={{ animationDelay: `${index * 50}ms` }}
              className="block bg-white rounded-xl shadow-xl overflow-hidden 
                         hover:shadow-2xl hover:scale-[1.03] transition-all duration-300
                         animate-fadeInUp"
            >
              <img
                src={p.images?.[0] || "/placeholder.png"}
                alt={p.name}
                className="w-full h-72 object-cover"
              />

              <div className="p-4">
                {/* NAME */}
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                  {p.name}
                </h3>

                {/* PRICE ROW */}
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-[#8b1538] font-bold text-lg">
                    ₹{p.price}
                  </p>

                  {p.old_price && (
                    <p className="line-through text-gray-400 text-sm">
                      ₹{p.old_price}
                    </p>
                  )}

                  {p.discount > 0 && (
                    <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      {p.discount}% OFF
                    </span>
                  )}
                </div>

                {/* TAG */}
                {p.tag && (
                  <div className="mt-2">
                    <span className="text-xs bg-[#fce8f0] text-[#8b1538] px-3 py-1 rounded-full">
                      {p.tag.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* LOAD MORE BUTTON */}
      {visibleCount < products.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-6 py-3 bg-[#8b1538] text-white rounded-full shadow-md 
                      hover:bg-[#6e0f2c] transition active:scale-95"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
