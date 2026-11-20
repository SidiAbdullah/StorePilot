import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../../types/cart";

interface Props {
  item: CartItemType;
  onUpdate: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdate, onRemove }: Props) {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.productName} />
        ) : (
          <span>No Image</span>
        )}
      </div>

      <div className="cart-item-info">
        <h3>{item.productName}</h3>
        <p>SKU: {item.sku}</p>
        <strong>${item.unitPrice.toFixed(2)}</strong>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-control">
          <button
            disabled={item.quantity <= 1}
            onClick={() => onUpdate(item.id, item.quantity - 1)}
          >
            <Minus size={15} />
          </button>

          <span>{item.quantity}</span>

          <button onClick={() => onUpdate(item.id, item.quantity + 1)}>
            <Plus size={15} />
          </button>
        </div>

        <strong>${item.totalPrice.toFixed(2)}</strong>

        <button
          className="remove-item"
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
