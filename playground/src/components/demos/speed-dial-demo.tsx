import * as React from 'react';
import { SpeedDial, SpeedDialAction } from '../ui/speed-dial';
import { Edit, Link, Mail, Send, Settings, Share2, Star, Trash } from 'lucide-react';

export default function SpeedDialDemo() {
    const [radialOpen, setRadialOpen] = React.useState(false);
    const [linearOpen, setLinearOpen] = React.useState(false);

    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto min-h-[500px]">
            {/* Explanatory introduction */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Speed Dial Layout Options</h2>
                <p className="text-sm text-muted-foreground">
                    Speed dials support circular (radial sweep angle) or directional linear positioning. They are fully keyboard accessible (dismiss on Escape) and close when clicking outside.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="p-4 border rounded bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-40 relative">
                        <div>
                            <span className="font-semibold text-sm">Radial layout (Sweep angle)</span>
                            <p className="text-xs text-muted-foreground mt-1">Fans out circular actions around the trigger button.</p>
                        </div>
                        {/* Inline SpeedDial (portal=false) so it stays inside this box */}
                        <div className="flex justify-end pr-8 pb-4">
                            <SpeedDial
                                open={radialOpen}
                                onOpenChange={setRadialOpen}
                                layout="radial"
                                radius={70}
                                angleStart={180}
                                angleSweep={90}
                                portal={false}
                                backdrop={false}
                                size="sm"
                                className="!absolute right-4 bottom-4"
                            >
                                <SpeedDialAction icon={<Edit className="size-4" />} label="Edit" onClick={() => alert('Edit Clicked!')} />
                                <SpeedDialAction icon={<Star className="size-4 text-amber-500" />} label="Star" onClick={() => alert('Star Clicked!')} />
                                <SpeedDialAction icon={<Share2 className="size-4" />} label="Share" onClick={() => alert('Share Clicked!')} />
                            </SpeedDial>
                        </div>
                    </div>

                    <div className="p-4 border rounded bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-40 relative">
                        <div>
                            <span className="font-semibold text-sm">Linear layout (Up Direction)</span>
                            <p className="text-xs text-muted-foreground mt-1">Arranges action items vertically or horizontally in sequence.</p>
                        </div>
                        <div className="flex justify-end pr-8 pb-4">
                            <SpeedDial
                                open={linearOpen}
                                onOpenChange={setLinearOpen}
                                layout="linear"
                                direction="up"
                                spacing={48}
                                portal={false}
                                backdrop={false}
                                size="sm"
                                className="!absolute right-4 bottom-4"
                            >
                                <SpeedDialAction icon={<Mail className="size-4" />} label="Email" onClick={() => alert('Email Clicked!')} />
                                <SpeedDialAction icon={<Send className="size-4" />} label="Message" onClick={() => alert('Send Clicked!')} />
                                <SpeedDialAction icon={<Link className="size-4" />} label="Copy Link" onClick={() => alert('Link Clicked!')} />
                            </SpeedDial>
                        </div>
                    </div>
                </div>
            </section>

            {/* Backdrop SpeedDial (Full Portal Trigger) */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Global Portal Trigger (Bottom-Right with Backdrop Overlay)</h2>
                <p className="text-sm text-muted-foreground">
                    Look at the bottom right corner of the page viewport! An interactive Speed Dial is loaded there via a React Portal with a dark blurred background backdrop enabled. Click it to view full-page overlays.
                </p>
                {/* Portaled SpeedDial */}
                <SpeedDial
                    layout="radial"
                    radius={80}
                    angleStart={180}
                    angleSweep={90}
                    portal={true}
                    backdrop={true}
                    size="md"
                    trigger={<Settings className="size-6" />}
                >
                    <SpeedDialAction icon={<Edit className="size-4" />} label="Edit Profile" onClick={() => alert('Edit Profile!')} />
                    <SpeedDialAction icon={<Star className="size-4 text-amber-500" />} label="Favorites" onClick={() => alert('Favorites!')} />
                    <SpeedDialAction icon={<Trash className="size-4 text-rose-500" />} label="Reset Cache" onClick={() => alert('Reset Cache!')} />
                </SpeedDial>
            </section>
        </div>
    );
}
