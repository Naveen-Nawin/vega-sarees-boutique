export default function Footer() {
  return (
    <footer className="bg-[#f8f1e8] mt-10 pt-10 pb-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        <div>
          <h4 className="font-semibold text-lg text-[#8b1538] mb-3">
            About Vega Sarees Boutique
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            We bring you luxury silk sarees handwoven with timeless elegance –
            crafted with tradition and styled for the modern woman.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg text-[#8b1538] mb-3">
            Customer Service
          </h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>Contact Us</li>
            <li>Returns & Exchanges</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg text-[#8b1538] mb-3">Follow Us</h4>
          <div className="flex gap-4 mb-3 text-[#8b1538] text-xl">
            <i className="fab fa-instagram"></i>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-youtube"></i>
          </div>
          <div className="flex">
            <input
              type="email"
              placeholder="Subscribe for updates"
              className="flex-1 px-3 py-2 text-sm border rounded-l-md outline-none"
            />
            <button className="bg-[#8b1538] text-white px-4 rounded-r-md text-sm">
              Join
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-600 mt-8">
        © 2025 Vega Sarees Boutique. All rights reserved.
      </p>
    </footer>
  );
}
