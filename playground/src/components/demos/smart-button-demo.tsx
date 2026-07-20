import { Button } from '../ui/smart-button';
import { Mail, ArrowRight, Star, Plus } from 'lucide-react';

export default function SmartButtonDemo() {
    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto">
            {/* Tones & Emphases Matrix */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Tones & Emphases</h2>
                <div className="grid gap-4">
                    {(['primary', 'success', 'info', 'warning', 'danger', 'secondary', 'neutral', 'theme', 'white', 'grey'] as const).map((tone) => (
                        <div key={tone} className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-border bg-zinc-50/50 dark:bg-zinc-900/30">
                            <span className="w-24 text-sm font-semibold capitalize text-muted-foreground">{tone}:</span>
                            <div className="flex flex-wrap gap-2">
                                <Button tone={tone} emphasis="solid">Solid</Button>
                                <Button tone={tone} emphasis="soft">Soft</Button>
                                <Button tone={tone} emphasis="outline">Outline</Button>
                                <Button tone={tone} emphasis="ghost">Ghost</Button>
                                <Button tone={tone} emphasis="link">Link</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sizes & Icons */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Sizes & Icon Placement</h2>
                <div className="flex flex-wrap items-end gap-4">
                    <Button size="sm" icon={<Mail className="size-4" />}>Small</Button>
                    <Button size="md" icon={<Mail className="size-4.5" />}>Medium</Button>
                    <Button size="lg" icon={<Mail className="size-5" />}>Large</Button>
                    <Button size="xl" icon={<Mail className="size-5.5" />}>Extra Large</Button>
                    <Button size="2xl" icon={<Mail className="size-6" />}>2XL</Button>
                    <Button size="3xl" icon={<Mail className="size-6.5" />}>3XL</Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                    <Button icon={<ArrowRight />} iconPosition="right">Next Page</Button>
                    <Button icon={<Plus />} iconGap={12}>Custom Gap</Button>
                    <Button icon={<Star className="text-amber-500" />} iconSize="3xl" tone="warning">Custom Icon Size</Button>
                </div>
            </section>

            {/* Icon Only Buttons */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Icon-Only Buttons</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <Button size="icon-sm" icon={<Star className="text-amber-500" />} tone="warning" />
                    <Button size="icon-md" icon={<Star className="text-amber-500" />} tone="warning" />
                    <Button size="icon-lg" icon={<Star className="text-amber-500" />} tone="warning" />
                    <Button size="icon-xl" icon={<Star className="text-amber-500" />} tone="warning" />
                    <Button size="icon-2xl" icon={<Star className="text-amber-500" />} tone="warning" />
                    <Button size="icon-3xl" icon={<Star className="text-amber-500" />} tone="warning" />
                </div>
            </section>

            {/* States: Loading & Disabled */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">States (Loading & Disabled)</h2>
                <div className="flex flex-wrap gap-4">
                    <Button loading>Solid Loading</Button>
                    <Button tone="success" emphasis="soft" loading icon={<Mail className="size-4" />}>Soft Loading</Button>
                    <Button tone="danger" emphasis="outline" loading>Outline Loading</Button>
                    <Button disabled icon={<Mail className="size-4" />}>Disabled Button</Button>
                    <Button tone="secondary" disabled>Disabled Solid</Button>
                </div>
            </section>

            {/* Shapes / Rounding */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Rounding (MD, Pill, None)</h2>
                <div className="flex flex-wrap gap-4">
                    <Button rounding="md">Default (Rounded MD)</Button>
                    <Button rounding="full" tone="success">Pill (Rounded Full)</Button>
                    <Button rounding="none" tone="neutral">Square (Rounded None)</Button>
                    <Button roundBy={16} tone="info">Custom Radius (16px)</Button>
                </div>
            </section>

            {/* Polymorphism */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Polymorphism (Render as Anchor Link)</h2>
                <div className="flex flex-wrap gap-4">
                    <Button as="a" href="https://github.com" target="_blank" rel="noopener noreferrer" tone="primary">
                        Open GitHub
                    </Button>
                    <Button as="a" href="#top" emphasis="outline" tone="secondary">
                        Back to Top
                    </Button>
                </div>
            </section>
        </div>
    );
}
