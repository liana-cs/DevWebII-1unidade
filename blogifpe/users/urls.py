from django.urls import path
from .views import manage_profile, user_logout, user_panel

urlpatterns = [
    path('logout/', user_logout, name='user_logout'),
    path('user_panel/', user_panel, name='user_panel'), #OK
    path('manage_profile/', manage_profile, name='manage_profile'), #OK
]