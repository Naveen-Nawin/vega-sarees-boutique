
import React from "react";

import { useShop } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, User, Search, Menu, X } from "lucide-react";


/* ------------ Mobile Search Fullscreen Overlay ------------ */

type MobileSearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
};

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  open,
  onClose,
  value,
  onChange,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-white/95 backdrop-blur-md z-[90] transition-all duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Red top bar */}
      <div className="bg-[#c62828] text-white flex items-center justify-between px-4 py-3">
        <span className="font-semibold tracking-wide">SEARCH</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 transition"
        >
          <X size={22} />
        </button>
      </div>

      {/* Input */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-[#c62828]" size={18} />
          <input
            autoFocus
            type="text"
            placeholder="Search for Sarees..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-[#e3bdb3] rounded-full py-2.5 pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#c62828]/40"
          />
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          🔍 Type to search your favourite sarees.
        </p>
      </div>
    </div>
  );
};

/* --------------------------- MAIN HEADER --------------------------- */

export default function Header(): JSX.Element {
  const { cartCount, wishlistCount } = useShop();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  // Listen to events from MobileNav (bottom menu)
  useEffect(() => {
    const toggle = () => setMenuOpen((v) => !v);
    const open = () => setMenuOpen(true);
    const close = () => setMenuOpen(false);

    window.addEventListener("toggle-main-menu", toggle);
    window.addEventListener("open-main-menu", open);
    window.addEventListener("close-main-menu", close);

    return () => {
      window.removeEventListener("toggle-main-menu", toggle);
      window.removeEventListener("open-main-menu", open);
      window.removeEventListener("close-main-menu", close);
    };
  }, []);

  const menuItems = [
    { label: "Sarees", to: "/category/sarees" },
    { label: "Kurtas", to: "/category/kurtas" },
    { label: "Dress Materials", to: "/category/dress-materials" },
    { label: "Blouses", to: "/category/blouses" },
    { label: "Short Kurtis & Tops", to: "/category/short-kurtis-tops" },
    { label: "New Arrivals", to: "/new" },
    { label: "Sale", to: "/sale" },
    { label: "Gifting", to: "/gifting" },
    { label: "Collections", to: "/collections" },
    { label: "More", to: "/more" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ========== MOBILE TOP BAR (Vara style) ========== */}
        <div className="flex md:hidden h-14 items-center justify-between">
          {/* Left: menu icon */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg text-black"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Center: logo */}
          <Link to="/" className="flex flex-col items-center">
            {/* Use your logo here */}
            <img
              src="/logo.svg"
              alt="Vega Sarees Boutique"
              className="h-8 object-contain"
            />
          </Link>

          {/* Right: search + cart */}
          <div className="flex items-center gap-4 text-black">
            <button
              onClick={() => setShowSearchOverlay(true)}
              className="p-2 rounded-lg"
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c62828] text-white text-[10px] px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ========== DESKTOP TOP BAR (your old layout) ========== */}
        <div className="hidden md:flex items-center justify-between gap-3 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Vega Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-serif text-[#8b1538] font-bold tracking-wide">
              Vega Sarees <span className="text-gray-700">Boutique</span>
            </h1>
          </Link>

          {/* Search */}
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search for Sarees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#e3bdb3] rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b1538]/40"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b1538]"
              size={18}
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-[#8b1538]">
            <button className="p-2 rounded-lg hover:bg-[#8b1538]/5" aria-label="Account">
              <User />
            </button>

            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg hover:bg-[#8b1538]/5"
              aria-label="Wishlist"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8b1538] text-white text-[10px] px-1.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-[#8b1538]/5"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Desktop Navigation Bar ===== */}
      <nav className="hidden md:block border-t border-gray-200 bg-[#fffaf7]">
        <ul className="flex flex-wrap justify-center gap-8 py-2 text-[15px] lg:text-base font-medium text-gray-700">
          {menuItems.map(({ label, to }) => (
            <li
              key={label}
              className="hover:text-[#8b1538] hover:scale-105 transition-all"
            >
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ===== FULLSCREEN MOBILE MENU OVERLAY ===== */}
      {menuOpen && (
        <div className="fixed inset-0 z-[80] bg-white">
          {/* Red header */}
          <div className="bg-[#c62828] text-white flex items-center justify-between px-4 py-3">
            <span className="font-semibold tracking-wide">MENU</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Menu list */}
          <nav className="h-[calc(100vh-48px)] overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {menuItems.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-4 py-3 text-base text-gray-800 hover:bg-gray-50"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* bottom profile icon */}
            <div className="px-4 py-4">
              <button className="flex items-center gap-2 text-gray-700">
                <User />
                <span>Account</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ===== MOBILE SEARCH FULLSCREEN OVERLAY ===== */}
      <MobileSearchOverlay
        open={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
        value={search}
        onChange={setSearch}
      />
    </header>
  );
}
