from rest_framework import serializers
from .models import compra, envio, articulo_compra

class compraSerializer(serializers.ModelSerializer):
    class Meta:
        model = compra
        fields = '__all__'

class envioSerializer(serializers.ModelSerializer):
    class Meta:
        model = envio
        fields = '__all__'


class articulo_compraSerializer(serializers.ModelSerializer):
    class Meta:
        model = articulo_compra
        fields = '__all__'