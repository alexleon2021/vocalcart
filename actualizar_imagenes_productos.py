import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vocalcart.settings')
django.setup()

from gestion_productos.models import producto

# Diccionario con las imágenes para cada producto (por referencia)
imagenes_productos = {
    # Frutas
    'FRUT-001': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',  # Manzanas
    'FRUT-002': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop',  # Plátanos
    'FRUT-003': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',  # Naranjas
    'FRUT-004': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',  # Fresas
    
    # Verduras
    'VERD-001': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',  # Tomates
    'VERD-002': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop',  # Lechugas
    'VERD-003': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',  # Zanahorias
    'VERD-004': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=300&fit=crop',  # Brócoli
    
    # Cereales
    'CERE-001': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',  # Arroz
    'CERE-002': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',  # Pasta
    'CERE-003': 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=400&h=300&fit=crop',  # Avena
    
    # Lácteos
    'LACT-001': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',  # Leche
    'LACT-002': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',  # Yogur
    'LACT-003': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop',  # Queso
    
    # Carnes
    'CARN-001': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',  # Pollo
    'CARN-002': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=300&fit=crop',  # Carne molida
    
    # Panadería
    'PANA-001': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',  # Pan integral
    'PANA-002': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',  # Croissants
    
    # Bebidas
    'BEBI-001': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',  # Agua
    'BEBI-002': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',  # Zumo
}

def actualizar_imagenes():
    """Actualiza las imágenes de los productos existentes"""
    print("Iniciando actualización de imágenes de productos...\n")
    
    productos_actualizados = 0
    productos_no_encontrados = []
    
    for referencia, url_imagen in imagenes_productos.items():
        try:
            prod = producto.objects.get(referencia=referencia)
            prod.imagen = url_imagen
            prod.save()
            productos_actualizados += 1
            print(f"✓ Imagen actualizada para: {prod.nombre} ({referencia})")
        except producto.DoesNotExist:
            productos_no_encontrados.append(referencia)
            print(f"⚠ Producto no encontrado: {referencia}")
        except Exception as e:
            print(f"✗ Error al actualizar {referencia}: {str(e)}")
    
    print(f"\n{'='*60}")
    print(f"Productos actualizados: {productos_actualizados}/{len(imagenes_productos)}")
    if productos_no_encontrados:
        print(f"Productos no encontrados: {', '.join(productos_no_encontrados)}")
    print(f"{'='*60}\n")
    
    # Mostrar resumen de productos con imágenes
    print("Resumen de productos con imágenes:")
    productos_con_imagen = producto.objects.exclude(imagen__isnull=True).exclude(imagen='')
    print(f"Total de productos con imagen: {productos_con_imagen.count()}")
    for prod in productos_con_imagen:
        print(f"  - {prod.nombre}: {prod.imagen}")

if __name__ == '__main__':
    actualizar_imagenes()
