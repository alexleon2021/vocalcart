from django.urls import path, include
from . import views
from rest_framework import routers
from .models import categoria, producto

router = routers.DefaultRouter()
router.register(r'api/categoria', views.categoriaView, 'api-categoria')
router.register(r'api/producto', views.productoView, 'api-producto')


app_name = 'productos'

urlpatterns = [
    path('', views.productos_lista, name='lista'),
    path('detalle/<int:producto_id>/', views.producto_detalle, name='detalle'),
    path('agregar-carrito/<int:producto_id>/', views.agregar_carrito, name='agregar_carrito'),

    path('', include(router.urls))
]
