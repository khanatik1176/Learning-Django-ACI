from django.contrib.auth.models import AbstractUser
from django.db import models
from taskCategory.models import TaskCategory

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    role=models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    is_banned=models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"
    

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    category = models.ForeignKey(TaskCategory, on_delete=models.CASCADE, related_name='tasks', default=1)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title