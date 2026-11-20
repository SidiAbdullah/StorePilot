interface Props {
  totalItems: number;
  totalPrice: number;
}

export default function CartSummary({ totalItems, totalPrice }: Props) {
  return (
    <div className="cart-summary">
      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Total Items</span>
        <span>{totalItems}</span>
      </div>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      <div className="summary-row summary-total">
        <strong>Total</strong>
        <strong>${totalPrice.toFixed(2)}</strong>
      </div>

      <p className="summary-note">Shipping costs are not included.</p>
    </div>
  );
}
