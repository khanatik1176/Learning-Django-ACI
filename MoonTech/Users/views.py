from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .permissions import UserPermission
from .models import userProfile
from .serializers import UserProfileSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [UserPermission]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return []
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class UserProfileViewSet(ModelViewSet):
    queryset = userProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [UserPermission]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return []
        if self.request.user.is_superuser:
            return userProfile.objects.all()
        return userProfile.objects.filter(user=self.request.user)