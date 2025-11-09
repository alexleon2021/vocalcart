from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class compra(models.Model):
    id=models.AutoField(primary_key=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario autenticado')
    
    # Datos de facturación
    nombre_facturacion = models.CharField(max_length=200, verbose_name='Nombre completo')
    documento_facturacion = models.CharField(max_length=50, verbose_name='Número de documento')
    telefono_facturacion = models.CharField(max_length=20, verbose_name='Teléfono de contacto')
    email_facturacion = models.EmailField(verbose_name='Email de contacto')
    
    # Opción de envío
    requiere_envio = models.BooleanField(default=True, verbose_name='Requiere envío a domicilio')
    
    # Totales
    subtotal=models.DecimalField(max_digits=20, decimal_places=2,verbose_name='Subtotal de la compra')
    iva=models.DecimalField(max_digits=20, decimal_places=2,verbose_name='IVA de la compra')
    total=models.DecimalField(max_digits=20, decimal_places=2,verbose_name='Total de la compra')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')
    
    def __str__(self):
        return f"Compra #{self.id} - {self.nombre_facturacion}"

class envio(models.Model):
    id=models.AutoField(primary_key=True)
    direccion = models.CharField(max_length=200,verbose_name='Dirección de envío')
    ciudad = models.CharField(max_length=100, blank=True, null=True, verbose_name='Ciudad')
    codigo_postal = models.CharField(max_length=20, blank=True, null=True, verbose_name='Código postal')
    notas_adicionales = models.TextField(blank=True, null=True, verbose_name='Notas adicionales')
    estado = models.BooleanField(default=True,verbose_name='Estado de envio')
    compra = models.ForeignKey(compra,on_delete=models.CASCADE,verbose_name='Compra asociada')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')
    
    def __str__(self):
        return f"{self.direccion} - {self.ciudad}"
    
class articulo_compra  (models.Model):
    id=models.AutoField(primary_key=True)
    cantidad = models.IntegerField(verbose_name='Cantidad del producto')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario autenticado')
    producto = models.ForeignKey('gestion_productos.producto',on_delete=models.CASCADE,verbose_name='Producto asociado')
    compra = models.ForeignKey(compra,on_delete=models.CASCADE,verbose_name='Compra asociada')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')
