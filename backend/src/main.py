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
    
    print(f"Target board: {board}")
    #temporarily save file to disk
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print("File saved! Uploading to Gemini...")

    prompt = f"""
    You are a senior hardware engineer analyzing a datasheet. 
    Extract the requested information and return it STRICTLY as a raw JSON object. 
    Do not include markdown blocks (like ```json), just the raw JSON text.
    
    Structure your JSON exactly like this:
    {{
        "critical_info": {{
            "component": "Name of the chip/board",
            "voltage": "Operating voltage range",
            "current_draw": "Current draw of the chip/board",
            "pins": "List of the specific pins on the {board} micro-controller that this component should be connected to. If the datasheet does not provide specific pin connections, look them up or describe the communication protocol being used (e.g., I2C on SDA/SCL, SPI, etc.), separated by commas and spaces",
            "additional_hardware": "List of any additional hardware required"
        }},
        "code_language": "The programming language primarily used by the {board} (e.g. C++ for Arduino, Python for Raspberry Pi, etc.)",
        "code": "Write a concise starter script to initialize this component for the {board} platform. Write the script in the primary language that the {board} uses. Also, if the component takes any input or output from the board, include that starter code.",
        "tips": "Write one paragraph of debugging tips."
    }}
    """

    #upload to gemini
    uploaded_file = ai_client.files.upload(file=file.filename)
    print("File uploaded to Gemini. Asking gemini to read it...")
    response = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents = [uploaded_file, prompt],
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