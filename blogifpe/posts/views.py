from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .serializers import PostSerializer
from .models import Post

# Create your views here.


@swagger_auto_schema(method='get', operation_summary="List all posts", )
@api_view(['GET'])
@permission_classes([AllowAny])
def list_posts(request):
    all_posts = Post.objects.all()
    serializer = PostSerializer(all_posts, many=True)
    return Response(serializer.data)

@swagger_auto_schema(method='POST', operation_summary="Create a new post", 
                     request_body=PostSerializer, responses={201: "Post created successfully"})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='PUT', operation_summary="Update a  post", 
                    request_body=PostSerializer, responses={200: "Post updated successfully"})
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PostSerializer(post, data=request.data)    
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='DELETE', operation_summary="Delete a post")
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        if post.author != request.user:
            return Response({'error': 'You do not have permission to delete this post'}, status=status.HTTP_403_FORBIDDEN)
        post.delete()
        return Response({'message': 'Post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(method='get', operation_summary="View a single post")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)