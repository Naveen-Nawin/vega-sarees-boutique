import { Link, useLocation } from "react-router-dom";
import { Home, Heart, ShoppingBag, Menu } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function MobileNav() {
  const { cartCount, wishlistCount } = useShop();
  const location = useLocation();

  const triggerMenu = () => {
    window.dispatchEvent(new Event("toggle-main-menu"));
  };

  const isActive = (path: string) =>
    location.pathname === path ? "text-[#8b1538]" : "text-gray-700";

  return (
    <>
      {/* Rounded pill bar */}
      <nav className="md:hidden fixed bottom-3 left-0 w-full flex justify-center z-[70]">
        <div className="bg-white/95 rounded-full shadow-xl px-6 py-2 flex items-center gap-8">
          {/* Home */}
          <Link to="/" className="flex flex-col items-center">
            <Home size={22} className={isActive("/")} />
            <span className="text-[12px]">Home</span>
          </Link>

          {/* Menu (opens fullscreen menu) */}
          <button
            onClick={triggerMenu}
            className="flex flex-col items-center text-gray-700"
          >
            <Menu size={22} />
            <span className="text-[12px]">Menu</span>
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative flex flex-col items-center">
            <Heart
              size={22}
              className={
                wishlistCount > 0 ? "text-[#8b1538]" : "text-gray-700"
              }
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 right-2 bg-[#c62828] text-white text-[10px] px-1.5 rounded-full">
                {wishlistCount}
              </span>
            )}
            <span className="text-[12px]">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative flex flex-col items-center">
            <ShoppingBag
              size={22}
              className={cartCount > 0 ? "text-[#8b1538]" : "text-gray-700"}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 right-2 bg-[#c62828] text-white text-[10px] px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
            <span className="text-[12px]">Cart</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
