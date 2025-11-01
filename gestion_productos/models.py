from django.db import models

# Create your models here.
class categoria(models.Model):
    id=models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=35,verbose_name='Nombre de la categoría')
    descripcion = models.TextField(blank=True,null=True,verbose_name='Descripción de la categoría')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')

    def __str__(self):
        return self.nombre
    
class producto(models.Model):
    id=models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=40,verbose_name='Nombre del producto')
    referencia = models.CharField(max_length=35,unique=True,verbose_name='Referencia del producto')
    stock = models.IntegerField(verbose_name='Cantidad en stock')
    precio = models.DecimalField(max_digits=20, decimal_places=2,verbose_name='Precio del producto')
    descripcion = models.TextField(blank=True,null=True,verbose_name='Descripción del producto')
    imagen = models.URLField(max_length=500, blank=True, null=True, verbose_name='URL de la imagen del producto')
    estado = models.BooleanField(default=True,verbose_name='Estado del producto')
    categoria = models.ForeignKey(categoria,on_delete=models.CASCADE,verbose_name='Categoría del producto')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')


    def __str__(self):
        return self.nombre
