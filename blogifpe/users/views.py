from django.shortcuts import redirect, render
from django.contrib.auth import logout
from users.serializers import RegisterSerializer, LoginSerializer
from django.contrib import messages
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings

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

@api_view(['POST'])
@permission_classes([AllowAny])
def user_register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user = authenticate(request, username=user.username, password=request.data['password1'])
        if user is not None:
            login(request, user)
            return Response({"message": "User created and logged in"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Authentication failed after registration"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([AllowAny])
@api_view(['POST'])
def user_login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    user = authenticate(request, username=username, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    payload = {
        'user_id': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24),  
        'iat': datetime.now(timezone.utc),
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    return Response({'token': token, 'username': user.username})
    
def manage_profile(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'POST':
            email = request.POST.get('email')
            user.email = email
            user.save()
            messages.success(request, 'Profile updated successfully.')
    return render(request, 'templates/manage_profile.html', {'user': user})