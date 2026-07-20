import { Paper } from '../ui/paper';

export default function PaperDemo() {
    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto">
            {/* Density Scale */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Density Scales</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Paper density="small">
                        <span className="text-xs font-semibold text-muted-foreground">Density: Small</span>
                        <p className="text-sm mt-1">Tightly padded panel surface block.</p>
                    </Paper>

                    <Paper density="compact">
                        <span className="text-xs font-semibold text-muted-foreground">Density: Compact</span>
                        <p className="text-sm mt-1">Comfortable condensed padding container.</p>
                    </Paper>

                    <Paper density="normal">
                        <span className="text-xs font-semibold text-muted-foreground">Density: Normal</span>
                        <p className="text-sm mt-1">Standard padding block layout.</p>
                    </Paper>

                    <Paper density="loose" className="sm:col-span-2 lg:col-span-3">
                        <span className="text-xs font-semibold text-muted-foreground">Density: Loose</span>
                        <p className="text-sm mt-1">Spacious padding block, ideal for rich landing page grids or callouts.</p>
                    </Paper>
                </div>
            </section>

            {/* Nested levels */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Nested Levels (Paper)</h2>
                <Paper level="outer" className="space-y-4">
                    <div>
                        <span className="text-xs font-semibold text-muted-foreground">Outer Paper Surface</span>
                        <p className="text-sm mt-1">Level: outer container.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Paper level="inner">
                            <span className="text-xs font-semibold text-muted-foreground">Inner Paper A</span>
                            <p className="text-sm mt-1">Level: inner block.</p>
                        </Paper>
                        <Paper level="inner">
                            <span className="text-xs font-semibold text-muted-foreground">Inner Paper B</span>
                            <p className="text-sm mt-1">Level: inner block.</p>
                        </Paper>
                    </div>
                </Paper>
            </section>
        </div>
    );
}
