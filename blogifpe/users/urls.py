from django.urls import path
from .views import manage_profile, logout_user, user_panel

urlpatterns = [
    path('logout/', logout_user, name='logout'),
    path('user_panel/', user_panel, name='user_panel'), #OK
    path('manage_profile/', manage_profile, name='manage_profile'), #OK
]