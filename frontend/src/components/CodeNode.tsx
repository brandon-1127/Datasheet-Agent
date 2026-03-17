import { Handle, Position } from 'reactflow';
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';

/**
 * REUSABLE CODE COMPONENT NODE
 * Looks like a standard dark-mode code IDE window with a copy button.
 */
export default function CodeNode({ data }: { data: any }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#1e1e1e] border border-zinc-700 rounded-xl shadow-2xl overflow-hidden font-sans w-[700px]">
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-zinc-400 border-zinc-900" />
            
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d] border-b border-[#404040]">
                <div className="flex items-center gap-2 text-zinc-300">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">{data.label} ({data.language || 'Code'})</span>
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors py-1 px-2 rounded hover:bg-zinc-700/50"
                >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            
            {/* Code Body */}
            <div className="p-5 overflow-x-auto custom-scrollbar">
                <pre className="text-[13px] leading-relaxed font-mono text-[#d4d4d4] whitespace-pre-wrap break-words">
                    <code>{data.value}</code>
                </pre>
            </div>
            
            {/* Optional bottom handle just in case */}
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-emerald-500 border-zinc-900 hidden" />
        </div>
    );
}
