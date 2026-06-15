# ReCommerce: Amazon Hackathon Project

ReCommerce is an intelligent "Fast Deviate" return logistics system designed to tackle the waste of perfectly usable items returned while in transit or stranded at a nearby facility. Instead of returning the item to the main warehouse (wasting shipping costs and increasing the carbon footprint), this system mathematically finds the nearest neighbor human buyer to deviate the shipment directly to them.

## System Architecture

The project consists of four main modules:

1. **ReCommerce-Recommender (AI Buyer Recommender)**
   A high-performance FastAPI backend that uses HuggingFace SentenceTransformers and FAISS (Facebook AI Similarity Search). It takes the stranded product's specifications and semantically matches them with the search histories of nearby Amazon buyers, prioritizing fast logistics based on geographical proximity (Haversine formula).
   
2. **ReCommerce-ai (Damage Detection Server)**
   A FastAPI inference service providing AI Damage Detection to automatically assess whether the cancelled or returned product is perfectly usable or damaged.
   
3. **ReCommerce-backend (Core API Server)**
   A robust Node.js, Express, TypeScript, and Prisma (PostgreSQL) RESTful API server. It manages user authentication, user profiles, items, and overall logistics data.
   
4. **ReCommerce-frontend (User Interface)**
   A modern React, TypeScript, and Vite frontend styled with Tailwind CSS, Radix UI, and Framer Motion for a seamless and responsive user experience.

---

## Folder Structure

```
f:/amazonHackathon/
├── ReCommerce-Recommender/   # FastAPI AI Buyer Recommender service
├── ReCommerce-ai/            # FastAPI AI Damage Detection service
├── ReCommerce-backend/       # Node.js/Express/Prisma core backend
└── ReCommerce-frontend/      # React/Vite/Tailwind frontend
```

---

## Installation & Running Instructions

### 1. ReCommerce-Recommender (AI Recommender)
**Tech Stack:** Python 3.10+, FastAPI, FAISS, HuggingFace SentenceTransformers

**Setup:**
```bash
cd ReCommerce-Recommender
# Create and activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\Activate.ps1
# Install dependencies
pip install -r requirements.txt
```

**Run:**
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

### 2. ReCommerce-ai (Damage Detection Server)
**Tech Stack:** Python 3.10+, FastAPI

**Setup:**
```bash
cd ReCommerce-ai
# Create and activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\Activate.ps1
# Install dependencies
pip install -r requirements.txt
# Set up environment variables
# Create a .env file based on the required settings (if any)
```

**Run:**
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```
*(Adjust the port if necessary to avoid conflicts with the Recommender. Note: main.py is in the root of the ReCommerce-ai folder).*
- Interactive Swagger UI: `http://127.0.0.1:8001/docs`

### 3. ReCommerce-backend (Node Server)
**Tech Stack:** Node.js, Express, TypeScript, Prisma, PostgreSQL, Docker

**Setup:**
```bash
cd ReCommerce-backend
# Install dependencies
yarn install
# Set up environment variables
cp .env.example .env
```
Ensure you have a PostgreSQL database running and update the `DATABASE_URL` inside the `.env` file. You can also start the DB using Docker:
```bash
yarn docker:dev-db:start
```

**Run:**
```bash
# Push Prisma schema to DB
yarn db:push
# Run server
yarn dev
```
- API starts at: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/v1/docs`

### 4. ReCommerce-frontend (React Web App)
**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS v4, Zustand/React Query

**Setup:**
```bash
cd ReCommerce-frontend
# This workspace uses pnpm
pnpm install
```

**Run:**
```bash
pnpm dev
```
- Web App starts at the port provided by Vite (usually `http://localhost:5173`).

---

## Environmental Variables
Be sure to populate the `.env` files in `ReCommerce-backend`, `ReCommerce-frontend`, and `ReCommerce-ai` before running the services.
- For the Node backend, refer to `.env.example`.
- For the frontend, check for `.env` files supplying API base URLs for the Backend and the AI servers.

## License
MIT / ISC License. Refer to individual subdirectories for detailed licensing information.
