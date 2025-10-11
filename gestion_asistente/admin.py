from django.contrib import admin
from .models import  asistente

# Register your models here.
class AsistenteAdmin(admin.ModelAdmin):
    list_display = ('id', 'consulta', 'fecha_creacion', 'fecha_actualizacion')
    search_fields = ('consulta',)
    list_filter = ('fecha_creacion',)
    ordering = ('-fecha_creacion',)
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
admin.site.register(asistente, AsistenteAdmin)