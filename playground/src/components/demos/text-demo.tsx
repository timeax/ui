import { Text } from '../ui/text';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

export default function TextDemo() {
    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto">
            {/* Standard Typographic Scale */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Typographic Variants</h2>
                <div className="space-y-6">
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">banner:</span>
                        <Text variant="banner">Super Hero Banner Text</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">title:</span>
                        <Text variant="title">Modern Landing Page Title Header</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">subtitle:</span>
                        <Text variant="subtitle">This is a descriptive sub-header that details the above header topic context.</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">heading:</span>
                        <Text variant="heading">Main Section Heading Header</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">subheading:</span>
                        <Text variant="subheading">Sub-Section Subheading Header Title</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">lead:</span>
                        <Text variant="lead">This is a featured lead paragraph helper. It presents introductory summaries nicely.</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">large:</span>
                        <Text variant="large">Slightly larger body copy layout content text.</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">body (default):</span>
                        <Text variant="body">This is standard paragraph copy. All standard document texts default to this preset to keep layout styling uniform and standard.</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">small:</span>
                        <Text variant="small">This is small fine-print text, standard for minor footnotes.</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">muted:</span>
                        <Text variant="muted">Sub-details or supplementary information that is styled in muted colors.</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">caption:</span>
                        <Text variant="caption">Fine print terms, copyrights, or system status metadata labels.</Text>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block mb-1">code:</span>
                        <Text variant="code">const message = "Hello Polymorphic Typography!";</Text>
                    </div>
                </div>
            </section>

            {/* Helper flags */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Inline Helpers & Casing</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-3 border rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-xs text-muted-foreground block mb-1">italic:</span>
                        <Text italic>This text has font-style italic enabled.</Text>
                    </div>
                    <div className="p-3 border rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-xs text-muted-foreground block mb-1">upper (Uppercase):</span>
                        <Text upper>this text will render capitalized upper case.</Text>
                    </div>
                    <div className="p-3 border rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-xs text-muted-foreground block mb-1">capitalise:</span>
                        <Text capitalise>capitalize the first character of each word block.</Text>
                    </div>
                    <div className="p-3 border rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-xs text-muted-foreground block mb-1">noSelect (select-none):</span>
                        <Text noSelect className="text-rose-500 font-semibold">This text cannot be selected (select-none).</Text>
                    </div>
                </div>
            </section>

            {/* Sizing & custom weights overrides */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Inline Style Overrides</h2>
                <div className="space-y-3">
                    <Text size={24} weight={800} color="#0EA5E9">
                        Custom Size (24px), Extra Bold (800), and Color (#0EA5E9) Override
                    </Text>
                    <Text size="0.875rem" weight={300} className="text-zinc-500">
                        Custom Size (0.875rem), Thin Weight (300) Override
                    </Text>
                </div>
            </section>

            {/* Icon Insertion */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Icon Slots</h2>
                <div className="flex flex-wrap gap-6">
                    <Text icon={<Sparkles className="size-4 text-amber-500" />}>
                        Sparkle alert icon on left
                    </Text>
                    <Text icon={<ArrowRight className="size-4" />} iconPos="right" gap={12}>
                        Read full documents on right side
                    </Text>
                    <Text icon={<Calendar className="size-4" />} iconClass="cursor-pointer text-indigo-500" onIconClick={() => alert('Calendar Clicked!')}>
                        Interactive icon click alert
                    </Text>
                </div>
            </section>

            {/* Formatting capabilities */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Currency & Number Formatting</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-3 border rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-xs text-muted-foreground block mb-1">currency="USD":</span>
                        <Text currency="USD" weight="bold" className="text-emerald-600">54000.75</Text>
                    </div>
                    <div className="p-3 border rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-xs text-muted-foreground block mb-1">currency="NGN" (Intl formatted):</span>
                        <Text currency="NGN" weight="bold">2500000</Text>
                    </div>
                    <div className="p-3 border rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-xs text-muted-foreground block mb-1">thousandSeparator (No Currency):</span>
                        <Text thousandSeparator weight="semibold">1245900.5</Text>
                    </div>
                    <div className="p-3 border rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-xs text-muted-foreground block mb-1">Custom prefix & suffix formatting:</span>
                        <Text thousandSeparator prefix="Qty: " suffix=" items">4210</Text>
                    </div>
                </div>
            </section>

            {/* Polymorphism / Custom rendering */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Polymorphic Tags</h2>
                <div className="flex flex-wrap gap-4">
                    <Text as="h3" variant="title" size={20} className="m-0">
                        Rendered as &lt;h3&gt; tag with title presets
                    </Text>
                    <Text as="a" href="https://google.com" target="_blank" variant="body" icon={<ArrowRight className="size-4" />} iconPos="right" className="text-blue-600 hover:underline">
                        Rendered as external link anchor anchor
                    </Text>
                </div>
            </section>
        </div>
    );
}
