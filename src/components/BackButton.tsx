import React from "react";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="fixed bottom-5 right-5 bg-gradient-to-r from-red-700 to-green-700 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition"
    >
      ← Back
    </button>
  );
}
