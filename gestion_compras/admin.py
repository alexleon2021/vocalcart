from django.contrib import admin
from .models import  compra, envio, articulo_compra

# Register your models here.
class CompraAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'subtotal', 'iva', 'total','fecha_creacion', 'fecha_actualizacion')
    search_fields = ('usuario__username',)
    list_filter = ('fecha_creacion',)
    # ordering = ('-fecha_creacion',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
admin.site.register(compra, CompraAdmin)

class EnvioAdmin(admin.ModelAdmin):
    list_display = ('id', 'direccion', 'estado', 'compra','fecha_creacion', 'fecha_actualizacion')
    search_fields = ('direccion', 'compra__usuario__username')
    list_filter = ('estado', 'fecha_creacion')
    # ordering = ('-fecha_creacion',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    list_editable = ('estado',)
admin.site.register(envio,EnvioAdmin)

class ArticuloCompraAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'producto', 'compra', 'cantidad','fecha_creacion', 'fecha_actualizacion' )
    search_fields = ( 'usuario__username','producto__nombre', 'compra__usuario__username', )
    list_filter = ('fecha_creacion', 'producto', 'usuario')
    # ordering = ('-fecha_creacion',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
admin.site.register(articulo_compra,ArticuloCompraAdmin)