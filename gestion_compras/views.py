from django.shortcuts import render
from rest_framework import viewsets
from .models import envio, compra, articulo_compra
from .serializer import compraSerializer, envioSerializer, articulo_compraSerializer
# Create your views here.
class compraView(viewsets.ModelViewSet):
    serializer_class = compraSerializer
    queryset = compra.objects.all() 

class envioView(viewsets.ModelViewSet):
    serializer_class = envioSerializer
    queryset = envio.objects.all()


class articulo_compraView(viewsets.ModelViewSet):
    serializer_class = articulo_compraSerializer
    queryset = articulo_compra.objects.all()