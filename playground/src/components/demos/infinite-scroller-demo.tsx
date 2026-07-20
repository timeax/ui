import * as React from 'react';
import { InfiniteScroller } from '../ui/infinite-scroller/infinite-scroller';
import { ShieldCheck, Cloud, Database, Lock, Terminal, Layers, Cpu, Code } from 'lucide-react';

const TECH_ITEMS = [
    { label: 'React', icon: <Code className="h-4 w-4 text-blue-500" /> },
    { label: 'TypeScript', icon: <Terminal className="h-4 w-4 text-sky-500" /> },
    { label: 'TailwindCSS', icon: <Layers className="h-4 w-4 text-teal-400" /> },
    { label: 'Secure Storage', icon: <Lock className="h-4 w-4 text-foreground" /> },
    { label: 'Vite Engine', icon: <Cpu className="h-4 w-4 text-amber-500" /> },
    { label: 'Cloud Deployment', icon: <Cloud className="h-4 w-4 text-indigo-400" /> },
    { label: 'SQL Database', icon: <Database className="h-4 w-4 text-green-500" /> },
    { label: 'Security Firewall', icon: <ShieldCheck className="h-4 w-4 text-red-500" /> },
];

export function InfiniteScrollerDemo() {
    const [speed, setSpeed] = React.useState<number>(60);
    const [direction, setDirection] = React.useState<'left' | 'right'>('left');
    const [pauseOnHover, setPauseOnHover] = React.useState<boolean>(true);

    return (
        <div className="space-y-12 max-w-2xl mx-auto p-4">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Infinite Scrolling Marquee Track</h3>
                <p className="text-sm text-muted-foreground">
                    A ResizeObserver-powered scroller that loops any child nodes infinitely, supporting vertical/horizontal tracks and hover physics.
                </p>
            </div>

            {/* Scroller control dashboard */}
            <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-4 rounded-xl border text-xs">
                {/* Speed Slider */}
                <div className="flex flex-col gap-1 w-32">
                    <div className="flex justify-between text-muted-foreground">
                        <span className="font-medium">Track Speed:</span>
                        <span className="font-mono">{speed}px/s</span>
                    </div>
                    <input
                        type="range"
                        min="20"
                        max="200"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full cursor-ew-resize accent-primary"
                    />
                </div>

                {/* Direction toggle */}
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground font-medium">Scroll Direction:</span>
                    <div className="flex border rounded-md overflow-hidden bg-background">
                        {(['left', 'right'] as const).map((d) => (
                            <button
                                key={d}
                                onClick={() => setDirection(d)}
                                className={`px-3 py-1 font-medium hover:cursor-pointer transition-colors ${
                                    direction === d ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pause Checkbox */}
                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="pause"
                        checked={pauseOnHover}
                        onChange={(e) => setPauseOnHover(e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary accent-primary"
                    />
                    <label htmlFor="pause" className="text-muted-foreground font-medium select-none cursor-pointer">
                        Pause on hover
                    </label>
                </div>
            </div>

            {/* Showcase Containers */}
            <div className="space-y-6">
                {/* Showcase 1: Horizontal Badges */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        1. Horizontal Tag Marquee
                    </span>
                    <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6 overflow-hidden">
                        <InfiniteScroller
                            items={TECH_ITEMS}
                            direction={direction}
                            speed={speed}
                            pauseOnHover={pauseOnHover}
                            renderItem={(item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 shrink-0 rounded-xl px-4 py-2 text-xs font-semibold border bg-card/85 shadow-xs"
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* Showcase 2: Vertical Alerts */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        2. Vertical Notification Track
                    </span>
                    <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6 overflow-hidden flex justify-center">
                        <InfiniteScroller
                            items={[
                                '🔥 System load exceeded threshold limits (84%).',
                                '🔒 Security credentials rotated successfully.',
                                '📦 Automated deployment finished (Build v4.11).',
                                '🛡️ SSL certificate renew checks validated.',
                            ]}
                            direction="up"
                            speed={35}
                            pauseOnHover={pauseOnHover}
                            className="w-full max-w-md border rounded-lg bg-background p-4"
                            pillClassName="py-1 text-center font-medium block max-w-full text-xs truncate"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default InfiniteScrollerDemo;
