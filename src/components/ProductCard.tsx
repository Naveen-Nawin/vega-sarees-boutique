import React from "react";

interface ProductProps {
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ name, price, image }: ProductProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-3 hover:scale-105 transition">
      <img src={image} alt={name} className="rounded-md w-full h-64 object-cover" />
      <h2 className="mt-3 text-lg font-semibold text-gray-800">{name}</h2>
      <p className="text-red-600 font-bold mt-1">₹{price}</p>
      <button className="mt-3 w-full py-2 bg-gradient-to-r from-red-700 to-green-700 text-white rounded-md hover:opacity-90">
        View Details
      </button>
    </div>
  );
}
