from rest_framework import serializers
from .models import Engagement

class EngagementSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True) 
    class Meta:
        model = Engagement
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']

     