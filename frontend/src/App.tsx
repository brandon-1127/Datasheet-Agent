import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Cpu, Settings2 } from 'lucide-react';
import classNames from 'classnames';

function App() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 p-2 rounded-lg border border-zinc-700 shadow-sm">
            <Cpu className="w-6 h-6 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Datasheet<span className="text-zinc-500">Agent</span></h1>
            <p className="text-xs text-zinc-400 font-medium">Hardware documentation stripped down</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
            <Settings2 className="w-4 h-4 text-zinc-400" />
            <select className="bg-transparent text-sm font-medium text-zinc-300 outline-none appearance-none cursor-pointer">
              <option value="arduino">Arduino</option>
              <option value="esp32">ESP32</option>
              <option value="nordic">Nordic nRF52</option>
              <option value="raspberry-pi-pico">Raspberry Pi Pico</option>
              <option value="raspberry-pi-5/4">Raspberry Pi 5/4</option>
              <option value="stm32">STM32</option>
              <option value="mspm430">MSPM430</option>

            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-5xl mx-auto w-full">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
            Stop reading <span className="text-zinc-500 line-through decoration-zinc-700 decoration-2">messy PDFs</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Drop your hardware datasheet below. We extract the critical pinouts, electrical limits, and generate starter code instantly.
          </p>
        </div>

        {/* Dropzone Container */}
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
          {/* Subtle background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-800/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <input {...getInputProps()} />

          {file ? (
            <div className="flex flex-col items-center text-center z-10 transition-all">
              <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 shadow-xl">
                <FileText className="w-10 h-10 text-zinc-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{file.name}</h3>
              <p className="text-sm text-zinc-400 mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

              <button
                className="bg-zinc-100 text-zinc-950 px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors shadow-lg shadow-white/5 disabled:opacity-50"
                onClick={(e) => { e.stopPropagation(); /* TODO: trigger processing */ }}
              >
                Process Datasheet
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 ring-8 ring-zinc-900/50 group-hover:ring-zinc-800/50 transition-all">
                <Upload className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-medium text-zinc-200 mb-2">
                {isDragActive ? "Drop the PDF here..." : "Drag & drop your datasheet"}
              </h3>
              <p className="text-sm text-zinc-500">
                or click to browse your files (PDF only)
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
