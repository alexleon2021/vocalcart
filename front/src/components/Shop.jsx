import { useState, useEffect, useCallback } from 'react';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { ProductCard } from '../components/ProductCard';
import { ShoppingCart } from '../components/ShoppingCart';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { getCategorias, getProductos } from '../services/api';
import './Shop.css';

/**
 * Componente principal de la tienda
 * Integra productos, carrito y asistente de voz
 */
export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [categories, setCategories] = useState(['todas']);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const { speak, transcript, clearTranscript } = useVoiceAssistant();

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const apiCategories = await getCategorias();
        // Combinar "todas" con las categorías de la API
        const categoryNames = apiCategories.map(cat => cat.nombre.toLowerCase());
        setCategories(['todas', ...categoryNames]);
        setLoadingCategories(false);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setCategories(['todas']);
        setLoadingCategories(false);
        speak('No pude conectarme con el servidor de categorías');
      }
    };

    fetchCategories();
  }, [speak]);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const apiProducts = await getProductos();
        
        // Transformar productos de Django al formato del frontend
        const transformedProducts = apiProducts.map(prod => ({
          id: prod.id,
          name: prod.nombre,
          price: parseFloat(prod.precio),
          description: prod.descripcion || '',
          image: prod.imagen || 'https://via.placeholder.com/300x200/007bff/ffffff?text=Producto',
          category: prod.categoria_nombre ? prod.categoria_nombre.toLowerCase() : 'sin categoría',
          stock: prod.stock,
          rating: 4.5, // Valor por defecto, puede agregarse al modelo más adelante
          estado: prod.estado
        }));
        
        setAllProducts(transformedProducts);
        setProducts(transformedProducts);
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProducts([]);
        setAllProducts([]);
        setLoadingProducts(false);
        speak('No pude cargar los productos del servidor');
      }
    };

    fetchProducts();
  }, [speak]);

  // Procesar comandos de voz
  const processVoiceCommand = useCallback((command) => {
    const cmd = command.toLowerCase().trim();
    console.log('Comando recibido:', cmd);

    // Agregar producto al carrito
    if (cmd.includes('agregar') || cmd.includes('añadir')) {
      const productMatches = products.filter(p => 
        cmd.includes(p.name.toLowerCase()) || 
        cmd.includes(p.category.toLowerCase())
      );

      if (productMatches.length > 0) {
        const product = productMatches[0];
        addToCart(product);
        speak(`He agregado ${product.name} al carrito`);
      } else {
        speak('No encontré ese producto. ¿Puedes repetir el nombre?');
      }
      clearTranscript();
      return;
    }

    // Ver carrito
    if (cmd.includes('ver carrito') || cmd.includes('mostrar carrito')) {
      if (cartItems.length === 0) {
        speak('Tu carrito está vacío');
      } else {
        const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        speak(`Tienes ${total} artículos en el carrito`);
      }
      clearTranscript();
      return;
    }

    // Buscar producto
    if (cmd.includes('buscar') || cmd.includes('busca')) {
      const searchTerm = cmd.replace(/buscar|busca/g, '').trim();
      if (searchTerm) {
        setSearchQuery(searchTerm);
        // Buscar en todos los productos
        const results = allProducts.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        speak(`Encontré ${results.length} producto${results.length !== 1 ? 's' : ''} con ${searchTerm}`);
      }
      clearTranscript();
      return;
    }

    // Leer productos disponibles
    if (cmd.includes('leer productos') || cmd.includes('qué productos hay') || cmd.includes('que productos hay')) {
      if (products.length === 0) {
        speak('No hay productos disponibles');
      } else {
        const productNames = products.slice(0, 5).map(p => p.name).join(', ');
        speak(`Tenemos los siguientes productos: ${productNames}${products.length > 5 ? ', y más' : ''}`);
      }
      clearTranscript();
      return;
    }

    // Vaciar carrito
    if (cmd.includes('vaciar carrito') || cmd.includes('limpiar carrito')) {
      clearCart();
      speak('He vaciado tu carrito');
      clearTranscript();
      return;
    }

    // Finalizar compra
    if (cmd.includes('finalizar compra') || cmd.includes('terminar compra') || cmd.includes('comprar')) {
      if (cartItems.length === 0) {
        speak('Tu carrito está vacío. Agrega productos antes de finalizar la compra');
      } else {
        handleCheckout();
      }
      clearTranscript();
      return;
    }

    // Filtrar por categoría
    const categoryMatch = categories.find(cat => 
      cmd.includes(cat.toLowerCase())
    );
    if (categoryMatch && cmd.includes('categoría')) {
      setSelectedCategory(categoryMatch);
      speak(`Mostrando productos de ${categoryMatch}`);
      clearTranscript();
      return;
    }

    // Comando no reconocido
    if (cmd.length > 0) {
      speak('No entendí ese comando. Prueba con: agregar producto, ver carrito, leer productos, o finalizar compra');
      clearTranscript();
    }
  }, [products, cartItems, speak, clearTranscript, categories]);

  // Efecto para procesar transcripciones
  useEffect(() => {
    if (transcript) {
      processVoiceCommand(transcript);
    }
  }, [transcript, processVoiceCommand]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCartItems(cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        speak(`No hay más stock disponible de ${product.name}`);
      }
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Finalizar compra
  const handleCheckout = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    speak(`Tu compra de ${totalItems} artículos por un total de ${total.toFixed(2)} dólares ha sido procesada. ¡Gracias por tu compra!`);
    
    // Aquí se integraría con el backend de Django
    console.log('Procesando compra:', {
      items: cartItems,
      total: total
    });
    
    // Limpiar carrito después de 2 segundos
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  // Filtrar productos según búsqueda y categoría
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'todas' || 
      product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shop-container">
      {/* Asistente de Voz */}
      <VoiceAssistant onCommand={processVoiceCommand} />

      {/* Header */}
      <header className="shop-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-shopping-basket"></i>
            VocalCart - Tienda de Alimentos
          </h1>
          <p className="header-subtitle">
            🎤 Compra alimentos frescos con tu voz - Accesible para todos
          </p>
        </div>
      </header>

      {/* Barra de búsqueda y filtros */}
      <div className="shop-filters">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar alimentos... o usa tu voz: 'buscar manzanas'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="category-filters">
          <label>
            <i className="fas fa-filter"></i>
            Categoría:
          </label>
          {loadingCategories ? (
            <div className="loading-categories">
              <i className="fas fa-spinner fa-spin"></i>
              Cargando categorías...
            </div>
          ) : (
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  className={`btn-category ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resultados */}
      <div className="shop-results">
        <p className="results-count">
          {loadingProducts ? (
            <span><i className="fas fa-spinner fa-spin"></i> Cargando productos...</span>
          ) : filteredProducts.length === 0 ? (
            'No se encontraron productos'
          ) : (
            `Mostrando ${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''}`
          )}
        </p>
      </div>

      {/* Grid de productos */}
      {loadingProducts ? (
        <div className="loading-products">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando productos desde el servidor...</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {/* Mensaje si no hay productos */}
          {filteredProducts.length === 0 && !loadingProducts && (
            <div className="no-products">
              <i className="fas fa-search"></i>
              <h3>No se encontraron productos</h3>
              <p>Intenta con otra búsqueda o categoría</p>
              <button 
                className="btn-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todas');
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </>
      )}

      {/* Carrito de compras */}
      <ShoppingCart
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};
