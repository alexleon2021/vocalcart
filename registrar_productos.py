import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vocalcart.settings')
django.setup()

from gestion_productos.models import categoria, producto
from decimal import Decimal

# Lista de productos a registrar con sus categorías
productos = [
    # Frutas
    {'nombre': 'Manzanas Rojas', 'referencia': 'FRUT-001', 'precio': '2.99', 'stock': 50, 
     'descripcion': 'Manzanas rojas frescas de la temporada, ricas en vitaminas y fibra (1 kg)', 
     'categoria': 'Frutas', 'imagen': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'},
    
    {'nombre': 'Plátanos', 'referencia': 'FRUT-002', 'precio': '1.99', 'stock': 60,
     'descripcion': 'Plátanos frescos, excelente fuente de potasio y energía (1 kg)',
     'categoria': 'Frutas', 'imagen': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'},
    
    {'nombre': 'Naranjas', 'referencia': 'FRUT-003', 'precio': '3.49', 'stock': 45,
     'descripcion': 'Naranjas jugosas para zumo o consumo directo, ricas en vitamina C (1 kg)',
     'categoria': 'Frutas', 'imagen': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400'},
    
    {'nombre': 'Fresas', 'referencia': 'FRUT-004', 'precio': '4.99', 'stock': 30,
     'descripcion': 'Fresas frescas de temporada, perfectas para postres y batidos (500g)',
     'categoria': 'Frutas', 'imagen': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400'},
    
    # Verduras
    {'nombre': 'Tomates', 'referencia': 'VERD-001', 'precio': '2.49', 'stock': 55,
     'descripcion': 'Tomates frescos y maduros, ideales para ensaladas y salsas (1 kg)',
     'categoria': 'Verduras', 'imagen': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'},
    
    {'nombre': 'Lechugas', 'referencia': 'VERD-002', 'precio': '1.79', 'stock': 40,
     'descripcion': 'Lechugas frescas y crujientes para ensaladas saludables (unidad)',
     'categoria': 'Verduras', 'imagen': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400'},
    
    {'nombre': 'Zanahorias', 'referencia': 'VERD-003', 'precio': '1.99', 'stock': 50,
     'descripcion': 'Zanahorias frescas, ricas en betacaroteno y vitaminas (1 kg)',
     'categoria': 'Verduras', 'imagen': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'},
    
    {'nombre': 'Brócoli', 'referencia': 'VERD-004', 'precio': '2.99', 'stock': 35,
     'descripcion': 'Brócoli fresco, excelente fuente de nutrientes y fibra (500g)',
     'categoria': 'Verduras', 'imagen': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400'},
    
    # Cereales
    {'nombre': 'Arroz Blanco', 'referencia': 'CERE-001', 'precio': '5.99', 'stock': 100,
     'descripcion': 'Arroz blanco de grano largo, perfecto para cualquier comida (2 kg)',
     'categoria': 'Cereales', 'imagen': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'},
    
    {'nombre': 'Pasta Integral', 'referencia': 'CERE-002', 'precio': '3.99', 'stock': 80,
     'descripcion': 'Pasta integral de trigo, rica en fibra y nutrientes (500g)',
     'categoria': 'Cereales', 'imagen': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'},
    
    {'nombre': 'Avena', 'referencia': 'CERE-003', 'precio': '4.49', 'stock': 70,
     'descripcion': 'Avena natural en hojuelas para desayunos saludables (1 kg)',
     'categoria': 'Cereales', 'imagen': 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=400'},
    
    # Lácteos
    {'nombre': 'Leche Entera', 'referencia': 'LACT-001', 'precio': '2.99', 'stock': 60,
     'descripcion': 'Leche entera fresca pasteurizada, rica en calcio (1 litro)',
     'categoria': 'Lácteos', 'imagen': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'},
    
    {'nombre': 'Yogur Natural', 'referencia': 'LACT-002', 'precio': '1.99', 'stock': 50,
     'descripcion': 'Yogur natural cremoso sin azúcar añadido (500g)',
     'categoria': 'Lácteos', 'imagen': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'},
    
    {'nombre': 'Queso Mozzarella', 'referencia': 'LACT-003', 'precio': '5.99', 'stock': 40,
     'descripcion': 'Queso mozzarella fresco, ideal para pizzas y ensaladas (250g)',
     'categoria': 'Lácteos', 'imagen': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'},
    
    # Carnes
    {'nombre': 'Pechuga de Pollo', 'referencia': 'CARN-001', 'precio': '8.99', 'stock': 30,
     'descripcion': 'Pechuga de pollo fresca y sin hueso, baja en grasa (1 kg)',
     'categoria': 'Carnes', 'imagen': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'},
    
    {'nombre': 'Carne Molida', 'referencia': 'CARN-002', 'precio': '9.99', 'stock': 25,
     'descripcion': 'Carne molida de res fresca, perfecta para hamburguesas (500g)',
     'categoria': 'Carnes', 'imagen': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400'},
    
    # Panadería
    {'nombre': 'Pan Integral', 'referencia': 'PANA-001', 'precio': '2.49', 'stock': 45,
     'descripcion': 'Pan integral fresco de molde, rico en fibra (500g)',
     'categoria': 'Panadería', 'imagen': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'},
    
    {'nombre': 'Croissants', 'referencia': 'PANA-002', 'precio': '3.99', 'stock': 35,
     'descripcion': 'Croissants recién horneados, mantecosos y deliciosos (6 unidades)',
     'categoria': 'Panadería', 'imagen': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'},
    
    # Bebidas
    {'nombre': 'Agua Mineral', 'referencia': 'BEBI-001', 'precio': '0.99', 'stock': 100,
     'descripcion': 'Agua mineral natural sin gas (1.5 litros)',
     'categoria': 'Bebidas', 'imagen': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400'},
    
    {'nombre': 'Zumo de Naranja', 'referencia': 'BEBI-002', 'precio': '3.49', 'stock': 50,
     'descripcion': 'Zumo de naranja 100% natural recién exprimido (1 litro)',
     'categoria': 'Bebidas', 'imagen': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'},
]

def registrar_productos():
    """Registra productos en la base de datos"""
    print("Iniciando registro de productos...\n")
    
    for prod_data in productos:
        try:
            # Obtener la categoría
            cat = categoria.objects.get(nombre=prod_data['categoria'])
            
            # Crear o actualizar el producto
            prod, created = producto.objects.get_or_create(
                referencia=prod_data['referencia'],
                defaults={
                    'nombre': prod_data['nombre'],
                    'precio': Decimal(prod_data['precio']),
                    'stock': prod_data['stock'],
                    'descripcion': prod_data['descripcion'],
                    'categoria': cat,
                    'estado': True
                }
            )
            
            if created:
                print(f"✓ Producto creado: {prod.nombre} ({prod.referencia}) - ${prod.precio} - Categoría: {cat.nombre}")
            else:
                print(f"⊗ Producto ya existe: {prod.nombre} ({prod.referencia})")
                
        except categoria.DoesNotExist:
            print(f"✗ Error: Categoría '{prod_data['categoria']}' no encontrada para {prod_data['nombre']}")
        except Exception as e:
            print(f"✗ Error al crear {prod_data['nombre']}: {str(e)}")
    
    print(f"\n{'='*60}")
    print(f"Total de productos en la base de datos: {producto.objects.count()}")
    print(f"{'='*60}")

if __name__ == '__main__':
    registrar_productos()
