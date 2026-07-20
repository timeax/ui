import * as React from 'react';
import { OverflowList } from '../ui/overflow-list/overflow-list';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreHorizontal, Plus, FileText, Share2, Printer, Trash2, ArrowRightLeft, PenTool, Download, Copy, Check } from 'lucide-react';
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
    const [scrollBehavior, setScrollBehavior] = React.useState<'smooth' | 'auto'>('smooth');
    const [scrollStep, setScrollStep] = React.useState<'half' | 'page'>('half');
    
    // Configurable container width to test resizing on screen
    const [containerWidth, setContainerWidth] = React.useState<number>(450);
    const [activeActionId, setActiveActionId] = React.useState<string>('new');

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
                className={cn("flex items-center gap-2 h-8 whitespace-nowrap", isActive && "active")}
            >
                <span className={isActive ? 'text-primary-foreground' : action.color}>{action.icon}</span>
                <span>{action.label}</span>
            </Button>
        );
    };

    const renderMoreDropdown = (collapsedActions: ActionItem[]) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:text-foreground hover:bg-accent hover:cursor-pointer transition-colors"
                        aria-label="More actions"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1 select-none">
                        Collapsed Actions ({collapsedActions.length})
                    </div>
                    {collapsedActions.map((item) => renderActionBtn(item, true))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="space-y-12 max-w-4xl mx-auto p-4">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Standalone OverflowList Component</h3>
                    <p className="text-sm text-muted-foreground">
                        A dynamic layout primitive that automatically calculates DOM child widths and slices them behind a "More" trigger or manages custom scroll arrow animations.
                    </p>
                </div>

                {/* Toolbar controls */}
                <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-4 rounded-xl border text-xs">
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

                    {/* Width slider to test container dimensions dynamically */}
                    <div className="flex flex-col gap-1 w-48">
                        <div className="flex justify-between text-muted-foreground">
                            <span className="font-medium">Container Width:</span>
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
                        Adjust the slider above or resize the screen to watch the items automatically collapse or scroll!
                    </p>

                    <div 
                        style={{ width: `${containerWidth}px` }} 
                        className="bg-card border border-border/80 p-3 rounded-lg shadow-sm overflow-hidden transition-all duration-150"
                    >
                        <OverflowList
                            items={ACTION_ITEMS}
                            renderItem={(item) => renderActionBtn(item, false)}
                            renderMore={renderMoreDropdown}
                            overflow={overflowMode}
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
