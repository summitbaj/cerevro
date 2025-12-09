import React, { useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
        disabled?: boolean;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}

const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width = '420px',
    primaryAction,
    secondaryAction
}) => {
    // We strictly control open state via props
    const [isDragging, setIsDragging] = useState(false);
    const nodeRef = useRef(null); // Reference for Draggable to avoid findDOMNode warning

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPrimitive.Portal>
                {/* Overlay - pointer-events-auto ensures clicks are captured. 
                    Radix handles focus trap automatically. 
                    We can make overlay transparent or dimmed. 
                    Strict requirement: Background click does NOT dismiss? 
                    Radix default is click outside dismisses. We can prevent this via onPointerDownOutside.
                */}
                <DialogPrimitive.Overlay
                    className="fixed inset-0 z-[10001] bg-black/20 backdrop-blur-sm animate-fade-in"
                />

                {/* 
                   FIX: Removed 'asChild'. 
                   Radix Content now acts as the full-screen container. 
                   This avoids the Ref conflict between Radix and Draggable.
                */}
                <DialogPrimitive.Content
                    className="fixed inset-0 z-[10002] flex items-center justify-center pointer-events-none"
                    onPointerDownOutside={(e) => {
                        // Strict requirement: prevent background dismiss
                        e.preventDefault();
                    }}
                    onEscapeKeyDown={(e) => {
                        // Allow escape to close
                    }}
                    onInteractOutside={(e) => {
                        // Prevent interaction with outside elements
                        e.preventDefault();
                    }}
                >
                    {/* Draggable Wrapper */}
                    <Draggable
                        handle=".dialog-header"
                        nodeRef={nodeRef}
                        onStart={() => setIsDragging(true)}
                        onStop={() => setIsDragging(false)}
                    >
                        <div
                            ref={nodeRef}
                            className={cn(
                                // Apple-like Glassmorphism: White with 90% opacity and blur
                                "bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.25)] border border-black/10 overflow-hidden flex flex-col pointer-events-auto outline-none",
                                "animate-scale-in"
                            )}
                            style={{
                                width,
                                maxHeight: '85vh',
                                marginLeft: 'auto', // Keep auto margins for centering flexibility
                                marginRight: 'auto'
                            }}
                        >
                            {/* Header - Draggable Handle */}
                            <div className={cn(
                                "dialog-header flex items-center justify-between px-4 py-3 border-b border-black/5 bg-white/50 select-none",
                                isDragging ? "cursor-grabbing" : "cursor-grab"
                            )}>
                                <DialogPrimitive.Title className="text-[13px] font-bold text-gray-900 leading-none tracking-wide text-center w-full pl-6">
                                    {title}
                                </DialogPrimitive.Title>
                                <DialogPrimitive.Close asChild>
                                    <button
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-md hover:bg-black/5 focus:outline-none focus:ring-1 focus:ring-gray-300 absolute right-3"
                                        aria-label="Close"
                                    >
                                        <X size={14} />
                                    </button>
                                </DialogPrimitive.Close>
                            </div>

                            {/* Body */}
                            <div className="p-5 overflow-y-auto bg-transparent">
                                {children}
                            </div>

                            {/* Footer */}
                            {(primaryAction || secondaryAction) && (
                                <div className="px-5 py-3.5 bg-white/50 border-t border-black/5 flex items-center justify-end gap-3">
                                    {secondaryAction && (
                                        <button
                                            onClick={secondaryAction.onClick}
                                            className="px-3 py-1.5 min-w-[70px] text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-[6px] shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/30 focus:outline-none active:bg-gray-100 transition-all active:scale-[0.98]"
                                        >
                                            {secondaryAction.label}
                                        </button>
                                    )}
                                    {primaryAction && (
                                        <button
                                            onClick={primaryAction.onClick}
                                            disabled={primaryAction.disabled}
                                            className={cn(
                                                "px-3 py-1.5 min-w-[70px] text-[13px] font-medium text-white rounded-[6px] shadow-sm transition-all focus:ring-2 focus:ring-blue-500/30 focus:outline-none active:scale-[0.98] flex items-center justify-center gap-2",
                                                primaryAction.disabled
                                                    ? "bg-blue-400/50 cursor-not-allowed shadow-none text-white/80"
                                                    : "bg-[#007AFF] hover:bg-[#006ADD] shadow-blue-500/20 bg-gradient-to-b from-[#007AFF] to-[#0062CC]"
                                            )}
                                        >
                                            {primaryAction.label}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </Draggable>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default Dialog;
