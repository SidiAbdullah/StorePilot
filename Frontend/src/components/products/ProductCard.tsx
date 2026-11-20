import { Link } from "react-router-dom";
import { ShoppingBag, Plus } from "lucide-react";
import type { Product } from "../../types/product";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      setMessage("");

      await addItem({
        productId: product.id,
        quantity: 1,
      });

      setMessage("Added to cart!");
    } catch {
      setMessage("Unable to add product.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="image-placeholder">
            <ShoppingBag size={42} />
          </div>
        )}
      </Link>

      <div className="product-card-content">
        <span className="product-category">
          {product.categoryName || "General"}
        </span>

        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>

        <div className="product-card-bottom">
          <strong>${product.price.toFixed(2)}</strong>

          {isAuthenticated && user?.role === "Customer" && (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={adding || !product.isActive}
            >
              <Plus size={16} />
              {adding ? "Adding..." : "Add"}
            </button>
          )}
        </div>

        {message && <p className="cart-feedback">{message}</p>}
      </div>
    </article>
  );
}
