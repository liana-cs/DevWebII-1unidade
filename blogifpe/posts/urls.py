from django.urls import path
from . import views

urlpatterns = [
    path("<int:pk>/", views.view_post, name="view_post"),
    path("", views.list_posts, name="list_posts"),
    path("create/", views.create_post, name="create_post"),
    path("<int:pk>/update", views.update_post, name="update_post"),
    path("<int:pk>/delete", views.delete_post, name="delete_post"),
    path("<int:pk>/comments/", views.list_comments, name="list_comments"),
    path("<int:pk>/comments/create", views.create_comment, name="create_comment"),
    path("<int:pk>/comments/<str:comment_id>/update", views.update_comment, name="update_comment"),
    path("<int:pk>/comments/<str:comment_id>/delete", views.delete_comment, name="delete_comment"),
    path("search/", views.search_posts, name="search_posts"),
]