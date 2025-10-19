from django.urls import path, include
from . import views
from rest_framework import routers
from .models import compra, envio, articulo_compra

router = routers.DefaultRouter()
router.register(r'api/compra', views.compraView, 'api-compra')
router.register(r'api/envio', views.envioView, 'api-envio')
router.register(r'api/articulo-compra', views.articulo_compraView, 'api-articulo-compra')


urlpatterns = [
    path('', include(router.urls))
]
