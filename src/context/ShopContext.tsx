import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
};

type CartLine = { product: Product; qty: number };

// 🔹 Filters for Products page
export type ProductFilters = {
  priceRange: [number, number];
  discount: number;
  size: string;
  fabric: string;
  colour: string;
  occasion: string;
  sortBy: "new" | "priceLow" | "priceHigh";
};

const DEFAULT_FILTERS: ProductFilters = {
  priceRange: [0, 60000],
  discount: 0,
  size: "",
  fabric: "",
  colour: "",
  occasion: "",
  sortBy: "new",
};

type ShopContextType = {
  // Existing
  cart: Record<number, CartLine>;
  wishlist: Record<number, Product>;
  cartCount: number;
  wishlistCount: number;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  changeQty: (id: number, qty: number) => void;
  toggleWishlist: (p: Product) => void;
  inWishlist: (id: number) => boolean;
  inCart: (id: number) => boolean;
  clearCart: () => void;

  // ⭐ New premium features
  cartSubtotal: number;
  cartTotal: number;

  clearWishlist: () => void;
  moveWishlistToCart: () => void;

  recentlyViewed: Product[];
  addRecentlyViewed: (p: Product) => void;

  recentlySearched: string[];
  addSearchQuery: (q: string) => void;

  productFilters: ProductFilters;
  updateProductFilters: (partial: Partial<ProductFilters>) => void;
  resetProductFilters: () => void;

  cartAnimationToken: number;
  lastAddedProduct: Product | null;
};

const ShopContext = createContext<ShopContextType | null>(null);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 🛒 CART
  const [cart, setCart] = useState<Record<number, CartLine>>(() => {
    try {
      const saved = localStorage.getItem("vega_cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // ❤️ WISHLIST
  const [wishlist, setWishlist] = useState<Record<number, Product>>(() => {
    try {
      const saved = localStorage.getItem("vega_wishlist");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 👀 RECENTLY VIEWED
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("vega_recently_viewed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 🔍 RECENTLY SEARCHED
  const [recentlySearched, setRecentlySearched] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vega_recently_searched");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 🎚 PRODUCT FILTERS (Products page)
  const [productFilters, setProductFiltersState] = useState<ProductFilters>(
    () => {
      try {
        const saved = localStorage.getItem("vega_filters");
        return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
      } catch {
        return DEFAULT_FILTERS;
      }
    }
  );

  // ✨ CART ANIMATION SUPPORT
  const [cartAnimationToken, setCartAnimationToken] = useState(0);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);

  // 🔁 Persist to localStorage
  useEffect(() => {
    localStorage.setItem("vega_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("vega_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("vega_recently_viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem("vega_recently_searched", JSON.stringify(recentlySearched));
  }, [recentlySearched]);

  useEffect(() => {
    localStorage.setItem("vega_filters", JSON.stringify(productFilters));
  }, [productFilters]);

  // 🛒 Add to cart
  const addToCart = (p: Product, qty = 1) => {
    setCart((prev) => {
      const line = prev[p.id];
      const nextQty = (line?.qty ?? 0) + qty;
      return { ...prev, [p.id]: { product: p, qty: nextQty } };
    });

    // update animation token + last added product
    setCartAnimationToken((t) => t + 1);
    setLastAddedProduct(p);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const cp = { ...prev };
      delete cp[id];
      return cp;
    });
  };

  const changeQty = (id: number, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        const cp = { ...prev };
        delete cp[id];
        return cp;
      }
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], qty } };
    });
  };

  const clearCart = () => setCart({});

  // ❤️ Wishlist
  const toggleWishlist = (p: Product) => {
    setWishlist((prev) => {
      const cp = { ...prev };
      if (cp[p.id]) delete cp[p.id];
      else cp[p.id] = p;
      return cp;
    });
  };

  const inWishlist = (id: number) => !!wishlist[id];
  const inCart = (id: number) => !!cart[id];

  const clearWishlist = () => setWishlist({});

  const moveWishlistToCart = () => {
    setCart((prevCart) => {
      const next = { ...prevCart };
      Object.values(wishlist).forEach((p) => {
        const line = next[p.id];
        const nextQty = (line?.qty ?? 0) + 1;
        next[p.id] = { product: p, qty: nextQty };
      });
      return next;
    });
    setWishlist({});
  };

  // 👀 Recently viewed
  const addRecentlyViewed = (p: Product) => {
    setRecentlyViewed((prev) => {
      // remove if already exists
      const filtered = prev.filter((item) => item.id !== p.id);
      const updated = [p, ...filtered];
      return updated.slice(0, 10); // keep last 10
    });
  };

  // 🔍 Search queries
  const addSearchQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentlySearched((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered];
      return updated.slice(0, 8);
    });
  };

  // 🎚 Filters
  const updateProductFilters = (partial: Partial<ProductFilters>) => {
    setProductFiltersState((prev) => ({ ...prev, ...partial }));
  };

  const resetProductFilters = () => {
    setProductFiltersState(DEFAULT_FILTERS);
  };

  // 🔢 Counts / totals
  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, l) => sum + l.qty, 0),
    [cart]
  );

  const wishlistCount = useMemo(
    () => Object.keys(wishlist).length,
    [wishlist]
  );

  const cartSubtotal = useMemo(
    () =>
      Object.values(cart).reduce(
        (sum, line) => sum + line.product.price * line.qty,
        0
      ),
    [cart]
  );

  const cartTotal = cartSubtotal; // later: add shipping / discounts if needed

  const value: ShopContextType = {
    // existing
    cart,
    wishlist,
    cartCount,
    wishlistCount,
    addToCart,
    removeFromCart,
    changeQty,
    toggleWishlist,
    inWishlist,
    inCart,
    clearCart,

    // new
    cartSubtotal,
    cartTotal,
    clearWishlist,
    moveWishlistToCart,
    recentlyViewed,
    addRecentlyViewed,
    recentlySearched,
    addSearchQuery,
    productFilters,
    updateProductFilters,
    resetProductFilters,
    cartAnimationToken,
    lastAddedProduct,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within <ShopProvider>");
  return ctx;
};
