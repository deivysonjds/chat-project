Chat Project — FullStack [chat](https://chat-project-red-phi.vercel.app/)

📘 Sobre o Projeto
📌 Visão Geral

Este projeto é uma aplicação de chat simples que permite envio de mensagens para um modelo de ia, além de poder acessar o histórico dessas mensagens enviadas e recebidas.

🎯 Objetivos do Sistema

Envio e recebimento de mensagens de um modelo de IA.

Filtragem de mensagens por usuário logado


🏗️ Arquitetura

Backend (Django) → API REST, regras de negócio, banco de dados SQLite localmente e Postegres em Deploy no render.

Frontend (Next.js) → consumo da API, autenticação no navegador

Comunicação via JSON usando Axios

🚀 Principais Tecnologias
Backend

Django

Django REST Framework

SimpleJWT

PostgreSQL

dj-database-url

Frontend

Next.js

React

TypeScript

Zustand 

Axios 

Zod

🔐 Autenticação

Tokens gerado em /api/token

Token de refresh em /api/token/refresh

Front salva no Cookie e Zustand

Requests enviados com Authorization: Bearer <token>

Middleware para impedir acesso às rotas /chat e /history

💬 Funcionalidades do Chat

Exemplo:

Enviar mensagem

Receber resposta da IA

Buscar mensagens anteriores


📦 Deploy

Backend em deploy no render

FrontEnd em deploy no Vercel 

📁 Estrutura do Projeto
```
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
```


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
```
cd chat_project_api
```

▶️ Passo 2: Criar e ativar o ambiente virtual

Windows:

python -m venv venv
```
venv\Scripts\activate
// ou
source venv/bin/activate

```


Linux/Mac:

python3 -m venv venv
```
source venv/bin/activate
```

▶️ Passo 3: Instalar dependências
```
pip install -r requirements.txt
```

▶️ Passo 4: Criar arquivo .env

Na pasta chat_project_api/chat_project/ crie uo arquivo e insira as variáveis:

```
SECRET_ACESS=chave-secreta_acess
SECRET_REFRESH=chave-secreta_refresh
GEMINI_API_KEY=chave_gemini_aqui
URL_FRONTEND=http://localhost:3000
SECRET_KEY_DJANGO=secret_django
DEGUB=True
DATABASE_URL=postgres://usuario:senha@host:5432/dbname ( caso use postegres localmente )
```

▶️ Passo 5: Rodar migrações
```
python manage.py migrate
```

▶️ Passo 6: (Opcional) Rodar seed para criar usuários iniciais
```
python manage.py seed
```

▶️ Passo 7: Rodar o servidor backend
```
python manage.py runserver
```


O backend estará rodando em:

👉 http://127.0.0.1:8000

🌐 2. Como Rodar o FRONTEND (Next.js + React)
🚧 Pré-requisitos

Node.js 18+

npm ou yarn

▶️ Passo 1: Acessar a pasta do frontend
```
cd chat_project_frontend
```

▶️ Passo 2: Instalar dependências
```
npm install
// ou
yarn
```

▶️ Passo 3: Configurar variáveis de ambiente

Crie um .env.local na pasta do frontend:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```


▶️ Passo 4: Rodar o frontend
npm run dev


Ou:

yarn dev


O frontend estará rodando em:

👉 http://localhost:3000

🔗 Como o Frontend se conecta ao Backend

O frontend usa:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000


Após acessar o site, faça login com:

username: user1 ou user2
password: 123456

Ao acessar a página "/chat", faça uma pergunta e envie.
Para visualizar o histórico de mensagens, basta acessar a página "history"


