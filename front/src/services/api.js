// Configuración de la API
const API_BASE_URL = 'http://localhost:8000';

/**
 * Servicio para consumir la API de VocalCart
 */

// Obtener todas las categorías
export const getCategorias = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/`);
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getCategorias:', error);
    throw error;
  }
};

// Obtener una categoría por ID
export const getCategoria = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/${id}/`);
    if (!response.ok) {
      throw new Error('Error al obtener la categoría');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getCategoria:', error);
    throw error;
  }
};

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/producto/`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getProductos:', error);
    throw error;
  }
};

// Obtener un producto por ID
export const getProducto = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/producto/${id}/`);
    if (!response.ok) {
      throw new Error('Error al obtener el producto');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getProducto:', error);
    throw error;
  }
};

// Crear una nueva categoría
export const createCategoria = async (categoriaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoriaData),
    });
    if (!response.ok) {
      throw new Error('Error al crear la categoría');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en createCategoria:', error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProducto = async (productoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/producto/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productoData),
    });
    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en createProducto:', error);
    throw error;
  }
};

// Actualizar una categoría
export const updateCategoria = async (id, categoriaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoriaData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la categoría');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en updateCategoria:', error);
    throw error;
  }
};

// Actualizar un producto
export const updateProducto = async (id, productoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/producto/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productoData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar el producto');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en updateProducto:', error);
    throw error;
  }
};

// Eliminar una categoría
export const deleteCategoria = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categoria/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la categoría');
    }
    return true;
  } catch (error) {
    console.error('Error en deleteCategoria:', error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/producto/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }
    return true;
  } catch (error) {
    console.error('Error en deleteProducto:', error);
    throw error;
  }
};
