from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Message
from .serializers import MessageSerializer, MyTokenObtainPairSerializer
from .services import generate_response

class UserMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        messages = Message.objects \
            .filter(user_chat=user) \
            .order_by('created_at')
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        user = request.user
        text = request.data.get("text")

        if not text:
            return Response(
                {"error": "O campo 'text' é obrigatório."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        Message.objects.create(
            user_chat=user,
            text=text,
            is_from_user=True
        )

        try:
            response_gemini = generate_response(text)

            response_database = Message.objects.create(
                user_chat=user,
                text=response_gemini,
                is_from_user=False
            )

            serializer = MessageSerializer(response_database)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            Message.objects.create(
                user_chat=user,
                text=f"error: {e}",
                is_from_user=False
            )
            return Response({"error": f"{e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout efetuado"}, status=status.HTTP_205_RESET_CONTENT)

        except Exception:
            return Response({"error": "Refresh token inválido"}, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

