import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Global hover tooltip wrapper for any element
 * Shows description on hover with royal blue styling
 */
export default function HoverTooltip({ children, content, side = 'top', delayDuration = 300 }) {
  if (!content) return children;

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] max-w-xs"
        >
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}