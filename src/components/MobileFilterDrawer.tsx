import { X } from "lucide-react";
import { Range } from "react-range";
import { useShop } from "../context/ShopContext";

export default function MobileFilterDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { productFilters, updateProductFilters, resetProductFilters } = useShop();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer Container */}
      <div
        className={`
          fixed bottom-0 left-0 w-full bg-white z-[1000] 
          rounded-t-3xl shadow-2xl 
          transition-transform duration-400 
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
        style={{
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-[#8b1538]">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6">

          {/* ============== PRICE RANGE ============= */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">Price Range</h3>

            <Range
              min={0}
              max={60000}
              step={500}
              values={productFilters.priceRange}
              onChange={(values) =>
                updateProductFilters({ priceRange: values })
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

          {/* ============== DISCOUNT ============= */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">Discount</h3>
            <div className="space-y-2">
              {[5, 10, 20, 30, 50].map((d) => (
                <label key={d} className="flex gap-2 items-center">
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
          </div>

          {/* ============== SIZE ============= */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">Size</h3>
            <div className="flex gap-2 flex-wrap">
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    updateProductFilters({
                      size: productFilters.size === s ? "" : s,
                    })
                  }
                  className={`px-3 py-1 rounded-md border ${
                    productFilters.size === s
                      ? "bg-[#8b1538] text-white"
                      : "text-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ============== FABRIC ============= */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">Fabric</h3>
            <div className="space-y-2">
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
          </div>

          {/* ============== COLOUR ============= */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">Colour</h3>
            <div className="space-y-2">
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
          </div>

          {/* ============== OCCASION ============= */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">Occasion</h3>
            <div className="space-y-2">
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
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="p-6 border-t mt-4 flex gap-4">
          <button
            onClick={resetProductFilters}
            className="flex-1 py-3 text-[#8b1538] border border-[#8b1538] rounded-xl font-semibold"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#8b1538] text-white rounded-xl font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
