from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

class SimpleMessage(BaseModel):
    text: str

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# only accepts GET request, getting data
@app.get("/")
def read_root():
    return{"message": "Hello from the Python Backend! Server is running"}

@app.post("/test-message")
def receive_test_message(data: SimpleMessage):
    uppercase_text= data.text.upper()

    return{
        "reply": f"server received your message.you said: {uppercase_text}"
    }

@app.post("/upload_pdf")
def receive_pdf(file: UploadFile = File(...)):
    print(file.filename)
    return{
        "reply": "server received PDF"
    }