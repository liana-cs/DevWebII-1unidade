from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import user_posts, user_panel, user_register

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-panel/', user_panel, name='user_panel'), 
    path('user-posts/', user_posts, name='user_posts'), 
    path('register/', user_register, name='user_register'),
]