import * as React from 'react';
import { Tabs, TabPanel } from '../ui/enhanced-tabs/enhanced-tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

import { ShieldAlert, BookOpen, Settings, User, FileText, HelpCircle, Code, Layers } from 'lucide-react';

export function EnhancedTabsDemo() {
    const [overflowMode, setOverflowMode] = React.useState<'scroll' | 'dropdown' | 'both'>('scroll');
    const [scrollBehavior, setScrollBehavior] = React.useState<'smooth' | 'auto'>('smooth');
    const [scrollStep, setScrollStep] = React.useState<'half' | 'page'>('half');
    const [variant, setVariant] = React.useState<'block' | 'underline'>('underline');

    // State for transition guard tab demo
    const [isFormDirty, setIsFormDirty] = React.useState(false);

    // Large list of tabs for overflow demo
    const OVERFLOW_TABS = [
        { id: 'profile', label: 'User Profile', icon: <User className="h-4 w-4" /> },
        { id: 'documents', label: 'Billing Documents', icon: <FileText className="h-4 w-4" /> },
        { id: 'settings', label: 'System Settings', icon: <Settings className="h-4 w-4" /> },
        { id: 'security', label: 'Security Protocols', icon: <ShieldAlert className="h-4 w-4" /> },
        { id: 'articles', label: 'Documentation Articles', icon: <BookOpen className="h-4 w-4" /> },
        { id: 'integrations', label: 'External API Integrations', icon: <Code className="h-4 w-4" /> },
        { id: 'support', label: 'Customer Support Tickets', icon: <HelpCircle className="h-4 w-4" /> },
        { id: 'audit', label: 'System Audit Trail Logs', icon: <Layers className="h-4 w-4" /> },
    ];

    const guardBeforeLeave = React.useCallback(async () => {
        if (isFormDirty) {
            const confirmed = window.confirm(
                'WARNING: You have unsaved changes inside this tab. Are you sure you want to discard your edits and leave?'
            );
            return confirmed;
        }
        return true;
    }, [isFormDirty]);

    return (
        <div className="space-y-12 max-w-4xl mx-auto p-4">
            {/* Section 1: Dynamic Overflow Engine */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">1. Responsive Tab Layouts & Arrow Physics</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure layout variants, overflow collapsing styles, and scroll speed steps. Hover over the headers to see custom scroll navigation arrows.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-muted/40 p-4 rounded-xl border text-xs">
                    {/* Style switch */}
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground font-medium">Variant:</span>
                        <div className="flex border rounded-md overflow-hidden bg-background">
                            {(['underline', 'block'] as const).map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setVariant(v)}
                                    className={`px-3 py-1 font-medium hover:cursor-pointer transition-colors ${
                                        variant === v ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mode switch */}
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground font-medium">Overflow Mode:</span>
                        <div className="flex border rounded-md overflow-hidden bg-background">
                            {(['scroll', 'dropdown', 'both'] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setOverflowMode(m)}
                                    className={`px-3 py-1 font-medium hover:cursor-pointer transition-colors ${
                                        overflowMode === m ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Behavior physics */}
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground font-medium">Scroll Physics:</span>
                        <div className="flex border rounded-md overflow-hidden bg-background">
                            {(['smooth', 'auto'] as const).map((b) => (
                                <button
                                    key={b}
                                    onClick={() => setScrollBehavior(b)}
                                    className={`px-3 py-1 font-medium hover:cursor-pointer transition-colors ${
                                        scrollBehavior === b ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground font-medium">Scroll Shift step:</span>
                        <div className="flex border rounded-md overflow-hidden bg-background">
                            {(['half', 'page'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setScrollStep(s)}
                                    className={`px-3 py-1 font-medium hover:cursor-pointer transition-colors ${
                                        scrollStep === s ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6">
                    <Tabs
                        tabs={OVERFLOW_TABS}
                        variant={variant}
                        size="sm"
                        overflow={overflowMode}
                        scrollBehavior={scrollBehavior}
                        scrollStep={scrollStep}
                        className="w-full"
                    >
                        {OVERFLOW_TABS.map((t) => (
                            <TabPanel key={t.id} tabId={t.id}>
                                <Card className="bg-card shadow-xs border-border/60">
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                            {t.icon}
                                            {t.label} Context Frame
                                        </CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground">
                                            Dynamic tab layout active in viewport.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed">
                                        This viewport demonstrates the standalone overflow-list measuring child offsets and managing scroll arrows, entrance duration properties, and drop-down menu slicing dynamically.
                                    </CardContent>
                                </Card>
                            </TabPanel>
                        ))}
                    </Tabs>
                </div>
            </div>

            {/* Section 2: Validation Guard */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">2. Asynchronous Transition Guards</h3>
                    <p className="text-sm text-muted-foreground">
                        Guards block user navigation away from a tab when conditions are met. Enable the toggle below and attempt to switch tabs.
                    </p>
                </div>

                <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6">
                    <Tabs
                        tabs={[
                            { id: 'form', label: 'Editable Input Form', icon: <FileText className="h-4 w-4" /> },
                            { id: 'preview', label: 'Compiled Summary View', icon: <Layers className="h-4 w-4" /> },
                        ]}
                        variant="underline"
                        size="sm"
                        className="w-full"
                    >
                        <TabPanel tabId="form" onBeforeLeave={guardBeforeLeave}>
                            <Card className="bg-card shadow-xs border-border/60">
                                <CardContent className="p-4 space-y-4 text-xs">
                                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-foreground">Simulate Unsaved Form Edits</p>
                                            <p className="text-muted-foreground text-[11px]">When enabled, switching tabs will trigger a confirmation dialog check.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsFormDirty((d) => !d)}
                                            className={`px-3 py-1.5 border rounded-md font-medium hover:cursor-pointer transition-colors bg-background ${
                                                isFormDirty ? 'border-red-500 text-red-500 bg-red-50/10' : 'hover:bg-muted'
                                            }`}
                                        >
                                            {isFormDirty ? 'Form is DIRTY' : 'Form is CLEAN'}
                                        </button>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Validation guards work asynchronously. TabPanel context registers callback hooks on mount, validating state changes before triggering transition commits.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabPanel>

                        <TabPanel tabId="preview">
                            <Card className="bg-card shadow-xs border-border/60">
                                <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
                                    You have successfully transitioned to the preview window because the guard validated successfully!
                                </CardContent>
                            </Card>
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
export default EnhancedTabsDemo;
