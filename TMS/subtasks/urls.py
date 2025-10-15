from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import SubtaskViewSet
    
router=DefaultRouter()
router.register(r'subtasks', SubtaskViewSet, basename='subtasks')

urlpatterns=router.urls