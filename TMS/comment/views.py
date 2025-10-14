from rest_framework.viewsets import ModelViewSet
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsUserTaskOwner

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsUserTaskOwner]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)