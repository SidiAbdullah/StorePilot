import { useEffect, useState } from "react";
import { Package, Tags, ShoppingCart, Users } from "lucide-react";

import api from "../api/axios";

import AdminSidebar from "../components/admin/AdminSidebar";
import StatCard from "../components/admin/StatCard";

import RecentOrders, { type Order } from "../components/admin/RecentOrders";

import "./Dashboard.css";

function Dashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes, usersRes] =
          await Promise.all([
            api.get("/Products"),
            api.get("/Categories"),
            api.get("/Orders/all"),
            api.get("/Users"),
          ]);

        const products = productsRes.data;
        const categories = categoriesRes.data;
        const allOrders = ordersRes.data;
        const users = usersRes.data;

        setProductsCount(
          Array.isArray(products)
            ? products.length
            : (products.totalCount ?? 0),
        );

        setCategoriesCount(
          Array.isArray(categories)
            ? categories.length
            : (categories.totalCount ?? 0),
        );

        setUsersCount(
          Array.isArray(users) ? users.length : (users.totalCount ?? 0),
        );

        const normalizedOrders = Array.isArray(allOrders)
          ? allOrders
          : (allOrders.items ?? []);

        setOrders(
          normalizedOrders
            .sort(
              (a: Order, b: Order) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 5),
        );
      } catch (err) {
        console.error("Dashboard data error:", err);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening with your store.</p>
          </div>
        </header>

        {loading ? (
          <div className="dashboard-message">Loading dashboard...</div>
        ) : error ? (
          <div className="dashboard-error">{error}</div>
        ) : (
          <>
            <section className="dashboard-stats">
              <StatCard
                title="Total Products"
                value={productsCount}
                icon={<Package size={24} />}
                color="#2563eb"
              />

              <StatCard
                title="Total Categories"
                value={categoriesCount}
                icon={<Tags size={24} />}
                color="#7c3aed"
              />

              <StatCard
                title="Total Orders"
                value={orders.length}
                icon={<ShoppingCart size={24} />}
                color="#ea580c"
              />

              <StatCard
                title="Total Users"
                value={usersCount}
                icon={<Users size={24} />}
                color="#059669"
              />
            </section>

            <RecentOrders orders={orders} />
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
