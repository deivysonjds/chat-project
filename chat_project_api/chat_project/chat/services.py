# meu_app/services.py
import google.generativeai as genai
from django.conf import settings
genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("models/gemini-2.5-flash")

def generate_response(prompt: str) -> str:
    response = model.generate_content(f"Responda APENAS com texto puro, sem markdown, sem negrito, sem formatação, sem quebra de linha, etc:\n{prompt}")
    return response.text
