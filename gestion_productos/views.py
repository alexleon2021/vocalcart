from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import producto, categoria
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets
from .serializer import categoriaSerializer, productoSerializer

def productos_lista(request):
    """
    Vista principal para mostrar productos con interfaz accesible
    """
    productos = producto.objects.filter(estado=True).select_related('categoria')
    categorias = categoria.objects.all()
    
    context = {
        'productos': productos,
        'categorias': categorias,
        'total_productos': productos.count()
    }
    
    return render(request, 'productos/lista_productos.html', context)

def producto_detalle(request, producto_id):
    """
    Vista para obtener detalles de un producto específico
    """
    try:
        prod = get_object_or_404(producto, id=producto_id, estado=True)
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            # Respuesta AJAX para modal
            data = {
                'id': prod.id,
                'nombre': prod.nombre,
                'referencia': prod.referencia,
                'precio': str(prod.precio),
                'descripcion': prod.descripcion or 'Sin descripción disponible',
                'categoria': prod.categoria.nombre,
                'stock': prod.stock,
                'disponible': prod.stock > 0
            }
            return JsonResponse(data)
        else:
            # Vista normal
            context = {'producto': prod}
            return render(request, 'productos/detalle_producto.html', context)
            
    except Exception as e:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Producto no encontrado'}, status=404)
        else:
            messages.error(request, 'Producto no encontrado')
            return redirect('productos_lista')

@login_required
def agregar_carrito(request, producto_id):
    """
    Vista para agregar productos al carrito
    """
    if request.method == 'POST':
        try:
            prod = get_object_or_404(producto, id=producto_id, estado=True)
            cantidad = int(request.POST.get('cantidad', 1))
            
            if cantidad <= 0:
                return JsonResponse({'error': 'Cantidad inválida'}, status=400)
                
            if cantidad > prod.stock:
                return JsonResponse({'error': 'Stock insuficiente'}, status=400)
            
            # Aquí implementarías la lógica del carrito
            # Por ahora solo simulamos la respuesta
            
            return JsonResponse({
                'success': True,
                'mensaje': f'{prod.nombre} agregado al carrito exitosamente',
                'producto': prod.nombre,
                'cantidad': cantidad,
                'precio_total': str(prod.precio * cantidad)
            })
            
        except Exception as e:
            return JsonResponse({'error': 'Error al agregar al carrito'}, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)

class categoriaView(viewsets.ModelViewSet):
    serializer_class = categoriaSerializer
    queryset = categoria.objects.all() 
class productoView(viewsets.ModelViewSet):
    serializer_class = productoSerializer
    queryset = producto.objects.all()
