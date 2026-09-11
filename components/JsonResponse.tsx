// file: components/JsonResponse.tsx
'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';

interface JsonNodeProps {
    keyName?: string;
    value: any;
    isLast: boolean;
    depth?: number;
}

const JsonNode: React.FC<JsonNodeProps> = ({ keyName, value, isLast, depth = 0 }) => {
    // Otomatis expand sampai kedalaman 3 tingkat
    const [isExpanded, setIsExpanded] = useState(depth < 3);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const textToCopy = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Pewarnaan ala VS Code Dark+ Theme
    const getValueColor = (val: any) => {
        if (val === null) return 'text-[#569cd6]'; // null
        switch (typeof val) {
            case 'string': return 'text-[#ce9178]'; // string (orange)
            case 'number': return 'text-[#b5cea8]'; // number (green)
            case 'boolean': return 'text-[#569cd6]'; // boolean (blue)
            default: return 'text-slate-300';
        }
    };

    const renderValue = (val: any) => {
        if (val === null) return 'null';
        if (typeof val === 'string') return `"${val}"`;
        return String(val);
    };

    const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isComplex = isObject || isArray;
    const isEmpty = isComplex && Object.keys(value).length === 0;

    const openBrace = isArray ? '[' : '{';
    const closeBrace = isArray ? ']' : '}';
    const keys = isComplex ? Object.keys(value) : [];

    return (
        <div className="font-mono text-[12px] leading-6 w-full">
            <div className="flex group items-start relative hover:bg-white/[0.03] rounded transition-colors pr-2">

                {/* 🎯 Toggle Expand/Collapse */}
                {isComplex && !isEmpty ? (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 mr-1 shrink-0 text-slate-500 hover:text-slate-300 focus:outline-none"
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                ) : (
                    <div className="w-[18px] shrink-0" /> // Spacer biar sejajar
                )}

                <div className="flex-1 flex flex-wrap items-center break-all">
                    {/* 🎯 Key Name */}
                    {keyName && <span className="text-[#9cdcfe] mr-1 shrink-0">"{keyName}":</span>}

                    {/* 🎯 Value / Object Preview */}
                    {!isComplex ? (
                        <span className={getValueColor(value)}>
                            {renderValue(value)}{!isLast && <span className="text-[#d4d4d4]">,</span>}
                        </span>
                    ) : (
                        <span className="text-[#d4d4d4] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                            {openBrace}
                            {!isExpanded && !isEmpty && <span className="mx-1 text-slate-500">...</span>}
                            {(!isExpanded || isEmpty) && <span>{closeBrace}{!isLast && ','}</span>}
                        </span>
                    )}
                </div>

                {/* 🎯 Copy Button (Per-Node) - Support Mobile & Desktop */}
                <button
                    onClick={handleCopy}
                    className="ml-2 md:opacity-0 md:group-hover:opacity-100 opacity-30 hover:opacity-100 shrink-0 transition-all text-slate-400 hover:text-white absolute right-1 top-1 md:static"
                    title="Copy Value"
                >
                    {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
            </div>

            {/* 🎯 Render Anak-anaknya (Children) kalau di-expand */}
            {isComplex && isExpanded && !isEmpty && (
                <div className="pl-4 border-l border-white/[0.08] ml-[9px]">
                    {keys.map((key, index) => (
                        <JsonNode
                            key={key}
                            keyName={isArray ? undefined : key}
                            value={value[key as keyof typeof value]}
                            isLast={index === keys.length - 1}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}

            {/* 🎯 Penutup Bracket kalau di-expand */}
            {isComplex && isExpanded && !isEmpty && (
                <div className="flex hover:bg-white/[0.03] rounded">
                    <div className="w-[18px] shrink-0" />
                    <span className="text-[#d4d4d4]">{closeBrace}{!isLast && ','}</span>
                </div>
            )}
        </div>
    );
};

export default function JsonResponse({ data }: { data: any }) {
    if (!data) return null;
    return (
        <div className="text-[#d4d4d4] w-full overflow-x-hidden">
            <JsonNode value={data} isLast={true} />
        </div>
    );
}