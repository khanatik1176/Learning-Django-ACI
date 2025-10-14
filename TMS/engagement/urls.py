from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EngagementViewSet

router = DefaultRouter()
router.register(r'engagements', EngagementViewSet, basename='engagement')

urlpatterns = [
    path('', include(router.urls)),
]

