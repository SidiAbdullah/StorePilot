import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          StorePilot
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-icon">
                <ShoppingCart size={20} />
                Cart
              </Link>

              <span className="nav-user">
                <User size={18} />
                {user?.username}
              </span>

              {user?.role === "Admin" && <Link to="/admin">Dashboard</Link>}

              <button onClick={handleLogout} className="logout-button">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="primary-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
