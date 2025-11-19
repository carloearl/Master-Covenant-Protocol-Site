import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, Zap, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock, Volume2, Square } from 'lucide-react';
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function FunctionDisplay({ toolCall }) {
    const [expanded, setExpanded] = useState(false);
    const name = toolCall?.name || 'Function';
    const status = toolCall?.status || 'pending';
    const results = toolCall?.results;
    
    const parsedResults = (() => {
        if (!results) return null;
        try {
            return typeof results === 'string' ? JSON.parse(results) : results;
        } catch {
            return results;
        }
    })();
    
    const isError = results && (
        (typeof results === 'string' && /error|failed/i.test(results)) ||
        (parsedResults?.success === false)
    );
    
    const statusConfig = {
        pending: { icon: Clock, color: 'text-blue-400', text: 'Pending' },
        running: { icon: Loader2, color: 'text-blue-400', text: 'Running...', spin: true },
        in_progress: { icon: Loader2, color: 'text-blue-400', text: 'Running...', spin: true },
        completed: isError ? 
            { icon: AlertCircle, color: 'text-red-400', text: 'Failed' } : 
            { icon: CheckCircle2, color: 'text-green-400', text: 'Success' },
        success: { icon: CheckCircle2, color: 'text-green-400', text: 'Success' },
        failed: { icon: AlertCircle, color: 'text-red-400', text: 'Failed' },
        error: { icon: AlertCircle, color: 'text-red-400', text: 'Failed' }
    }[status] || { icon: Zap, color: 'text-blue-400', text: '' };
    
    const Icon = statusConfig.icon;
    const formattedName = name.split('.').reverse().join(' ').toLowerCase();
    
    return (
        <div className="mt-2 text-xs">
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all glass-dark",
                    "hover:bg-blue-500/20",
                    expanded ? "bg-blue-500/20 border-blue-500/50" : "border-blue-500/30"
                )}
            >
                <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
                <span className="text-white">{formattedName}</span>
                {statusConfig.text && (
                    <span className={cn("text-white/70", isError && "text-red-400")}>
                        • {statusConfig.text}
                    </span>
                )}
                {!statusConfig.spin && (toolCall.arguments_string || results) && (
                    <ChevronRight className={cn("h-3 w-3 text-white/70 transition-transform ml-auto", 
                        expanded && "rotate-90")} />
                )}
            </button>
            
            {expanded && !statusConfig.spin && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-blue-500/30 space-y-2">
                    {toolCall.arguments_string && (
                        <div>
                            <div className="text-xs text-blue-400 mb-1">Parameters:</div>
                            <pre className="glass-dark rounded-md p-2 text-xs text-white whitespace-pre-wrap">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2);
                                    } catch {
                                        return toolCall.arguments_string;
                                    }
                                })()}
                            </pre>
                        </div>
                    )}
                    {parsedResults && (
                        <div>
                            <div className="text-xs text-blue-400 mb-1">Result:</div>
                            <pre className="glass-dark rounded-md p-2 text-xs text-white whitespace-pre-wrap max-h-48 overflow-auto">
                                {typeof parsedResults === 'object' ? 
                                    JSON.stringify(parsedResults, null, 2) : parsedResults}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(null);
    
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const voicePersonalities = [
        { id: 'professional', name: 'Professional', icon: '👔', description: 'Clear & confident business voice' },
        { id: 'friendly', name: 'Friendly', icon: '😊', description: 'Warm & approachable companion' },
        { id: 'calm', name: 'Calm', icon: '🧘', description: 'Relaxed & soothing meditation voice' },
        { id: 'energetic', name: 'Energetic', icon: '⚡', description: 'Upbeat & dynamic motivator' },
        { id: 'thoughtful', name: 'Thoughtful', icon: '🤔', description: 'Deliberate & wise mentor' },
        { id: 'authoritative', name: 'Authoritative', icon: '🎯', description: 'Commanding & decisive leader' },
        { id: 'warm', name: 'Warm', icon: '☀️', description: 'Caring & empathetic listener' },
        { id: 'confident', name: 'Confident', icon: '💪', description: 'Bold & self-assured expert' },
        { id: 'soothing', name: 'Soothing', icon: '🌙', description: 'Gentle & calming storyteller' },
        { id: 'dynamic', name: 'Dynamic', icon: '🚀', description: 'Fast-paced & exciting announcer' }
    ];

    const stopSpeaking = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsSpeaking(false);
    };

    const processTextForSpeech = (text) => {
        return text
            .replace(/[#*`]/g, '')
            .replace(/\.\.\./g, '... ')
            .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
            .replace(/,/g, ', ')
            .replace(/:/g, ': ')
            .replace(/;/g, '; ')
            .replace(/\n\n+/g, '. ')
            .replace(/\n/g, '. ')
            .trim();
    };

    const speakText = async (voiceId) => {
        if (isSpeaking) {
            stopSpeaking();
            return;
        }

        const text = processTextForSpeech(message.content);
        if (!text || text.length > 1000) {
            alert('Text is too long (max 1000 characters)');
            return;
        }

        try {
            setIsLoading(true);
            
            const response = await base44.functions.invoke('textToSpeech', {
                text: text,
                voice: voiceId
            });

            if (response.data) {
                const blob = new Blob([response.data], { type: 'audio/mpeg' });
                const url = URL.createObjectURL(blob);
                
                if (audioRef.current) {
                    audioRef.current.src = url;
                    audioRef.current.onended = () => setIsSpeaking(false);
                    audioRef.current.onerror = () => {
                        setIsSpeaking(false);
                        setIsLoading(false);
                    };
                    
                    setIsSpeaking(true);
                    await audioRef.current.play();
                }
            }
        } catch (error) {
            console.error('TTS Error:', error);
            alert('Failed to generate speech. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <audio ref={audioRef} className="hidden" />
            <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                {!isUser && (
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mt-0.5 glow-royal">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                )}
                <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
                {message.content && (
                    <div className={cn(
                        "rounded-2xl px-4 py-2.5 group/message relative",
                        isUser ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white" : "glass-royal text-white"
                    )}>
                        {!isUser && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 glass-dark hover:bg-blue-500/20"
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-3 w-3 text-white animate-spin" />
                                            ) : isSpeaking ? (
                                                <Square className="h-3 w-3 text-white" />
                                            ) : (
                                                <Volume2 className="h-3 w-3 text-white" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="glass-dark border-blue-500/30 min-w-[220px] max-h-[400px] overflow-y-auto">
                                        {isSpeaking ? (
                                            <DropdownMenuItem onClick={stopSpeaking} className="text-white hover:bg-blue-500/20">
                                                <Square className="h-3 w-3 mr-2" />
                                                Stop Speaking
                                            </DropdownMenuItem>
                                        ) : (
                                            <>
                                                <div className="px-2 py-1.5 text-[10px] text-blue-400 font-semibold uppercase tracking-wide">Voice Personas</div>
                                                {voicePersonalities.map((voice) => (
                                                    <DropdownMenuItem 
                                                        key={voice.id}
                                                        onClick={() => speakText(voice.id)}
                                                        disabled={isLoading}
                                                        className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20 flex flex-col items-start gap-1 py-2.5 cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2 w-full">
                                                            <span className="text-base">{voice.icon}</span>
                                                            <span className="font-medium text-sm">{voice.name}</span>
                                                        </div>
                                                        <span className="text-[10px] text-white/60 ml-7 leading-tight">{voice.description}</span>
                                                    </DropdownMenuItem>
                                                ))}
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                        {isUser ? (
                            <p className="text-sm leading-relaxed text-white">{message.content}</p>
                        ) : (
                            <ReactMarkdown 
                                className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                components={{
                                    code: ({ inline, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="relative group/code">
                                                <pre className="glass-dark text-white rounded-lg p-3 overflow-x-auto my-2">
                                                    <code className={className} {...props}>{children}</code>
                                                </pre>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/code:opacity-100 glass-dark hover:bg-blue-500/20"
                                                    onClick={() => {
                                                        copyToClipboard(String(children).replace(/\n$/, ''));
                                                    }}
                                                >
                                                    <Copy className="h-3 w-3 text-white" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <code className="px-1 py-0.5 rounded glass-dark text-blue-400 text-xs">
                                                {children}
                                            </code>
                                        );
                                    },
                                    a: ({ children, ...props }) => (
                                        <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                                            {children}
                                        </a>
                                    ),
                                    p: ({ children }) => <p className="my-1 leading-relaxed text-white">{children}</p>,
                                    ul: ({ children }) => <ul className="my-1 ml-4 list-disc text-white">{children}</ul>,
                                    ol: ({ children }) => <ol className="my-1 ml-4 list-decimal text-white">{children}</ol>,
                                    li: ({ children }) => <li className="my-0.5 text-white">{children}</li>,
                                    h1: ({ children }) => <h1 className="text-lg font-semibold my-2 text-white">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-semibold my-2 text-white">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-semibold my-2 text-white">{children}</h3>,
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-2 border-blue-400 pl-3 my-2 text-white/80">
                                            {children}
                                        </blockquote>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>
                )}
                
                {message.tool_calls && message.tool_calls.length > 0 && (
                    <div className="space-y-1 mt-2">
                        {message.tool_calls.map((toolCall, idx) => (
                            <FunctionDisplay key={idx} toolCall={toolCall} />
                        ))}
                    </div>
                )}

                {message.file_urls && message.file_urls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {message.file_urls.map((url, idx) => (
                            <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs glass-dark rounded px-2 py-1 hover:bg-blue-500/20 transition-colors text-white border border-blue-500/30"
                            >
                                📎 File {idx + 1}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </>
    );
}