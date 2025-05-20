from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from categories.models import Category
from posts.models import Post
from .serializers import CategorySerializer


# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    try:
        categories = Category.objects.all().order_by('-created_at')
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({"error": "Categories not found"}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(method='post', request_body=CategorySerializer)
@api_view(['POST'])    
@permission_classes([AllowAny])
def create_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

