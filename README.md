# ProfileIQ 🔍
### LinkedIn Profile Intelligence Chatbot with RAG

> Paste a LinkedIn URL → AI scrapes the profile → Chat with an intelligent assistant that knows everything about that person.

![ProfileIQ Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20FastAPI-blue) ![AI](https://img.shields.io/badge/AI-RAG%20%2B%20LangChain-orange)

---

## 🚀 What is ProfileIQ?

ProfileIQ is a full-stack AI-powered platform that lets you analyze any public LinkedIn profile through natural conversation. Built for recruiters, hiring managers, and researchers who need deep profile insights fast.

**Real use cases:**
- H1B/visa screening and background research
- Candidate evaluation before interviews
- Competitive intelligence on professionals
- Understanding someone's public stance on topics

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login with cookie-based sessions
- 🤖 **Playwright Scraping** — Automated LinkedIn data extraction (posts, experience, education, skills)
- 🧠 **RAG Pipeline** — LangChain + ChromaDB vector search for intelligent, context-aware answers
- 💬 **AI Chat** — Powered by Groq (Llama 3.3 70B) with expert recruiter persona
- 📊 **Profile Management** — Save and revisit multiple analyzed profiles
- ⚡ **Real-time UI** — Clean dark interface with typing indicators and suggested questions

---

## 🏗️ Architecture

```
React Frontend (Vite + TypeScript + TailwindCSS)
        ↓
Express Backend (Node.js + MongoDB + JWT Auth)
        ↓
Playwright Scraper (LinkedIn data extraction)
        ↓
FastAPI AI Service (Python)
        ↓
LangChain + ChromaDB (RAG Pipeline)
        ↓
Groq API (Llama 3.3 70B — Answer Generation)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, HTTP-only Cookies |
| Scraping | Playwright, Chromium |
| AI Service | Python, FastAPI, Uvicorn |
| RAG | LangChain, ChromaDB, HuggingFace Embeddings |
| LLM | Groq (Llama 3.3 70B Versatile) |

---

## 📁 Project Structure

```
profileIQ/
├── fe/                     # React Frontend
│   └── src/
│       ├── components/
│       │   ├── chat.tsx
│       │   ├── sidebar.tsx
│       │   ├── mainPage.tsx
│       │   ├── newProfileDialog.tsx
│       │   ├── login.tsx
│       │   └── register.tsx
│       └── api.ts
├── be/                     # Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── ai/                     # FastAPI AI Service
    ├── main.py             # API endpoints
    └── rag.py              # RAG pipeline
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)
- LinkedIn account credentials

### 1. Clone the repo
```bash
git clone https://github.com/YadharthGC/profileIQ.git
cd profileIQ
```

### 2. Backend Setup
```bash
cd be
npm install
```

Create `be/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
LINKEDIN_EMAIL=your_linkedin_email
LINKEDIN_PASSWORD=your_linkedin_password
```

```bash
npm run dev
```

### 3. AI Service Setup
```bash
cd ai
python -m venv venv
venv\Scripts\activate  # Windows
pip install fastapi uvicorn langchain langchain-groq langchain-community chromadb sentence-transformers langchain-text-splitters python-dotenv
```

Create `ai/.env`:
```env
GROQ_API_KEY=your_groq_api_key
```

```bash
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd fe
npm install
npm run dev
```

---

## 🔄 How It Works

1. **User pastes a LinkedIn URL** → Express receives the request
2. **Playwright scrapes** — profile info, experience, education, skills, 30 latest posts
3. **Data saved to MongoDB** and sent to FastAPI for indexing
4. **FastAPI chunks the text** → generates embeddings → stores in ChromaDB
5. **User asks a question** → question embedded → top 5 relevant chunks retrieved
6. **Groq LLM generates** a concise, recruiter-style answer

---

## 🎯 RAG Pipeline

```
Profile Text
    ↓
Chunking (RecursiveCharacterTextSplitter, 500 tokens)
    ↓
Embeddings (all-MiniLM-L6-v2, runs locally)
    ↓
ChromaDB (vector store, per profile namespace)
    ↓
Query → Similarity Search → Top 5 Chunks
    ↓
Groq Llama 3.3 70B → Answer
```

---

## 🚧 Roadmap

- [ ] BullMQ + Redis for background scraping jobs
- [ ] Streaming AI responses
- [ ] Chat history persistence
- [ ] Multi-profile comparison
- [ ] Deploy to Vercel + Railway

---

## 👨‍💻 Author

**Yadharth GC** — [GitHub](https://github.com/YadharthGC)

---

⭐ Star this repo if you found it useful!
