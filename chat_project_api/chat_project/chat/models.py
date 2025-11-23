from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)

    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username
    
class Message(models.Model):
    user_chat = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    text = models.TextField(null=False)
    is_from_user = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        origin = f"user {self.user_chat}" if self.is_from_user else "system"
        return f'{origin} {self.created_at}: {self.text}'