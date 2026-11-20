import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { getProductById } from "../api/productsApi";
import type { Product } from "../types/product";

import Loader from "../components/common/Loader";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id || !Number.isInteger(Number(id))) {
          throw new Error("Invalid product ID");
        }

        const data = await getProductById(Number(id));
        setProduct(data);
      } catch {
        setError("Product not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      setMessage("");

      await addItem({
        productId: product.id,
        quantity: 1,
      });

      setMessage("Product added to your cart!");
    } catch {
      setMessage("Unable to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;

  if (error || !product) {
    return (
      <div className="empty-state">
        <h2>{error || "Product not found"}</h2>
        <Link to="/products" className="primary-btn">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <section className="product-details-page">
      <Link to="/products" className="back-link">
        <ArrowLeft size={18} /> Back to Products
      </Link>

      <div className="product-details">
        <div className="product-details-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <ShoppingBag size={90} />
          )}
        </div>

        <div className="product-details-info">
          <span className="eyebrow">{product.categoryName || "GENERAL"}</span>

          <h1>{product.name}</h1>

          <p className="product-sku">SKU: {product.sku}</p>

          <h2>${product.price.toFixed(2)}</h2>

          <p className="product-description">
            {product.description || "No description available."}
          </p>

          <div className="stock-status">
            {product.isActive ? "Available" : "Currently unavailable"}
          </div>

          {isAuthenticated && user?.role === "Customer" && (
            <button
              className="add-to-cart-btn details-add-btn"
              onClick={handleAddToCart}
              disabled={adding || !product.isActive}
            >
              <ShoppingBag size={18} />
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          )}

          {message && <p className="cart-feedback">{message}</p>}

          {!isAuthenticated && (
            <Link to="/login" className="primary-btn">
              Login to Purchase
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
