from django.urls import path
from .views import get_categories, create_category

urlpatterns = [
    path('', get_categories, name='get_categories'),
    path('create/', create_category, name='create_category'),
]