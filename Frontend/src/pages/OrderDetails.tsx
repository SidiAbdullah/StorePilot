import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { getOrderById } from "../api/ordersApi";
import type { Order } from "../types/order";
import Loader from "../components/common/Loader";

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const id = Number(orderId);

      if (!Number.isInteger(id) || id <= 0) {
        setError("Invalid order ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getOrderById(id);
        setOrder(data);
      } catch {
        setError("Unable to load order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !order) {
    return (
      <section className="order-details-error container">
        <Package size={50} />
        <h2>Order Not Found</h2>
        <p>{error || "This order does not exist."}</p>

        <Link to="/my-orders" className="primary-btn">
          Back to My Orders
        </Link>
      </section>
    );
  }

  return (
    <section className="order-details-page container">
      <Link to="/my-orders" className="back-to-orders">
        <ArrowLeft size={18} />
        Back to My Orders
      </Link>

      <div className="order-details-header">
        <div>
          <h1>Order Details</h1>
          <p>Order #{order.orderNumber}</p>
        </div>

        <span className={`order-status ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      <div className="order-details-layout">
        <div className="order-details-main">
          <div className="details-card">
            <h2>Ordered Products</h2>

            <div className="details-products">
              {order.items.map((item) => (
                <div className="details-product" key={item.id}>
                  <div className="details-product-info">
                    <h3>{item.productName}</h3>
                    <p>Product ID: {item.productId}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Unit Price: ${item.unitPrice.toFixed(2)}</p>
                  </div>

                  <strong>${item.subtotal.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="details-total">
              <span>Total Amount</span>
              <strong>${order.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <aside className="order-details-sidebar">
          <div className="details-card">
            <h2>Customer Information</h2>

            <div className="details-field">
              <span>Name</span>
              <p>{order.customerName}</p>
            </div>

            <div className="details-field">
              <span>Email</span>
              <p>{order.customerEmail}</p>
            </div>

            <div className="details-field">
              <span>Phone</span>
              <p>{order.customerPhone}</p>
            </div>
          </div>

          <div className="details-card">
            <h2>Shipping Information</h2>

            <div className="details-field">
              <span>Shipping Address</span>
              <p>{order.shippingAddress}</p>
            </div>
          </div>

          <div className="details-card">
            <h2>Order Information</h2>

            <div className="details-field">
              <span>Order Date</span>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div className="details-field">
              <span>Payment Method</span>
              <p>{order.paymentMethod}</p>
            </div>

            <div className="details-field">
              <span>Order Status</span>
              <p>{order.status}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
