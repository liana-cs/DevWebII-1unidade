from django.shortcuts import render
from categories.models import Category
from posts.models import Post


# Create your views here.

def get_categories(request, name):
    try:
        category = Category.objects.get(name=name)
        posts_category = Post.objects.filter(category=category).order_by('-created_at')
        return render (request, 'templates/category_posts.html', {'category': category, 'posts_category': posts_category})
    except Category.DoesNotExist:
        return render(request, 'templates/category_posts.html', {'error': 'Category not found'})

