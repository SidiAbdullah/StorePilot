import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  return (
    <section className="order-success">
      <CheckCircle size={75} />

      <h1>Order Placed Successfully!</h1>

      <p>Thank you for your purchase. Your order has been created.</p>

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
