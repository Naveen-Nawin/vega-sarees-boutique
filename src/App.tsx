import React from "react";
import Admin from "./pages/Admin";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import Header from "./components/Header";
import HeroCarousel from "./components/HeroCarousel";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ScrollToTop from "./components/ScrollToTop";
import AdminLogin from "./pages/AdminLogin";

// 👉 AUTH WRAPPER (added fresh)
function ProtectedRoute({ children }) {
  const logged = localStorage.getItem("admin_logged") === "true";
  return logged ? children : <Navigate to="/admin-login" replace />;
}

function App() {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroCarousel />
                <Products />
              </>
            }
          />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* 🔐 NEW: Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* 🔒 NEW: Protected Admin Page */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="text-center text-gray-600 py-20">
                <h1 className="text-3xl font-bold text-[#8b1538] mb-4">404</h1>
                <p>Page Not Found</p>
              </div>
            }
          />
        </Routes>

        <Footer />
        <MobileNav />
      </Router>
    </ShopProvider>
  );
}

export default App;
