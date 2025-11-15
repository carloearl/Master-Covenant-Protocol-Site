import React from "react";
import { Shield } from "lucide-react";

export default function LoadingSpinner({ message = "Loading...", size = "default" }) {
  const sizes = {
    sm: { spinner: "w-8 h-8", logo: "w-4 h-4", text: "text-xs" },
    default: { spinner: "w-16 h-16", logo: "w-8 h-8", text: "text-sm" },
    lg: { spinner: "w-24 h-24", logo: "w-12 h-12", text: "text-base" }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className={`${currentSize.spinner} rounded-full border-4 border-glyphlock-brand/20 border-t-glyphlock-brand animate-spin`} />
        
        {/* Middle pulsing ring */}
        <div className={`absolute inset-0 ${currentSize.spinner} rounded-full border-2 border-blue-400/40 animate-pulse`} />
        
        {/* Inner glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${currentSize.logo} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg glow-royal-blue animate-pulse`}>
            <Shield className="w-1/2 h-1/2 text-white" />
          </div>
        </div>
      </div>

      {message && (
        <div className="text-center space-y-2">
          <p className={`${currentSize.text} font-semibold text-glyphlock-primary animate-pulse`}>
            {message}
          </p>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-glyphlock-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-glyphlock-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-glyphlock-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}