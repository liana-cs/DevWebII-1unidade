from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import manage_profile, user_logout, user_panel, api_login, user_register, user_login

urlpatterns = [
    path('api/login/', api_login, name='api_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', user_logout, name='user_logout'),
    path('user_panel/', user_panel, name='user_panel'), 
    path('manage_profile/', manage_profile, name='manage_profile'), 
    path('register/', user_register, name='user_register'),
    path('login/', user_login, name='user_login'),
]