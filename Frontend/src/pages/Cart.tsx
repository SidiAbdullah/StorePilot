import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { useCart } from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import Loader from "../components/common/Loader";

export default function Cart() {
  const { cart, isLoading, updateItem, removeItem, emptyCart } = useCart();

  if (isLoading) return <Loader />;

  if (!cart || cart.items.length === 0) {
    return (
      <section className="cart-empty">
        <ShoppingBag size={65} />

        <h1>Your Cart Is Empty</h1>

        <p>You haven't added any products yet.</p>

        <Link to="/products" className="primary-btn">
          Explore Products
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">YOUR SHOPPING BAG</span>
          <h1>Shopping Cart</h1>
          <p>{cart.totalItems} items in your cart</p>
        </div>

        <button className="clear-cart-btn" onClick={emptyCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={updateItem}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="cart-sidebar">
          <CartSummary
            totalItems={cart.totalItems}
            totalPrice={cart.totalPrice}
          />

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
