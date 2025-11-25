Chat Project — FullStack

Este projeto é composto por dois componentes rodando juntos:

Backend: Python + Django REST Framework

Frontend: React + Next.js

📁 Estrutura do Projeto

/chat_project
   ├── chat_project_api/
   |     ├── chat_project/
   │     |     ├── settings.py
   │     |     ├── urls.py
   │     |
   │     ├── chat/
   |     |     ├── models.py
   │     |     ├── serializers.py
   │     |     ├── services.py
   │     |     ├── views.py
   │     |     ├── urls.py
   │     |
   │     ├── manage.py
   |
   └── chat_project_frontend/
         ├── app/
         ├── schemas/
         ├── services/
         ├── stores/

🖥️ Backend – Python + Django (chat_project_api/)

O backend é responsável pela API REST, autenticação JWT, gerenciamento de usuários e mensagens.

📁 chat_project/

Contém os arquivos principais de configuração do Django:

settings.py – Configurações do projeto (apps, banco de dados, JWT, CORS, etc.).

urls.py – Arquivo de rotas principais do backend.

📁 chat/

Aplicação principal da API. Contém:

models.py
Define as tabelas do banco utilizando o ORM do Django.

serializers.py
Responsáveis por transformar os modelos em JSON e validar dados de entrada.

services.py
Contém regras de negócio separadas das views.

views.py
Onde ficam os endpoints da API (ex.: envio de mensagens, listagem, logout, etc.).

urls.py
Rotas específicas dessa aplicação, incluídas no arquivo principal.

📄 manage.py

Arquivo utilitário do Django, usado para comandos como:

python manage.py runserver
python manage.py migrate
python manage.py createsuperuser

🌐 Frontend – React + Next.js (chat_project_frontend/)

O frontend é responsável pela interface da aplicação, autenticação via JWT e comunicação com o backend.

📁 app/

Páginas e rotas do Next.js 13+ (App Router).
Aqui ficam telas como:

/login

/chat

/register

📁 schemas/

Define os tipos TypeScript usados na aplicação, como:

Modelo de usuário

Modelo de mensagem

Formatos de requisição/resposta da API

📁 services/

Contém funções que fazem requisições ao backend usando fetch ou axios, como:

login

registrar usuário

enviar mensagens

buscar mensagens

📁 stores/

Armazena estados globais com Zustand ou outro gerenciador, como:

usuário autenticado

token JWT

lista de mensagens

estados de loading
🛠️ 1. Como Rodar o BACKEND (Django)
🚧 Pré-requisitos

Python 3.10+

pip

Virtualenv (opcional, mas recomendado)

PostgreSQL ou SQLite (ambiente local pode usar SQLite sem configurações extras)

▶️ Passo 1: Acessar a pasta do backend
cd chat_project_api

▶️ Passo 2: Criar e ativar o ambiente virtual

Windows:

python -m venv venv
venv\Scripts\activate
ou
source venv/bin/activate


Linux/Mac:

python3 -m venv venv
source venv/bin/activate

▶️ Passo 3: Instalar dependências
pip install -r requirements.txt

▶️ Passo 4: Criar arquivo .env

Na pasta chat_project_api/chat_project/ crie uo arquivo e insira as variáveis:

SECRET_ACESS=chave-secreta_acess
SECRET_REFRESH=chave-secreta_refresh
GEMINI_API_KEY=chave_gemini_aqui
URL_FRONTEND=http://localhost:3000
SECRET_KEY_DJANGO=secret_django
DEGUB=True
DATABASE_URL=postgres://usuario:senha@host:5432/dbname ( caso use postegres localmente )

▶️ Passo 5: Rodar migrações
python manage.py migrate

▶️ Passo 6: (Opcional) Rodar seed para criar usuários iniciais

python manage.py seed

▶️ Passo 7: Rodar o servidor backend
python manage.py runserver


O backend estará rodando em:

👉 http://127.0.0.1:8000

🌐 2. Como Rodar o FRONTEND (Next.js + React)
🚧 Pré-requisitos

Node.js 18+

npm ou yarn

▶️ Passo 1: Acessar a pasta do frontend
cd chat_project_frontend

▶️ Passo 2: Instalar dependências
npm install


Ou:

yarn

▶️ Passo 3: Configurar variáveis de ambiente

Crie um .env.local na pasta do frontend:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000


▶️ Passo 4: Rodar o frontend
npm run dev


Ou:

yarn dev


O frontend estará rodando em:

👉 http://localhost:3000

🔗 Como o Frontend se conecta ao Backend

O frontend usa:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000


Assim, qualquer requisição será enviada ao backend:


📌 Resumo
Parte	Comando
Instalar backend	pip install -r requirements.txt
Rodar backend	python manage.py runserver
Instalar frontend	npm install
Rodar frontend	npm run dev
