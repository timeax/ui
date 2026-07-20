import { SmartCard } from '../ui/smart-card';
import { CardTitle, CardDescription } from '../ui/card';

export default function SmartCardDemo() {
    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto">
            {/* Auto layout splitting */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Automatic Layout Splitting</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <SmartCard
                        title="Vite Project Scaffold"
                        description="Created 2 hours ago"
                        actionText="View Build Logs"
                        actionHref="#"
                    >
                        This card uses the convenience properties title, description, and actionText. The header border, alignment, and flex wrapping are handled automatically.
                        <div className="mt-4 p-3 rounded-md bg-muted/40 border text-xs font-mono">
                            npm run build --minify
                        </div>
                    </SmartCard>

                    <SmartCard>
                        {/* Auto splits 3 children elements into header/content/footer */}
                        <div>
                            <CardTitle>Implicit Region Split</CardTitle>
                            <CardDescription>Zero configuration required</CardDescription>
                        </div>
                        <p className="text-sm">
                            If you supply exactly three child elements to SmartCard without properties, they are mapped sequentially: child #1 becomes the header, child #2 becomes content, and child #3 becomes the footer.
                        </p>
                        <div className="text-xs text-muted-foreground flex gap-2">
                            <span>Status: Active</span>
                            <span>•</span>
                            <span>Version: v1.4.0</span>
                        </div>
                    </SmartCard>
                </div>
            </section>

            {/* Layout levels (Outer & Inner Nested Surfaces) */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Nested Levels (Outer & Inner)</h2>
                <div className="p-6 border rounded-xl bg-zinc-50 dark:bg-zinc-950/20">
                    <SmartCard level="outer" title="Outer Surface Container">
                        <p className="text-sm mb-4">
                            This container is marked level="outer" (standard surface layer). Below are two inner level="inner" cards nested directly in its content block.
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <SmartCard level="inner" title="Inner Level Card A">
                                Inner level cards have a slightly muted, translucent background to stand out clearly on top of outer cards without double borders.
                            </SmartCard>
                            <SmartCard level="inner" title="Inner Level Card B">
                                Perfect for layout divisions, detail panels, or sidebar widgets.
                            </SmartCard>
                        </div>
                    </SmartCard>
                </div>
            </section>

            {/* Variant choices */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Style Variants</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <SmartCard variant="solid" title="Solid Variant">
                        Default surface with standard background and light border.
                    </SmartCard>

                    <SmartCard variant="soft" title="Soft Shadow Variant">
                        Includes a sleek subtle bottom shadow without heavy border rings.
                    </SmartCard>

                    <SmartCard variant="outlined" title="Outlined Variant">
                        Draws a border wrapper with a fully transparent backdrop.
                    </SmartCard>

                    <SmartCard variant="ghost" title="Ghost Variant">
                        No borders, no background fills, no shadows. Transparent layout frame.
                    </SmartCard>

                    <SmartCard variant="soft-outline" title="Soft Outline Variant">
                        Combines soft shadows and border wraps.
                    </SmartCard>
                </div>
            </section>
        </div>
    );
}
