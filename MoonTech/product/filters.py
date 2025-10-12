import django_filters
from django_filters import FilterSet
from .models import Product

class ProductFilter(FilterSet):

    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    description = django_filters.CharFilter(field_name='description', lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category__id', lookup_expr='exact')
    price_lt = django_filters.NumberFilter(field_name='price', lookup_expr='lt')
    price_gt = django_filters.NumberFilter(field_name='price', lookup_expr='gt')
    in_stock = django_filters.BooleanFilter(field_name='in_stock')

    class Meta:
        model = Product
        fields = ['name', 'description', 'category', 'price_lt', 'price_gt', 'in_stock']
