from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class compra(models.Model):
    id=models.AutoField(primary_key=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario autenticado')
    subtotal=models.DecimalField(max_digits=20, decimal_places=2,verbose_name='Subtotal de la compra')
    iva=models.DecimalField(max_digits=20, decimal_places=2,verbose_name='IVA de la compra')
    total=models.DecimalField(max_digits=20, decimal_places=2,verbose_name='Total de la compra')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')

class envio(models.Model):
    id=models.AutoField(primary_key=True)
    direccion = models.CharField(max_length=200,verbose_name='Dirección de envío')
    estado = models.BooleanField(default=True,verbose_name='Estado de envio')
    compra = models.ForeignKey(compra,on_delete=models.CASCADE,verbose_name='Compra asociada')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')
    def __str__(self):
        return self.direccion
    
class articulo_compra  (models.Model):
    id=models.AutoField(primary_key=True)
    cantidad = models.IntegerField(verbose_name='Cantidad del producto')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario autenticado')
    producto = models.ForeignKey('gestion_productos.producto',on_delete=models.CASCADE,verbose_name='Producto asociado')
    compra = models.ForeignKey(compra,on_delete=models.CASCADE,verbose_name='Compra asociada')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')
