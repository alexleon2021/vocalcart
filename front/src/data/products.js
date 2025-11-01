// Datos de productos de ejemplo para la tienda de alimentos

export const productsData = [
  // Frutas
  {
    id: 1,
    name: 'Manzanas Rojas',
    price: 2.99,
    description: 'Manzanas rojas frescas de la temporada, ricas en vitaminas y fibra (1 kg)',
    image: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Manzanas',
    category: 'frutas',
    stock: 50,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Plátanos',
    price: 1.99,
    description: 'Plátanos frescos, excelente fuente de potasio y energía (1 kg)',
    image: 'https://via.placeholder.com/300x200/ffe66d/ffffff?text=Platanos',
    category: 'frutas',
    stock: 60,
    rating: 4.9
  },
  {
    id: 3,
    name: 'Naranjas',
    price: 3.49,
    description: 'Naranjas jugosas para zumo o consumo directo, ricas en vitamina C (1 kg)',
    image: 'https://via.placeholder.com/300x200/ff9f43/ffffff?text=Naranjas',
    category: 'frutas',
    stock: 45,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Fresas',
    price: 4.99,
    description: 'Fresas frescas de temporada, perfectas para postres y batidos (500g)',
    image: 'https://via.placeholder.com/300x200/ee5a6f/ffffff?text=Fresas',
    category: 'frutas',
    stock: 30,
    rating: 4.9
  },

  // Verduras
  {
    id: 5,
    name: 'Tomates',
    price: 2.49,
    description: 'Tomates maduros y jugosos, ideales para ensaladas y salsas (1 kg)',
    image: 'https://via.placeholder.com/300x200/ff6348/ffffff?text=Tomates',
    category: 'verduras',
    stock: 55,
    rating: 4.6
  },
  {
    id: 6,
    name: 'Lechuga Fresca',
    price: 1.79,
    description: 'Lechuga verde crujiente y fresca, perfecta para ensaladas (1 unidad)',
    image: 'https://via.placeholder.com/300x200/26de81/ffffff?text=Lechuga',
    category: 'verduras',
    stock: 40,
    rating: 4.5
  },
  {
    id: 7,
    name: 'Zanahorias',
    price: 1.99,
    description: 'Zanahorias frescas ricas en betacaroteno y vitamina A (1 kg)',
    image: 'https://via.placeholder.com/300x200/fd9644/ffffff?text=Zanahorias',
    category: 'verduras',
    stock: 50,
    rating: 4.7
  },
  {
    id: 8,
    name: 'Brócoli',
    price: 3.29,
    description: 'Brócoli fresco, rico en vitaminas y minerales (500g)',
    image: 'https://via.placeholder.com/300x200/20bf6b/ffffff?text=Brocoli',
    category: 'verduras',
    stock: 35,
    rating: 4.6
  },

  // Cereales y Granos
  {
    id: 9,
    name: 'Arroz Blanco',
    price: 2.99,
    description: 'Arroz blanco de grano largo, ideal para acompañamientos (1 kg)',
    image: 'https://via.placeholder.com/300x200/f7f1e3/000000?text=Arroz',
    category: 'cereales',
    stock: 100,
    rating: 4.8
  },
  {
    id: 10,
    name: 'Pasta Integral',
    price: 1.89,
    description: 'Pasta integral de trigo, rica en fibra (500g)',
    image: 'https://via.placeholder.com/300x200/d4a574/ffffff?text=Pasta',
    category: 'cereales',
    stock: 80,
    rating: 4.5
  },
  {
    id: 11,
    name: 'Avena en Hojuelas',
    price: 3.49,
    description: 'Avena en hojuelas para desayunos saludables (500g)',
    image: 'https://via.placeholder.com/300x200/f3a683/ffffff?text=Avena',
    category: 'cereales',
    stock: 70,
    rating: 4.9
  },

  // Lácteos
  {
    id: 12,
    name: 'Leche Entera',
    price: 1.99,
    description: 'Leche entera fresca y pasteurizada (1 litro)',
    image: 'https://via.placeholder.com/300x200/ffffff/000000?text=Leche',
    category: 'lacteos',
    stock: 90,
    rating: 4.7
  },
  {
    id: 13,
    name: 'Yogur Natural',
    price: 2.49,
    description: 'Yogur natural cremoso, rico en probióticos (pack de 4)',
    image: 'https://via.placeholder.com/300x200/ffeaa7/000000?text=Yogur',
    category: 'lacteos',
    stock: 65,
    rating: 4.8
  },
  {
    id: 14,
    name: 'Queso Fresco',
    price: 4.99,
    description: 'Queso fresco para ensaladas y bocadillos (250g)',
    image: 'https://via.placeholder.com/300x200/fdcb6e/ffffff?text=Queso',
    category: 'lacteos',
    stock: 45,
    rating: 4.6
  },

  // Carnes
  {
    id: 15,
    name: 'Pechuga de Pollo',
    price: 7.99,
    description: 'Pechuga de pollo fresca sin hueso (1 kg)',
    image: 'https://via.placeholder.com/300x200/fab1a0/ffffff?text=Pollo',
    category: 'carnes',
    stock: 40,
    rating: 4.7
  },
  {
    id: 16,
    name: 'Carne de Res',
    price: 12.99,
    description: 'Carne de res magra para guisos y asados (1 kg)',
    image: 'https://via.placeholder.com/300x200/d63031/ffffff?text=Carne+Res',
    category: 'carnes',
    stock: 30,
    rating: 4.8
  },

  // Panadería
  {
    id: 17,
    name: 'Pan Integral',
    price: 2.29,
    description: 'Pan integral de molde, rico en fibra (500g)',
    image: 'https://via.placeholder.com/300x200/6c5ce7/ffffff?text=Pan+Integral',
    category: 'panaderia',
    stock: 55,
    rating: 4.6
  },
  {
    id: 18,
    name: 'Pan Francés',
    price: 1.49,
    description: 'Pan francés fresco del día (barra)',
    image: 'https://via.placeholder.com/300x200/dfe6e9/000000?text=Pan+Frances',
    category: 'panaderia',
    stock: 60,
    rating: 4.9
  },

  // Bebidas
  {
    id: 19,
    name: 'Jugo de Naranja',
    price: 3.99,
    description: 'Jugo de naranja natural 100% (1 litro)',
    image: 'https://via.placeholder.com/300x200/fdcb6e/ffffff?text=Jugo+Naranja',
    category: 'bebidas',
    stock: 50,
    rating: 4.7
  },
  {
    id: 20,
    name: 'Agua Mineral',
    price: 0.99,
    description: 'Agua mineral natural sin gas (1.5 litros)',
    image: 'https://via.placeholder.com/300x200/74b9ff/ffffff?text=Agua+Mineral',
    category: 'bebidas',
    stock: 120,
    rating: 4.8
  }
];

// Función para buscar productos por nombre
export const searchProducts = (query) => {
  if (!query) return productsData;
  
  const searchTerm = query.toLowerCase();
  return productsData.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
};

// Función para obtener producto por ID
export const getProductById = (id) => {
  return productsData.find(product => product.id === id);
};

// Función para obtener productos por categoría
export const getProductsByCategory = (category) => {
  return productsData.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

// Función para obtener todas las categorías
export const getCategories = () => {
  const categories = [...new Set(productsData.map(p => p.category))];
  return categories;
};
