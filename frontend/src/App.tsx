import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Cpu, Settings2, ArrowRight, X } from 'lucide-react';
import classNames from 'classnames';
import { ReactFlow, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import DataNode from './components/DataNode';

const nodeTypes = { customDataNode: DataNode };

/**
 * Welcome to React! 
 * 
 * A React "Component" is just a JavaScript function that returns UI (HTML).
 * The HTML inside this JavaScript file is called JSX (or TSX if using TypeScript).
 * Notice how we can mix JavaScript logic and HTML tags in the same file!
 */
function App() {
  /**
   * STATE in React:
   * This is how React remembers things. `useState` gives us two things:
   * 1. `file`: The current value (initially `null` because no file is selected).
   * 2. `setFile`: A function we call to change the value.
   * Whenever `setFile` is called, React automatically re-draws the entire screen!
   */
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("arduno");

  /**
   * This function runs when a user drops a file onto the screen.
   * It takes the array of `acceptedFiles` and uses `setFile` to save the very first one [0].
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // This tells React to re-render the screen
    }
  }, []);

  /**
   * This is a "Hook" from a library called `react-dropzone`.
   * It handles all the complex logic of dragging, hovering, and reading files from the browser,
   * so we don't have to write it ourselves!
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, // Tell it to run our onDrop function above when a file is dropped
    accept: { 'application/pdf': ['.pdf'] }, // ONLY allow PDFs
    maxFiles: 1 // Only one file at a time
  });

  return (
    // Tailwind CSS Explained:
    // Every `className` here is actually a pre-written CSS style.
    // - `min-h-screen`: Make this block take up at least 100% of the screen height.
    // - `bg-zinc-950`: Background color is a very dark gray (almost black).
    // - `text-zinc-100`: Text color is very light gray (almost white).
    // - `flex flex-col`: Use CSS flexbox to stack things vertically (Column).
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">

      {/* 
        HEADER SECTION
        `sticky top-0 z-50` makes the header stick to the top of the screen when scrolling.
      */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 p-2 rounded-lg border border-zinc-700 shadow-sm">
            {/* The `<Cpu />` tag is importing an SVG icon from the lucide-react library */}
            <Cpu className="w-6 h-6 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Datasheet<span className="text-zinc-500">Agent</span></h1>
            <p className="text-xs text-zinc-400 font-medium">Hardware documentation stripped down</p>
          </div>
        </div>


      </header>

      {/* 
        MAIN CONTENT AREA
        This is where the big drag and drop box lives.
      */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-[1600px] mx-auto w-full">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
            Stop reading <span className="text-zinc-500 line-through decoration-zinc-700 decoration-2">messy PDFs</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Drop your hardware datasheet below. We extract the critical pinouts, electrical limits, and generate starter code instantly.
          </p>
        </div>

        {/* MAIN UI STATE MACHINE */}
        {!isProcessing ? (
          <>
            {/* DROPZONE CONTAINER */}
            <div
              {...getRootProps()}
              className={classNames(
                "w-full max-w-3xl rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-16 cursor-pointer relative overflow-hidden group bg-zinc-900/30",
                {
                  "border-zinc-500 bg-zinc-800/50": isDragActive,
                  "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50": !isDragActive && !file,
                  "border-emerald-900/50 bg-emerald-950/20": !!file
                }
              )}
            >
              {/* Subtle background glow effect (purely visual) */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-800/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* This is a hidden HTML input that actually accepts the file when clicked */}
              <input {...getInputProps()} />

              {/* 
                CONDITIONAL RENDERING (The coolest part of React!)
                If `file` is TRUE (we have a file), show the first <div> block.
                If `file` is FALSE (null), show the second <div> block with the Upload icon.
              */}
              {file ? (

                // --- BLOCK 1: WE HAVE A FILE, READY TO PROCESS ---
                <div className="flex flex-col items-center text-center z-10 transition-all">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 shadow-xl">
                    <FileText className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{file.name}</h3>
                  <p className="text-sm text-zinc-400 mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                  <button
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 p-4 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center group/btn"
                    onClick={async (e) => {
                      e.stopPropagation();
                      
                      // 1. Kick off the loading screen immediately
                      setIsLoading(true);
                      setIsProcessing(true); // Tell React we are leaving the dropzone state
                      
                      const myFormDataBox = new FormData();
                      myFormDataBox.append("file", file);
                      myFormDataBox.append("board",selectedBoard)
                      
                      try {
                        const response = await fetch("http://127.0.0.1:8000/upload_pdf", {
                          method: 'POST',
                          body: myFormDataBox
                        });
                        const data = await response.json();
                        console.log("python server replied, data: ", data.reply);
                        
                        // 2. Turn off loader and switch to the diagram phase
                        setIsLoading(false);
                        setIsProcessing(true); 
                      } catch (error) {
                        console.error("Error processing file:", error);
                        // Make sure we stop loading even on error!
                        setIsLoading(false);
                      }
                    }}
                  >
                    <ArrowRight className="w-8 h-8 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <p className="mt-4 text-emerald-500/80 font-medium text-sm">Click to process</p>
                </div>
              ) : (

                // --- BLOCK 2: NO FILE YET ---
                <div className="flex flex-col items-center text-center z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 ring-8 ring-zinc-900/50 group-hover:ring-zinc-800/50 transition-all">
                    <Upload className="w-10 h-10 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-200 mb-2">
                    {/* Dynamically change the text if dragging! */}
                    {isDragActive ? "Drop the PDF here..." : "Drag & drop your datasheet"}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    or click to browse your files (PDF only)
                  </p>
                </div>
              )}
            </div>

            {/* BOARD SELECTION DROPDOWN */}
            <div className="flex gap-4 items-center mt-8">
              <div className="flex items-center gap-3 bg-zinc-900 px-6 py-3 rounded-full border border-zinc-800 shadow-md">
                <Settings2 className="w-6 h-6 text-zinc-400" />
                <select 
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="bg-transparent text-lg font-medium text-zinc-300 outline-none appearance-none cursor-pointer">
                  <option value="arduino">Arduino</option>
                  <option value="esp32">ESP32</option>
                  <option value="nordic">Nordic nRF52</option>
                  <option value="raspberry-pi-pico">Raspberry Pi Pico</option>
                  <option value="raspberry-pi-5/4">Raspberry Pi 5/4</option>
                  <option value="stm32">STM32</option>
                </select>
              </div>
            </div>
          </>
        ) : isLoading ? (
          // --- BLOCK: LOADING AI RESPONSE ---
          <div className="w-full max-w-3xl flex flex-col items-center justify-center p-16 relative animate-in fade-in duration-500">
            {/* The outer ring (spins slowly) */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-t-2 border-zinc-700 animate-[spin_3s_linear_infinite]" />
              
              {/* The inner ring (spins faster, offset border for effect) */}
              <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-emerald-500/50 animate-[spin_1s_linear_infinite]" />
              
              {/* Center icon */}
              <Cpu className="w-8 h-8 text-zinc-400 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-semibold text-white mt-12 mb-2">Analyzing Datasheet</h3>
            <div className="flex items-center gap-1 text-zinc-400 font-medium tracking-widest text-lg">
              Loading
              <span className="animate-[bounce_1.4s_infinite_[-0.3s]] text-emerald-500">.</span>
              <span className="animate-[bounce_1.4s_infinite_[-0.15s]] text-emerald-500">.</span>
              <span className="animate-[bounce_1.4s_infinite_0s] text-emerald-500">.</span>
            </div>
          </div>
        ) : (
          // --- BLOCK 3: PROCESSING (REACT FLOW CANVAS) ---
          // This block is completely outside of the dropzone, so dragging a file here won't do anything!
          <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-zinc-700 bg-zinc-900 shadow-2xl relative animate-in fade-in zoom-in-95 duration-500">
            {/* Exit Button */}
            <button
              className="absolute top-4 right-4 z-10 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 p-2.5 rounded-lg border border-zinc-600 transition-colors flex items-center gap-2 backdrop-blur-sm shadow-lg hover:text-white"
              onClick={() => {
                setFile(null); // Clear the file
                setIsProcessing(false); // Go back to the dropzone state
              }}
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Clear & Exit</span>
            </button>

            <ReactFlow
              nodeTypes={nodeTypes} 
              nodes={[
                {
                  id: '1',
                  type: 'customDataNode',
                  position: { x: 100, y: 100 },
                  data: { label: 'Microcontroller', value: 'ESP32' }
                },
                {
                  id: '2',
                  type: 'customDataNode',
                  position: { x: 100, y: 300 },
                  data: { label: 'Operating Voltage', value: '3.3V' }
                }
              ]}
              edges={[
                {
                  id: 'e1-2',
                  source: '1',
                  target: '2',
                  animated: true,
                  style: { stroke: '#10b981', strokeWidth: 2 }
                }
              ]}
              fitView
            >
              <Background color="#52525b" gap={16} />
              <Controls />
            </ReactFlow>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
