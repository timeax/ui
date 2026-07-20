import * as React from 'react';
import { Toolbox } from './toolbox';
import { Actions, type ActionItem } from './actions';
import { BulkToolbar } from './bulk-toolbar';
import { exportSelectedAsJson } from './bulk-utils';
import {
    Plus,
    Download,
    Upload,
    Filter,
    Settings,
    Search,
    Trash,
    Eye,
    Edit2,
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    status: 'backlog' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
}

const initialTasks: Task[] = [
    { id: 'TSK-1', title: 'Implement login screen validation', status: 'completed', priority: 'high' },
    { id: 'TSK-2', title: 'Setup database migration scripts', status: 'in-progress', priority: 'high' },
    { id: 'TSK-3', title: 'Design user profile settings page', status: 'backlog', priority: 'low' },
    { id: 'TSK-4', title: 'Write unit tests for authentication API', status: 'completed', priority: 'medium' },
    { id: 'TSK-5', title: 'Configure production deployment pipeline', status: 'backlog', priority: 'high' },
];

export default function ActionsToolboxDemo() {
    const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredTasks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredTasks.map((t) => t.id));
        }
    };

    const handleDeleteTask = (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
    };

    const handleBulkDelete = () => {
        setTasks((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
        setSelectedIds([]);
    };

    const handleBulkExport = () => {
        const selectedTasks = tasks.filter((t) => selectedIds.includes(t.id));
        exportSelectedAsJson(selectedTasks, 'tasks-export');
    };

    const filteredTasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Dynamic Bulk Actions definition
    const bulkActions: ActionItem[] = [
        {
            name: 'Export Selected Tasks',
            icon: <Download className="h-4 w-4" />,
            action: handleBulkExport,
        },
        {
            name: 'Delete Selected',
            icon: <Trash className="h-4 w-4" />,
            danger: true,
            action: handleBulkDelete,
        },
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tasks Management</h1>
                    <p className="text-sm text-muted-foreground">Manage project tasks, status tracking, and export utilities.</p>
                </div>
            </div>

            {/* 1. COMPOSABLE TOOLBOX TOOLBAR */}
            <div className="rounded-xl border bg-card p-4 shadow-xs">
                <Toolbox>
                    {/* Search Field (Always visible) */}
                    <div className="relative max-w-xs w-full flex items-center">
                        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filter tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 h-9 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    {/* Filter Button (Collapses on md screen) */}
                    <Toolbox.Item collapseAt="md" menuLabel="Filter List:">
                        <button className="inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium hover:bg-accent text-accent-foreground hover:cursor-pointer transition-colors gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Filters</span>
                        </button>
                    </Toolbox.Item>

                    {/* Bulk Options Toolbar (Controlled item count) */}
                    <BulkToolbar
                        selectedCount={selectedIds.length}
                        totalCount={filteredTasks.length}
                        items={bulkActions}
                        noun="Tasks"
                    />

                    {/* Standard Action items */}
                    <Toolbox.Group collapseAt="lg" className="ml-auto" separator>
                        <button className="inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium hover:bg-accent text-accent-foreground hover:cursor-pointer transition-colors gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Import CSV</span>
                        </button>
                        <button className="inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium hover:bg-accent text-accent-foreground hover:cursor-pointer transition-colors gap-2">
                            <Download className="h-4 w-4" />
                            <span>Export All</span>
                        </button>
                    </Toolbox.Group>

                    {/* Primary Trigger (Always visible) */}
                    <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-primary-foreground px-4 text-sm font-medium hover:cursor-pointer shadow-xs transition-colors gap-2 ml-auto lg:ml-0">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New Task</span>
                    </button>

                    {/* Collapsed Items drop down */}
                    <Toolbox.Menu />
                </Toolbox>
            </div>

            {/* 2. GRID / LIST WITH ROW ACTIONS */}
            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b text-xs font-semibold text-muted-foreground uppercase">
                        <tr>
                            <th className="p-4 w-12 text-center">
                                <input
                                    type="checkbox"
                                    checked={filteredTasks.length > 0 && selectedIds.length === filteredTasks.length}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 hover:cursor-pointer"
                                />
                            </th>
                            <th className="p-4">ID</th>
                            <th className="p-4">Task Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    No tasks found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filteredTasks.map((task) => {
                                const isSelected = selectedIds.includes(task.id);
                                return (
                                    <tr
                                        key={task.id}
                                        className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors ${
                                            isSelected ? 'bg-primary/5' : ''
                                        }`}
                                    >
                                        <td className="p-4 w-12 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(task.id)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 hover:cursor-pointer"
                                            />
                                        </td>
                                        <td className="p-4 font-mono text-xs text-muted-foreground">{task.id}</td>
                                        <td className="p-4 font-medium">{task.title}</td>
                                        <td className="p-4 capitalize">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    task.status === 'completed'
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : task.status === 'in-progress'
                                                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400'
                                                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400'
                                                }`}
                                            >
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="p-4 capitalize">{task.priority}</td>
                                        <td className="p-4 text-right">
                                            {/* ROW ACTIONS COMPONENT */}
                                            <Actions
                                                items={[
                                                    {
                                                        name: 'View Task Details',
                                                        icon: <Eye className="h-4 w-4" />,
                                                        action: () => alert(`Viewing task ${task.id}`),
                                                    },
                                                    {
                                                        name: 'Edit Settings',
                                                        icon: <Settings className="h-4 w-4" />,
                                                        children: [
                                                            {
                                                                name: 'Edit Task Name',
                                                                icon: <Edit2 className="h-4 w-4" />,
                                                                action: () => alert(`Renaming task ${task.id}`),
                                                            },
                                                            {
                                                                name: 'Delete Task',
                                                                icon: <Trash className="h-4 w-4" />,
                                                                danger: true,
                                                                action: () => handleDeleteTask(task.id),
                                                            },
                                                        ],
                                                    },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
