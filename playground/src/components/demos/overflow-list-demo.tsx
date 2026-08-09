import * as React from 'react';
import { OverflowList } from '../ui/overflow-list/overflow-list';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreHorizontal, Plus, FileText, Share2, Printer, Trash2, ArrowRightLeft, PenTool, Download, Copy, Check, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const ACTION_ITEMS: ActionItem[] = [
    { id: 'new', label: 'Create New File', icon: <Plus className="h-4 w-4" />, color: 'text-green-500' },
    { id: 'view', label: 'View Document', icon: <FileText className="h-4 w-4" />, color: 'text-blue-500' },
    { id: 'share', label: 'Share with Team', icon: <Share2 className="h-4 w-4" />, color: 'text-purple-500' },
    { id: 'print', label: 'Print Layout', icon: <Printer className="h-4 w-4" />, color: 'text-amber-500' },
    { id: 'rename', label: 'Rename Item', icon: <PenTool className="h-4 w-4" />, color: 'text-orange-500' },
    { id: 'export', label: 'Export Dataset', icon: <Download className="h-4 w-4" />, color: 'text-teal-500' },
    { id: 'copy', label: 'Copy Clipboard', icon: <Copy className="h-4 w-4" />, color: 'text-cyan-500' },
    { id: 'move', label: 'Move Directory', icon: <ArrowRightLeft className="h-4 w-4" />, color: 'text-indigo-500' },
    { id: 'delete', label: 'Delete Securely', icon: <Trash2 className="h-4 w-4" />, color: 'text-red-500' },
];

export function OverflowListDemo() {
    const [overflowMode, setOverflowMode] = React.useState<'scroll' | 'dropdown' | 'both'>('dropdown');
    const [direction, setDirection] = React.useState<'horizontal' | 'vertical'>('horizontal');
    const [triggerMode, setTriggerMode] = React.useState<'builtin' | 'custom-trigger' | 'custom-render'>('builtin');
    const [scrollBehavior, setScrollBehavior] = React.useState<'smooth' | 'auto'>('smooth');
    const [scrollStep, setScrollStep] = React.useState<'half' | 'page'>('half');
    const [customMoreStyle, setCustomMoreStyle] = React.useState(false);
    
    // Configurable container dimensions to test resizing on screen
    const [containerWidth, setContainerWidth] = React.useState<number>(450);
    const [containerHeight, setContainerHeight] = React.useState<number>(220);
    const [activeActionId, setActiveActionId] = React.useState<string>('new');

    const isVertical = direction === 'vertical';

    const renderActionBtn = (action: ActionItem, isCollapsed: boolean) => {
        const isActive = action.id === activeActionId;

        if (isCollapsed) {
            return (
                <DropdownMenuItem 
                    key={action.id} 
                    onClick={() => setActiveActionId(action.id)}
                    className="cursor-pointer flex items-center justify-between"
                >
                    <span className="flex items-center gap-2">
                        <span className={action.color}>{action.icon}</span>
                        <span>{action.label}</span>
                    </span>
                    {isActive && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
            );
        }

        return (
            <Button
                key={action.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveActionId(action.id)}
                className={cn("flex items-center gap-2 h-8 whitespace-nowrap", isVertical && "w-full justify-start", isActive && "active")}
            >
                <span className={isActive ? 'text-primary-foreground' : action.color}>{action.icon}</span>
                <span>{action.label}</span>
            </Button>
        );
    };

    const renderCustomDropdown = (collapsedActions: ActionItem[], triggerNode?: React.ReactNode) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {triggerNode ?? (
                        <button
                            className={cn(
                                "flex h-8 items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:text-foreground hover:bg-accent hover:cursor-pointer transition-colors",
                                isVertical ? "w-full gap-2 px-3" : "w-8"
                            )}
                            aria-label="More actions"
                        >
                            {isVertical ? (
                                <>
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="text-xs font-medium">More ({collapsedActions.length})</span>
                                </>
                            ) : (
                                <MoreHorizontal className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isVertical ? "start" : "end"} className="w-56 max-h-64 overflow-y-auto">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1 select-none">
                        Custom RenderMore ({collapsedActions.length})
                    </div>
                    {collapsedActions.map((item) => renderActionBtn(item, true))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const getMoreTrigger = () => {
        if (triggerMode === 'custom-trigger') {
            return (count: number) => (
                <Button size="sm" variant="secondary" className="h-8 gap-1 text-xs">
                    +{count} More
                </Button>
            );
        }
        return undefined;
    };

    return (
        <div className="space-y-12 max-w-4xl mx-auto p-4">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Standalone OverflowList Component</h3>
                    <p className="text-sm text-muted-foreground">
                        A dynamic layout primitive that automatically calculates DOM child dimensions and slices them behind a "More" trigger or manages custom scroll arrow animations in horizontal or vertical orientations.
                    </p>
                </div>

                {/* Toolbar controls */}
                <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-4 rounded-xl border text-xs">
                    {/* Direction switch */}
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground font-medium">Direction:</span>
                        <div className="flex border rounded-md overflow-hidden bg-background">
                            {(['horizontal', 'vertical'] as const).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDirection(d)}
                                    className={`px-3 py-1.5 font-medium hover:cursor-pointer transition-colors ${
                                        direction === d ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Trigger Mode switch */}
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground font-medium">Dropdown / Trigger Setup:</span>
                        <div className="flex border rounded-md overflow-hidden bg-background">
                            {[
                                { id: 'builtin', label: 'Built-in Dropdown' },
                                { id: 'custom-trigger', label: 'moreTrigger Prop' },
                                { id: 'custom-render', label: 'renderMore Callback' },
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setTriggerMode(m.id as any)}
                                    className={`px-3 py-1.5 font-medium hover:cursor-pointer transition-colors ${
                                        triggerMode === m.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mode switch */}
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground font-medium">Overflow Mode:</span>
                        <div className="flex border rounded-md overflow-hidden bg-background">
                            {(['scroll', 'dropdown', 'both'] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setOverflowMode(m)}
                                    className={`px-3 py-1.5 font-medium hover:cursor-pointer transition-colors ${
                                        overflowMode === m ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dimension sliders */}
                    {direction === 'horizontal' ? (
                        <div className="flex flex-col gap-1 w-44">
                            <div className="flex justify-between text-muted-foreground">
                                <span className="font-medium">Width:</span>
                                <span className="font-mono">{containerWidth}px</span>
                            </div>
                            <input
                                type="range"
                                min="200"
                                max="800"
                                value={containerWidth}
                                onChange={(e) => setContainerWidth(Number(e.target.value))}
                                className="w-full cursor-ew-resize accent-primary"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 w-44">
                            <div className="flex justify-between text-muted-foreground">
                                <span className="font-medium">Height:</span>
                                <span className="font-mono">{containerHeight}px</span>
                            </div>
                            <input
                                type="range"
                                min="120"
                                max="450"
                                value={containerHeight}
                                onChange={(e) => setContainerHeight(Number(e.target.value))}
                                className="w-full cursor-ns-resize accent-primary"
                            />
                        </div>
                    )}

                    {/* Custom More Styling Toggle */}
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground font-medium">More Button Styling:</span>
                        <button
                            onClick={() => setCustomMoreStyle(!customMoreStyle)}
                            className={`px-3 py-1.5 font-medium border rounded-md transition-colors hover:cursor-pointer ${
                                customMoreStyle ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' : 'bg-background hover:bg-muted'
                            }`}
                        >
                            {customMoreStyle ? 'Custom styled' : 'Default'}
                        </button>
                    </div>

                    {/* Behavior physics */}
                    {overflowMode !== 'dropdown' && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground font-medium">Scroll Behavior:</span>
                                <div className="flex border rounded-md overflow-hidden bg-background">
                                    {(['smooth', 'auto'] as const).map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setScrollBehavior(b)}
                                            className={`px-3 py-1.5 font-medium hover:cursor-pointer transition-colors ${
                                                scrollBehavior === b ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                            }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground font-medium">Scroll Step:</span>
                                <div className="flex border rounded-md overflow-hidden bg-background">
                                    {(['half', 'page'] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setScrollStep(s)}
                                            className={`px-3 py-1.5 font-medium hover:cursor-pointer transition-colors ${
                                                scrollStep === s ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Resizable frame */}
                <div className="rounded-xl border p-6 bg-card/30 backdrop-blur-md space-y-4">
                    <p className="text-xs text-muted-foreground">
                        Adjust the sliders above or change direction and trigger setups to test horizontal and vertical overflow collapsing!
                    </p>

                    <div 
                        style={{
                            width: isVertical ? '240px' : `${containerWidth}px`,
                            height: isVertical ? `${containerHeight}px` : 'auto',
                        }} 
                        className="bg-card border border-border/80 p-3 rounded-lg shadow-sm overflow-hidden transition-all duration-150"
                    >
                        <OverflowList
                            items={ACTION_ITEMS}
                            renderItem={(item) => renderActionBtn(item, false)}
                            renderMore={triggerMode === 'custom-render' ? renderCustomDropdown : undefined}
                            moreTrigger={getMoreTrigger()}
                            overflow={overflowMode}
                            direction={direction}
                            moreClassName={customMoreStyle ? "ring-2 ring-primary/40 rounded-md shadow-sm" : undefined}
                            scrollBehavior={scrollBehavior}
                            scrollStep={scrollStep}
                            activeId={activeActionId}
                            isActive={(item) => item.id === activeActionId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OverflowListDemo;
