# chat/serializers.py
from rest_framework import serializers
from .models import Message, User

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "text", "user_chat", "created_at"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User,
        fields = ["id", "username", "email"]