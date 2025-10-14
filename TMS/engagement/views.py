from rest_framework.viewsets import ModelViewSet
from .models import Engagement
from .serializers import EngagementSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsUserTaskOwner

class EngagementViewSet(ModelViewSet):
    queryset = Engagement.objects.all()
    serializer_class = EngagementSerializer
    permission_classes = [IsAuthenticated, IsUserTaskOwner]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

