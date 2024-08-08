from rest_framework.permissions import BasePermission

class Tan_IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 1

class Tan_IsLeTan(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 2

class Tan_IsKhachHang(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 3