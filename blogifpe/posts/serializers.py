from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Post

class PostSerializer(ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'body', 'slug', 'category', 'category_name', 
                 'image', 'pub_date', 'update_date', 'author_name']
        read_only_fields = ['id', 'pub_date', 'update_date', 'author_name', 'category_name']

class CommentSerializer(serializers.Serializer):
    id = serializers.CharField( read_only=True)
    post = serializers.IntegerField(write_only=True)
    author = serializers.CharField()
    body = serializers.CharField(max_length=500, required=True)
    pub_date = serializers.DateTimeField(read_only=True)