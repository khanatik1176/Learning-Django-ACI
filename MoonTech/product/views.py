from rest_framework.viewsets import ModelViewSet
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .permissions import isAdminOrStaffOrReadOnly
from rest_framework.filters import SearchFilter 
from .filters import ProductFilter 
from django_filters.rest_framework import DjangoFilterBackend

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [isAdminOrStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    search_fields = ['name', 'description']
    filterset_class = ProductFilter

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [isAdminOrStaffOrReadOnly]


