# Instrucciones para Ejecutar VOCALCART - Interfaz Accesible de Productos

## Pasos para configurar y ejecutar:

### 1. Migraciones de la base de datos
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Crear productos de ejemplo
```bash
python manage.py crear_productos_demo
```

### 3. Crear superusuario (opcional)
```bash
python manage.py createsuperuser
```

### 4. Ejecutar el servidor
```bash
python manage.py runserver
```

## URLs disponibles:

- **Login/Registro**: http://localhost:8000/
- **Productos Accesibles**: http://localhost:8000/productos/
- **Admin**: http://localhost:8000/admin/

## Características de Accesibilidad Implementadas:

### ♿ **Para Personas con Discapacidad Visual:**
- Navegación completa por teclado (Tab, Enter, Escape)
- Compatibilidad con lectores de pantalla
- Descripciones ARIA detalladas
- Indicadores de estado por voz
- Alto contraste disponible

### 🦻 **Para Personas con Discapacidad Auditiva:**
- Notificaciones visuales
- Indicadores de estado por colores
- Texto alternativo para todos los sonidos

### 🧠 **Para Personas con Discapacidad Cognitiva:**
- Interfaz simple e intuitiva
- Botones grandes y claros
- Asistente virtual para ayuda
- Navegación consistente
- Confirmaciones claras

### 🖱️ **Para Personas con Discapacidad Motriz:**
- Botones grandes (mínimo 44px)
- Áreas de click amplias
- Navegación por teclado completa
- Tiempo suficiente para interacciones

## Funcionalidades Principales:

1. **Catálogo de Productos Accesible**
   - Grid responsive con productos
   - Filtros por categoría y precio
   - Información completa de cada producto

2. **Asistente Virtual**
   - Modal que se sobrepone en la parte inferior
   - Chat interactivo para ayuda
   - Respuestas automáticas a consultas comunes

3. **Botones de Acción**
   - "Más información" - Muestra detalles del producto
   - "Agregar al carrito" - Funcionalidad de compra

4. **Navegación Accesible**
   - Breadcrumbs
   - Enlaces claros
   - Estructura semántica HTML

## Tecnologías Utilizadas:

- **Backend**: Django 5.2
- **Frontend**: Bootstrap 5, CSS3, JavaScript
- **Accesibilidad**: ARIA, WCAG 2.1 AA
- **Icons**: FontAwesome
- **Notificaciones**: SweetAlert2

## Notas Importantes:

- La interfaz cumple con estándares WCAG 2.1 AA
- Optimizada para lectores de pantalla como NVDA, JAWS
- Funciona con navegación por teclado exclusivamente
- Responsive design para dispositivos móviles
- Soporte para modo oscuro automático

## Productos de Ejemplo Incluidos:

El comando `crear_productos_demo` crea productos específicamente diseñados para personas con discapacidad:
- Smartphone con lector de pantalla
- Auriculares con vibración
- Termómetro parlante
- Silla ergonómica adaptada
- Y muchos más...

## Para Desarrolladores:

Si quieres añadir más funcionalidades de accesibilidad:

1. Mantén siempre etiquetas ARIA apropiadas
2. Usa elementos semánticos HTML5
3. Asegúrate de que todo sea navegable por teclado
4. Prueba con lectores de pantalla
5. Mantén contraste de colores apropiado
6. Proporciona texto alternativo para imágenes

¡La accesibilidad es un derecho, no una característica opcional! 💚