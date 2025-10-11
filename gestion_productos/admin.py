from django.contrib import admin
from .models import  categoria, producto
# Register your models here.
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion', 'fecha_creacion', 'fecha_actualizacion')
    search_fields = ('nombre', 'descripcion')
    list_filter = ('fecha_creacion', 'fecha_actualizacion','nombre')
    # ordering = ('-fecha_creacion',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    # list_per_page = 20
admin.site.register(categoria, CategoriaAdmin)

class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'referencia', 'stock', 'precio','estado', 'categoria', 'fecha_creacion', 'fecha_actualizacion')
    search_fields = ('nombre', 'referencia', 'descripcion')
    list_filter = ('estado', 'categoria', 'fecha_creacion','referencia')
    # ordering = ('-fecha_creacion',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    # list_editable = ('stock', 'precio', 'estado')
admin.site.register(producto, ProductoAdmin)