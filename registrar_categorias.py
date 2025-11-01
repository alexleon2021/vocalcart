"""
Script para registrar las categorías de alimentos en la base de datos
Ejecutar con: python manage.py shell < registrar_categorias.py
"""

from gestion_productos.models import categoria

# Definir las categorías de alimentos
categorias_data = [
    {
        'nombre': 'Frutas',
        'descripcion': 'Frutas frescas de temporada, ricas en vitaminas y minerales'
    },
    {
        'nombre': 'Verduras',
        'descripcion': 'Verduras frescas para una alimentación saludable'
    },
    {
        'nombre': 'Cereales',
        'descripcion': 'Cereales, granos y pastas para tu despensa'
    },
    {
        'nombre': 'Lácteos',
        'descripcion': 'Productos lácteos frescos: leche, yogur, queso y más'
    },
    {
        'nombre': 'Carnes',
        'descripcion': 'Carnes frescas de pollo, res y cerdo'
    },
    {
        'nombre': 'Panadería',
        'descripcion': 'Pan fresco y productos de panadería'
    },
    {
        'nombre': 'Bebidas',
        'descripcion': 'Bebidas naturales, jugos y agua'
    }
]

# Registrar o actualizar categorías
for cat_data in categorias_data:
    categoria_obj, created = categoria.objects.get_or_create(
        nombre=cat_data['nombre'],
        defaults={'descripcion': cat_data['descripcion']}
    )
    
    if created:
        print(f'✓ Categoría creada: {categoria_obj.nombre}')
    else:
        # Actualizar descripción si ya existe
        categoria_obj.descripcion = cat_data['descripcion']
        categoria_obj.save()
        print(f'✓ Categoría actualizada: {categoria_obj.nombre}')

print(f'\n✓ Total de categorías en la base de datos: {categoria.objects.count()}')
print('\nCategorías registradas:')
for cat in categoria.objects.all():
    print(f'  - ID: {cat.id}, Nombre: {cat.nombre}')
