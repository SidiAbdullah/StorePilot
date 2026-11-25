import { NavLink } from "react-router-dom";
import { LayoutDashboard, Store } from "lucide-react";
import "./AdminSidebar.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <Store size={27} />
        <span>StorePilot</span>
      </div>

      <p className="sidebar-label">MANAGEMENT</p>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end>
          <LayoutDashboard size={19} />
          <span>Overview</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/">
          <Store size={19} />
          <span>Back to Store</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default AdminSidebar;
