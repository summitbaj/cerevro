import React, { useState, useRef, useEffect } from 'react';
import { Play, Timer, X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import FocusStartDialog from './FocusStartDialog';
import ShortcutDialog from './ShortcutDialog';

interface DockPosition {
    x: number;
    y: number;
}

interface DockItem {
    id: number | string;
    name: string;
    url?: string;
    icon?: React.ReactNode;
    action?: () => void;
    type?: string;
    favicon?: string;
    browser?: 'chrome' | 'edge';
    profile?: string;
    isCustom?: boolean;
    customIndex?: number;
}

interface CustomShortcut {
    id: string;
    name: string;
    url: string;
    favicon: string;
    browser: 'chrome' | 'edge';
    profile?: string;
}

const Dock: React.FC = () => {
    // Dock State
    const [hovered, setHovered] = useState<number | null>(null);
    const [position, setPosition] = useState<DockPosition>({ x: 0, y: 0 });
    const [isDraggingDock, setIsDraggingDock] = useState(false);

    // App State
    const [activeApps, setActiveApps] = useState<Set<number>>(new Set());

    // Feature State
    const [showFocusModal, setShowFocusModal] = useState(false);
    const [showFocusPrompt, setShowFocusPrompt] = useState<number | null>(null);
    const [showAddShortcut, setShowAddShortcut] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Data State
    const [customShortcuts, setCustomShortcuts] = useState<CustomShortcut[]>([]);

    // Refs
    const dockDragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
    const dockRef = useRef<HTMLDivElement>(null);

    // DnD State
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null); // Index within customShortcuts

    useEffect(() => {
        const savedPosition = localStorage.getItem('dockPositionHorizontal');
        const savedShortcuts = localStorage.getItem('customShortcuts');
        if (savedPosition) setPosition(JSON.parse(savedPosition));
        if (savedShortcuts) setCustomShortcuts(JSON.parse(savedShortcuts));
    }, []);

    // --- Actions ---

    const handleAppLaunch = (appId: number, url: string, browser: 'chrome' | 'edge', profile?: string) => {
        if (isEditMode) return; // Prevent launch in edit mode
        window.electronAPI?.launchBrowser(browser, url, profile);
        setActiveApps(prev => new Set(prev).add(appId));
        setTimeout(() => setShowFocusPrompt(appId), 2000);
    };

    const startFocusSession = (duration: number) => {
        setShowFocusModal(false);
        setShowFocusPrompt(null);
        (window as any).focusDuration = duration;
        window.electronAPI?.toggleOverlay(true);
    };

    const dismissFocusPrompt = (appId: number) => {
        setShowFocusPrompt(null);
        setActiveApps(prev => {
            const newSet = new Set(prev);
            newSet.delete(appId);
            return newSet;
        });
    };

    const removeShortcut = (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if (window.confirm(`Remove "${name}" from dock?`)) {
            const updated = customShortcuts.filter(s => s.id !== id);
            setCustomShortcuts(updated);
            localStorage.setItem('customShortcuts', JSON.stringify(updated));
        }
    };

    const handleAddShortcut = (data: { name: string; url: string; browser: 'chrome' | 'edge'; profile: string }) => {
        const newShortcut: CustomShortcut = {
            id: Date.now().toString(),
            name: data.name,
            url: data.url,
            favicon: `https://www.google.com/s2/favicons?domain=${data.url}&sz=64`,
            browser: data.browser,
            profile: data.profile
        };
        const updated = [...customShortcuts, newShortcut];
        setCustomShortcuts(updated);
        localStorage.setItem('customShortcuts', JSON.stringify(updated));
        setShowAddShortcut(false);
    };

    // --- Dock Dragging ---

    const handleDockMouseDown = (e: React.MouseEvent) => {
        if (!dockRef.current) return;
        setIsDraggingDock(true);
        const rect = dockRef.current.getBoundingClientRect();
        dockDragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x || rect.left,
            initialY: position.y || rect.top
        };
    };

    const handleDockMouseMove = (e: MouseEvent) => {
        if (!isDraggingDock || !dockDragRef.current) return;
        const deltaX = e.clientX - dockDragRef.current.startX;
        const deltaY = e.clientY - dockDragRef.current.startY;
        setPosition({
            x: dockDragRef.current.initialX + deltaX,
            y: dockDragRef.current.initialY + deltaY
        });
    };

    const handleDockMouseUp = () => {
        setIsDraggingDock(false);
        dockDragRef.current = null;
        localStorage.setItem('dockPositionHorizontal', JSON.stringify(position));
    };

    useEffect(() => {
        if (isDraggingDock) {
            window.addEventListener('mousemove', handleDockMouseMove);
            window.addEventListener('mouseup', handleDockMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleDockMouseMove);
                window.removeEventListener('mouseup', handleDockMouseUp);
            };
        }
    }, [isDraggingDock, position]);

    // --- Item Reordering (HTML5 DnD) ---

    // Note: We only support reordering CUSTOM shortcuts.
    const handleItemDragStart = (e: React.DragEvent, customIndex: number) => {
        if (!isEditMode) {
            e.preventDefault();
            return;
        }
        setDraggedItemIndex(customIndex);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', customIndex.toString());
    };

    const handleItemDragOver = (e: React.DragEvent, customIndex: number) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleItemDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (!isEditMode || draggedItemIndex === null || draggedItemIndex === dropIndex) return;

        const updated = [...customShortcuts];
        const [moved] = updated.splice(draggedItemIndex, 1);
        updated.splice(dropIndex, 0, moved);

        setCustomShortcuts(updated);
        localStorage.setItem('customShortcuts', JSON.stringify(updated));
        setDraggedItemIndex(null);
    };


    // --- Helpers ---

    const getScale = (index: number) => {
        if (hovered === null) return 1;
        const distance = Math.abs(index - hovered);
        return distance === 0 ? 1.15 : distance === 1 ? 1.08 : 1;
    };

    const getDockPositionStyle = (): React.CSSProperties => {
        if (position.x !== 0 || position.y !== 0) {
            return { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, transform: 'none' };
        }
        // Initial Position: Bottom Center
        return { position: 'fixed', left: '50%', bottom: '20px', transform: 'translateX(-50%)' };
    };

    // --- Data ---
    const DEFAULT_ITEMS: DockItem[] = [
        {
            id: 1,
            name: 'Google',
            url: 'https://google.com',
            favicon: 'https://www.google.com/favicon.ico',
            browser: 'chrome',
            action: () => handleAppLaunch(1, 'https://google.com', 'chrome')
        },
        {
            id: 2,
            name: 'Notion',
            url: 'https://notion.so',
            favicon: 'https://www.notion.so/images/favicon.ico',
            browser: 'chrome',
            action: () => handleAppLaunch(2, 'https://notion.so', 'chrome')
        },
        {
            id: 3,
            name: 'Spotify',
            url: 'https://spotify.com',
            favicon: 'https://www.spotify.com/favicon.ico',
            browser: 'chrome',
            action: () => handleAppLaunch(3, 'https://spotify.com', 'chrome')
        },
        {
            id: 4,
            name: 'YouTube',
            url: 'https://youtube.com',
            favicon: 'https://www.youtube.com/favicon.ico',
            browser: 'chrome',
            action: () => handleAppLaunch(4, 'https://youtube.com', 'chrome')
        },
    ];

    const DOCK_ITEMS: DockItem[] = [
        ...DEFAULT_ITEMS,
        ...customShortcuts.map((shortcut, idx) => ({
            id: shortcut.id,
            name: shortcut.name,
            url: shortcut.url,
            favicon: shortcut.favicon,
            browser: shortcut.browser,
            profile: shortcut.profile,
            action: () => handleAppLaunch(parseInt(shortcut.id), shortcut.url, shortcut.browser, shortcut.profile),
            isCustom: true,
            customIndex: idx
        })),
        { id: 'divider', type: 'divider', name: '' },
        {
            id: 'focus',
            name: 'Focus',
            icon: <Play size={28} fill="currentColor" />,
            action: () => setShowFocusModal(true)
        },
        {
            id: 'add',
            name: 'Add Shortcut',
            icon: <Plus size={28} />,
            action: () => setShowAddShortcut(true)
        },
    ];

    const baseSize = 52;

    return (
        <div className="h-screen w-full overflow-visible pointer-events-none">
            <style>{`
                @keyframes wiggle {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(-3deg); }
                    50% { transform: rotate(0deg); }
                    75% { transform: rotate(3deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-wiggle {
                    animation: wiggle 0.3s ease-in-out infinite;
                }
            `}</style>

            {/* Focus Prompt */}
            {showFocusPrompt !== null && (
                <div
                    className="pointer-events-auto fixed animate-fade-in z-[10000]"
                    style={{
                        left: position.x !== 0 ? `${position.x + 90}px` : '110px',
                        top: position.y !== 0 ? `${position.y}px` : '50%',
                        transform: position.y === 0 ? 'translateY(-50%)' : 'none'
                    }}
                >
                    <div className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl p-4 shadow-2xl w-[280px]">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Timer size={18} />
                                <h4 className="font-semibold text-sm">Start Focus Session?</h4>
                            </div>
                            <button
                                onClick={() => dismissFocusPrompt(showFocusPrompt)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <p className="text-xs text-white/90 mb-3">
                            {DOCK_ITEMS.find(item => item.id === showFocusPrompt)?.name} is now open
                        </p>
                        <button
                            onClick={() => {
                                setShowFocusPrompt(null);
                                setShowFocusModal(true);
                            }}
                            className="w-full bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                        >
                            Start Focus Timer
                        </button>
                    </div>
                </div>
            )}

            {/* Focus Dialog */}
            {showFocusModal && (
                <FocusStartDialog
                    onClose={() => setShowFocusModal(false)}
                    onStart={startFocusSession}
                />
            )}

            {/* Shortcut Dialog */}
            {showAddShortcut && (
                <ShortcutDialog
                    onClose={() => setShowAddShortcut(false)}
                    onSave={handleAddShortcut}
                />
            )}

            {/* Dock Container */}
            <div
                ref={dockRef}
                className="pointer-events-auto"
                style={getDockPositionStyle()}
            >
                {/* Drag Handle - Full Lef... wait, if horizontal, maybe left edge still? 
                   User said "Doc container is 54 width 409 height I want it to be 409 width and 54 height"
                   This implies width > height.
                   I will make the drag handle the LEFT EDGE still, or maybe a small handle?
                   Let's keep the drag handle on the LEFT edge for now, but 
                   maybe make it full height of the dock (54px).
                */}
                <div
                    onMouseDown={handleDockMouseDown}
                    className="drag-handle absolute left-0 top-0 h-full z-50 rounded-l-2xl hover:bg-white/10 transition-colors"
                    style={{
                        width: '12px', // Reduce width slightly
                        cursor: isDraggingDock ? 'grabbing' : 'grab',
                        transform: 'translateX(-50%)' // Center on edge
                    }}
                />

                {/* Dock Body */}
                <div
                    className="dock-container px-4 py-2 flex flex-row items-center gap-3 w-fit" // Horizontal flex
                    style={{
                        height: '54px', // Explicit height
                        // min-width removed or set logic later
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(30px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                        borderRadius: '16px', // Slightly smaller radius for bar
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                        {DOCK_ITEMS.map((item, index) => {
                            if (item.type === 'divider') {
                                return (
                                    <div key={`div-${index}`} className="w-[1px] h-8 bg-white/20 mx-1" /> // Vertical divider
                                );
                            }

                            const scale = getScale(index);
                            const size = baseSize * scale;
                            const isActive = typeof item.id === 'number' && activeApps.has(item.id);
                            const isDraggable = isEditMode && item.isCustom;

                            return (
                                <div
                                    key={item.id}
                                    className={`relative flex items-center justify-center ${isEditMode && item.isCustom ? 'animate-wiggle' : ''}`}
                                    onMouseEnter={() => setHovered(index)}
                                    onMouseLeave={() => setHovered(null)}
                                    // ... keep DnD props ...
                                    draggable={isDraggable}
                                    onDragStart={(e) => item.customIndex !== undefined && handleItemDragStart(e, item.customIndex)}
                                    onDragOver={(e) => item.customIndex !== undefined && handleItemDragOver(e, item.customIndex)}
                                    onDrop={(e) => item.customIndex !== undefined && handleItemDrop(e, item.customIndex)}

                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }}
                                >
                                    <button
                                        onClick={item.action}
                                        disabled={isEditMode}
                                        style={{
                                            width: '42px', // Reduce base icon size inside container to fit 54px comfortable
                                            height: '42px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: isEditMode ? (item.isCustom ? 'grab' : 'default') : 'pointer',
                                            background: hovered === index ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                            border: isActive ? '2px solid rgba(251, 191, 36, 0.8)' : 'none',
                                            boxShadow: isActive ? '0 0 16px rgba(251, 191, 36, 0.6)' : 'none'
                                        }}
                                    >
                                        {item.favicon ? (
                                            <img
                                                src={item.favicon}
                                                alt={item.name}
                                                className="w-8 h-8 object-contain pointer-events-none"
                                            />
                                        ) : (
                                            <div className="text-white pointer-events-none transform scale-75">
                                                {item.icon}
                                            </div>
                                        )}
                                    </button>

                                    {/* Edit Mode Badge */}
                                    {isEditMode && item.isCustom && (
                                        <button
                                            onClick={(e) => removeShortcut(e, item.id.toString(), item.name)}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors z-20 pointer-events-auto"
                                        >
                                            <Trash2 size={8} />
                                        </button>
                                    )}

                                    {/* Tooltip - adjusted for horizontal */}
                                    {hovered === index && !isEditMode && (
                                        <div className="tooltip absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-white text-[10px] font-medium rounded-md pointer-events-none whitespace-nowrap bg-gray-900/90 backdrop-blur-sm">
                                            {item.name}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Toggle Edit Mode Button */}
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ml-2 ${isEditMode ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                        title={isEditMode ? "Done Editing" : "Rearrange Shortcuts"}
                    >
                        {isEditMode ? <Check size={14} /> : <Edit2 size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dock;
