import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useCart } from "../hooks/useCart";
import Loader from "../components/common/Loader";

export default function Checkout() {
  const navigate = useNavigate();

  const { cart, isLoading, refreshCart } = useCart();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      setError("");

      const response = await api.post("/Orders/checkout");

      await refreshCart();

      navigate("/order-success", {
        state: {
          order: response.data,
          success: true,
        },
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Checkout failed. Please try again.";

      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <Loader />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="primary-btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <span className="eyebrow">FINAL STEP</span>
        <h1>Checkout</h1>
        <p>Review your order before confirming.</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-products">
          <h2>Order Items</h2>

          {cart.items.map((item) => (
            <div className="checkout-item" key={item.id}>
              <div>
                <h3>{item.productName}</h3>
                <p>Quantity: {item.quantity}</p>
              </div>

              <strong>${item.totalPrice.toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Total Items</span>
            <span>{cart.totalItems}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row summary-total">
            <strong>Total</strong>
            <strong>${cart.totalPrice.toFixed(2)}</strong>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="confirm-order-btn"
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? "Processing..." : "Confirm Order"}
          </button>

          <Link to="/cart" className="back-to-cart">
            Back to Cart
          </Link>
        </div>
      </div>
    </section>
  );
}
