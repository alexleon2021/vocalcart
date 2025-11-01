# VocalCart - Tienda con Asistente de Voz 🎤🛒

Una aplicación de comercio electrónico moderna construida con **React + Vite** que incluye un **asistente de voz completo** para personas con discapacidad visual.

## 🌟 Características Principales

### 🎙️ Asistente de Voz Avanzado
- **Reconocimiento de voz en español** (es-ES)
- **Síntesis de voz** con 3 tipos de voz seleccionables
- **Control de velocidad** ajustable (0.5x - 2.0x)
- **Panel flotante** con controles visuales
- **Modal de chat** para ver el historial de comandos
- **Ayuda integrada** para configurar permisos del micrófono

### 🛍️ Funcionalidades de Compras
- **12 productos de ejemplo** con información detallada
- **Carrito de compras lateral** con gestión de cantidades
- **Búsqueda de productos** por texto o voz
- **Filtros por categoría**
- **Cálculo automático** de subtotal, impuestos y total
- **Diseño responsive** adaptado a móviles y tablets

### ♿ Accesibilidad
- **100% navegable por voz**
- **Etiquetas ARIA** para lectores de pantalla
- **Alto contraste** en modo de accesibilidad
- **Atajos de teclado** (Alt+V, Alt+A)
- **Indicadores visuales** de estado

## 🎤 Comandos de Voz Disponibles

### Agregar Productos
```
"agregar laptop al carrito"
"añadir mouse logitech"
```

### Ver Carrito
```
"ver carrito"
"mostrar carrito"
```

### Buscar Productos
```
"buscar audífonos"
"busca teclado"
```

### Listar Productos
```
"leer productos disponibles"
"qué productos hay"
```

### Gestión del Carrito
```
"vaciar carrito"
"limpiar carrito"
```

### Finalizar Compra
```
"finalizar compra"
"terminar compra"
"comprar"
```

### Filtrar por Categoría
```
"mostrar categoría computadoras"
"filtrar por categoría accesorios"
```

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
cd vocalcart/front
npm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 3. Habilitar Permisos del Micrófono

1. Cuando el navegador solicite permisos, haz clic en **"Permitir"**
2. Si bloqueaste el micrófono, haz clic en el 🔒 de la barra de direcciones
3. Selecciona "Configuración del sitio"
4. Cambia "Micrófono" de "Bloqueado" a "Permitir"
5. Recarga la página

## 📁 Estructura del Proyecto

```
front/
├── src/
│   ├── components/
│   │   ├── VoiceAssistant.jsx    # Asistente de voz
│   │   ├── VoiceAssistant.css
│   │   ├── ProductCard.jsx       # Tarjeta de producto
│   │   ├── ProductCard.css
│   │   ├── ShoppingCart.jsx      # Carrito lateral
│   │   ├── ShoppingCart.css
│   │   ├── Shop.jsx              # Tienda principal
│   │   └── Shop.css
│   ├── hooks/
│   │   └── useVoiceAssistant.js  # Hook personalizado de voz
│   ├── data/
│   │   └── products.js           # Datos de productos
│   ├── App.jsx                   # Componente raíz
│   ├── App.css
│   └── main.jsx                  # Punto de entrada
├── index.html
├── package.json
└── vite.config.js
```

## 🔧 Tecnologías Utilizadas

- **React 19** - Librería de UI
- **Vite 7** - Build tool ultrarrápido
- **Web Speech API** - Reconocimiento y síntesis de voz
- **Font Awesome 6** - Iconos
- **CSS3** - Estilos modernos con gradientes y animaciones

## 🌐 Compatibilidad de Navegadores

| Navegador | Reconocimiento de Voz | Síntesis de Voz |
|-----------|----------------------|-----------------|
| Chrome    | ✅ Excelente         | ✅ Excelente    |
| Edge      | ✅ Excelente         | ✅ Excelente    |
| Safari    | ✅ Bueno             | ✅ Bueno        |
| Firefox   | ⚠️ Limitado          | ✅ Bueno        |
| Opera     | ✅ Bueno             | ✅ Bueno        |

**Recomendado:** Chrome o Edge para la mejor experiencia

## 🎨 Características Visuales

### Panel de Control de Voz (Esquina Superior Derecha)
- **Botón principal** - Activar/Desactivar reconocimiento
- **Control de velocidad** - Slider de 0.5x a 2.0x
- **Selector de voz** - 3 opciones (Predeterminada, Femenina, Masculina)
- **Indicador de estado** - Visual con LED de color
- **Botones de acción** - Chat y Ayuda

### Carrito de Compras (Botón Flotante Inferior Derecho)
- **Badge de cantidad** - Muestra número de artículos
- **Panel lateral** - Se desliza desde la derecha
- **Controles de cantidad** - +/- para cada producto
- **Resumen detallado** - Subtotal, impuestos, total
- **Botones de acción** - Vaciar y Finalizar compra

## 📱 Diseño Responsive

- **Desktop** (>1200px) - Grid de 4 columnas
- **Tablet** (768px-1200px) - Grid de 3 columnas
- **Mobile** (480px-768px) - Grid de 2 columnas
- **Small Mobile** (<480px) - Grid de 1 columna

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Alt+V` | Activar/Desactivar reconocimiento de voz |
| `Alt+A` | Abrir modal del asistente |

## 🔐 Seguridad y Privacidad

- El reconocimiento de voz se procesa **localmente en el navegador**
- **No se envían datos** a servidores externos
- Los permisos del micrófono pueden ser **revocados en cualquier momento**
- El carrito se almacena en el **estado local de React**

## 🚧 Desarrollo Futuro

### Integraciones Planeadas
- [ ] Conectar con API REST de Django
- [ ] Autenticación de usuarios
- [ ] Persistencia del carrito en backend
- [ ] Procesamiento de pagos
- [ ] Historial de pedidos
- [ ] Sistema de recomendaciones

### Mejoras del Asistente de Voz
- [ ] Soporte para más idiomas
- [ ] Comandos personalizables
- [ ] Reconocimiento de sinónimos mejorado
- [ ] Feedback háptico en móviles
- [ ] Modo "manos libres" completo

## 🐛 Solución de Problemas

### El reconocimiento de voz no funciona
1. Verifica que estés usando Chrome o Edge
2. Revisa los permisos del micrófono en el navegador
3. Asegúrate de que el micrófono funcione en otras aplicaciones
4. Recarga la página después de cambiar permisos

### Los comandos no se reconocen
1. Habla claramente y pausadamente
2. Usa las frases exactas de los comandos (o similares)
3. Verifica que el indicador de estado esté en "Escuchando..."
4. Revisa el chat del asistente para ver qué se capturó

### El carrito no se actualiza
1. Verifica que el producto tenga stock disponible
2. Abre la consola del navegador (F12) para ver errores
3. Recarga la página si persiste el problema

## 📞 Soporte

Para reportar problemas o sugerencias:
- Abre un issue en el repositorio
- Contacta al equipo de desarrollo

## 📄 Licencia

Este proyecto es parte de VocalCart y está desarrollado para propósitos educativos y de accesibilidad.

---

**¡Desarrollado con ❤️ para hacer las compras en línea accesibles para todos!**
