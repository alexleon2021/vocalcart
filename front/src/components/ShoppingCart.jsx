import { useState } from 'react';
import './ShoppingCart.css';

/**
 * Componente del Carrito de Compras
 * Muestra los productos agregados y permite gestionar cantidades
 */
export const ShoppingCart = ({ items, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => setIsOpen(!isOpen);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.12; // 12% de impuesto
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleIncreaseQuantity = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.quantity < item.stock) {
      onUpdateQuantity(itemId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      onUpdateQuantity(itemId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      onRemoveItem(itemId);
    }
  };

  return (
    <>
      {/* Botón flotante del carrito */}
      <button
        className={`cart-button ${isOpen ? 'active' : ''}`}
        onClick={toggleCart}
        aria-label={`Carrito de compras, ${getTotalItems()} artículos`}
      >
        <i className="fas fa-shopping-cart"></i>
        {getTotalItems() > 0 && (
          <span className="cart-badge">{getTotalItems()}</span>
        )}
      </button>

      {/* Panel lateral del carrito */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>
            <i className="fas fa-shopping-cart"></i>
            Mi Carrito
          </h3>
          <button className="btn-close-cart" onClick={toggleCart}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <i className="fas fa-shopping-basket"></i>
              <p>Tu carrito está vacío</p>
              <small>Agrega productos para comenzar tu compra</small>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-price">{formatPrice(item.price)}</p>
                      
                      <div className="item-quantity-controls">
                        <button
                          className="btn-quantity"
                          onClick={() => handleDecreaseQuantity(item.id)}
                          aria-label="Disminuir cantidad"
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        
                        <span className="item-quantity">{item.quantity}</span>
                        
                        <button
                          className="btn-quantity"
                          onClick={() => handleIncreaseQuantity(item.id)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Aumentar cantidad"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>

                      {item.quantity >= item.stock && (
                        <span className="stock-warning">
                          <i className="fas fa-exclamation-circle"></i>
                          Stock máximo alcanzado
                        </span>
                      )}
                    </div>

                    <div className="item-actions">
                      <div className="item-subtotal">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <button
                        className="btn-remove-item"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen del pedido */}
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="summary-row">
                  <span>Impuestos (12%):</span>
                  <span>{formatPrice(calculateTax())}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span className="total-amount">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="cart-actions">
                <button
                  className="btn-clear-cart"
                  onClick={onClearCart}
                >
                  <i className="fas fa-trash-alt"></i>
                  Vaciar Carrito
                </button>
                
                <button
                  className="btn-checkout"
                  onClick={onCheckout}
                >
                  <i className="fas fa-credit-card"></i>
                  Finalizar Compra
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay cuando el carrito está abierto */}
      {isOpen && (
        <div 
          className="cart-overlay" 
          onClick={toggleCart}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};
