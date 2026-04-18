# Mini Sentiment Widget

Users rate their experience (1–5), leave an optional comment, and see a live summary of all submissions.

The frontend support **fully standalone** (pure React state, no backend required). Alternate with the NestJS + MongoDB backend by fill the "NEXT_PUBLIC_API_URL" environment variable frontend.


Live Deployment: [http://sentiment-alb-930936963.ap-southeast-1.elb.amazonaws.com:8080](http://sentiment-alb-930936963.ap-southeast-1.elb.amazonaws.com:8080)
---

## Prerequisites

- Node.js 20+
- npm 10+
- Make
- MongoDB 7+ (only when running the backend locally)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Next.js 16 (App Router), Tailwind CSS |
| State | `useReducer` + custom hooks |
| Backend | NestJS, TypeScript |
| Database | MongoDB (via Mongoose) |
| CI/CD | GitHub Actions |
| Container | Docker (multi-stage), Docker Compose |

---


## 1. Frontend — standalone mode (no backend needed)

```bash
cd frontend
cp .env.example .env.local # leave NEXT_PUBLIC_API_URL blank by default  
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). All submissions are held in React state — refreshing resets the data.

---


## 2. Frontend + Backend (Docker Compose)

Run command below
```bash
make docker-build   # build frontend + backend images
make docker-up      # start mongo + backend + frontend
```

To stop:
```bash
make docker-down
```

Open [http://localhost:3000](http://localhost:3000). The backend API is at [http://localhost:3001](http://localhost:3001).



## 3. Environment Variables

### `frontend/.env.local`

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | *(blank)* | Blank = standalone mode. `/api` = Next.js rewrite → localhost:3001. Full URL for production. |

### `backend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port the NestJS server listens on |
| `MONGODB_URI` | `mongodb://localhost:27017/sentiment` | MongoDB connection string |
| `FRONTEND_URL` | `*` | Allowed CORS origin |

---


## 4. Makefile Targets

Run `make` with no arguments to list all targets.

| Target | Description |
|--------|-------------|
| `make install` | Install dependencies for both services |
| `make dev-backend` | Start backend in watch mode (port 3001) |
| `make dev-frontend` | Start frontend dev server (port 3000) |
| `make build` | Build both services |
| `make test` | Run all unit tests |
| `make test-backend-e2e` | Run backend e2e tests |
| `make lint` | Lint both services |
| `make docker-build` | Build Docker images |
| `make docker-up` | Start all containers (detached) |
| `make docker-down` | Stop and remove containers |
| `make docker-logs` | Follow container logs |
| `make clean` | Remove build artefacts and node_modules |

---

### 5. GitHub Secrets
Add each secret below:

| Secret name | Value |
|-------------|-------|
| `AWS_ROLE_ARN` | `arn:aws:iam::<AWS Account ID>:role/github-actions-sentiment` |
| `AWS_REGION` | `ap-southeast-1` |
| `ECR_BACKEND_REPO` | `sentiment-backend` |
| `ECR_FRONTEND_REPO` | `sentiment-frontend` |
| `ECS_CLUSTER` | `sentiment` |
| `ECS_BACKEND_SERVICE` | `sentiment-backend` |
| `ECS_FRONTEND_SERVICE` | `sentiment-frontend` |
| `NEXT_PUBLIC_API_URL` | `http://sentiment-alb-XXXX.ap-southeast-1.elb.amazonaws.com` |

---

## 5. CI/CD Deployment

### Architecture

```
GitHub push to main
GitHub Actions
- CI gate (lint + unit + e2e)
- Deploy Frontend
- Deploy Backend
ECS Deploy
- ECR Frontend & Backend (Fargate) => Application Load Balancer (ALB) => api.example.com
```

**AWS services used:**

| Service | Purpose |
|---------|---------|
| ECR | Docker image registry (one repo per service) |
| ECS Fargate | Serverless container runtime |
| ALB | routing, health checks |
| Secrets Manager | `MONGODB_URI` injected at runtime (never in image) |
| IAM (OIDC) | Keyless GitHub Actions authentication |