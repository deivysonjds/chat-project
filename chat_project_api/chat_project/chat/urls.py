from django.urls import path
from .views import UserMessageView, LogoutView, MyTokenObtainPairView

urlpatterns = [
    path("messages", UserMessageView.as_view(), name="messages-views"),
    path("token/logout", LogoutView.as_view(), name="logout"),
    path("token", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
]