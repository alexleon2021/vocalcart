from django.contrib import admin
from django.urls import path, include
from . import views
from django.shortcuts import render, redirect
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from .models import asistente

router = routers.DefaultRouter()
router.register(r'api/asistente', views.asistenteView, 'api-asistente')

urlpatterns = [
   
    path('', views.home, name='casita'),
    path('login/', views.home, name='login'),
    path('login-voice/', views.login_voice, name='login_voice'),
    path('registro/', views.registro, name='registrarse'),
    path('registrarse/', views.registro, name='registro'),
    path('', include(router.urls))
  
] 

