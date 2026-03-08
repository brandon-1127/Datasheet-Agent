import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Cpu, Settings2 } from 'lucide-react';
import classNames from 'classnames';
import { ReactFlow, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';


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

        {/* 
          DROPZONE CONTAINER
          `classNames` is a tool that lets us write "if/else" logic for CSS.
          If `isDragActive` is true (the user is hovering a file), it adds the green `bg-zinc-800/50` colors!
        */}
        <div
          {...getRootProps()}
          className={classNames(
            "w-full max-w-3xl rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-16 cursor-pointer relative overflow-hidden group bg-zinc-900/30",
            {
              "border-zinc-500 bg-zinc-800/50": isDragActive,
              "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50": !isDragActive && !file,
              "border-emerald-900/50 bg-emerald-950/20": !!file // If `file` exists, make it green!
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
            
            // --- BLOCK 1: WE HAVE A FILE ---
            <div className="w-full h-full min-h-[600px] rounded-3xl overflow-hidden border border-zinc-700 bg-zinc-900 shadow-xl bg-opacity-50">
                <ReactFlow 
                  nodes={[{ id: '1', position: { x: 100, y: 100 }, data: { label: 'Microcontroller (Drop Datasheet to Process)' } }]} 
                  edges={[]}
                  fitView
                >
                  {/* These add the dotted background and zoom controls! */}
                  <Background color="#52525b" gap={16} />
                  <Controls className="bg-zinc-800 fill-white text-white border-zinc-700" />
                </ReactFlow>
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
        
        {/* 
          BOARD SELECTION DROPDOWN
          We moved this here! Let's look at the Tailwind classes we added:
          - `mt-8`: Adds "Margin Top" to separate it from the drop box above it.
          - `px-6 py-3`: Padding on the X (left/right) and Y (up/down) axes. We doubled these numbers!
          - `text-lg`: Makes the text "large". The icon size `w-6 h-6` was also increased.
          transition-transform hover:scale-105
        */}
        <div className="flex gap-4 items-center mt-8">
          <div className="flex items-center gap-3 bg-zinc-900 px-6 py-3 rounded-full border border-zinc-800 shadow-md">
            <Settings2 className="w-6 h-6 text-zinc-400" />
            <select className="bg-transparent text-lg font-medium text-zinc-300 outline-none appearance-none cursor-pointer">
              <option value="arduino">Arduino</option>
              <option value="esp32">ESP32</option>
              <option value="nordic">Nordic nRF52</option>
              <option value="raspberry-pi-pico">Raspberry Pi Pico</option>
              <option value="raspberry-pi-5/4">Raspberry Pi 5/4</option>
              <option value="stm32">STM32</option>
            </select>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
