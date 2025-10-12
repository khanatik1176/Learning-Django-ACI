from rest_framework.permissions import BasePermission

class UserPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user

class UserProfilePermission(BasePermission):

    def has_permission(self, request, view):
        if request.method == 'POST':
            return False
        return True

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user