# Predictive Political Strategy Matrix

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) dashboard that compares electoral candidates and calculates their **Probability of Win (PoW)** using weighted algorithmic scoring.

## Features

- **Candidate Comparative Table** — Side-by-side analysis of candidates across 6 strategic factors
- **Strategic Gaps Visualizer** — Bar chart comparing raw scores to identify weaknesses
- **Forecast Engine** — Interactive Donut Chart with real-time weight adjustment sliders
- **Live OSINT Sync** — Fetches live news article volume from GNews API to dynamically update Digital Sentiment scores

## Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Database    | MongoDB (Mongoose)     |
| Backend     | Node.js, Express.js    |
| Frontend    | React.js (Vite)        |
| Charts      | Recharts               |
| News API    | GNews.io               |

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/RaunakK22UB/Predictive-Political-Strategy-Matrix.git
cd Predictive-Political-Strategy-Matrix
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/political_matrix
GNEWS_API_KEY=your_gnews_api_key_here
```

Seed the database:
```bash
node seed.js
```

Start the server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the Dashboard
Navigate to `http://localhost:5173` in your browser.

## API Endpoints

| Method | Route                 | Description                                  |
|--------|-----------------------|----------------------------------------------|
| GET    | `/api/candidates`     | Fetch all candidates                         |
| GET    | `/api/constituency`   | Fetch constituency weights                   |
| POST   | `/api/calculate-pow`  | Calculate PoW with custom weights            |
| GET    | `/api/current-pow`    | Calculate PoW using DB weights               |
| POST   | `/api/osint/sync`     | Fetch live news data and update sentiment    |

## Core Algorithm: Probability of Win (PoW)

1. For each candidate, multiply raw factor scores (1-10) by constituency weights (0-1)
2. Sum the weighted scores to get a **Total Weighted Score**
3. PoW = `(Candidate Total Score / Sum of All Scores) × 100`

## License

MIT
