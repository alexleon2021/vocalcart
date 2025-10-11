from django.db import models

# Create your models here.
class asistente(models.Model):
    id=models.AutoField(primary_key=True)
    consulta= models.TextField(verbose_name='descripcion de la consulta')
    fecha_creacion = models.DateTimeField(auto_now_add=True,verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización')
