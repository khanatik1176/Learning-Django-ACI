from django.db import models
from api.models import User, Task

class Engagement(models.Model):
    disLike = models.IntegerField(default=0)
    like = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)
    task = models.ManyToManyField(Task, related_name='engagements')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Engagement by {self.user} on Task(s): {[task.id for task in self.task.all()]}"