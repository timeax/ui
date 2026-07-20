import * as React from 'react';
import { CommandSearchProvider, CommandSearchTrigger } from '../ui/command-search/command-search';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Users, Ticket, CheckCircle2 } from 'lucide-react';
import type { CommandSearchRegistryEntry, CommandSearchResult } from '../ui/command-search/command-search.types';

const SEARCH_CATEGORIES: CommandSearchRegistryEntry[] = [
    {
        subject: 'users',
        label: 'System Users',
        description: 'Search accounts, roles, and emails',
        icon: Users,
        placeholder: 'Type a user name or email address...',
    },
    {
        subject: 'tickets',
        label: 'Support Tickets',
        description: 'Search help desk tickets and status',
        icon: Ticket,
        placeholder: 'Type a ticket subject or number...',
    },
];

const MOCK_USERS = [
    { id: 1, name: 'Alice Vance', email: 'alice.vance@example.com', badge: 'Admin' },
    { id: 2, name: 'Bob Sterling', email: 'bob.sterling@example.com', badge: 'Client' },
    { id: 3, name: 'David Mercer', email: 'david.m@example.com', badge: 'Support Agent' },
    { id: 4, name: 'Sarah Connor', email: 'sarah.c@example.com', badge: 'Client' },
];

const MOCK_TICKETS = [
    { id: 101, subject: 'Wallet balance display error', number: '#TK-48201', badge: 'Open' },
    { id: 102, subject: 'Payment gateway timeout on checkout', number: '#TK-48202', badge: 'High Priority' },
    { id: 103, subject: 'API key secret rotation request', number: '#TK-48203', badge: 'Resolved' },
    { id: 104, subject: 'Analytics dashboard metrics blank', number: '#TK-48204', badge: 'Open' },
];

export function CommandSearchDemo() {
    const [selectedResult, setSelectedResult] = React.useState<CommandSearchResult | null>(null);

    const handleSearch = React.useCallback(async (query: string, subject: string): Promise<CommandSearchResult[]> => {
        // Mock network delay of 450ms
        await new Promise((resolve) => setTimeout(resolve, 450));

        const normalizedQuery = query.toLowerCase();

        if (subject === 'users') {
            return MOCK_USERS.filter(
                (u) =>
                    u.name.toLowerCase().includes(normalizedQuery) ||
                    u.email.toLowerCase().includes(normalizedQuery)
            ).map((u) => ({
                id: u.id,
                subject: 'users',
                title: u.name,
                subtitle: u.email,
                badge: u.badge,
            }));
        }

        if (subject === 'tickets') {
            return MOCK_TICKETS.filter(
                (t) =>
                    t.subject.toLowerCase().includes(normalizedQuery) ||
                    t.number.toLowerCase().includes(normalizedQuery)
            ).map((t) => ({
                id: t.id,
                subject: 'tickets',
                title: t.subject,
                subtitle: t.number,
                badge: t.badge,
            }));
        }

        return [];
    }, []);

    const handleSelectResult = (result: CommandSearchResult) => {
        setSelectedResult(result);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            <div>
                <h3 className="text-lg font-semibold text-foreground">Decoupled Command Palette Search</h3>
                <p className="text-sm text-muted-foreground">
                    A completely generic programmatic command search dialog (Ctrl K). Click the trigger below or hit <strong>Ctrl + K</strong> (or <strong>⌘ + K</strong>) to search mock tables.
                </p>
            </div>

            <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6 flex flex-col gap-6">
                <CommandSearchProvider
                    entries={SEARCH_CATEGORIES}
                    onSearch={handleSearch}
                    onSelectResult={handleSelectResult}
                >
                    <div className="flex justify-center p-4 border border-dashed rounded-lg bg-background/50">
                        <CommandSearchTrigger />
                    </div>
                </CommandSearchProvider>

                {/* Display Selection Results */}
                {selectedResult && (
                    <Card className="bg-card border-border/60 shadow-xs animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2 space-y-0">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <CardTitle className="text-sm font-semibold">Search Callback Dispatched</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs space-y-2 leading-relaxed">
                            <p className="text-muted-foreground">
                                The provider intercepted the item commit. Custom router callbacks or page redirects can now be fired cleanly.
                            </p>
                            <div className="p-3 rounded-lg border bg-muted/40 font-mono space-y-1">
                                <div><strong className="text-foreground">Category:</strong> {selectedResult.subject}</div>
                                <div><strong className="text-foreground">ID:</strong> {selectedResult.id}</div>
                                <div><strong className="text-foreground">Title:</strong> {selectedResult.title}</div>
                                {selectedResult.subtitle && <div><strong className="text-foreground">Subtitle:</strong> {selectedResult.subtitle}</div>}
                                {selectedResult.badge && <div><strong className="text-foreground">Badge:</strong> {selectedResult.badge}</div>}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
export default CommandSearchDemo;
