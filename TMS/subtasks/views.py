from django.shortcuts import render
from rest_framework import viewsets
from .models import Subtask
from .serializers import SubtaskSerializer

class SubtaskViewSet(viewsets.ModelViewSet):
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer

    def perform_create(self, serializer):
        serializer.save()