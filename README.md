# 📄 Hardware Datasheet AI Agent

An intelligent full-stack web application designed to accelerate hardware engineering workflows. Drop in any PDF hardware datasheet, and this agent will use Google's Gemini 2.5 Pro to automatically extract critical operating specifications, generate platform-specific initialization code, and provide targeted debugging tips—mapped out beautifully on an interactive React Flow canvas.

---

## 🚀 Features
*   **PDF Parsing**: Automatically reads and understands complex hardware datasheets.
*   **Interactive Mapping**: Visualizes data symmetrically using React Flow.
*   **Dynamic Code Generation**: Automatically writes initialization scripts in the native language of your selected target board (e.g., C++ for Arduino, Python for Raspberry Pi).
*   **Smart Pin Mapping**: If datasheet pinouts are unclear, the AI proactively researches and suggests standard protocol connections (I2C, SPI, etc.).

## 🛠️ Tech Stack
*   **Frontend**: React, TypeScript, Tailwind CSS, Vite, React Flow
*   **Backend**: Python, FastAPI, Uvicorn
*   **AI Engine**: Google Gemini 2.5 Flash API

---

## ⚙️ Setup & Installation

To run this project locally, you will need two terminal windows open: one for the React frontend and one for the Python backend.

### 1. Get a Gemini API Key
You must have a free Google Gemini API key to run the parsing engine.
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate a new API Key
3. Save it for the Backend Setup step.

### 2. Backend Setup (Python)
Navigate to the backend directory and set up your environment:

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install required dependencies
cd src
pip install fastapi uvicorn pydantic python-multipart google-genai python-dotenv

# Set up your environment variables
touch .env
```

Open the `.env` file you just created and paste your API key inside:
```env
GEMINI_API_KEY="your_api_key_here"
```

Start the backend server:
```bash
uvicorn main:app --reload
```
*The backend will boot up on `http://localhost:8000`*

### 3. Frontend Setup (React)
Open a **new** terminal window and navigate to the frontend directory:

```bash
cd frontend

# Install necessary Node modules
npm install

# Install UI libraries
npm install lucide-react reactflow

# Start the frontend server window
npm run dev
```
*The React app will boot up. Click the CLI link (usually `http://localhost:5173` or `5174`) to open it in your browser!*

---

## 📖 How to Use
1. Select your target microcontroller board from the dropdown (e.g., Arduino, Raspberry Pi, ESP32).
2. Drag and drop any `.pdf` hardware datasheet into the dropzone.
3. Wait for the Gemini engine to process the document.
4. Explore the generated React Flow diagram! You can drag nodes around, copy the initialization code directly from the IDE window, and zoom in/out infinitely.

*Disclaimer: AI-generated hardware parameters should always be double-checked before hooking up live voltage to prevent damaging your components!*
