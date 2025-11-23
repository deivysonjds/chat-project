from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Message

@admin.register(User)
class UserAdmin(BaseUserAdmin):

    list_display = ("id", "email", "username", "is_active", "password")

    search_fields = ("email", "username")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):

    list_display = ("id", "user_chat", "text", "is_from_user", "created_at")

    list_filter = ("is_from_user", "created_at")

    search_fields = ("text", "user_chat__email", "user_chat__username")

    ordering = ("-created_at",)
