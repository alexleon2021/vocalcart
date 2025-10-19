from rest_framework import serializers
from .models import asistente

class asistenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = asistente
        fields = '__all__'

