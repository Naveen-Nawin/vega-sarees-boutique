import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";

type Props = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string | undefined;  // CHANGE HERE
};


const CategoryCards: React.FC<Props> = ({ id, name, price, oldPrice, image }) => {
  const {
    addToCart,
    toggleWishlist,
    inWishlist,
    inCart,
    cartAnimationToken,
    lastAddedProduct,
  } = useShop();

  const [addedCart, setAddedCart] = useState(false);
  const [addedWish, setAddedWish] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const product = { id, name, price, oldPrice, image };

  /* ----------------------------------------------------------
      🟣 1. Fly-to-cart animation (trigger from global context)
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!lastAddedProduct || lastAddedProduct.id !== id) return;
    const el = cardRef.current;
    if (!el) return;

    el.classList.add("fly-shake");
    const timer = setTimeout(() => el.classList.remove("fly-shake"), 500);
    return () => clearTimeout(timer);
  }, [cartAnimationToken]);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 1000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    setAddedWish(true);
    setTimeout(() => setAddedWish(false), 800);
  };

  return (
    <div
      ref={cardRef}
      className="
        group bg-white rounded-xl overflow-hidden 
        shadow-sm hover:shadow-xl
        transition-all duration-300 border border-gray-100
        transform hover:-translate-y-1
      "
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${id}`}>
                <img
                    src={image || "/placeholder.png"}
                    alt={name}
                    className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                   />

        </Link> 

        {/* Badges — New, Trending etc future use */}
      </div>

      {/* Hover / Mobile Buttons */}
      <div className="
        flex justify-center gap-4 py-3 
        opacity-0 group-hover:opacity-100
        md:hover:opacity-100 
        transition-opacity duration-500
      ">
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`
            p-3 rounded-full border shadow-sm 
            transition-all duration-300
            ${
              inCart(id)
                ? "bg-[#8b1538] text-white border-[#8b1538]"
                : "bg-white border-gray-300 text-gray-800 hover:bg-[#8b1538] hover:text-white"
            }
            ${addedCart ? "scale-110 ring-2 ring-[#8b1538]/40" : ""}
          `}
        >
          <FaShoppingCart size={18} />
        </button>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={`
            p-3 rounded-full border shadow-sm 
            transition-all duration-300
            ${
              inWishlist(id)
                ? "bg-red-600 text-white border-red-600"
                : "bg-white border-gray-300 text-gray-800 hover:bg-[#8b1538] hover:text-white"
            }
            ${addedWish ? "scale-110 ring-2 ring-red-400/40" : ""}
          `}
        >
          <FaHeart size={18} />
        </button>

        {/* View Product */}
        <Link
          to={`/product/${id}`}
          className="
            p-3 rounded-full border 
            bg-white border-gray-300 text-gray-800
            hover:bg-[#8b1538] hover:text-white
            shadow-sm transition-all duration-300
          "
        >
          <FaEye size={18} />
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 text-center">
        <p className="text-gray-800 text-sm font-medium mb-1">
          {name}
        </p>

        <div className="flex justify-center items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;
