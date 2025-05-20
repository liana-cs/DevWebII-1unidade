from django.urls import path
from . import views

urlpatterns = [
    path("<int:pk>/", views.view_post, name="view_post"),
    path("", views.list_posts, name="list_posts"),
    path("create/", views.create_post, name="create_post"),
    path("<int:pk>/update", views.update_post, name="update_post"),
    path("<int:pk>/delete", views.delete_post, name="delete_post"),
]