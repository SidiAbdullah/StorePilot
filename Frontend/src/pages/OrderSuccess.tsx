import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import type { Order } from "../types/order";

interface LocationState {
  order?: Order;
}

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const order = state?.order;

  return (
    <section className="order-success">
      <CheckCircle size={75} />

      <h1>Order Placed Successfully!</h1>

      <p>Thank you for your purchase. Your order has been created.</p>

      {order && (
        <div className="success-order-details">
          <p>
            <strong>Order ID:</strong> #{order.id}
          </p>

          <p>
            <strong>Total:</strong> {order.totalAmount}
          </p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>
      )}

      <div className="success-actions">
        <Link to="/my-orders" className="primary-btn">
          View My Orders
        </Link>

        <Link to="/products" className="secondary-btn">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
