from rest_framework import serializers
from .models import Comment
from api.models import Task
from .permissions import IsUserTaskOwner
from rest_framework.permissions import IsAuthenticated

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True) 
    task = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all())
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'task', 'content', 'created_at']
        permissions = [IsAuthenticated, IsUserTaskOwner]