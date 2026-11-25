import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../api/axios";
import { useCart } from "../hooks/useCart";
import Loader from "../components/common/Loader";

interface ApiError {
  message?: string;
  title?: string;
}

export default function Checkout() {
  const navigate = useNavigate();

  const { cart, isLoading, refreshCart } = useCart();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      setError("");

      const response = await api.post("/Orders/checkout", {
        customerName,
        customerPhone,
        shippingAddress,
      });
      await refreshCart();

      navigate("/order-success", {
        state: {
          order: response.data,
        },
      });
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiError>(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.title ||
            "Checkout failed",
        );
      } else {
        setError("An unexpected error occurred.");
      }
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

          <div className="checkout-form">
            <h2>Shipping Information</h2>

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />

            <textarea
              placeholder="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
          </div>

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
