from django.shortcuts import redirect, render
from django.http import HttpResponse
from .models import Post
from .forms import PostForm
from django.contrib import messages
# Create your views here.

def index(request):
    return HttpResponse("Hello, world! You're at the posts index.")

def list_posts(request):
    all_posts = Post.objects.all()
    context = {
        'posts': all_posts
    }
    return render(request, 'templates/list_posts.html', context)

def create_post(request):
    pass

def update_post(request, pk):
    pass

def delete_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        if request.method == 'POST': #em django só tem metodos get e post
            post.delete()
            messages.success(request, 'Post deleted successfully.')
            return redirect('list_posts')
    except Post.DoesNotExist:
        messages.error(request, 'Post not found.')
    return render(request, 'templates/list_posts.html')

def view_post(request, pk):
    try:
        post = Post.objects.all(pk=pk)
        context = {
            'post': post
        }
    except Post.DoesNotExist:
        messages.error(request, 'Post not found.')
        return redirect('list_posts')
    return render(request, 'templates/view_post.html', context)