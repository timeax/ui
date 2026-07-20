import * as React from 'react';
import { Table, Column } from '../ui/data-table/data-table';
import { DateText } from '../ui/date-text';
import { Button } from '@/components/ui/button';
import { Button as SmartButton } from '@/components/ui/smart-button';
import { Edit2, Trash2, Search, SlidersHorizontal } from 'lucide-react';

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'pending' | 'suspended';
    joined: string;
}

const MOCK_DATA: UserRow[] = [
    { id: '1', name: 'Olivia Martin', email: 'olivia.martin@email.com', role: 'Administrator', status: 'active', joined: '2025-01-15T09:30:00Z' },
    { id: '2', name: 'Jackson Lee', email: 'jackson.lee@email.com', role: 'Editor', status: 'active', joined: '2025-02-20T14:45:00Z' },
    { id: '3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', role: 'Subscriber', status: 'pending', joined: '2025-03-05T11:15:00Z' },
    { id: '4', name: 'William Chen', email: 'william.chen@email.com', role: 'Editor', status: 'suspended', joined: '2025-04-10T16:20:00Z' },
    { id: '5', name: 'Sofia Davis', email: 'sofia.davis@email.com', role: 'Administrator', status: 'active', joined: '2025-05-12T08:00:00Z' },
    { id: '6', name: 'Liam Wilson', email: 'liam.wilson@email.com', role: 'Subscriber', status: 'active', joined: '2025-06-01T10:00:00Z' },
    { id: '7', name: 'Emma Taylor', email: 'emma.taylor@email.com', role: 'Editor', status: 'pending', joined: '2025-06-15T15:30:00Z' },
];

export function DataTableDemo() {
    const [selection, setSelection] = React.useState<any[]>([]);
    const [selection2, setSelection2] = React.useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [density, setDensity] = React.useState<'comfortable' | 'compact'>('compact');
    const [variant, setVariant] = React.useState<'spaced' | 'normal' | 'bordered' | 'minimal' | 'glass'>('spaced');
    const [loading, setLoading] = React.useState(false);
    const [stickyHeader, setStickyHeader] = React.useState(true);

    const handleEdit = (user: UserRow) => {
        alert(`Edit user: ${user.name}`);
    };

    const handleDelete = (user: UserRow) => {
        alert(`Delete user: ${user.name}`);
    };

    const rowExpansionTemplate = (row: UserRow) => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-card/50 backdrop-blur-xs p-4 rounded-xl border border-border/60 shadow-xs space-y-1.5">
                    <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        User Details
                    </h4>
                    <div className="space-y-0.5 text-muted-foreground">
                        <p>ID: <span className="font-medium text-foreground">{row.id}</span></p>
                        <p>Role Authority: <span className="font-medium text-foreground">{row.role === 'Administrator' ? 'Full Access' : 'Staff Access'}</span></p>
                        <p>Security Level: <span className="font-medium text-foreground">Tier 2 Verification</span></p>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-xs p-4 rounded-xl border border-border/60 shadow-xs space-y-1.5">
                    <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        System Diagnostics
                    </h4>
                    <div className="space-y-0.5 text-muted-foreground">
                        <p>Status: <span className="capitalize font-medium text-green-500">{row.status}</span></p>
                        <p>Audit Log: <span className="font-medium text-foreground">No alerts detected</span></p>
                        <p>Session Ref: <span className="font-mono text-[10px] text-foreground">0x9F3...{row.id}B</span></p>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-xs p-4 rounded-xl border border-border/60 shadow-xs space-y-1.5">
                    <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Administrator Notes
                    </h4>
                    <p className="text-muted-foreground italic text-[11px] leading-relaxed">
                        "Active record verified for registry distribution demo. Permission scopes confirmed as neutral."
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Toolbar controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search names, emails..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="h-9 w-60 rounded-md border border-input pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-background"
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLoading((l) => !l)}
                        className="hover:cursor-pointer"
                    >
                        Toggle Loading
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <SlidersHorizontal className="h-3 w-3" /> Layout:
                    </span>
                    <div className="flex border rounded-md overflow-hidden bg-background">
                        {(['spaced', 'normal', 'bordered', 'minimal', 'glass'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setVariant(v)}
                                className={`px-3 py-1.5 font-medium hover:cursor-pointer transition-colors ${
                                    variant === v ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>

                    <div className="flex border rounded-md overflow-hidden bg-background">
                        {(['comfortable', 'compact'] as const).map((d) => (
                            <button
                                key={d}
                                onClick={() => setDensity(d)}
                                className={`px-3 py-1.5 font-medium hover:cursor-pointer transition-colors ${
                                    density === d ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setStickyHeader((s) => !s)}
                        className={`px-3 py-1.5 border rounded-md font-medium hover:cursor-pointer transition-colors bg-background ${
                            stickyHeader ? 'border-primary text-primary' : 'hover:bg-muted'
                        }`}
                    >
                        Sticky Header: {stickyHeader ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Table wrapper container to demonstrate scrolling */}
            <div className="relative rounded-xl overflow-hidden bg-muted/10 p-6 border border-border/40">
                {/* Visual backdrop decorative gradient shapes visible only behind glass theme */}
                {variant === 'glass' && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                        <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
                        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-500/10" />
                    </div>
                )}
                <Table
                    value={MOCK_DATA}
                    display={variant}
                    density={density}
                    loading={loading}
                    globalFilter={globalFilter}
                    selectionMode="multiple"
                    selection={selection}
                    onSelectionChange={setSelection}
                    checkbox
                    stickyHeader={stickyHeader}
                    viewportHeight={stickyHeader ? 280 : undefined}
                    emptyMessage="No users match your criteria."
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column field="name" header="Name" sortable width={180} frozen="left" />
                    <Column field="email" header="Email Address" sortable width={220} />
                    <Column field="role" header="Access Role" sortable width={140} />
                    <Column
                        field="joined"
                        header="Joined Date"
                        sortable
                        width={180}
                        body={(row: UserRow) => <DateText value={row.joined} date="dateMedium" />}
                    />
                    <Column
                        field="status"
                        header="Status"
                        status
                        width={120}
                        body={(row: UserRow) => (
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    row.status === 'active'
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                        : row.status === 'pending'
                                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                }`}
                            >
                                {row.status}
                            </span>
                        )}
                    />
                    <Column
                        header="Actions"
                        align="center"
                        width={100}
                        frozen="right"
                        body={(row: UserRow) => (
                            <div className="flex items-center justify-center gap-1.5">
                                <SmartButton
                                    size="icon"
                                    emphasis="ghost"
                                    onClick={() => handleEdit(row)}
                                    className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:cursor-pointer"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </SmartButton>
                                <SmartButton
                                    size="icon"
                                    emphasis="ghost"
                                    onClick={() => handleDelete(row)}
                                    className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 hover:cursor-pointer"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </SmartButton>
                            </div>
                        )}
                    />
                </Table>
            </div>

            {/* Selection indicators */}
            {selection.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-sm font-medium">
                    <span>Selected Users (Table 1): {selection.length}</span>
                    <Button variant="outline" size="sm" onClick={() => setSelection([])} className="hover:cursor-pointer">
                        Clear Selection
                    </Button>
                </div>
            )}

            <div className="border-t pt-6 mt-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">Table Sample 2: Checkbox Selection Only (No Collapsible/Expander Rows)</h3>
                <div className="relative rounded-xl overflow-hidden bg-muted/10 p-6 border border-border/40">
                    {variant === 'glass' && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                            <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
                            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-500/10" />
                        </div>
                    )}
                    <Table
                        value={MOCK_DATA}
                        display={variant}
                        density={density}
                        loading={loading}
                        globalFilter={globalFilter}
                        selectionMode="multiple"
                        selection={selection2}
                        onSelectionChange={setSelection2}
                        checkbox
                        stickyHeader={stickyHeader}
                        viewportHeight={stickyHeader ? 280 : undefined}
                        emptyMessage="No users match your criteria."
                    >
                        <Column field="name" header="Name" sortable width={180} frozen="left" />
                        <Column field="email" header="Email Address" sortable width={220} />
                        <Column field="role" header="Access Role" sortable width={140} />
                        <Column
                            field="joined"
                            header="Joined Date"
                            sortable
                            width={180}
                            body={(row: UserRow) => <DateText value={row.joined} date="dateMedium" />}
                        />
                        <Column
                            field="status"
                            header="Status"
                            status
                            width={120}
                            body={(row: UserRow) => (
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        row.status === 'active'
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                            : row.status === 'pending'
                                              ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                    }`}
                                >
                                    {row.status}
                                </span>
                            )}
                        />
                        <Column
                            header="Actions"
                            align="center"
                            width={100}
                            frozen="right"
                            body={(row: UserRow) => (
                                <div className="flex items-center justify-center gap-1.5">
                                    <SmartButton
                                        size="icon"
                                        emphasis="ghost"
                                        onClick={() => handleEdit(row)}
                                        className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:cursor-pointer"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                    </SmartButton>
                                    <SmartButton
                                        size="icon"
                                        emphasis="ghost"
                                        onClick={() => handleDelete(row)}
                                        className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 hover:cursor-pointer"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </SmartButton>
                                </div>
                            )}
                        />
                    </Table>
                </div>
            </div>

            {/* Selection indicators 2 */}
            {selection2.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-sm font-medium mt-2">
                    <span>Selected Users (Table 2): {selection2.length}</span>
                    <Button variant="outline" size="sm" onClick={() => setSelection2([])} className="hover:cursor-pointer">
                        Clear Selection
                    </Button>
                </div>
            )}
        </div>
    );
}
export default DataTableDemo;
