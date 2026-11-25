import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  Package,
} from "lucide-react";

import { getProducts } from "../api/productsApi";
import type { Product } from "../types/product";
import ProductGrid from "../components/products/ProductGrid";
import Loader from "../components/common/Loader";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("Unable to load featured products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Welcome to StorePilot</span>

          <h1>
            Everything You Need,
            <span> All in One Place.</span>
          </h1>

          <p>
            Discover quality products, explore great deals, and enjoy a simple
            and convenient shopping experience.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-primary-btn">
              Shop Now
              <ArrowRight size={19} />
            </Link>

            <Link to="/products" className="hero-secondary-btn">
              Explore Products
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>Quality</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>Secure</strong>
              <span>Shopping</span>
            </div>

            <div>
              <strong>Easy</strong>
              <span>Experience</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-placeholder">
            <ShoppingBag size={100} strokeWidth={1.2} />
            <span>Discover Your Next Favorite</span>
          </div>

          <div className="hero-floating-card">
            <Package size={25} />
            <div>
              <strong>Find Your Product</strong>
              <span>Start shopping today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-categories container">
        <div className="section-heading">
          <div>
            <span className="section-subtitle">Explore</span>
            <h2>Shop Our Products</h2>
          </div>

          <Link to="/products" className="section-link">
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="category-cards">
          <Link to="/products" className="category-card">
            <ShoppingBag size={35} />
            <h3>All Products</h3>
            <p>Explore our collection</p>
          </Link>

          <Link to="/products" className="category-card">
            <Package size={35} />
            <h3>New Arrivals</h3>
            <p>Discover our products</p>
          </Link>

          <Link to="/products" className="category-card">
            <ShieldCheck size={35} />
            <h3>Quality Products</h3>
            <p>Shop with confidence</p>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-subtitle">Our Collection</span>

              <h2>Featured Products</h2>

              <p>Discover some of the products available in our store.</p>
            </div>

            <Link to="/products" className="section-link">
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <div className="home-error">{error}</div>
          ) : featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="home-empty">
              <Package size={45} />
              <h3>No Products Available</h3>
              <p>Check back later for new products.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-storepilot container">
        <div className="why-heading">
          <span className="section-subtitle">Why StorePilot?</span>
          <h2>A Better Shopping Experience</h2>
          <p>
            We focus on making your shopping experience simple, convenient, and
            reliable.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <ShoppingBag size={32} />
            <h3>Easy Shopping</h3>
            <p>Browse products and manage your cart with ease.</p>
          </div>

          <div className="benefit-card">
            <ShieldCheck size={32} />
            <h3>Secure Experience</h3>
            <p>Your account and shopping experience are protected.</p>
          </div>

          <div className="benefit-card">
            <Truck size={32} />
            <h3>Order Tracking</h3>
            <p>View your orders and follow their current status.</p>
          </div>

          <div className="benefit-card">
            <Headphones size={32} />
            <h3>Customer Focus</h3>
            <p>We aim to make every step of shopping straightforward.</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="home-cta">
        <div className="container cta-content">
          <div>
            <h2>Ready to Start Shopping?</h2>
            <p>Explore our collection and find what you need today.</p>
          </div>

          <Link to="/products" className="cta-btn">
            Explore Products
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </main>
  );
}
