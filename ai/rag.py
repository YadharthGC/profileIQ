from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os

load_dotenv()

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

prompt = ChatPromptTemplate.from_template("""
You are ProfileIQ, an expert AI analyst specializing in LinkedIn profile analysis.

You have access to this person's LinkedIn data:
{context}

Rules:
- Be concise and direct — no unnecessary data dumps
- When asked for an opinion, give YOUR opinion confidently in 2-3 sentences
- Only cite specific data points when they directly support your answer
- Talk like a smart recruiter having a casual conversation
- Never list everything you know — only what's relevant to the question

Question: {question}

Answer concisely:
""")

def build_vectorstore(profile_id: str, profile_data: dict):
    raw_text = f"""
    NAME: {profile_data.get('name', '')}

    EXPERIENCE:
    {chr(10).join(profile_data.get('experience', []))}

    EDUCATION:
    {chr(10).join(profile_data.get('education', []))}

    SKILLS:
    {chr(10).join(profile_data.get('skills', []))}

    POSTS & ACTIVITY:
    {chr(10).join(profile_data.get('posts', []))}
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.create_documents([raw_text])
    print(f"✓ Created {len(chunks)} chunks for profile {profile_id}")

    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=f"profile_{profile_id}",
        persist_directory="./chroma_db"
    )
    print(f"✓ Stored vectors for profile {profile_id}")
    return vectorstore


def query_profile(profile_id: str, question: str) -> str:
    vectorstore = Chroma(
        collection_name=f"profile_{profile_id}",
        embedding_function=embeddings,
        persist_directory="./chroma_db"
    )

    # Find top 5 relevant chunks
    docs = vectorstore.similarity_search(question, k=5)
    context = "\n\n".join([doc.page_content for doc in docs])

    # Build and send prompt to Groq
    chain = prompt | llm
    result = chain.invoke({"context": context, "question": question})

    print(f"✓ RAG query done for profile {profile_id}")
    return result.content