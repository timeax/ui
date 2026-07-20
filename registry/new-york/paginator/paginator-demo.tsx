import { Paginator } from './paginator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Item {
    id: number;
    title: string;
    description: string;
    category: string;
}

const ITEMS: Item[] = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    title: `Documentation Article #${i + 1}`,
    description: `This is a pre-rendered snippet description for article #${i + 1}. Explains layout configurations, density styling, and integration boundaries in shadcn registries.`,
    category: i % 3 === 0 ? 'React Principles' : i % 3 === 1 ? 'Design Systems' : 'Performance',
}));

export function PaginatorDemo() {
    return (
        <div className="space-y-12 max-w-4xl mx-auto p-4">
            {/* Section 1: Standard child slicing */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">1. Render-Prop Child Slicing</h3>
                    <p className="text-sm text-muted-foreground">
                        Paginator wraps a dataset, automatically slices pages, and exposes pagination state to render children.
                    </p>
                </div>

                <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6">
                    <Paginator
                        values={ITEMS}
                        pageSize={3}
                        rowsPerPageOptions={[3, 6, 9]}
                        position="both"
                        paginatorContainerClassName="py-3"
                        pageLinkActiveClassName="bg-primary text-primary-foreground hover:bg-primary/95"
                    >
                        {({ values: sliced }) => (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                                {sliced.map((item) => (
                                    <Card key={item.id} className="bg-card shadow-xs">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">
                                                {item.category}
                                            </div>
                                            <CardTitle className="text-sm font-semibold">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Paginator>
                </div>
            </div>

            {/* Section 2: Custom Layout templates */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">2. Custom Zoned Template</h3>
                    <p className="text-sm text-muted-foreground">
                        Uses zones (left, right) and template tokens to arrange paginator pieces (first, links, page inputs, etc.) differently.
                    </p>
                </div>

                <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6">
                    <Paginator
                        values={ITEMS}
                        pageSize={5}
                        position="bottom"
                        orderZones={{
                            left: 'PageInfo Divider PageInput',
                            right: 'First Prev PageLinks Next Last'
                        }}
                        pageLinkActiveClassName="bg-primary text-primary-foreground hover:bg-primary/95"
                    />
                </div>
            </div>
        </div>
    );
}
export default PaginatorDemo;
