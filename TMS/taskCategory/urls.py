from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TaskCategoryViewSet

router=DefaultRouter()
router.register('task-categories', TaskCategoryViewSet, basename='task-categories')

urlpatterns=router.urls