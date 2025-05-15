from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['category','title', 'body', 'author', 'image']
        list_display = ['id', 'body', 'author', 'image']
        list_display_links = ('id', 'title')
        search_fields = ('author', 'body')
        list_filter = ('author', 'body')
        list_editable = ('image',)