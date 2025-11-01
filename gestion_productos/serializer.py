from rest_framework import serializers
from .models import categoria, producto

class categoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = categoria
        fields = '__all__'

class productoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = producto
        fields = '__all__'
