import os
import shutil
import json
from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv

class SimpleMessage(BaseModel):
    text: str

app = FastAPI()

load_dotenv()

ai_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

prompt = """
    You are a senior hardware engineer analyzing a datasheet. 
    Extract the requested information and return it STRICTLY as a raw JSON object. 
    Do not include markdown blocks (like ```json), just the raw JSON text.
    
    Structure your JSON exactly like this:
    {
        "critical_info": {
            "component": "Name of the chip/board",
            "voltage": "Operating voltage range",
            "pins": "List of the most critical pins (max 5)"
        },
        "code": "Write a concise script to initialize this component for a board that will also be provided for you. Also, if the component takes any input or ouput from the board, include that starter code in the code.",
        "tips": "Write one paragraph of debugging tips."
    }
    """


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
def receive_pdf(file: UploadFile = File(...), board: str = Form(...)):
    
    print(board)
    #temporarily save file to disk
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print("File saved! Uploading to Gemini...")

    #upload to gemini
    uploaded_file = ai_client.files.upload(file=file.filename)
    print("File uploaded to Gemini. Asking gemini to read it...")
    response = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents = [uploaded_file, prompt, board],
        config = genai.types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    #reponse
    parsed_json = json.loads(response.text)
    print("Gemini JSON success")
    print(parsed_json)
    #print("gemini said:", response.text)

    return parsed_json