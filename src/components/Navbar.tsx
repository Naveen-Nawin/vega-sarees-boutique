import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-700 to-green-600 text-white shadow-md">
      <h1 className="text-2xl font-bold tracking-wide">Vega Sarees Boutique</h1>
      <div className="space-x-6">
        <a href="/" className="hover:text-yellow-300">Home</a>
        <a href="/products" className="hover:text-yellow-300">Collections</a>
        <a href="/about" className="hover:text-yellow-300">About</a>
      </div>
    </nav>
  );
}
