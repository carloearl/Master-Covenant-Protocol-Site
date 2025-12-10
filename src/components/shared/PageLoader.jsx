import React from "react";

export default function PageLoader({ progress = null, message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-xl">
      <div className="text-center space-y-6 animate-in fade-in duration-500">
        {/* Dual spinning rings */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute inset-3 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" 
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} 
          />
          <div className="absolute inset-6 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" 
            style={{ animationDuration: '2s' }} 
          />
        </div>

        {/* Message */}
        <div>
          <h2 className="text-2xl font-black text-white mb-2 animate-pulse">
            {message}
          </h2>
          
          {/* Progress bar */}
          {progress !== null && (
            <div className="w-64 mx-auto">
              <p className="text-blue-300 mb-2 text-sm">{Math.round(progress)}%</p>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Pulsing dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}