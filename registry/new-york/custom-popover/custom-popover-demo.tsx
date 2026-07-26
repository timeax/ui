import * as React from 'react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow
} from '@/components/ui/custom-popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crosshair, Target, MousePointer, HelpCircle } from 'lucide-react';

export default function CustomPopoverDemo() {
    // State/Refs for Demo 1: External Target Ref
    const targetRef = React.useRef<HTMLDivElement>(null);
    const [refOpen, setRefOpen] = React.useState(false);

    // State/Refs for Demo 2: Virtual Coordinate (Mouse Click)
    const [mouseCoords, setMouseCoords] = React.useState<{ x: number; y: number } | null>(null);
    const [mouseOpen, setMouseOpen] = React.useState(false);

    // We construct a virtual element that conforms to Radix UI's Measurable interface
    const virtualAnchor = React.useMemo(() => {
        if (!mouseCoords) return null;
        return {
            getBoundingClientRect: () => new DOMRect(mouseCoords.x, mouseCoords.y, 0, 0),
        };
    }, [mouseCoords]);

    const handleZoneClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Record click coordinates
        setMouseCoords({ x: e.clientX, y: e.clientY });
        setMouseOpen(true);
    };

    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Custom Popover</h1>
                <p className="text-muted-foreground mt-2">
                    A flexible popover that mirrors Radix features and shadcn styles, with advanced support for dynamic DOM ref anchors and coordinate-based virtual anchors.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demo 1: External DOM Ref Anchor */}
                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="size-5 text-indigo-500" />
                            External Ref Anchoring
                        </CardTitle>
                        <CardDescription>
                            Position a popover relative to a target element located elsewhere in the DOM by passing its React ref.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                        {/* The Anchor Element */}
                        <div
                            ref={targetRef}
                            className="p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-dashed border-indigo-200 dark:border-indigo-800 text-center min-h-[80px] flex flex-col justify-center items-center"
                        >
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Popover Target Box
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                (The popover will attach here)
                            </span>
                        </div>

                        {/* Popover setup */}
                        <Popover open={refOpen} onOpenChange={setRefOpen} anchor={targetRef}>
                            {/* Standard button trigger that toggles the popover */}
                            <Button 
                                onClick={() => setRefOpen(!refOpen)} 
                                variant="outline" 
                                className="w-full"
                            >
                                Toggle Popover (Trigger Button)
                            </Button>

                            <PopoverContent side="bottom" align="center" className="w-80">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm">Attached to Ref!</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Notice that this popover is anchored to the dashed target box above, even though you clicked this button.
                                    </p>
                                    <div className="flex justify-end">
                                        <Button size="sm" variant="ghost" onClick={() => setRefOpen(false)}>
                                            Understood
                                        </Button>
                                    </div>
                                </div>
                                <PopoverArrow className="fill-border" />
                            </PopoverContent>
                        </Popover>
                    </CardContent>
                </Card>

                {/* Demo 2: Click Coordinate Virtual Anchor */}
                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MousePointer className="size-5 text-emerald-500" />
                            Virtual Coordinate Anchor
                        </CardTitle>
                        <CardDescription>
                            Click anywhere in the zone below to spawn a context-style popover precisely at your mouse coordinates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                        {/* Interactive Click Zone */}
                        <div
                            onClick={handleZoneClick}
                            className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] cursor-crosshair rounded-xl min-h-[160px] transition text-center p-4"
                        >
                            <Crosshair className="size-8 text-muted-foreground/40 mb-2" />
                            <span className="text-sm font-medium text-foreground">
                                Click anywhere inside this region
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                Popover will spawn at your click position
                            </span>
                        </div>

                        {/* Popover with Virtual Anchor */}
                        <Popover open={mouseOpen} onOpenChange={setMouseOpen} anchor={virtualAnchor}>
                            <PopoverContent side="top" align="center" sideOffset={8} className="w-64">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span className="font-semibold">Context Options</span>
                                        <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                                            X: {mouseCoords?.x}, Y: {mouseCoords?.y}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <button 
                                            onClick={() => setMouseOpen(false)}
                                            className="w-full text-left p-1.5 hover:bg-accent rounded transition"
                                        >
                                            Copy Coordinate
                                        </button>
                                        <button 
                                            onClick={() => setMouseOpen(false)}
                                            className="w-full text-left p-1.5 hover:bg-accent rounded transition text-destructive"
                                        >
                                            Dismiss Menu
                                        </button>
                                    </div>
                                </div>
                                <PopoverArrow className="fill-border" />
                            </PopoverContent>
                        </Popover>
                    </CardContent>
                </Card>
            </div>

            {/* Demo 3: Standard Popover Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="size-5 text-blue-500" />
                        Standard Inline Trigger
                    </CardTitle>
                    <CardDescription>
                        Standard shadcn/Radix popover flow using inline triggers and inputs for rich content.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-8 bg-muted/25 rounded-xl border border-dashed">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Open Popover</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold leading-none">Dimensions</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Set the width and height of the bounding container.
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="width">Width</Label>
                                        <Input
                                            id="width"
                                            defaultValue="100%"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="maxWidth">Max. width</Label>
                                        <Input
                                            id="maxWidth"
                                            defaultValue="300px"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="height">Height</Label>
                                        <Input
                                            id="height"
                                            defaultValue="25px"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="maxHeight">Max. height</Label>
                                        <Input
                                            id="maxHeight"
                                            defaultValue="none"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardContent>
            </Card>
        </div>
    );
}
