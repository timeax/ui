import * as React from 'react';
import { RenderIf } from '../ui/render-if/render-if';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { Database, Plus, RefreshCw, Trash2 } from 'lucide-react';

interface MockItem {
    id: number;
    name: string;
    size: string;
    updatedAt: string;
}

const MOCK_ITEMS: MockItem[] = [
    { id: 1, name: 'user_analytics_q3.csv', size: '14.2 MB', updatedAt: '2 hours ago' },
    { id: 2, name: 'marketing_campaign_leads.xlsx', size: '2.8 MB', updatedAt: 'Yesterday' },
    { id: 3, name: 'system_error_logs_backup.log', size: '104.5 MB', updatedAt: '3 days ago' },
];

export function RenderIfDemo() {
    const [items, setItems] = React.useState<MockItem[]>(MOCK_ITEMS);

    const handleClear = () => setItems([]);
    const handleRestore = () => setItems(MOCK_ITEMS);

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            <div>
                <h3 className="text-lg font-semibold text-foreground">Conditional RenderIf & Empty States</h3>
                <p className="text-sm text-muted-foreground">
                    A state-driven renderer that switches between active content layouts and styled shadcn Empty slots containers.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClear} 
                    disabled={items.length === 0}
                    className="flex items-center gap-2 hover:cursor-pointer"
                >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    Clear Items (Empty State)
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRestore} 
                    disabled={items.length > 0}
                    className="flex items-center gap-2 hover:cursor-pointer"
                >
                    <RefreshCw className="h-4 w-4 text-green-500" />
                    Restore Mock Dataset
                </Button>
            </div>

            <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6">
                <RenderIf
                    data={items}
                    empty={{
                        title: 'No Dataset Files Found',
                        description: 'We couldn\'t detect any spreadsheet files in this container directory. Upload one or restore the mockup files above to begin.',
                        kicker: 'Directory Empty',
                        icon: <Database className="h-5 w-5" />,
                        action: (
                            <Button 
                                size="sm" 
                                onClick={handleRestore} 
                                className="flex items-center gap-2 mt-2 hover:cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                Populate Sample Files
                            </Button>
                        ),
                        wrapper: (node) => (
                            <div className="rounded-xl border border-dashed border-border/80 bg-background/50 p-6">
                                {node}
                            </div>
                        ),
                    }}
                >
                    {(rows) => (
                        <div className="space-y-3">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Active Document Store ({rows.length} files)
                            </div>
                            <div className="grid gap-3">
                                {rows.map((row) => (
                                    <Card key={row.id} className="bg-card/75 border-border/60 shadow-xs">
                                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <CardTitle className="text-sm font-semibold">{row.name}</CardTitle>
                                                <p className="text-xs text-muted-foreground">Updated {row.updatedAt}</p>
                                            </div>
                                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded border">
                                                {row.size}
                                            </span>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </RenderIf>
            </div>
        </div>
    );
}
export default RenderIfDemo;
