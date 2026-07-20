import * as React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, Search, SlidersHorizontal, ArrowRight, Eye, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RevealDemo() {
    const [searchVal, setSearchVal] = React.useState('');
    const [openRelative, setOpenRelative] = React.useState(false);
    const [openAbsolute, setOpenAbsolute] = React.useState(false);
    const [openDynamic, setOpenDynamic] = React.useState(false);


    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reveal Control</h1>
                <p className="text-muted-foreground mt-2">
                    A responsive disclosure container that collapses inputs, search bars, and toolbar items behind a simple toggle button on mobile screens.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* 1. Relative (Inline) Reveal */}
                <Card>
                    <CardHeader>
                        <CardTitle>Relative Inline Collapse (Default)</CardTitle>
                        <CardDescription>
                            Sliding expansion layout which pushes adjacent layout items as it opens. Best for inline toolbar slots.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-muted/20 border rounded-xl">
                            <span className="text-sm font-semibold grow text-foreground">Admin Directory</span>

                            <Reveal
                                open={openRelative}
                                onOpenChange={setOpenRelative}
                                width="18rem"
                                variant="relative"
                                placeholder="Search employees..."
                                title="Search Directory"
                            >
                                <Input
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    placeholder="Search employees..."
                                    className="h-9 w-full bg-background"
                                    autoFocus
                                />
                            </Reveal>

                            <Button size="sm" variant="outline" className="h-9">
                                <Filter className="size-4 mr-1.5" />
                                Filters
                            </Button>
                        </div>

                        {searchVal && (
                            <p className="text-xs text-muted-foreground">
                                Active Filter query: <span className="font-semibold text-foreground">"{searchVal}"</span>
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* 2. Absolute (Overlay) Reveal */}
                <Card>
                    <CardHeader>
                        <CardTitle>Absolute Overlay Collapse</CardTitle>
                        <CardDescription>
                            Pops out as a floating absolute-overlay card above other dashboard header items without distorting the layout.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/20 border rounded-xl">
                            <span className="text-sm font-semibold">Activity Feeds</span>

                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground">
                                    <RefreshCw className="size-4" />
                                </Button>

                                <Reveal
                                    open={openAbsolute}
                                    onOpenChange={setOpenAbsolute}
                                    icon={<SlidersHorizontal className="size-4" />}
                                    width="16rem"
                                    variant="absolute"
                                    side="left"
                                    title="Preferences"
                                >
                                    <div className="p-3 border bg-card rounded-lg shadow-lg flex flex-col gap-2.5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Filters</h4>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="limit" className="text-[10px]">Max records</Label>
                                            <Input id="limit" defaultValue="50" className="h-7 text-xs" />
                                        </div>
                                        <Button size="sm" className="h-7 text-xs w-full" onClick={() => setOpenAbsolute(false)}>
                                            Apply Changes
                                        </Button>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Dynamic Icon Toggle */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dynamic Trigger Icon Toggle</CardTitle>
                        <CardDescription>
                            Toggles the trigger button's icon dynamically based on the open state (e.g. morphing from Search to a Close "X" icon).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-muted/20 border rounded-xl">
                            <span className="text-sm font-semibold grow text-foreground">Dynamic Filter Control</span>
                            
                            <Reveal
                                open={openDynamic}
                                onOpenChange={setOpenDynamic}
                                icon={openDynamic ? <X className="size-4 text-destructive" /> : <Search className="size-4" />}
                                width="15rem"
                                variant="relative"
                                title="Dynamic Input"
                                buttonClassName={cn(openDynamic && "border-destructive/30 hover:bg-destructive/5")}
                            >
                                <Input
                                    placeholder="Type dynamically..."
                                    className="h-9 w-full bg-background"
                                    autoFocus
                                />
                            </Reveal>
                        </div>
                    </CardContent>
                </Card>


                {/* 3. Responsive Breakpoint Demonstration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Viewport Breakpoint-Driven Collapse</CardTitle>
                        <CardDescription>
                            Always remains expanded on desktop screens, but automatically collapses behind a toggle button on smaller/mobile screen widths.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border rounded-xl p-4 bg-muted/20 space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <Eye className="size-3.5" />
                                    Collapse Breakpoint: 768px (md)
                                </div>
                                <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-mono">
                                    Responsive
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Reveal
                                    collapseAt="md"
                                    width="14rem"
                                    icon={<SlidersHorizontal className="size-4" />}
                                    title="Quick Filter"
                                >
                                    <div className="flex items-center gap-2">
                                        <Input placeholder="Enter filter value..." className="h-9 bg-background" />
                                        <Button size="sm" className="h-9">
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    </div>
                                </Reveal>
                                
                                <span className="text-xs text-muted-foreground hidden md:inline">
                                    (Drag/resize the browser window to see this collapse on smaller screen widths)
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
