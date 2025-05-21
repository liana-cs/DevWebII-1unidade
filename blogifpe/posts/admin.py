from django.contrib import admin
from django import forms
from django.contrib import admin
from posts.models import Post

# Register your models here.

@admin.register(Post)
class createPostAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'pub_date', 'author', 'image']
    search_fields = ['title', 'category__name']
    list_per_page = 8
    list_editable = ['image']
    prepopulated_fields = {'slug': ('title',)}


