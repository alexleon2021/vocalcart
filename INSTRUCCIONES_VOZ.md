# 🎙️ Instrucciones para usar VocalCart con Voz

## ⚙️ Configuración Inicial

### 1. **Verificar que los servidores estén corriendo**

**Backend Django (puerto 8000):**
```bash
cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart
/home/d4n7dev/Escritorio/DEV/vocalcart/envvocalcart/bin/python manage.py runserver
```

**Frontend React (puerto 5173):**
```bash
cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart/front
npm run dev
```

### 2. **Abrir la aplicación en el navegador**
```
http://localhost:5173
```

### 3. **Activar el micrófono**

⚠️ **IMPORTANTE**: Para que el reconocimiento de voz funcione, debes:

1. Hacer clic en el botón **"Activar Voz"** en el panel flotante de la izquierda
2. El navegador te pedirá permiso para usar el micrófono - **debes PERMITIR**
3. Verás que el botón cambia a **"Escuchando..."** con un ícono rojo
4. Ahora puedes hablar y dar comandos

---

## 🎤 Comandos de Voz Disponibles

### En la Tienda (Shop)

#### 📦 Agregar Productos
- **"agregar manzana"** - Agrega 1 manzana
- **"agregar 5 manzanas"** - Agrega 5 manzanas
- **"agregar dos yogurt"** - Agrega 2 yogurts (números en palabras: uno-diez)

#### 🛒 Gestión del Carrito
- **"ver carrito"** - Muestra cuántos artículos tienes
- **"vaciar carrito"** - Elimina todos los productos del carrito

#### 🔍 Búsqueda y Navegación
- **"buscar manzanas"** - Busca productos que contengan "manzanas"
- **"leer productos"** - Lee los primeros 5 productos disponibles
- **"categoría frutas"** - Filtra por categoría de frutas

#### 💳 Finalizar Compra
- **"finalizar compra"** - Abre el modal de checkout

#### ℹ️ Ayuda
- **"ayuda"** - Lee todos los comandos disponibles

---

### En el Checkout (Modal de Compra)

#### 📝 Paso 1 - Datos de Facturación

**Información Personal:**
- **"mi nombre es Juan Pérez"** - Registra tu nombre
- **"mi documento es 12345678"** - Registra tu documento
- **"mi teléfono es 3001234567"** - Registra tu teléfono
- **"mi correo es juan arroba gmail punto com"** - Registra tu email (usa "arroba" para @)

**Información de Pago:**
- **"mi tarjeta es 1234567890123456"** - Registra número de tarjeta (16 dígitos)
- **"CVV 123"** - Registra código de seguridad (3-4 dígitos)
- **"vencimiento 1225"** - Registra fecha (MMAA = diciembre 2025)

#### 🚚 Paso 2 - Datos de Envío

**Opciones de Entrega:**
- **"con envío"** - Activa envío a domicilio
- **"sin envío"** o **"recogida en tienda"** - Recoge en tienda

**Dirección (si seleccionas envío):**
- **"mi dirección es Calle 123 #45-67"** - Registra dirección
- **"mi ciudad es Bogotá"** - Registra ciudad
- **"código postal 110111"** - Registra código postal

#### ✅ Paso 3 - Confirmación

- **"confirmar compra"** - Finaliza el pedido
- **"atrás"** - Vuelve al paso anterior

#### 🧭 Navegación en el Checkout

- **"siguiente"** - Avanza al siguiente paso
- **"atrás"** - Retrocede al paso anterior
- **"cancelar"** o **"cerrar"** - Cierra el modal de checkout
- **"ayuda"** - Lee los comandos del paso actual

---

## 🚨 Solución de Problemas

### ❌ "No se reconoce mi voz"

**Posibles causas:**

1. **Micrófono no activado**
   - Verifica que el botón diga "Escuchando..." (no "Activar Voz")
   - Haz clic en el botón de micrófono para activarlo

2. **Permisos del navegador**
   - El navegador debe tener permiso para usar el micrófono
   - En Chrome: haz clic en el candado 🔒 junto a la URL → Configuración del sitio → Micrófono → Permitir
   - Recarga la página después de dar permisos

3. **Micrófono del sistema**
   - Verifica que tu micrófono esté conectado y funcionando
   - Prueba en otra aplicación (ej: grabadora de voz)

4. **Navegador incompatible**
   - Usa **Google Chrome**, **Microsoft Edge** o **Opera** (recomendados)
   - Safari y Firefox tienen soporte limitado

### ❌ "Error de red"

**Solución:**

1. Verifica que Django esté corriendo:
   ```bash
   curl http://localhost:8000/api/categoria/
   ```
   Debe devolver JSON con categorías

2. Verifica que React esté corriendo:
   ```bash
   curl http://localhost:5173
   ```
   Debe devolver HTML

3. Revisa CORS en Django (`settings.py`):
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
   ]
   ```

### ❌ "El asistente habla pero no escucha"

**Solución:**

1. El reconocimiento de voz requiere **acción del usuario**
2. Debes hacer clic manualmente en "Activar Voz"
3. Los navegadores bloquean el reconocimiento automático por seguridad

---

## 💡 Consejos para Mejor Reconocimiento

### ✅ Buenas Prácticas

1. **Habla claro y pausado** - No grites ni susurres
2. **Ambiente silencioso** - Reduce ruido de fondo
3. **Espera la confirmación** - El asistente dirá "He agregado..." después de cada acción
4. **Usa comandos completos** - "agregar 5 manzanas" es mejor que solo "manzanas"
5. **Di "ayuda" si olvidas** - El asistente te recordará los comandos

### ❌ Evita

- Comandos incompletos: ❌ "agregar" (sin producto)
- Hablar mientras el asistente está hablando
- Usar comandos muy largos o complejos
- Decir varios comandos seguidos sin pausa

---

## 🔧 Ajustes de Voz

En el panel flotante de la izquierda puedes:

- **Velocidad**: Ajusta qué tan rápido habla el asistente (0.5x - 2.0x)
- **Tipo de Voz**: Selecciona voz predeterminada, femenina o masculina
- **Activar/Desactivar**: Usa el ícono 🔊/🔇 para silenciar

---

## 📱 Ejemplo de Flujo Completo

**Usuario quiere comprar 5 manzanas y 3 panes:**

1. Haz clic en **"Activar Voz"** ✅
2. Di: **"agregar 5 manzanas"**
3. Escucha: *"He agregado 5 manzanas al carrito"*
4. Di: **"agregar 3 panes"**
5. Escucha: *"He agregado 3 panes al carrito"*
6. Di: **"ver carrito"**
7. Escucha: *"Tienes 8 artículos en el carrito"*
8. Di: **"finalizar compra"**
9. Se abre el modal de checkout
10. Di: **"mi nombre es María González"**
11. Di: **"mi documento es 98765432"**
12. Di: **"mi teléfono es 3009876543"**
13. Di: **"mi correo es maria arroba email punto com"**
14. Di: **"mi tarjeta es 4111111111111111"**
15. Di: **"CVV 456"**
16. Di: **"vencimiento 0826"**
17. Di: **"siguiente"**
18. Di: **"con envío"**
19. Di: **"mi dirección es Carrera 7 #32-16"**
20. Di: **"mi ciudad es Bogotá"**
21. Di: **"código postal 110311"**
22. Di: **"siguiente"**
23. Di: **"confirmar compra"**
24. ✅ ¡Compra completada!

---

## 🎯 Accesibilidad

VocalCart está diseñado específicamente para personas con **discapacidad visual**.

### Características de Accesibilidad:

- ✅ **Control 100% por voz** - No requiere ver la pantalla
- ✅ **Instrucciones automáticas** - El asistente lee qué hacer en cada paso
- ✅ **Confirmaciones verbales** - Cada acción se confirma por voz
- ✅ **Comandos en español natural** - Habla como hablas normalmente
- ✅ **Sistema de ayuda contextual** - "ayuda" en cualquier momento

---

## 📞 Soporte

Si tienes problemas, verifica:

1. ✅ Ambos servidores corriendo (Django + React)
2. ✅ Permisos de micrófono permitidos
3. ✅ Botón "Activar Voz" presionado
4. ✅ Navegador compatible (Chrome/Edge recomendados)
5. ✅ Micrófono del sistema funcionando

---

**¡Disfruta de una experiencia de compra completamente accesible con VocalCart! 🛒🎤**
