from django.db import models
from django.contrib.auth.models import User

class userProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone= models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state= models.CharField(max_length=100, blank=True, null=True)
    zipCode = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profileImage = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    
    def __str__(self):
        return self.user.username