#!/usr/bin/env bash
set -e


ACCOUNT_ID=${ACCOUNT_ID:?ACCOUNT_ID required}
REGION=${REGION:?REGION required}
IMAGE_TAG=${IMAGE_TAG:-latest}

ECR_BACKEND=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/autoblog-backend:$IMAGE_TAG
ECR_FRONTEND=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/autoblog-frontend:$IMAGE_TAG

echo "Logging into ECR..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

echo "Pulling images..."
docker pull "$ECR_BACKEND"
docker pull "$ECR_FRONTEND"

echo "Stopping old containers (if any)..."
docker rm -f autoblog-backend autoblog-frontend autoblog-postgres 2>/dev/null || true

echo "Starting Postgres..."
docker run -d --name autoblog-postgres \
  -e POSTGRES_USER=autoblog \
  -e POSTGRES_PASSWORD=autoblog123 \
  -e POSTGRES_DB=autoblog \
  -v autoblog_db:/var/lib/postgresql/data \
  postgres:15-alpine

echo "Starting backend..."
docker run -d --name autoblog-backend --restart always \
  -e DATABASE_URL=postgres://autoblog:autoblog123@autoblog-postgres:5432/autoblog \
  -e PORT=3000 \
  -e OPENROUTER_API_KEY="${OPENROUTER_API_KEY:?OPENROUTER_API_KEY required}" \
  --network bridge -p 3000:3000 \
  "$ECR_BACKEND"

echo "Starting frontend..."
docker run -d --name autoblog-frontend --restart always \
  -p 80:80 \
  "$ECR_FRONTEND"

echo "Deploy finished. Backend on :3000, frontend on :80"

