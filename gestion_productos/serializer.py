from rest_framework import serializers
from .models import categoria, producto

class categoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = categoria
        fields = '__all__'

class productoSerializer(serializers.ModelSerializer):
    class Meta:
        model = producto
        fields = '__all__'
