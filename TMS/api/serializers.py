from rest_framework import serializers

from taskCategory.serializers import TaskCategorySerializer
from .models import User, Task
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from comment.serializers import CommentSerializer
from engagement.serializers import EngagementSerializer
from subtasks.serializers import SubtaskSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model=User
        fields=['id', 'username', 'email', 'role', 'is_banned',]

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email','password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return User.objects.create(**validated_data)
    
class ResetPasswordSerializer(serializers.Serializer):
    email= serializers.EmailField(required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        new_password = attrs.get('new_password')

        try: 
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('User with this email does not exist.')
        
        # if len(new_password) < 8:
        #     raise serializers.ValidationError('Password must be at least 8 characters long.')

        self.context['user'] = user
        return attrs
    
    def save(self):
        user = self.context['user']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user

    
class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs['username'], password=attrs['password'])
        if user is None:
            raise serializers.ValidationError('Invalid username or password')
        if user.is_banned:
            raise serializers.ValidationError('This account is banned.')
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }

class TaskSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    engagements = EngagementSerializer(many=True, read_only=True)
    category = TaskCategorySerializer(read_only=True)
    subtasks = SubtaskSerializer(many=True, read_only=True)
    subtask_count = serializers.SerializerMethodField() 

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['user', 'comments', 'engagements', 'category', 'subtasks']

    def get_subtask_count(self, obj):
        return obj.subtasks.count()