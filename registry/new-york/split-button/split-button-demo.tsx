import { SplitButton } from './split-button';
import type { MenuItem } from './split-button';
import { FileText, Trash, Edit, Star } from 'lucide-react';

export default function SplitButtonDemo() {
    const items: MenuItem[] = [
        { label: 'Edit Content', value: 'edit', icon: <Edit className="size-4" /> },
        { label: 'Save Draft', value: 'draft', icon: <FileText className="size-4" /> },
        { label: 'Mark Favorite', value: 'fav', icon: <Star className="size-4 text-amber-500" /> },
        { label: 'Delete Entry', value: 'delete', icon: <Trash className="size-4 text-rose-500" />, className: 'text-rose-500 focus:bg-rose-500/10 focus:text-rose-600' },
    ];

    const handleSelect = (val: string) => {
        alert(`Selected option: ${val}`);
    };

    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto">
            {/* Tone matrix */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Split Button Tones</h2>
                <div className="flex flex-wrap gap-4">
                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Primary Clicked!')}
                        onSelect={handleSelect}
                        tone="primary"
                    >
                        Primary Action
                    </SplitButton>
                    
                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Success Clicked!')}
                        onSelect={handleSelect}
                        tone="success"
                    >
                        Publish Changes
                    </SplitButton>

                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Danger Clicked!')}
                        onSelect={handleSelect}
                        tone="danger"
                    >
                        Delete Project
                    </SplitButton>

                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Warning Clicked!')}
                        onSelect={handleSelect}
                        tone="warning"
                    >
                        Warning Action
                    </SplitButton>

                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Info Clicked!')}
                        onSelect={handleSelect}
                        tone="info"
                    >
                        Info Action
                    </SplitButton>
                </div>
            </section>

            {/* Emphases Matrix */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Split Button Emphases</h2>
                <div className="flex flex-wrap gap-4">
                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Solid Clicked!')}
                        onSelect={handleSelect}
                        tone="primary"
                        emphasis="solid"
                    >
                        Solid Action
                    </SplitButton>

                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Soft Clicked!')}
                        onSelect={handleSelect}
                        tone="primary"
                        emphasis="soft"
                    >
                        Soft Action
                    </SplitButton>

                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Outline Clicked!')}
                        onSelect={handleSelect}
                        tone="primary"
                        emphasis="outline"
                    >
                        Outline Action
                    </SplitButton>
                </div>
            </section>

            {/* Sizes Matrix */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Split Button Sizes</h2>
                <div className="flex flex-wrap items-end gap-4">
                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Small Clicked!')}
                        onSelect={handleSelect}
                        size="sm"
                        tone="success"
                    >
                        Small Split
                    </SplitButton>

                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Medium Clicked!')}
                        onSelect={handleSelect}
                        size="md"
                        tone="success"
                    >
                        Medium Split
                    </SplitButton>

                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Large Clicked!')}
                        onSelect={handleSelect}
                        size="lg"
                        tone="success"
                    >
                        Large Split
                    </SplitButton>

                    <SplitButton
                        items={items}
                        onPrimaryClick={() => alert('Extra Large Clicked!')}
                        onSelect={handleSelect}
                        size="xl"
                        tone="success"
                    >
                        Extra Large Split
                    </SplitButton>
                </div>
            </section>
        </div>
    );
}
