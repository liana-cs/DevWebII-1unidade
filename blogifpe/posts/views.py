from django.shortcuts import redirect, render
from django.http import HttpResponse
from .models import Post
from .forms import PostForm
from django.contrib import messages
from categories.models import Category
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
    try:
        categories = Category.objects.all()
        post = Post.objects.all()
        sucess = False
        if request.method == 'POST':
            post_form = PostForm(request.POST or None, request.FILES)
            if post_form.is_valid():
                post_form.save()
                sucess = True
                messages.success(request, 'Post created successfully.')
                return redirect('list_posts')
            else:
                messages.error(request, 'Error creating post. Please check the form.')
        else:
            post_form = PostForm()
        context = {
            'form': post_form,
            'categories': categories,
            'posts': post,
            'success': sucess
        }
        return render(request, 'templates/create_post.html', context)
    except Exception as e:
        messages.error(request, f'An error occurred: {e}')
        return redirect('list_posts')


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