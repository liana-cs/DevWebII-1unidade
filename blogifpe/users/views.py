from venv import logger
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib.auth import logout
from users.forms import RegisterForm, LoginForm
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm

# Create your views here.


def user_logout(request):
    logout(request)
    return redirect('login')

def user_panel(request):
    user = request.user
    user_data ={}
    if user.is_authenticated:
        user_data = {
           'id': user.id,
            'username': user.username,
            'email': user.email,
        }
    return render(request, 'templates/user_panel.html', {'user': user_data} )

def user_register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            email = form.cleaned_data['email']
            password = form.cleaned_data['password1']
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                logger.info(f'User {user.username} successfully registered and logged in.')
                return redirect('user_panel')
            else:
                logger.error('Error: User not authenticated after registration.')   
    else:
        form = RegisterForm()
    return render(request, 'templates/register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('user_panel') 
    else:
        form = LoginForm()
    return render(request, 'templates/login.html', {'form': form})

    
def manage_profile(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'POST':
            email = request.POST.get('email')
            user.email = email
            user.save()
            messages.success(request, 'Profile updated successfully.')
    return render(request, 'templates/manage_profile.html', {'user': user})