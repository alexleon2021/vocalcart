from django.urls import path
from . import views

app_name = 'productos'

urlpatterns = [
    path('', views.productos_lista, name='lista'),
    path('detalle/<int:producto_id>/', views.producto_detalle, name='detalle'),
    path('agregar-carrito/<int:producto_id>/', views.agregar_carrito, name='agregar_carrito'),
]