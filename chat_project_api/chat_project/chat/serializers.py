# chat/serializers.py
from rest_framework import serializers
from .models import Message, User

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "text", "user_chat", "is_from_user", "created_at"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User,
        fields = ["id", "username", "email"]

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username

        return token