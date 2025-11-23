from django.core.management.base import BaseCommand
from chat.models import User

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        users = [
            {"email": "user1@example.com", "username": "user1", "password": "123456"},
            {"email": "user2@example.com", "username": "user2", "password": "123456"},
        ]

        for data in users:
            if not User.objects.filter(email=data["email"]).exists():
                user = User.objects.create_user(
                    email=data["email"],
                    username=data["username"],
                    password=data["password"]
                )
                self.stdout.write(self.style.SUCCESS(f"Usuário criado: {user.email}"))
            else:
                self.stdout.write(self.style.WARNING(f"Já existe: {data['email']}"))
