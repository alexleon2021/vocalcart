from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import messages
from django import forms

# Formulario personalizado para registro
class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)

    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        if commit:
            user.save()
        return user

def home(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                if user.groups.filter(name='admin').exists():
                    messages.success(request, f'¡Bienvenido administrador {user.username}! Has iniciado sesión exitosamente.')
                    return redirect('/admin')
                else:
                    messages.success(request, f'¡Bienvenido {user.username}! Has iniciado sesión exitosamente.')
                    return redirect('/productos/')
            else:
                messages.error(request, 'Credenciales incorrectas. Por favor verifica tu usuario y contraseña.')
                return render(request, 'login.html', {'form': form})    
        else:
            messages.error(request, 'Por favor ingresa credenciales válidas para iniciar sesión.')
            return render(request, 'login.html', {'form': form})
    else:
        form = AuthenticationForm()

    return render(request, 'login.html', {'form': form})



def registro(request):
    if request.method == 'POST':
        # Validar términos y condiciones
        if not request.POST.get('terms'):
            messages.error(request, 'Debes aceptar los términos y condiciones.')
            return render(request, 'registrarse.html')
        
        # Crear formulario con datos del POST
        form = CustomUserCreationForm(request.POST)
        
        if form.is_valid():
            try:
                # Guardar el usuario
                user = form.save()
                
                # Mensaje de éxito
                messages.success(request, f'¡Cuenta creada exitosamente para {user.username}! Ya puedes iniciar sesión.')
                
                # Redirigir al login
                return redirect('casita')
                
            except Exception as e:
                messages.error(request, f'Error al crear la cuenta: {str(e)}')
                return render(request, 'registrarse.html', {'form': form})
        else:
            # Si el formulario no es válido, mostrar errores
            for field, errors in form.errors.items():
                for error in errors:
                    if field == 'username':
                        if 'already exists' in error:
                            messages.error(request, 'Este nombre de usuario ya está en uso.')
                        else:
                            messages.error(request, f'Error en nombre de usuario: {error}')
                    elif field == 'email':
                        messages.error(request, f'Error en email: {error}')
                    elif field == 'password2':
                        if 'don\'t match' in error:
                            messages.error(request, 'Las contraseñas no coinciden.')
                        else:
                            messages.error(request, f'Error en contraseña: {error}')
                    elif field == 'password1':
                        messages.error(request, f'Error en contraseña: {error}')
                    else:
                        messages.error(request, f'Error en {field}: {error}')
            
            return render(request, 'registrarse.html', {'form': form})
    else:
        form = CustomUserCreationForm()

    return render(request, 'registrarse.html', {'form': form})