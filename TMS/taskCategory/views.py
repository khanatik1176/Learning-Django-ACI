from django.shortcuts import render
from rest_framework import viewsets
from .models import TaskCategory
from .serializers import TaskCategorySerializer

class TaskCategoryViewSet(viewsets.ModelViewSet):
    queryset = TaskCategory.objects.all()
    serializer_class = TaskCategorySerializer
    
