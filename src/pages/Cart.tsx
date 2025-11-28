import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Trash2, Info } from "lucide-react";

const Cart: React.FC = () => {
  const { cart, changeQty, removeFromCart, clearCart } = useShop();
  const items = Object.values(cart);

  const subtotal = items.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0
  );
  const shipping = items.length > 0 ? 500 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        🛒 Your shopping cart is empty.
        <div className="mt-6">
          <Link
            to="/"
            className="px-6 py-2 bg-[#8b1538] text-white rounded-full hover:bg-[#a01d45] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Section */}
      <div className="lg:col-span-3">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 text-left w-1/2">Item</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-center w-[120px]">Qty</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ product, qty }) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Sku:TGC13022313
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => alert("Product info popup")}
                        className="text-gray-500 hover:text-[#8b1538] transition"
                        title="Info"
                      >
                        <Info size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-500 hover:text-[#8b1538] transition"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </td>

                <td className="p-3 text-gray-700">
                  ₹{product.price.toLocaleString("en-IN")}
                  <p className="text-xs text-gray-500">
                    (Inclusive of all taxes)
                  </p>
                </td>

                <td className="p-3 text-center">
                  <div className="inline-flex items-center border border-gray-300 rounded-full">
                    <button
                      onClick={() => changeQty(product.id, qty - 1)}
                      className="px-3 py-1 text-gray-700 hover:text-[#8b1538]"
                    >
                      −
                    </button>
                    <span className="px-3 text-gray-800">{qty}</span>
                    <button
                      onClick={() => changeQty(product.id, qty + 1)}
                      className="px-3 py-1 text-gray-700 hover:text-[#8b1538]"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td className="p-3 text-right font-medium text-gray-800">
                  ₹{(product.price * qty).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-8">
          <Link
            to="/"
            className="px-6 py-3 bg-[#8b1538] text-white rounded-full hover:bg-[#a01d45] transition text-sm"
          >
            ← Continue Shopping
          </Link>

          <div className="flex gap-4">
            <button
              onClick={() => clearCart()}
              className="px-6 py-3 bg-[#8b1538] text-white rounded-full hover:bg-[#a01d45] transition text-sm"
            >
              Clear Shopping Cart
            </button>
            <button
              className="px-6 py-3 bg-[#8b1538] text-white rounded-full hover:bg-[#a01d45] transition text-sm"
              onClick={() => alert('Cart updated!')}
            >
              Update Shopping Cart
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Summary */}
      <div className="lg:col-span-1 border border-gray-200 rounded-xl p-6 bg-gray-50 h-fit">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Summary</h3>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount On MRP</span>
            <span>₹0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping (Domestic - Payable)</span>
            <span>₹{shipping.toLocaleString("en-IN")}</span>
          </div>

          <hr className="my-3 border-gray-300" />

          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Order Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <button
          onClick={() => alert("Proceed to Checkout clicked!")}
          className="w-full mt-6 bg-[#8b1538] text-white py-3 rounded-full font-medium hover:bg-[#a01d45] transition"
        >
          PROCEED TO CHECKOUT
        </button>

        {/* Coupon */}
        <div className="mt-6">
          <p className="text-sm text-gray-700 mb-2">Apply Coupon</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Coupon"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b1538]/50"
            />
            <button className="px-5 py-2 bg-[#8b1538] text-white rounded-full text-sm hover:bg-[#a01d45] transition">
              APPLY
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Login & Apply Coupons
        </p>
      </div>
    </div>
  );
};

export default Cart;
