from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("post/<int:pk>/", views.view_post, name="view_post"),
    path("posts/", views.list_posts, name="list_posts"),
    path("posts/create/", views.create_post, name="create_post"),
    path("posts/<int:pk>/update", views.update_post, name="update_post"),
    path("posts/<int:pk>/delete", views.delete_post, name="delete_post"),
]