import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { VoiceDiagnostics } from '../components/VoiceDiagnostics';
import { ProductCard } from '../components/ProductCard';
import { ShoppingCart } from '../components/ShoppingCart';
import { CheckoutModal } from '../components/CheckoutModal';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { getCategorias, getProductos, processCheckout } from '../services/api';
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
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  // Control de comandos procesados para evitar duplicados
  const lastProcessedCommand = useRef('');
  const lastProcessedTime = useRef(0);
  const commandProcessedSuccessfully = useRef(false);
  
  const { speak, transcript, clearTranscript, startListening, isListening } = useVoiceAssistant();

  // Mensaje de bienvenida con síntesis de voz
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🎤 Bienvenido a Vocal Cart - Push-to-Talk activado');
      console.log('⌨️ Mantén presionada la BARRA ESPACIADORA para hablar');
      
      // Hablar mensaje de bienvenida (usando Web Speech API synthesis)
      speak('Bienvenido a Vocal Cart. Mantén presionada la barra espaciadora para hablar.');
    }, 1500);

    return () => clearTimeout(timer);
  }, [speak]);

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

  // Procesar comandos de voz (optimizado para discapacidad visual)
  const processVoiceCommand = useCallback((command) => {
    // No procesar comandos mientras todavía está escuchando
    if (isListening) {
      console.log('⏸️ Esperando a que termine el reconocimiento...');
      return;
    }
    
    const cmd = command.toLowerCase().trim();
    console.log('🎤 Comando recibido:', cmd);
    
    // Prevenir procesamiento duplicado del mismo comando
    const now = Date.now();
    if (cmd === lastProcessedCommand.current && (now - lastProcessedTime.current) < 2000) {
      console.log('⏭️ Comando duplicado ignorado (mismo comando en <2s)');
      return;
    }
    
    // Si el comando ya fue procesado exitosamente, no procesarlo de nuevo
    if (commandProcessedSuccessfully.current && cmd === lastProcessedCommand.current) {
      console.log('⏭️ Comando ya procesado exitosamente, ignorando');
      return;
    }
    
    // Guardar el comando actual ANTES de resetear la bandera
    lastProcessedCommand.current = cmd;
    lastProcessedTime.current = now;
    
    // Resetear la bandera de comando procesado (se marcará como true si se procesa exitosamente)
    commandProcessedSuccessfully.current = false;
    
    console.log('✅ Comando aceptado para procesamiento:', cmd);

    // ===== COMANDO: AYUDA =====
    if (cmd.includes('ayuda') || cmd.includes('comandos') || cmd.includes('qué puedo decir') || cmd.includes('que puedo decir')) {
      const ayuda = 'Comandos disponibles. ' +
                    'Para agregar productos di: agregar seguido de la cantidad y el nombre del producto. Por ejemplo, agregar cinco manzanas. ' +
                    'Para ver el carrito di: ver carrito o leer carrito. ' +
                    'Para conocer productos di: leer productos o qué productos hay. ' +
                    'Para buscar di: buscar seguido del nombre. ' +
                    'Para vaciar el carrito di: vaciar carrito. ' +
                    'Para finalizar la compra di: finalizar compra. ' +
                    'Para información de un producto di: información de seguido del nombre del producto. ' +
                    'Di ayuda en cualquier momento para escuchar esta lista.';
      commandProcessedSuccessfully.current = true;
      speak(ayuda);
      clearTranscript();
      return;
    }

    // ===== COMANDO: AGREGAR PRODUCTO CON CANTIDAD =====
    if (cmd.includes('agregar') || cmd.includes('añadir') || cmd.includes('agrega')) {
      console.log('🛒 Procesando comando de agregar:', cmd);
      
      // Diccionario completo de números en español
      const numberWords = {
        'cero': 0,
        'uno': 1, 'una': 1, 'un': 1,
        'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
        'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9,
        'diez': 10, 'once': 11, 'doce': 12, 'trece': 13,
        'catorce': 14, 'quince': 15,
        'dieciséis': 16, 'dieciseis': 16,
        'diecisiete': 17, 'dieciocho': 18, 'diecinueve': 19,
        'veinte': 20, 'veintiuno': 21, 'veintiuna': 21,
        'veintidós': 22, 'veintidos': 22,
        'veintitrés': 23, 'veintitres': 23,
        'veinticuatro': 24, 'veinticinco': 25,
        'veintiséis': 26, 'veintiseis': 26,
        'veintisiete': 27, 'veintiocho': 28, 'veintinueve': 29,
        'treinta': 30, 'cuarenta': 40, 'cincuenta': 50,
        'sesenta': 60, 'setenta': 70, 'ochenta': 80, 'noventa': 90
      };
      
      let cantidad = 1;
      let cantidadDetectada = false;
      
      // Extraer la parte después de "agregar/añadir"
      const comandoPartes = cmd.split(/agregar|añadir|agrega/i);
      const parteRelevante = comandoPartes[1] ? comandoPartes[1].trim() : '';
      
      console.log('📝 Parte relevante del comando:', parteRelevante);
      console.log('🔍 Buscando cantidad en:', parteRelevante);
      
      // Primero buscar número en dígitos (más confiable)
      const digitMatch = parteRelevante.match(/\b(\d+)\b/);
      if (digitMatch) {
        cantidad = parseInt(digitMatch[1]);
        cantidadDetectada = true;
        console.log('✅ Cantidad detectada (dígito):', cantidad);
      }
      
      // Si no hay dígito, buscar números en palabras
      if (!cantidadDetectada) {
        console.log('⚠️ No se encontró dígito, buscando en palabras...');
        // Primero buscar números compuestos (más específicos)
        const numerosOrdenados = Object.entries(numberWords).sort((a, b) => b[0].length - a[0].length);
        
        for (const [palabra, numero] of numerosOrdenados) {
          const regex = new RegExp(`\\b${palabra}\\b`, 'i');
          if (regex.test(parteRelevante)) {
            cantidad = numero;
            cantidadDetectada = true;
            console.log('✅ Cantidad detectada (palabra):', cantidad, `"${palabra}"`);
            break;
          }
        }
      }
      
      // Manejar números compuestos como "treinta y cinco"
      if (!cantidadDetectada) {
        const compuestoMatch = parteRelevante.match(/\b(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)\s+y\s+(uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/i);
        if (compuestoMatch) {
          const decena = numberWords[compuestoMatch[1].toLowerCase()] || 0;
          const unidad = numberWords[compuestoMatch[2].toLowerCase()] || 0;
          cantidad = decena + unidad;
          cantidadDetectada = true;
          console.log('✅ Cantidad detectada (compuesto):', cantidad, `(${compuestoMatch[0]})`);
        }
      }
      
      if (!cantidadDetectada) {
        console.log('ℹ️ No se detectó cantidad específica, usando default: 1');
      }
      
      console.log('🔢 Cantidad final a agregar:', cantidad);
      console.log('🔢 Tipo de dato:', typeof cantidad);
      console.log('🔢 Valor numérico verificado:', Number(cantidad));

      // Buscar producto por nombre o categoría
      const productMatches = products.filter(p => 
        cmd.includes(p.name.toLowerCase()) || 
        p.name.toLowerCase().split(' ').some(word => cmd.includes(word))
      );

      if (productMatches.length > 0) {
        const product = productMatches[0];
        console.log('🎯 Producto encontrado:', product.name);
        console.log('🔢 IMPORTANTE: Cantidad que se va a usar:', cantidad);
        
        // Verificar stock disponible
        const currentInCart = cartItems.find(item => item.id === product.id)?.quantity || 0;
        const availableStock = product.stock - currentInCart;
        
        console.log(`📊 Stock: total=${product.stock}, en carrito=${currentInCart}, disponible=${availableStock}, solicitado=${cantidad}`);
        
        if (availableStock < cantidad) {
          speak(`Lo siento, solo hay ${availableStock} unidades disponibles de ${product.name}. ${currentInCart > 0 ? `Ya tienes ${currentInCart} en el carrito.` : ''}`);
          clearTranscript();
          return;
        }
        
        console.log(`📦 Agregando EXACTAMENTE ${cantidad} unidades de ${product.name} al carrito...`);
        console.log(`🔢 CANTIDAD A AGREGAR: ${cantidad} (tipo: ${typeof cantidad})`);
        
        // IMPORTANTE: Capturar la cantidad en una constante para evitar que se modifique
        const cantidadFinal = Number(cantidad);
        console.log(`🔒 CANTIDAD BLOQUEADA: ${cantidadFinal}`);
        
        // Agregar la cantidad especificada de una sola vez
        const existingItem = cartItems.find(item => item.id === product.id);
        
        console.log(`📋 Producto existente en carrito:`, existingItem ? `Sí (${existingItem.quantity} unidades)` : 'No');
        
        if (existingItem) {
          // Si ya existe, actualizar la cantidad sumando la nueva cantidad
          const nuevaCantidad = existingItem.quantity + cantidadFinal;
          console.log(`➕ Sumando ${cantidadFinal} a las ${existingItem.quantity} existentes = ${nuevaCantidad}`);
          setCartItems(cartItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: nuevaCantidad }
              : item
          ));
        } else {
          // Si no existe, agregar con la cantidad especificada
          console.log(`🆕 Creando nuevo item con cantidad: ${cantidadFinal}`);
          setCartItems([...cartItems, { ...product, quantity: cantidadFinal }]);
        }
        
        const totalInCart = currentInCart + cantidadFinal;
        const precioTotal = product.price * cantidadFinal;
        
        console.log(`✅ CONFIRMACIÓN: Se agregaron ${cantidadFinal} unidades`);
        console.log(`📊 Total en carrito ahora: ${totalInCart} unidades de ${product.name}`);
        
        // Mensaje de confirmación ULTRA CORTO
        commandProcessedSuccessfully.current = true;
        speak(`${cantidadFinal} ${product.name}. Total ${totalInCart}.`);
        
        console.log(`✅ Agregado exitosamente: ${cantidadFinal} x ${product.name}`);
        console.log(`💰 Precio total: ${precioTotal.toFixed(2)} pesos`);
        console.log(`🛒 Total en carrito de este producto: ${totalInCart} unidades`);
      } else {
        console.log('❌ Producto no encontrado en el comando:', cmd);
        commandProcessedSuccessfully.current = true; // También marcamos como procesado aunque no encontró producto
        speak('No encontré ese producto. Por favor, di leer productos para escuchar los productos disponibles.');
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: LEER/VER CARRITO COMPLETO =====
    if (cmd.includes('leer carrito') || cmd.includes('ver carrito') || cmd.includes('mostrar carrito') || cmd.includes('qué hay en el carrito') || cmd.includes('que hay en el carrito')) {
      commandProcessedSuccessfully.current = true;
      if (cartItems.length === 0) {
        speak('Tu carrito está vacío. Di leer productos para conocer los productos disponibles.');
      } else {
        let mensaje = `Tienes ${cartItems.length} ${cartItems.length === 1 ? 'producto' : 'productos'} en el carrito. `;
        
        cartItems.forEach((item, index) => {
          mensaje += `${index + 1}. ${item.name}, cantidad: ${item.quantity}, precio unitario: ${item.price} pesos, subtotal: ${(item.price * item.quantity).toFixed(2)} pesos. `;
        });
        
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        mensaje += `Total de artículos: ${totalItems}. Total a pagar: ${totalPrice.toFixed(2)} pesos.`;
        
        speak(mensaje);
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: INFORMACIÓN DE PRODUCTO =====
    if (cmd.includes('información') || cmd.includes('informacion') || cmd.includes('detalles') || cmd.includes('precio de') || cmd.includes('cuánto cuesta') || cmd.includes('cuanto cuesta')) {
      commandProcessedSuccessfully.current = true;
      const productMatches = products.filter(p => 
        cmd.includes(p.name.toLowerCase()) || 
        p.name.toLowerCase().split(' ').some(word => cmd.includes(word))
      );

      if (productMatches.length > 0) {
        const product = productMatches[0];
        const mensaje = `${product.name}. ` +
                       `Categoría: ${product.category}. ` +
                       `Precio: ${product.price} pesos. ` +
                       `${product.description ? product.description + '. ' : ''}` +
                       `Stock disponible: ${product.stock} unidades. ` +
                       `Di agregar ${product.name} para agregarlo al carrito.`;
        speak(mensaje);
      } else {
        speak('No encontré información de ese producto. Di leer productos para conocer los productos disponibles.');
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: BUSCAR PRODUCTO =====
    if (cmd.includes('buscar') || cmd.includes('busca') || cmd.includes('encuentra')) {
      commandProcessedSuccessfully.current = true;
      const searchTerm = cmd.replace(/buscar|busca|encuentra/g, '').trim();
      if (searchTerm) {
        setSearchQuery(searchTerm);
        
        const results = allProducts.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (results.length === 0) {
          speak(`No encontré productos con ${searchTerm}. Di leer productos para conocer todos los productos disponibles.`);
        } else if (results.length === 1) {
          const p = results[0];
          speak(`Encontré un producto: ${p.name}. Categoría: ${p.category}. Precio: ${p.price} pesos. Di agregar ${p.name} para agregarlo al carrito.`);
        } else {
          let mensaje = `Encontré ${results.length} productos con ${searchTerm}. `;
          results.slice(0, 5).forEach((p, i) => {
            mensaje += `${i + 1}. ${p.name}, ${p.price} pesos. `;
          });
          if (results.length > 5) {
            mensaje += `Y ${results.length - 5} productos más. `;
          }
          speak(mensaje);
        }
      } else {
        speak('No escuché el nombre del producto a buscar. Por favor, di buscar seguido del nombre del producto.');
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: LEER PRODUCTOS DISPONIBLES =====
    if (cmd.includes('leer productos') || cmd.includes('qué productos hay') || cmd.includes('que productos hay') || cmd.includes('mostrar productos') || cmd.includes('listar productos')) {
      commandProcessedSuccessfully.current = true;
      if (products.length === 0) {
        speak('No hay productos disponibles en este momento.');
      } else {
        let mensaje = `Hay ${products.length} productos disponibles. `;
        
        products.slice(0, 10).forEach((p, index) => {
          mensaje += `${index + 1}. ${p.name}, categoría: ${p.category}, precio: ${p.price} pesos. `;
        });
        
        if (products.length > 10) {
          mensaje += `Y ${products.length - 10} productos más. Di buscar para encontrar un producto específico.`;
        } else {
          mensaje += `Para agregar un producto, di agregar seguido del nombre y la cantidad.`;
        }
        
        speak(mensaje);
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: LEER CATEGORÍAS =====
    if (cmd.includes('categorías') || cmd.includes('categorias') || cmd.includes('qué categorías hay') || cmd.includes('que categorias hay')) {
      commandProcessedSuccessfully.current = true;
      const categoriasDisponibles = categories.filter(c => c !== 'todas');
      if (categoriasDisponibles.length > 0) {
        let mensaje = `Tenemos ${categoriasDisponibles.length} categorías: `;
        categoriasDisponibles.forEach((cat, i) => {
          mensaje += `${i + 1}. ${cat}. `;
        });
        mensaje += 'Di filtrar por seguido del nombre de la categoría para ver solo esos productos.';
        speak(mensaje);
      } else {
        speak('No hay categorías disponibles.');
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: FILTRAR POR CATEGORÍA =====
    if (cmd.includes('filtrar') || cmd.includes('categoría') || cmd.includes('categoria') || cmd.includes('mostrar solo')) {
      commandProcessedSuccessfully.current = true;
      const categoryMatch = categories.find(cat => 
        cmd.includes(cat.toLowerCase()) && cat !== 'todas'
      );
      
      if (categoryMatch) {
        setSelectedCategory(categoryMatch);
        const productosEnCategoria = allProducts.filter(p => p.category.toLowerCase() === categoryMatch.toLowerCase());
        speak(`Mostrando ${productosEnCategoria.length} productos de la categoría ${categoryMatch}. Di leer productos para escucharlos.`);
      } else if (cmd.includes('todas') || cmd.includes('todos')) {
        setSelectedCategory('todas');
        speak(`Mostrando todos los productos. Hay ${allProducts.length} productos disponibles.`);
      } else {
        speak('No entendí qué categoría quieres filtrar. Di qué categorías hay para escuchar las categorías disponibles.');
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: VACIAR CARRITO =====
    if (cmd.includes('vaciar carrito') || cmd.includes('limpiar carrito') || cmd.includes('borrar carrito') || cmd.includes('eliminar todo del carrito')) {
      commandProcessedSuccessfully.current = true;
      if (cartItems.length === 0) {
        speak('Tu carrito ya está vacío.');
      } else {
        const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        clearCart();
        speak(`He vaciado tu carrito. Se eliminaron ${itemsCount} artículos.`);
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: QUITAR/ELIMINAR PRODUCTO DEL CARRITO =====
    if (cmd.includes('quitar') || cmd.includes('eliminar') || cmd.includes('remover')) {
      commandProcessedSuccessfully.current = true;
      const productMatches = cartItems.filter(item => 
        cmd.includes(item.name.toLowerCase())
      );

      if (productMatches.length > 0) {
        const item = productMatches[0];
        removeFromCart(item.id);
        speak(`He quitado ${item.name} del carrito.`);
      } else {
        speak('No encontré ese producto en el carrito. Di leer carrito para escuchar lo que tienes.');
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO: FINALIZAR COMPRA =====
    // Solo procesar este comando si el modal NO está abierto
    // Si el modal está abierto, el CheckoutModal se encargará de procesar los comandos
    if (!showCheckoutModal && (cmd.includes('finalizar compra') || cmd.includes('terminar compra') || cmd.includes('comprar') || cmd.includes('pagar') || cmd.includes('proceder al pago'))) {
      // Marcar como procesado ANTES de cualquier otra operación
      commandProcessedSuccessfully.current = true;
      console.log('✅ Comando "finalizar compra" procesado exitosamente en Shop');
      
      if (cartItems.length === 0) {
        speak('Tu carrito está vacío. Agrega productos antes de finalizar la compra. Di leer productos para conocer los productos disponibles.');
      } else {
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        speak(`Procediendo a finalizar la compra. Tienes ${totalItems} artículos. Total a pagar: ${totalPrice.toFixed(2)} pesos.`);
        handleCheckout();
      }
      clearTranscript();
      return; // IMPORTANTE: return aquí para evitar que continúe al mensaje de error
    }
    
    // Si el modal está abierto, ignorar comandos de la tienda (el CheckoutModal los procesará)
    if (showCheckoutModal) {
      console.log('📦 Modal abierto, ignorando comando de Shop. El CheckoutModal lo procesará.');
      return;
    }

    // ===== COMANDO: TOTAL DEL CARRITO =====
    if (cmd.includes('total') || cmd.includes('cuánto debo') || cmd.includes('cuanto debo') || cmd.includes('cuánto es') || cmd.includes('cuanto es')) {
      commandProcessedSuccessfully.current = true;
      if (cartItems.length === 0) {
        speak('Tu carrito está vacío, el total es cero pesos.');
      } else {
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        speak(`El total de tu carrito es ${totalPrice.toFixed(2)} pesos por ${totalItems} artículos.`);
      }
      clearTranscript();
      return;
    }

    // ===== COMANDO NO RECONOCIDO =====
    // Solo mostrar mensaje de error si el comando NO fue procesado exitosamente
    if (cmd.length > 0 && !commandProcessedSuccessfully.current) {
      console.log('❌ Comando no reconocido:', cmd);
      console.log('🔍 Estado de commandProcessedSuccessfully:', commandProcessedSuccessfully.current);
      speak('No entendí ese comando. Di ayuda para escuchar todos los comandos disponibles.');
      clearTranscript();
    } else if (cmd.length > 0 && commandProcessedSuccessfully.current) {
      console.log('✅ Comando procesado exitosamente, no se muestra error');
    }
  }, [products, allProducts, cartItems, speak, clearTranscript, categories, setSearchQuery, setSelectedCategory, isListening, showCheckoutModal]);

  // Efecto para procesar transcripciones
  useEffect(() => {
    if (transcript && !isListening) {
      // Prevenir procesamiento duplicado
      const cmd = transcript.toLowerCase().trim();
      if (cmd === lastProcessedCommand.current) {
        console.log('⏭️ Transcript duplicado ignorado en useEffect');
        return;
      }
      
      // Esperar un momento después de que termine el reconocimiento antes de procesar
      // Esto evita que el bot hable mientras el usuario todavía está hablando
      const timer = setTimeout(() => {
        // Verificar nuevamente antes de procesar
        if (!isListening && transcript) {
          processVoiceCommand(transcript);
        }
      }, 500); // Esperar 500ms después de que termine el reconocimiento
      
      return () => clearTimeout(timer);
    }
  }, [transcript, processVoiceCommand, isListening]);

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

  // Abrir modal de checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      speak('Tu carrito está vacío. Agrega productos antes de finalizar la compra');
      return;
    }
    setShowCheckoutModal(true);
  };

  // Procesar compra completa
  const handleCheckoutComplete = async (checkoutData) => {
    try {
      const result = await processCheckout(checkoutData);
      
      if (result.success) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        speak(`¡Compra exitosa! Tu pedido número ${result.compraId} de ${totalItems} artículos por ${total.toFixed(2)} dólares ha sido registrado. ¡Gracias por tu compra!`);
        
        // Cerrar modal y limpiar carrito
        setShowCheckoutModal(false);
        clearCart();
        
        // Mostrar toast de éxito
        toast.success(
          <div>
            <strong>¡Compra completada con éxito!</strong>
            <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
              <div>📦 Pedido N°: <strong>{result.compraId}</strong></div>
              <div>💰 Total: <strong>${total.toFixed(2)}</strong></div>
              <div>📍 {checkoutData.requiere_envio 
                ? '🚚 Tu pedido será enviado a la dirección indicada' 
                : '🏪 Puedes recoger tu pedido en la tienda'}
              </div>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      speak('Hubo un error al procesar tu compra. Por favor, intenta nuevamente.');
      
      toast.error(
        'Error al procesar la compra. Por favor, intenta nuevamente.',
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
      
      throw error;
    }
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

      {/* Diagnóstico de Voz */}
      <VoiceDiagnostics />

      {/* Botón de cerrar sesión */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 100 
      }}>
        <button
          onClick={() => {
            speak('Cerrando sesión');
            setTimeout(() => {
              window.location.href = 'http://localhost:8000/login';
            }, 500);
          }}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c82333';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#dc3545';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          Cerrar Sesión
        </button>
      </div>

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

      {/* Banner de instrucciones de voz */}
      {!isListening && (
        <div className="voice-help-banner" style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '15px',
          margin: '20px auto',
          maxWidth: '1200px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
            ⌨️ ¡Mantén presionada la BARRA ESPACIADORA para hablar!
          </h3>
          <p style={{ margin: '5px 0', fontSize: '1rem' }}>
            <strong>Push-to-Talk activado:</strong> Mantén presionada la <strong>BARRA ESPACIADORA ⎵</strong> mientras hablas, suéltala cuando termines.
          </p>
          <p style={{ margin: '5px 0', fontSize: '0.9rem', opacity: 0.9 }}>
            📢 Ejemplos: "agregar 5 manzanas", "ver carrito", "finalizar compra", "ayuda"
          </p>
        </div>
      )}

      {/* Display grande de transcripción en tiempo real */}
      {isListening && (
        <div style={{
          backgroundColor: '#ffc107',
          color: '#000',
          padding: '20px',
          margin: '20px auto',
          maxWidth: '1200px',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(255, 193, 7, 0.5)',
          border: '3px solid #fff',
          animation: 'pulse 1.5s infinite'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            🎤 ESCUCHANDO... Habla ahora
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: transcript ? '2rem' : '1.2rem', 
            fontWeight: 'bold',
            background: 'rgba(0, 0, 0, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {transcript || '⌨️ Mantén presionada la BARRA ESPACIADORA y habla...'}
          </p>
        </div>
      )}

      {/* Mostrar último comando procesado */}
      {!isListening && transcript && (
        <div style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '20px',
          margin: '20px auto',
          maxWidth: '1200px',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
          border: '3px solid #fff'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: 'bold' }}>
            ✅ Comando procesado
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '1.8rem', 
            fontWeight: 'bold',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '15px',
            borderRadius: '10px',
            letterSpacing: '0.5px'
          }}>
            "{transcript}"
          </p>
        </div>
      )}

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

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartItems={cartItems}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </div>
  );
};
