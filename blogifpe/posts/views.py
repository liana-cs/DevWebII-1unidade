from datetime import datetime
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, viewsets, filters
from .serializers import PostSerializer, CommentSerializer
from .models import Post, Comment
from django.db.models import Q


# Create your views here.

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

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

@swagger_auto_schema(method='get', operation_summary="List comments for a post")   
@api_view(['GET'])
@permission_classes([AllowAny])
def list_comments(request, pk):
    try:
        comments = Comment.objects.filter(post=pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    except Comment.DoesNotExist:
        return Response({'error': 'Comments not found'}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(method='POST', operation_summary="Create a comment",
                     request_body=CommentSerializer, responses={201: "Comment created successfully"})    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, pk):
    if request.method == 'POST':
        data = request.data
        data['post'] = pk
        data['author'] = request.user.username
        data['pub_date'] = datetime.now()

        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            comment = Comment(**serializer.validated_data)
            comment.save()
            response_serializer = CommentSerializer(comment)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='get', operation_summary="Search posts by title or body",
                     manual_parameters=[openapi.Parameter(
                        name='search',
                        in_=openapi.IN_QUERY,  
                        required=False,
                        type=openapi.TYPE_STRING,
                        description='Search term for post title or body'
                    )])
@api_view(['GET'])
@permission_classes([AllowAny])
def search_posts(request):
    query = request.GET.get('search', '')
    if query:
        posts = Post.objects.filter(Q(title__icontains=query) | Q(body__icontains=query))
    else:
        posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)