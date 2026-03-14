Potential Issues to Address Before We Start
Since we are planning on building a production-like tool, here are the three biggest technical hurdles we need to be aware of:

1. PDF Parsing is Notoriously Messy Datasheets are often multi-column PDFs with complex diagrams and tables. Pulling text out of them isn't as simple as reading a .txt file.

The Plan: We will need to use a robust parsing tool on the backend to extract text. We might have to sacrifice reading the diagrams in the PDF for version 1 and focus purely on extracting the text and tables.
2. LLM Hallucinations (Making things up) If the LLM can't find the voltage, it might just guess "5V" because that's common. For hardware, a wrong voltage means a fried board.

The Plan: When we write our AI Prompt, we must explicitly instruct it: "If a value is not explicitly stated in the text, you MUST return null or 'Not Found'. Do not guess." We could also have the AI return the Page Number where it found the info, so the user can verify it.
3. API Costs and Limits (Token limits) Datasheets can be 100+ pages long. Feeding a 150-page PDF into an LLM every time a user drops a file will eat up tokens very fast and might hit API content limits.

The Plan: We might need to implement a strategy to either use a model with a massive context window (like Gemini 1.5 Pro) or pre-filter the PDF to only send the first ~20 pages (which usually contain the pinouts and electrical specs) and the pages containing the word "Registers" or "I2C". For Phase 1, we will test with short datasheets (like simple sensors).
