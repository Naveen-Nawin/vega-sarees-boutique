import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const items = Object.values(wishlist);

  if (items.length === 0)
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        ❤️ Your wishlist is empty.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-[#8b1538]">
        Your Wishlist
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <div
            key={p.id}
            className="border rounded-md overflow-hidden shadow hover:shadow-lg transition-all duration-300"
          >
            <Link to={`/product/${p.id}`}>
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="p-4 text-center">
              <h3 className="text-gray-800 font-medium mb-1">{p.name}</h3>
              <p className="text-gray-700 font-semibold mb-3">
                ₹{p.price.toLocaleString("en-IN")}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => addToCart(p)}
                  className="px-4 py-2 bg-[#8b1538] text-white text-sm rounded hover:bg-[#a21d46]"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(p)}
                  className="px-4 py-2 border border-gray-400 text-gray-600 text-sm rounded hover:bg-gray-100"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
