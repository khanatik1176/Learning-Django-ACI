from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, TaskViewSet, AdminUserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
