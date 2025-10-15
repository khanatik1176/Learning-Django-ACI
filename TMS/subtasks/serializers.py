from rest_framework import serializers
from .models import Subtask

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'task', 'title', 'is_completed', 'created_at', 'updated_at', 'due_date', 'priority', 'assigned_to', 'description', 'order']
        read_only_fields = ['created_at', 'updated_at']