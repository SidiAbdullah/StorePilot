import "./RecentOrders.css";

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  createdAt: string;
  totalAmount: number;
  status: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <section className="recent-orders">
      <div className="recent-orders-header">
        <h2>Recent Orders</h2>
        <span>Latest 5 orders</span>
      </div>

      {orders.length === 0 ? (
        <p className="empty-orders">No orders found.</p>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`order-status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentOrders;
