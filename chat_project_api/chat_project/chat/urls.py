from django.urls import path
from .views import UserMessageView

urlpatterns = [
    path("messages", UserMessageView.as_view(), name="messages-views"),
]