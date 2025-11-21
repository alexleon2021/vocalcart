# 🎤 Guía de Comandos de Voz - VocalCart Accesible

## 📋 Introducción

VocalCart está diseñado para ser 100% accesible mediante comandos de voz, especialmente para usuarios con discapacidad visual. El sistema proporciona retroalimentación de audio completa y descriptiva en cada paso.

## 🚀 Cómo Usar el Sistema

### Activar el Micrófono
1. Mantén presionada la **BARRA ESPACIADORA**
2. Habla tu comando claramente
3. Suelta la barra espaciadora cuando termines
4. Escucha la respuesta del sistema

### Mensaje de Bienvenida
Al abrir VocalCart, escucharás:
> "Bienvenido a Vocal Cart. Mantén presionada la barra espaciadora para hablar."

## 📚 Comandos Disponibles

### 🆘 AYUDA
Usa este comando cuando no sepas qué hacer o qué comandos están disponibles.

**Ejemplos:**
- "Ayuda"
- "Qué puedo decir"
- "Comandos"

**Respuesta del sistema:**
> "Comandos disponibles. Para agregar productos di: agregar seguido de la cantidad y el nombre del producto. Por ejemplo, agregar cinco manzanas. Para ver el carrito di: ver carrito o leer carrito..."

---

### ➕ AGREGAR PRODUCTOS AL CARRITO

Agrega productos especificando la cantidad y el nombre.

**Formato:** `agregar [cantidad] [nombre del producto]`

**Ejemplos:**
```
✅ "Agregar cinco manzanas"
✅ "Agregar 3 leches"
✅ "Añadir dos panes"
✅ "Agrega una naranja"
✅ "Agregar diez huevos"
```

**Respuesta del sistema:**
> "Perfecto. He agregado 5 manzanas al carrito. Precio unitario: 50 pesos. Total: 250 pesos. Ahora tienes 5 unidades de este producto."

**Si no hay stock suficiente:**
> "Lo siento, solo hay 3 unidades disponibles de manzanas. Ya tienes 2 en el carrito."

**Si el producto no existe:**
> "No encontré ese producto. Por favor, di leer productos para escuchar los productos disponibles."

---

### 📦 VER/LEER EL CARRITO

Escucha todos los productos en tu carrito con precios y cantidades.

**Ejemplos:**
```
✅ "Ver carrito"
✅ "Leer carrito"
✅ "Mostrar carrito"
✅ "Qué hay en el carrito"
```

**Respuesta del sistema (carrito con productos):**
> "Tienes 3 productos en el carrito. 1. Manzanas, cantidad: 5, precio unitario: 50 pesos, subtotal: 250 pesos. 2. Leche, cantidad: 2, precio unitario: 80 pesos, subtotal: 160 pesos. 3. Pan, cantidad: 1, precio unitario: 30 pesos, subtotal: 30 pesos. Total de artículos: 8. Total a pagar: 440 pesos."

**Respuesta del sistema (carrito vacío):**
> "Tu carrito está vacío. Di leer productos para conocer los productos disponibles."

---

### 📋 LISTAR PRODUCTOS DISPONIBLES

Escucha la lista completa de productos con sus precios.

**Ejemplos:**
```
✅ "Leer productos"
✅ "Qué productos hay"
✅ "Mostrar productos"
✅ "Listar productos"
```

**Respuesta del sistema:**
> "Hay 20 productos disponibles. 1. Manzanas, categoría: frutas, precio: 50 pesos. 2. Leche, categoría: lácteos, precio: 80 pesos. 3. Pan integral, categoría: panadería, precio: 30 pesos... Para agregar un producto, di agregar seguido del nombre y la cantidad."

---

### ℹ️ INFORMACIÓN DETALLADA DE UN PRODUCTO

Obtén información completa sobre un producto específico.

**Formato:** `información de [nombre del producto]`

**Ejemplos:**
```
✅ "Información de manzanas"
✅ "Detalles de leche"
✅ "Cuánto cuesta el pan"
✅ "Precio de las naranjas"
```

**Respuesta del sistema:**
> "Manzanas. Categoría: frutas. Precio: 50 pesos. Frutas frescas de temporada. Stock disponible: 100 unidades. Di agregar manzanas para agregarlo al carrito."

---

### 🔍 BUSCAR PRODUCTOS

Busca productos por nombre, categoría o descripción.

**Formato:** `buscar [término de búsqueda]`

**Ejemplos:**
```
✅ "Buscar leche"
✅ "Busca frutas"
✅ "Encuentra pan"
```

**Respuesta del sistema (un resultado):**
> "Encontré un producto: Leche entera. Categoría: lácteos. Precio: 80 pesos. Di agregar leche para agregarlo al carrito."

**Respuesta del sistema (múltiples resultados):**
> "Encontré 5 productos con frutas. 1. Manzanas, 50 pesos. 2. Naranjas, 40 pesos. 3. Plátanos, 30 pesos. 4. Fresas, 90 pesos. 5. Uvas, 120 pesos."

**Respuesta del sistema (sin resultados):**
> "No encontré productos con galletas. Di leer productos para conocer todos los productos disponibles."

---

### 🏷️ CATEGORÍAS

Conoce las categorías disponibles y filtra productos por categoría.

#### Listar Categorías
**Ejemplos:**
```
✅ "Qué categorías hay"
✅ "Categorías disponibles"
```

**Respuesta del sistema:**
> "Tenemos 8 categorías: 1. frutas. 2. verduras. 3. lácteos. 4. panadería. 5. carnes. 6. bebidas. 7. snacks. 8. despensa. Di filtrar por seguido del nombre de la categoría para ver solo esos productos."

#### Filtrar por Categoría
**Ejemplos:**
```
✅ "Filtrar por frutas"
✅ "Mostrar solo lácteos"
✅ "Categoría panadería"
```

**Respuesta del sistema:**
> "Mostrando 5 productos de la categoría frutas. Di leer productos para escucharlos."

#### Mostrar Todas las Categorías
**Ejemplos:**
```
✅ "Mostrar todas las categorías"
✅ "Filtrar por todas"
```

**Respuesta del sistema:**
> "Mostrando todos los productos. Hay 20 productos disponibles."

---

### 🗑️ VACIAR EL CARRITO

Elimina todos los productos del carrito.

**Ejemplos:**
```
✅ "Vaciar carrito"
✅ "Limpiar carrito"
✅ "Borrar carrito"
✅ "Eliminar todo del carrito"
```

**Respuesta del sistema:**
> "He vaciado tu carrito. Se eliminaron 8 artículos."

**Si el carrito ya está vacío:**
> "Tu carrito ya está vacío."

---

### ➖ QUITAR UN PRODUCTO DEL CARRITO

Elimina un producto específico del carrito.

**Formato:** `quitar [nombre del producto]`

**Ejemplos:**
```
✅ "Quitar manzanas"
✅ "Eliminar leche"
✅ "Remover pan"
```

**Respuesta del sistema:**
> "He quitado manzanas del carrito."

**Si el producto no está en el carrito:**
> "No encontré ese producto en el carrito. Di leer carrito para escuchar lo que tienes."

---

### 💰 TOTAL DEL CARRITO

Escucha el total a pagar sin leer todos los productos.

**Ejemplos:**
```
✅ "Total"
✅ "Cuánto debo"
✅ "Cuánto es"
```

**Respuesta del sistema:**
> "El total de tu carrito es 440 pesos por 8 artículos."

**Si el carrito está vacío:**
> "Tu carrito está vacío, el total es cero pesos."

---

### ✅ FINALIZAR LA COMPRA

Procede al pago y finaliza tu compra.

**Ejemplos:**
```
✅ "Finalizar compra"
✅ "Terminar compra"
✅ "Comprar"
✅ "Pagar"
✅ "Proceder al pago"
```

**Respuesta del sistema:**
> "Procediendo a finalizar la compra. Tienes 8 artículos. Total a pagar: 440 pesos."

**Si el carrito está vacío:**
> "Tu carrito está vacío. Agrega productos antes de finalizar la compra. Di leer productos para conocer los productos disponibles."

**Después de completar la compra:**
> "¡Compra exitosa! Tu pedido número 1234 de 8 artículos por 440 pesos ha sido registrado. ¡Gracias por tu compra!"

---

## 📖 Ejemplos de Flujos Completos

### Flujo 1: Compra Simple
```
Usuario: "Leer productos"
Sistema: "Hay 20 productos disponibles. 1. Manzanas, categoría: frutas, precio: 50 pesos..."

Usuario: "Agregar cinco manzanas"
Sistema: "Perfecto. He agregado 5 manzanas al carrito. Precio unitario: 50 pesos. Total: 250 pesos..."

Usuario: "Agregar dos leches"
Sistema: "Perfecto. He agregado 2 leche al carrito. Precio unitario: 80 pesos. Total: 160 pesos..."

Usuario: "Ver carrito"
Sistema: "Tienes 2 productos en el carrito. 1. Manzanas, cantidad: 5, precio unitario: 50 pesos..."

Usuario: "Finalizar compra"
Sistema: "Procediendo a finalizar la compra. Tienes 7 artículos. Total a pagar: 410 pesos."
```

### Flujo 2: Búsqueda y Categorías
```
Usuario: "Qué categorías hay"
Sistema: "Tenemos 8 categorías: 1. frutas. 2. verduras. 3. lácteos..."

Usuario: "Filtrar por frutas"
Sistema: "Mostrando 5 productos de la categoría frutas. Di leer productos para escucharlos."

Usuario: "Leer productos"
Sistema: "Hay 5 productos disponibles. 1. Manzanas, categoría: frutas, precio: 50 pesos..."

Usuario: "Buscar naranjas"
Sistema: "Encontré un producto: Naranjas. Categoría: frutas. Precio: 40 pesos..."

Usuario: "Agregar tres naranjas"
Sistema: "Perfecto. He agregado 3 naranjas al carrito..."
```

### Flujo 3: Información y Modificación
```
Usuario: "Información de leche"
Sistema: "Leche entera. Categoría: lácteos. Precio: 80 pesos. Leche fresca pasteurizada..."

Usuario: "Agregar dos leches"
Sistema: "Perfecto. He agregado 2 leche al carrito..."

Usuario: "Agregar cinco manzanas"
Sistema: "Perfecto. He agregado 5 manzanas al carrito..."

Usuario: "Leer carrito"
Sistema: "Tienes 2 productos en el carrito. 1. Leche, cantidad: 2... 2. Manzanas, cantidad: 5..."

Usuario: "Quitar leche"
Sistema: "He quitado leche del carrito."

Usuario: "Total"
Sistema: "El total de tu carrito es 250 pesos por 5 artículos."
```

---

## 🎯 Consejos para Mejores Resultados

### ✅ Buenas Prácticas

1. **Habla claro y pausado**
   - ✅ "Agregar... cinco... manzanas"
   - ❌ "Agregacincomanzanasrápido"

2. **Usa los nombres exactos de productos**
   - ✅ "Agregar leche entera"
   - ⚠️ "Agregar líquido blanco" (puede no funcionar)

3. **Especifica la cantidad**
   - ✅ "Agregar tres manzanas"
   - ✅ "Agregar 3 manzanas"
   - ⚠️ "Agregar manzanas" (agregará solo 1)

4. **Espera la respuesta antes de otro comando**
   - ✅ Escucha la confirmación completa
   - ❌ No interrumpas mientras habla el sistema

5. **Usa "ayuda" cuando tengas dudas**
   - ✅ "Ayuda" para escuchar todos los comandos
   - ✅ "Qué puedo decir" también funciona

### ⚠️ Evita

1. **Comandos ambiguos**
   - ❌ "Agregar eso"
   - ✅ "Agregar manzanas"

2. **Múltiples comandos a la vez**
   - ❌ "Agregar manzanas y leche y pan"
   - ✅ "Agregar manzanas" → esperar → "Agregar leche"

3. **Pausas muy largas mientras hablas**
   - ❌ "Agregar... (5 segundos)... manzanas"
   - ✅ "Agregar cinco manzanas"

---

## 🔊 Configuración de Voz

### Velocidad de Lectura
El sistema lee a velocidad normal (1.0x) por defecto. Actualmente no es ajustable por voz, pero se puede configurar en el código.

### Voces Disponibles
- El sistema usa voces del navegador (Microsoft voices en Edge)
- Voces en español tienen prioridad
- Si no hay voz en español, usa la primera disponible

---

## 🐛 Solución de Problemas

### "No entendí ese comando"
- **Causa:** El comando no coincide con ningún patrón conocido
- **Solución:** Di "ayuda" para escuchar los comandos disponibles
- **Ejemplo:** En vez de "comprar naranjas", di "agregar naranjas"

### "No encontré ese producto"
- **Causa:** El nombre del producto no coincide
- **Solución:** Di "leer productos" para escuchar los nombres exactos
- **Ejemplo:** En vez de "limón", puede ser "limones"

### "Tu carrito está vacío"
- **Causa:** Intentas finalizar compra sin productos
- **Solución:** Agrega productos primero con "agregar [producto]"

### "Solo hay X unidades disponibles"
- **Causa:** No hay suficiente stock
- **Solución:** Reduce la cantidad o elige otro producto

---

## 📊 Lista Completa de Comandos

### Navegación y Exploración
| Comando | Variaciones | Acción |
|---------|------------|--------|
| Ayuda | "comandos", "qué puedo decir" | Muestra lista de comandos |
| Leer productos | "qué productos hay", "mostrar productos" | Lista todos los productos |
| Qué categorías hay | "categorías disponibles" | Lista categorías |
| Buscar [producto] | "busca", "encuentra" | Busca productos |
| Información de [producto] | "detalles de", "precio de", "cuánto cuesta" | Info de un producto |

### Carrito
| Comando | Variaciones | Acción |
|---------|------------|--------|
| Agregar [cantidad] [producto] | "añadir", "agrega" | Agrega al carrito |
| Ver carrito | "leer carrito", "mostrar carrito" | Lee todo el carrito |
| Total | "cuánto debo", "cuánto es" | Dice el total |
| Quitar [producto] | "eliminar", "remover" | Quita un producto |
| Vaciar carrito | "limpiar carrito", "borrar carrito" | Vacía el carrito |

### Filtros
| Comando | Variaciones | Acción |
|---------|------------|--------|
| Filtrar por [categoría] | "mostrar solo", "categoría" | Filtra productos |
| Mostrar todas | "filtrar por todas" | Quita filtros |

### Compra
| Comando | Variaciones | Acción |
|---------|------------|--------|
| Finalizar compra | "terminar compra", "comprar", "pagar" | Procede al checkout |

---

## 💡 Características de Accesibilidad

### ✅ Retroalimentación Completa
- Cada acción es confirmada con voz
- Los precios siempre se mencionan
- Las cantidades se especifican claramente
- Los errores se explican de forma comprensible

### ✅ Contexto Claro
- El sistema siempre dice qué paso seguir
- Las sugerencias son específicas
- Los nombres de productos se mencionan completos

### ✅ Navegación Fácil
- No se requiere uso del mouse
- Todo funciona con la barra espaciadora
- Los comandos son intuitivos y en lenguaje natural

### ✅ Información Detallada
- Precios unitarios y totales
- Stock disponible
- Categorías de productos
- Cantidades en el carrito

---

## 📝 Notas Técnicas

### Reconocimiento de Números
El sistema entiende números en:
- **Palabras:** uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce, trece, catorce, quince, dieciséis, diecisiete, dieciocho, diecinueve, veinte
- **Dígitos:** 1, 2, 3, 4, 5, etc.

### Coincidencia de Productos
- Busca en el nombre del producto
- Busca palabras individuales del nombre
- No distingue mayúsculas/minúsculas
- Busca en la categoría si no encuentra por nombre

### Reconocimiento de Comandos
- No distingue mayúsculas/minúsculas
- Ignora espacios extra
- Acepta múltiples variaciones del mismo comando
- Robusto ante errores de pronunciación comunes

---

**Última actualización:** 11 de noviembre de 2025
**Versión del sistema:** VocalCart v3.0 Híbrido
**Optimizado para:** Usuarios con discapacidad visual
