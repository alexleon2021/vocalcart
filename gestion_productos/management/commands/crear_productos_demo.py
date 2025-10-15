from django.core.management.base import BaseCommand
from gestion_productos.models import categoria, producto

class Command(BaseCommand):
    help = 'Crea productos de ejemplo para la demo'

    def handle(self, *args, **options):
        # Crear categorías
        cat_electronicos, created = categoria.objects.get_or_create(
            nombre="Electrónicos",
            defaults={'descripcion': 'Productos electrónicos y tecnológicos'}
        )
        
        cat_hogar, created = categoria.objects.get_or_create(
            nombre="Hogar",
            defaults={'descripcion': 'Productos para el hogar y decoración'}
        )
        
        cat_ropa, created = categoria.objects.get_or_create(
            nombre="Ropa",
            defaults={'descripcion': 'Vestimenta y accesorios'}
        )
        
        cat_salud, created = categoria.objects.get_or_create(
            nombre="Salud y Bienestar",
            defaults={'descripcion': 'Productos para el cuidado personal y salud'}
        )
        
        # Crear productos de ejemplo
        productos_ejemplo = [
            {
                'nombre': 'Smartphone Android',
                'referencia': 'SMART001',
                'stock': 15,
                'precio': 299.99,
                'descripcion': 'Smartphone Android con pantalla táctil accesible, lector de pantalla integrado y navegación por voz. Ideal para personas con discapacidad visual.',
                'categoria': cat_electronicos
            },
            {
                'nombre': 'Tablet con Voz',
                'referencia': 'TAB001',
                'stock': 8,
                'precio': 199.99,
                'descripcion': 'Tablet con funciones de accesibilidad avanzadas, control por voz y texto a voz. Perfecta para navegación accesible.',
                'categoria': cat_electronicos
            },
            {
                'nombre': 'Auriculares con Vibración',
                'referencia': 'AUR001',
                'stock': 25,
                'precio': 89.99,
                'descripcion': 'Auriculares especiales con función de vibración para personas con discapacidad auditiva. Incluye indicadores visuales.',
                'categoria': cat_electronicos
            },
            {
                'nombre': 'Silla Ergonómica',
                'referencia': 'SIL001',
                'stock': 5,
                'precio': 450.00,
                'descripcion': 'Silla ergonómica adaptada para personas con movilidad reducida. Ajustable en altura y con soporte lumbar.',
                'categoria': cat_hogar
            },
            {
                'nombre': 'Mesa Ajustable',
                'referencia': 'MES001',
                'stock': 10,
                'precio': 320.00,
                'descripcion': 'Mesa de trabajo con altura ajustable, ideal para sillas de ruedas. Superficie antideslizante.',
                'categoria': cat_hogar
            },
            {
                'nombre': 'Lámpara LED Táctil',
                'referencia': 'LAM001',
                'stock': 20,
                'precio': 45.99,
                'descripcion': 'Lámpara LED con control táctil y diferentes niveles de intensidad. Perfecta para personas con baja visión.',
                'categoria': cat_hogar
            },
            {
                'nombre': 'Camiseta Adaptada',
                'referencia': 'CAM001',
                'stock': 30,
                'precio': 25.99,
                'descripcion': 'Camiseta con apertura trasera y velcro para facilitar el vestido. Tela suave y cómoda.',
                'categoria': cat_ropa
            },
            {
                'nombre': 'Zapatos Velcro',
                'referencia': 'ZAP001',
                'stock': 18,
                'precio': 65.99,
                'descripcion': 'Zapatos ortopédicos con cierre de velcro, suela antideslizante y soporte para el arco.',
                'categoria': cat_ropa
            },
            {
                'nombre': 'Termómetro Parlante',
                'referencia': 'TER001',
                'stock': 12,
                'precio': 35.99,
                'descripcion': 'Termómetro digital que anuncia la temperatura por voz en español. Ideal para personas con discapacidad visual.',
                'categoria': cat_salud
            },
            {
                'nombre': 'Tensiómetro Automático',
                'referencia': 'TEN001',
                'stock': 7,
                'precio': 120.00,
                'descripcion': 'Tensiómetro automático con pantalla grande y función de voz. Fácil de usar con una sola mano.',
                'categoria': cat_salud
            },
            {
                'nombre': 'Pastillero Semanal',
                'referencia': 'PAS001',
                'stock': 22,
                'precio': 15.99,
                'descripcion': 'Pastillero semanal con compartimentos grandes y etiquetas en braille. Incluye alarma de recordatorio.',
                'categoria': cat_salud
            },
            {
                'nombre': 'Reloj Parlante',
                'referencia': 'REL001',
                'stock': 16,
                'precio': 55.99,
                'descripcion': 'Reloj de pulsera que anuncia la hora por voz con solo presionar un botón. Resistente al agua.',
                'categoria': cat_electronicos
            }
        ]
        
        productos_creados = 0
        for producto_data in productos_ejemplo:
            producto_obj, created = producto.objects.get_or_create(
                referencia=producto_data['referencia'],
                defaults=producto_data
            )
            if created:
                productos_creados += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Producto creado: {producto_obj.nombre}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Producto ya existe: {producto_obj.nombre}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Comando completado. {productos_creados} productos nuevos creados.')
        )