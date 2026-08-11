import * as React from 'react';
import { SpeedDial, SpeedDialAction } from './speed-dial';
import { Edit, Link, Mail, Send, Settings, Share2, Star, Trash, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Compass } from 'lucide-react';

export default function SpeedDialDemo() {
    const [radialBrOpen, setRadialBrOpen] = React.useState(false);
    const [radialBlOpen, setRadialBlOpen] = React.useState(false);
    const [radialTrOpen, setRadialTrOpen] = React.useState(false);
    const [radialTlOpen, setRadialTlOpen] = React.useState(false);

    const [upOpen, setUpOpen] = React.useState(false);
    const [downOpen, setDownOpen] = React.useState(false);
    const [leftOpen, setLeftOpen] = React.useState(false);
    const [rightOpen, setRightOpen] = React.useState(false);

    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto min-h-[500px]">
            {/* Radial Layout Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Radial Layout Angle Presets</h2>
                <p className="text-sm text-muted-foreground">
                    Radial speed dials fan out action items circularly based on <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">angleStart</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">angleSweep</code> configurations. Below are sweep angle presets tailored for each viewport or container corner:
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                    {/* Bottom-Right */}
                    <div className="p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div>
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <Compass className="size-4 text-primary" />
                                <span>Bottom-Right Corner</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Fans up & left (180° - 270°).</p>
                        </div>
                        <SpeedDial
                            open={radialBrOpen}
                            onOpenChange={setRadialBrOpen}
                            layout="radial"
                            radius={65}
                            angleStart={180}
                            angleSweep={90}
                            portal={false}
                            backdrop={false}
                            size="sm"
                            placement="br"
                            className="!absolute !right-4 !bottom-4"
                        >
                            <SpeedDialAction icon={<Edit className="size-4" />} label="Edit" onClick={() => alert('Edit Clicked!')} />
                            <SpeedDialAction icon={<Star className="size-4 text-amber-500" />} label="Star" onClick={() => alert('Star Clicked!')} />
                            <SpeedDialAction icon={<Share2 className="size-4" />} label="Share" onClick={() => alert('Share Clicked!')} />
                        </SpeedDial>
                    </div>

                    {/* Bottom-Left */}
                    <div className="p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div>
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <Compass className="size-4 text-primary" />
                                <span>Bottom-Left Corner</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Fans up & right (270° - 360°).</p>
                        </div>
                        <SpeedDial
                            open={radialBlOpen}
                            onOpenChange={setRadialBlOpen}
                            layout="radial"
                            radius={65}
                            angleStart={270}
                            angleSweep={90}
                            portal={false}
                            backdrop={false}
                            size="sm"
                            placement="bl"
                            className="!absolute !left-4 !bottom-4"
                        >
                            <SpeedDialAction icon={<Edit className="size-4" />} label="Edit" onClick={() => alert('Edit Clicked!')} />
                            <SpeedDialAction icon={<Star className="size-4 text-amber-500" />} label="Star" onClick={() => alert('Star Clicked!')} />
                            <SpeedDialAction icon={<Share2 className="size-4" />} label="Share" onClick={() => alert('Share Clicked!')} />
                        </SpeedDial>
                    </div>

                    {/* Top-Right */}
                    <div className="p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div>
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <Compass className="size-4 text-primary" />
                                <span>Top-Right Corner</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Fans down & left (90° - 180°).</p>
                        </div>
                        <SpeedDial
                            open={radialTrOpen}
                            onOpenChange={setRadialTrOpen}
                            layout="radial"
                            radius={65}
                            angleStart={90}
                            angleSweep={90}
                            portal={false}
                            backdrop={false}
                            size="sm"
                            placement="tr"
                            className="!absolute !right-4 !top-14"
                        >
                            <SpeedDialAction icon={<Edit className="size-4" />} label="Edit" onClick={() => alert('Edit Clicked!')} />
                            <SpeedDialAction icon={<Star className="size-4 text-amber-500" />} label="Star" onClick={() => alert('Star Clicked!')} />
                            <SpeedDialAction icon={<Share2 className="size-4" />} label="Share" onClick={() => alert('Share Clicked!')} />
                        </SpeedDial>
                    </div>

                    {/* Top-Left */}
                    <div className="p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div>
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <Compass className="size-4 text-primary" />
                                <span>Top-Left Corner</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Fans down & right (0° - 90°).</p>
                        </div>
                        <SpeedDial
                            open={radialTlOpen}
                            onOpenChange={setRadialTlOpen}
                            layout="radial"
                            radius={65}
                            angleStart={0}
                            angleSweep={90}
                            portal={false}
                            backdrop={false}
                            size="sm"
                            placement="tl"
                            className="!absolute !left-4 !top-14"
                        >
                            <SpeedDialAction icon={<Edit className="size-4" />} label="Edit" onClick={() => alert('Edit Clicked!')} />
                            <SpeedDialAction icon={<Star className="size-4 text-amber-500" />} label="Star" onClick={() => alert('Star Clicked!')} />
                            <SpeedDialAction icon={<Share2 className="size-4" />} label="Share" onClick={() => alert('Share Clicked!')} />
                        </SpeedDial>
                    </div>
                </div>
            </section>

            {/* Linear Layout Directions */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Linear Directions</h2>
                <p className="text-sm text-muted-foreground">
                    Linear speed dials arrange action items in sequence across four supported directions: <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">up</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">down</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">left</code>, and <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">right</code>.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                    {/* Up */}
                    <div className="p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div>
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <ArrowUp className="size-4 text-primary" />
                                <span>Direction: Up</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Expands items vertically upwards.</p>
                        </div>
                        <SpeedDial
                            open={upOpen}
                            onOpenChange={setUpOpen}
                            layout="linear"
                            direction="up"
                            spacing={44}
                            portal={false}
                            backdrop={false}
                            size="sm"
                            placement="bl"
                            className="!absolute !bottom-4 !left-1/2 !-translate-x-1/2"
                        >
                            <SpeedDialAction icon={<Mail className="size-4" />} label="Email" onClick={() => alert('Email Clicked!')} />
                            <SpeedDialAction icon={<Send className="size-4" />} label="Message" onClick={() => alert('Send Clicked!')} />
                            <SpeedDialAction icon={<Link className="size-4" />} label="Copy Link" onClick={() => alert('Link Clicked!')} />
                        </SpeedDial>
                    </div>

                    {/* Down */}
                    <div className="p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div>
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <ArrowDown className="size-4 text-primary" />
                                <span>Direction: Down</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Expands items vertically downwards.</p>
                        </div>
                        <SpeedDial
                            open={downOpen}
                            onOpenChange={setDownOpen}
                            layout="linear"
                            direction="down"
                            spacing={44}
                            portal={false}
                            backdrop={false}
                            size="sm"
                            placement="tl"
                            className="!absolute !top-14 !left-1/2 !-translate-x-1/2"
                        >
                            <SpeedDialAction icon={<Mail className="size-4" />} label="Email" onClick={() => alert('Email Clicked!')} />
                            <SpeedDialAction icon={<Send className="size-4" />} label="Message" onClick={() => alert('Send Clicked!')} />
                            <SpeedDialAction icon={<Link className="size-4" />} label="Copy Link" onClick={() => alert('Link Clicked!')} />
                        </SpeedDial>
                    </div>

                    {/* Left */}
                    <div className="p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div>
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <ArrowLeft className="size-4 text-primary" />
                                <span>Direction: Left</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Expands items horizontally to the left.</p>
                        </div>
                        <SpeedDial
                            open={leftOpen}
                            onOpenChange={setLeftOpen}
                            layout="linear"
                            direction="left"
                            spacing={44}
                            portal={false}
                            backdrop={false}
                            size="sm"
                            placement="tr"
                            className="!absolute !right-4 !top-1/2 !-translate-y-1/2"
                        >
                            <SpeedDialAction icon={<Mail className="size-4" />} label="Email" onClick={() => alert('Email Clicked!')} />
                            <SpeedDialAction icon={<Send className="size-4" />} label="Message" onClick={() => alert('Send Clicked!')} />
                            <SpeedDialAction icon={<Link className="size-4" />} label="Copy Link" onClick={() => alert('Link Clicked!')} />
                        </SpeedDial>
                    </div>

                    {/* Right */}
                    <div className="p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div>
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <ArrowRight className="size-4 text-primary" />
                                <span>Direction: Right</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Expands items horizontally to the right.</p>
                        </div>
                        <SpeedDial
                            open={rightOpen}
                            onOpenChange={setRightOpen}
                            layout="linear"
                            direction="right"
                            spacing={44}
                            portal={false}
                            backdrop={false}
                            size="sm"
                            placement="tl"
                            className="!absolute !left-4 !top-1/2 !-translate-y-1/2"
                        >
                            <SpeedDialAction icon={<Mail className="size-4" />} label="Email" onClick={() => alert('Email Clicked!')} />
                            <SpeedDialAction icon={<Send className="size-4" />} label="Message" onClick={() => alert('Send Clicked!')} />
                            <SpeedDialAction icon={<Link className="size-4" />} label="Copy Link" onClick={() => alert('Link Clicked!')} />
                        </SpeedDial>
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


