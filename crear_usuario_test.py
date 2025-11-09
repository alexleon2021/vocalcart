import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vocalcart.settings')
django.setup()

from django.contrib.auth.models import User

# Crear usuario de prueba para las compras
username = 'cliente_test'
email = 'cliente@vocalcart.com'
password = 'test1234'

try:
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'email': email,
            'first_name': 'Cliente',
            'last_name': 'Test'
        }
    )
    
    if created:
        user.set_password(password)
        user.save()
        print(f"✓ Usuario creado exitosamente:")
        print(f"  Username: {username}")
        print(f"  Email: {email}")
        print(f"  Password: {password}")
        print(f"  ID: {user.id}")
    else:
        print(f"⊗ El usuario '{username}' ya existe (ID: {user.id})")
        print(f"  Puedes usar este usuario para las compras")
        
except Exception as e:
    print(f"✗ Error al crear usuario: {str(e)}")
