import { Handle, Position } from 'reactflow';
import { Cpu } from 'lucide-react';

/**
 * CUSTOM REACT FLOW NODE
 * This component dictates exactly how our "Bubbles" will look on the canvas.
 * We pass `data.label` and `data.value` into it from our main App.
 */
export default function DataNode({ data }: { data: any }) {
    return (
        // We style the box exactly like our other UI elements (dark gray, rounded corners)
        <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 shadow-xl w-[350px]">

            {/* 
        THE 'HANDLE' 
        This is a special React Flow component. It acts as the connection point for arrows!
        We put one on the top (Target) to receive incoming arrows. 
      */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 bg-zinc-400 border-zinc-900"
            />
            {/* The actual visual content of our bubble */}
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-zinc-800 rounded-lg">
                    <Cpu className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                    {data.label}
                </div>
            </div>

            <div className="text-xl font-mono text-white pl-1 whitespace-pre-wrap break-words">
                {data.value}
            </div>
            {/* Put a connection Handle on the bottom (Source) to send arrows out */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 bg-emerald-500 border-zinc-900"
            />
        </div>
    );
}