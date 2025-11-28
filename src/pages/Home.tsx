import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileHeroCarousel from "../components/MobileHeroCarousel";
import HeroCarousel from "../components/HeroCarousel";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  return (
    <>
      <Header />
      <MobileHeroCarousel />

      <main className="bg-[#fffdfb] overflow-hidden">
        {/* 🔥 FULL-SCREEN HERO BANNER LIKE VARA MAHALAKSHMI */}
        <section className="relative w-full">
          <HeroCarousel />
        </section>

        {/* ⭐ EXCLUSIVE CATEGORY SECTION */}
        <section className="max-w-[1300px] mx-auto px-4 mt-10">
          <h2 className="text-2xl font-bold text-[#8b1538] mb-4">
            Exclusive Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <div className="bg-white shadow-md rounded-xl p-3 hover:-translate-y-1 transition">
              <img
                src="/category1.jpg"
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="font-semibold mt-2 text-sm">Kancheepuram Sarees</p>
              <p className="text-xs text-gray-500">Pure zari woven drapes</p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-3 hover:-translate-y-1 transition">
              <img
                src="/category2.jpg"
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="font-semibold mt-2 text-sm">Banarasi Sarees</p>
              <p className="text-xs text-gray-500">Handpicked festive edits</p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-3 hover:-translate-y-1 transition">
              <img
                src="/category3.jpg"
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="font-semibold mt-2 text-sm">Silk Sarees</p>
              <p className="text-xs text-gray-500">Luxury wedding collection</p>
            </div>
          </div>
        </section>

        {/* ⭐ NEW ARRIVALS */}
        <section className="max-w-[1300px] mx-auto px-4 mt-14 mb-10">
          <h2 className="text-2xl font-bold text-[#8b1538] mb-2">
            New Arrivals
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Fresh pieces added every week – explore the latest drapes first.
          </p>

          {/* Unlimited products with pagination */}
          <ProductGrid />
        </section>

        {/* ⭐ WHY VEGA SAREES (TRUST SECTION) */}
        <section className="bg-[#fff5f2] border-t border-[#f3ddd4]">
          <div className="max-w-[1300px] mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#8b1538] mb-3">
                Why Vega Sarees?
              </h3>
              <p className="text-sm text-gray-700">
                Carefully curated sarees and tops sourced from trusted weavers
                and designers so you never worry about quality or finishing.
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-3 items-start">
                <span className="mt-1 text-[#8b1538]">✓</span>
                <div>
                  <p className="font-semibold">Authentic Fabrics</p>
                  <p>Pure silks, soft cottons & hand-picked blends only.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="mt-1 text-[#8b1538]">✓</span>
                <div>
                  <p className="font-semibold">Premium Finishing</p>
                  <p>Fall & pico ready styles, neat packing & dispatch.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-3 items-start">
                <span className="mt-1 text-[#8b1538]">✓</span>
                <div>
                  <p className="font-semibold">Secure Payment</p>
                  <p>UPI / Cards with secure encrypted checkout.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="mt-1 text-[#8b1538]">✓</span>
                <div>
                  <p className="font-semibold">Dedicated Support</p>
                  <p>WhatsApp assistance for sizing & styling queries.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp (change number to your actual one) */}
      <a
        href="https://wa.me/919000000000"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl active:scale-95"
      >
        <span className="text-lg">💬</span>
        <span className="text-sm font-semibold hidden md:inline">
          Chat on WhatsApp
        </span>
      </a>

      <Footer />
    </>
  );
}
