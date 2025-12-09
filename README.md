# 📰 AutoBlog AI

A fully **auto-generated tech blog** built with **React + Node.js + PostgreSQL**, Dockerized and deployed on **AWS EC2**. Articles are produced daily via **OpenRouter** for AI-driven content, using **Picsum** as a fallback image source.

🔗 **Live Demo:** http://13.201.229.0/

---

## 🚀 Tech Stack

| Layer      | Technologies |
|-----------|--------------|
| Frontend  | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, nginx |
| Backend   | Node.js, Express, node-cron |
| Database  | PostgreSQL |
| Infra     | Docker, AWS EC2, AWS ECR, AWS CodeBuild |
| AI        | OpenRouter (text), Picsum (images) |

---

## 📂 Repository Structure

.
├── frontend/   # React app + Vite + Tailwind + Dockerfile
├── backend/    # Express API + Cron jobs + Dockerfile
├── infra/      # Buildspec + nginx + deploy scripts
└── docs/       # Architecture notes (optional)

---

## 🔐 Environment Variables

### Backend
```
PORT=3000
DATABASE_URL=postgres://<user>:<pass>@<host>:5432/autoblog
OPENROUTER_API_KEY=<your_key>
```

### Frontend build-time
```
VITE_API_BASE=/api
```
> Ensures nginx proxies frontend → backend requests.

---

## 🛠 Local Development (Docker Compose)

```sh
docker compose up --build
```

Local endpoints:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Postgres: localhost:5432 (credentials in docker-compose.yml)

---

## 📦 Build & Push Images to ECR

Replace `<acct>` and `<region>` with your AWS values.

**Frontend**
```sh
cd frontend
export VITE_API_BASE=/api
npm install && npm run build
docker build -t <acct>.dkr.ecr.<region>.amazonaws.com/autoblog-frontend:v1 .
docker push <acct>.dkr.ecr.<region>.amazonaws.com/autoblog-frontend:v1
```

**Backend**
```sh
cd backend
npm install
npm run build
docker build -t <acct>.dkr.ecr.<region>.amazonaws.com/autoblog-backend:v1 .
docker push <acct>.dkr.ecr.<region>.amazonaws.com/autoblog-backend:v1
```

---

## ☁ Manual EC2 Deployment

On your EC2 host (ensure `nginx.conf` is present):
```sh
docker network create autoblog-network 2>/dev/null || true

# Postgres
docker rm -f postgres 2>/dev/null || true
docker run -d --name postgres --network autoblog-network \
  -e POSTGRES_DB=autoblog \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:16

# Backend
docker rm -f autoblog-backend 2>/dev/null || true
docker run -d --name autoblog-backend --network autoblog-network \
  -e DATABASE_URL=postgres://postgres:password@postgres:5432/autoblog \
  -e OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
  -p 3000:3000 \
  <acct>.dkr.ecr.<region>.amazonaws.com/autoblog-backend:v1

# Frontend (nginx + proxy)
docker rm -f autoblog-frontend 2>/dev/null || true
docker run -d -p 80:80 --name autoblog-frontend --network autoblog-network \
  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf \
  <acct>.dkr.ecr.<region>.amazonaws.com/autoblog-frontend:v1
```

---

## 🔁 CodeBuild CI/CD Setup

- Use CodeConnections for GitHub integration.
- Service role must include `codestar-connections:UseConnection`.
- `privilegedMode: true` for Docker-in-Docker.
- Uses `infra/buildspec.yml`.
- Required environment variables:
  - `AWS_REGION`
  - `ACCOUNT_ID`

---

## ✨ Core Features

- Daily auto-generated articles via OpenRouter.
- Picsum image fallback.
- REST APIs:
  - `GET /api/articles`
  - `GET /api/articles/:id`
- Fully containerized; works locally via Docker Compose.
- Production running on AWS EC2 + ECR + CodeBuild.

---

## ⚙️ Recommendations

- Store secrets in AWS Secrets Manager or SSM Parameter Store.
- Pin Docker tags (e.g., `v1`) to avoid unintended upgrades.
- `nginx.conf` lives in `infra/nginx.conf`.

---


