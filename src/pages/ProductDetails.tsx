import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useShop } from "../context/ShopContext";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const { addToCart } = useShop();
  const [added, setAdded] = useState(false);

  // ===============================
  // ⭐ FETCH PRODUCT FROM SUPABASE
  // ===============================
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (!error) setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading…
      </div>
    );
  }

  // Not Found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Product Not Found
      </div>
    );
  }

  // Add to cart
  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.old_price,
        image: product.images?.[0] || "",
      },
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Buy Now
        const handleBuyNow = () => {
          const message = `Hello, I want to buy:
        Product: ${product.name}
        Price: ₹${product.price}
        Product ID: ${product.id}
        Please confirm availability.`;

          const encodedMessage = encodeURIComponent(message);
          window.open(`https://wa.me/91XXXXXXXXXX?text=${encodedMessage}`, "_blank");
        };


  return (
    <>
      <div className="min-h-screen w-full bg-[#faf7f2] px-4 md:px-10 lg:px-20 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT SECTION */}
          <div className="flex gap-6">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {product.images?.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-24 rounded-md object-cover cursor-pointer border ${
                    selectedImage === i
                      ? "border-[#a31b52] scale-110 shadow-md"
                      : "border-gray-300 hover:scale-105"
                  }`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 flex justify-center items-center">
              <img
                src={product.images?.[selectedImage]}
                onClick={() => setZoomOpen(true)}
                className="w-[90%] rounded-xl shadow-xl object-cover cursor-zoom-in"
              />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-[#3a2e2e]">
              {product.name}
            </h1>

            <div>
              <p className="text-3xl font-bold">₹{product.price}</p>
              {product.old_price && (
                <p className="line-through text-gray-500 text-lg">
                  ₹{product.old_price}
                </p>
              )}
              {product.discount > 0 && (
                <p className="text-red-600 font-semibold">
                  {product.discount}% OFF
                </p>
              )}
            </div>

            <p className="text-gray-700">{product.description}</p>

            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mt-4">
              {product.images?.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  className="h-24 w-full object-cover rounded border"
                />
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-lg text-lg font-medium ${
                  added
                    ? "bg-green-600 text-white scale-105"
                    : "bg-black text-white"
                }`}
              >
                {added ? "Added ✔" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-teal-700 text-white py-3 rounded-lg text-lg"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE ZOOM */}
      {zoomOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center">
          <button
            className="absolute top-5 right-5 text-white text-3xl"
            onClick={() => setZoomOpen(false)}
          >
            ✕
          </button>
          <img
            src={product.images[selectedImage]}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  );
};

export default ProductDetails;
