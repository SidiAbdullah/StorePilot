import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { getProducts } from "../api/productsApi";
import type { Product } from "../types/product";
import ProductGrid from "../components/products/ProductGrid";
import Loader from "../components/common/Loader";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const term = search.toLowerCase();

      return (
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term)
      );
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, sort]);

  if (loading) return <Loader />;

  return (
    <section className="products-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">OUR COLLECTION</span>
          <h1>Explore Products</h1>
          <p>Discover products selected for your everyday needs.</p>
        </div>
        <span className="products-count">
          {filteredProducts.length} products
        </span>
      </div>

      <div className="products-toolbar">
        <div className="search-box">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sort-box">
          <SlidersHorizontal size={18} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default sorting</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try changing your search.</p>
        </div>
      )}
    </section>
  );
}
export default Products;
