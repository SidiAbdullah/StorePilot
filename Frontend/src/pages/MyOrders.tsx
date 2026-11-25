import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye } from "lucide-react";

import { getMyOrders } from "../api/ordersApi";
import type { Order } from "../types/order";
import Loader from "../components/common/Loader";

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getMyOrders();
        setOrders(data);
      } catch {
        setError("Failed to load your orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="orders-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <section className="my-orders container">
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>Track and manage your purchases.</p>
        </div>

        <span className="orders-count">{orders.length} Orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <Package size={65} />

          <h2>No Orders Yet</h2>

          <p>You haven't placed any orders. Start shopping today!</p>

          <Link to="/products" className="primary-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-label">Order Number</span>
                  <h3>{order.orderNumber}</h3>
                </div>

                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-info-grid">
                <div>
                  <span className="order-label">Order Date</span>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <span className="order-label">Items</span>
                  <p>
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </p>
                </div>

                <div>
                  <span className="order-label">Payment Method</span>
                  <p>{order.paymentMethod}</p>
                </div>

                <div>
                  <span className="order-label">Total Amount</span>
                  <p className="order-total">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="order-card-footer">
                <span>{order.items.length} Product Types</span>

                <Link
                  to={`/my-orders/${order.id}`}
                  className="order-details-btn"
                >
                  <Eye size={17} />
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
