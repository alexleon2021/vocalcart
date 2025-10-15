from django.contrib import admin
from django.urls import path, include
from . import views
from django.shortcuts import render, redirect
from django.conf import settings
from django.conf.urls.static import static




urlpatterns = [
   
    path('', views.home, name='casita'),
    path('login/', views.home, name='login'),
    path('registro/', views.registro, name='registrarse'),
    path('registrarse/', views.registro, name='registro'),
    
  
] 