import * as React from 'react';
import { Pill } from '../ui/pill';
import {
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Tag,
    Bell,
    Clock,
    ShieldCheck,
    Star,
    Layers,
} from 'lucide-react';

export default function PillDemo() {
    const [count, setCount] = React.useState(0);

    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto text-zinc-900 dark:text-zinc-50">
            {/* Tone & Variant Matrix */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Status Tones (Soft Variant)</h2>
                <div className="flex flex-wrap gap-2.5 items-center">
                    <Pill tone="primary">Primary</Pill>
                    <Pill tone="success" icon={<CheckCircle2 />}>Success</Pill>
                    <Pill tone="info" icon={<Sparkles />}>Info</Pill>
                    <Pill tone="warning" icon={<AlertCircle />}>Warning</Pill>
                    <Pill tone="danger" icon={<AlertCircle />}>Danger</Pill>
                    <Pill tone="theme" icon={<Bell />}>Theme</Pill>
                    <Pill tone="white">White</Pill>
                    <Pill tone="grey">Grey</Pill>
                    <Pill tone="secondary">Secondary</Pill>
                    <Pill tone="neutral">Neutral</Pill>
                </div>
            </section>

            {/* Visual Variants */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Variants</h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="w-20 text-xs font-mono text-muted-foreground">Soft:</span>
                        <div className="flex flex-wrap gap-2.5">
                            <Pill variant="soft" tone="primary">Primary</Pill>
                            <Pill variant="soft" tone="success">Success</Pill>
                            <Pill variant="soft" tone="warning">Warning</Pill>
                            <Pill variant="soft" tone="danger">Danger</Pill>
                            <Pill variant="soft" tone="info">Info</Pill>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-20 text-xs font-mono text-muted-foreground">Solid:</span>
                        <div className="flex flex-wrap gap-2.5">
                            <Pill variant="solid" tone="primary">Primary</Pill>
                            <Pill variant="solid" tone="success">Success</Pill>
                            <Pill variant="solid" tone="warning">Warning</Pill>
                            <Pill variant="solid" tone="danger">Danger</Pill>
                            <Pill variant="solid" tone="info">Info</Pill>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-20 text-xs font-mono text-muted-foreground">Outline:</span>
                        <div className="flex flex-wrap gap-2.5">
                            <Pill variant="outline" tone="primary">Primary</Pill>
                            <Pill variant="outline" tone="success">Success</Pill>
                            <Pill variant="outline" tone="warning">Warning</Pill>
                            <Pill variant="outline" tone="danger">Danger</Pill>
                            <Pill variant="outline" tone="info">Info</Pill>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-20 text-xs font-mono text-muted-foreground">Ghost:</span>
                        <div className="flex flex-wrap gap-2.5">
                            <Pill variant="ghost" tone="primary">Primary</Pill>
                            <Pill variant="ghost" tone="success">Success</Pill>
                            <Pill variant="ghost" tone="warning">Warning</Pill>
                            <Pill variant="ghost" tone="danger">Danger</Pill>
                            <Pill variant="ghost" tone="info">Info</Pill>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shapes & Sizes */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Shapes & Sizing</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <Pill size="sm" shape="pill" tone="info" icon={<Tag />}>Small Full Pill</Pill>
                    <Pill size="md" shape="rounded" tone="success" icon={<ShieldCheck />}>Medium Rounded (Default)</Pill>
                    <Pill size="lg" shape="square" tone="primary" icon={<Layers />}>Large Square</Pill>
                </div>
            </section>

            {/* Icon Support */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Icon Positions & Custom Sizes</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Pill tone="info" icon={<Clock />} iconPosition="left">Left Icon</Pill>
                    <Pill tone="primary" icon={<Star className="fill-current" />} iconPosition="right">Right Icon</Pill>
                    <Pill tone="warning" icon={<Sparkles />} iconSize={18}>Custom 18px Icon</Pill>
                    <Pill tone="success" icon={<CheckCircle2 />} shape="pill">+14 Reviews</Pill>
                </div>
            </section>

            {/* Interactive & Polymorphic */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Interactive & Clickable Actions</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Pill
                        as="button"
                        tone="primary"
                        variant="solid"
                        shape="pill"
                        onClick={() => setCount((prev) => prev + 1)}
                    >
                        Clicked {count} times
                    </Pill>
                    <Pill
                        as="button"
                        tone="secondary"
                        variant="soft"
                        shape="pill"
                        icon={<Bell />}
                        onClick={() => alert('Notifications clicked!')}
                    >
                        Alert Trigger
                    </Pill>
                    <Pill
                        as="a"
                        href="#interactive"
                        tone="theme"
                        variant="outline"
                        shape="rounded"
                    >
                        Anchor Link
                    </Pill>
                </div>
            </section>
        </div>
    );
}
