import * as React from 'react';
import { SmartPopover } from '@/components/ui/smart-popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SlidersHorizontal, Settings2, Bookmark, Sparkles } from 'lucide-react';

export default function SmartPopoverDemo() {
    const [savedTags, setSavedTags] = React.useState<string[]>(['react', 'tailwind']);
    const [newTag, setNewTag] = React.useState('');

    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Smart Popover</h1>
                <p className="text-muted-foreground mt-2">
                    An advanced decorator popover that supports trigger width matching and inline render-prop close callbacks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demo 1: Trigger Width Matching */}
                <Card>
                    <CardHeader>
                        <CardTitle>Trigger Width Matching</CardTitle>
                        <CardDescription>
                            The popover content's minimum width automatically maps to the trigger button's size. Try resizing the button.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-xs text-muted-foreground block mb-2">Match Trigger Width (Active)</Label>
                            <SmartPopover
                                label="Configure Database Node"
                                icon={<Settings2 className="size-4" />}
                                matchTriggerWidth
                                tone="theme"
                                emphasis="solid"
                                className="w-full justify-between"
                            >
                                <div className="space-y-4 p-2">
                                    <h4 className="font-medium text-sm">Cluster Settings</h4>
                                    <div className="space-y-2">
                                        <Label htmlFor="host" className="text-xs">Node Hostname</Label>
                                        <Input id="host" defaultValue="node-us-east.db.local" size={12} className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="port" className="text-xs">Connection Port</Label>
                                        <Input id="port" defaultValue="5432" size={12} className="h-8 text-xs" />
                                    </div>
                                </div>
                            </SmartPopover>
                        </div>

                        <div>
                            <Label className="text-xs text-muted-foreground block mb-2">Standard Popover (Default Width)</Label>
                            <SmartPopover
                                label="Configure Backup"
                                icon={<SlidersHorizontal className="size-4" />}
                                tone="grey"
                                emphasis="outline"
                                className="w-full justify-between"
                            >
                                <div className="p-3 text-xs text-muted-foreground space-y-1">
                                    <p className="font-semibold text-foreground text-sm mb-1.5">Backup Active</p>
                                    <p>Standard popovers retain their default Radix width settings regardless of trigger widths.</p>
                                </div>
                            </SmartPopover>
                        </div>
                    </CardContent>
                </Card>

                {/* Demo 2: Programmatic Self-Closing (Render-Prop) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Programmatic Self-Closing</CardTitle>
                        <CardDescription>
                            Submit forms or trigger actions that close the popover cleanly *without* hoisting states to parent React components.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {savedTags.map((tag) => (
                                <span key={tag} className="text-xs py-1 px-2.5 bg-secondary text-secondary-foreground rounded-full border">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <SmartPopover
                            label="Add Custom Tag"
                            icon={<Bookmark className="size-4" />}
                            tone="primary"
                            emphasis="outline"
                            side="bottom"
                            align="start"
                        >
                            {({ close }) => (
                                <div className="p-2 space-y-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tag" className="text-xs font-semibold">New Tag Name</Label>
                                        <Input
                                            id="tag"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="e.g. analytics"
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setNewTag('');
                                                close();
                                            }}
                                            className="h-7 text-xs px-2.5"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                if (newTag.trim()) {
                                                    setSavedTags((tags) => [...tags, newTag.trim().toLowerCase()]);
                                                    setNewTag('');
                                                }
                                                close();
                                            }}
                                            className="h-7 text-xs px-2.5"
                                        >
                                            Add Tag
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </SmartPopover>
                    </CardContent>
                </Card>
            </div>

            {/* Demo 3: Viewport Auto-Height Limit */}
            <Card>
                <CardHeader>
                    <CardTitle>Viewport Safe Containment</CardTitle>
                    <CardDescription>
                        Popovers are constrained to the current available viewport space and scroll automatically when contents overflow.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-8 bg-muted/20 border-dashed border rounded-xl">
                    <SmartPopover
                        label="Open Scrollable Logs"
                        icon={<Sparkles className="size-4" />}
                        tone="neutral"
                        emphasis="solid"
                        side="bottom"
                    >
                        <div className="p-2 space-y-2">
                            <h3 className="font-bold text-sm border-b pb-1">System Audit Log</h3>
                            <div className="space-y-1 text-[11px] font-mono text-muted-foreground w-64 max-h-48 overflow-y-auto">
                                {[...Array(30)].map((_, i) => (
                                    <p key={i} className="hover:bg-muted p-0.5 rounded transition">
                                        [{new Date().toLocaleTimeString()}] node-worker-{i}: OK
                                    </p>
                                ))}
                            </div>
                        </div>
                    </SmartPopover>
                </CardContent>
            </Card>
        </div>
    );
}
