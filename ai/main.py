from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rag import build_vectorstore, query_profile
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Request models
class IndexRequest(BaseModel):
    profile_id: str
    name: str
    experience: list[str]
    education: list[str]
    skills: list[str]
    posts: list[str]

class QueryRequest(BaseModel):
    profile_id: str
    question: str

@app.get("/")
def root():
    return {"message": "ProfileIQ AI service running 🚀"}

@app.post("/index")
def index_profile(req: IndexRequest):
    """
    Called by Express after scraping —
    chunks + embeds + stores profile in ChromaDB
    """
    try:
        profile_data = {
            "name": req.name,
            "experience": req.experience,
            "education": req.education,
            "skills": req.skills,
            "posts": req.posts,
        }
        build_vectorstore(req.profile_id, profile_data)
        return {"message": f"Profile {req.profile_id} indexed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
def query(req: QueryRequest):
    """
    Called by Express when user sends a chat message —
    finds relevant chunks + generates answer
    """
    try:
        answer = query_profile(req.profile_id, req.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))