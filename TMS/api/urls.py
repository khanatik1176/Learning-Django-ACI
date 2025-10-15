from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, TaskViewSet, AdminUserViewSet,CustomTokenObtainPairView, ResetPasswordView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('', include(router.urls)),
]
