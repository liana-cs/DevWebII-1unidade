from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Post

class PostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class CommentSerializer(serializers.Serializer):
    id = serializers.CharField( read_only=True)
    post = serializers.IntegerField(write_only=True)
    author = serializers.CharField()
    body = serializers.CharField(max_length=500, required=True)
    pub_date = serializers.DateTimeField(read_only=True)