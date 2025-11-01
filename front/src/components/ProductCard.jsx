import './ProductCard.css';

/**
 * Componente de Tarjeta de Producto
 * Muestra información del producto y permite agregarlo al carrito
 */
export const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    if (product.stock > 0) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div 
      className="product-card" 
      data-product-id={product.id}
      role="article"
      aria-label={`Producto: ${product.name}, Precio: ${formatPrice(product.price)}`}
    >
      {/* Imagen del producto */}
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="badge-stock-low">
            <i className="fas fa-exclamation-triangle"></i>
            ¡Últimas unidades!
          </span>
        )}
        {product.stock === 0 && (
          <span className="badge-out-of-stock">
            <i className="fas fa-times-circle"></i>
            Agotado
          </span>
        )}
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        
        <p className="product-description">
          {product.description}
        </p>

        {/* Rating */}
        <div className="product-rating">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`fas fa-star ${index < Math.floor(product.rating) ? 'filled' : ''}`}
            ></i>
          ))}
          <span className="rating-value">({product.rating})</span>
        </div>

        {/* Categoría */}
        <div className="product-category">
          <i className="fas fa-tag"></i>
          <span>{product.category}</span>
        </div>

        {/* Stock disponible */}
        <div className="product-stock">
          <i className="fas fa-box"></i>
          <span>
            {product.stock > 0 
              ? `${product.stock} disponibles` 
              : 'No disponible'}
          </span>
        </div>
      </div>

      {/* Pie de tarjeta con precio y botón */}
      <div className="product-footer">
        <div className="product-price">
          <span className="price-label">Precio:</span>
          <span className="price-value">{formatPrice(product.price)}</span>
        </div>

        <button
          className={`btn-add-to-cart ${product.stock === 0 ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <i className="fas fa-shopping-cart"></i>
          {product.stock > 0 ? 'Agregar al Carrito' : 'No Disponible'}
        </button>
      </div>
    </div>
  );
};
