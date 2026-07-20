import * as React from 'react';
import { useSidebar } from '../ui/sidebar-manager/sidebar-provider';
import { createSidebar } from '../ui/sidebar-manager/create-sidebar';
import {
    SidebarWrapper,
    SidebarHeader,
    SidebarTitle,
    SidebarClose,
    SidebarContent,
    SidebarFooter,
} from '../ui/sidebar-manager/sidebar-compound';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Settings2, ArrowRight, UserPlus, Layers, HelpCircle, RefreshCw } from 'lucide-react';

interface SimpleSidebarProps {
    initialText?: string;
}

// 1. Simple Sidebar using standard automatic header
export const SimpleSidebar = createSidebar<SimpleSidebarProps>(
    'simple-sidebar',
    ({ props, hide }) => {
        return (
            <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                    This sidebar renders a standard header automatically using the title and description props passed on mount.
                </p>
                <div className="rounded-lg border bg-muted/40 p-4 text-xs font-mono">
                    Props content: <span className="font-semibold text-foreground">{props.initialText ?? 'None provided'}</span>
                </div>
                <Button className="w-full" variant="outline" onClick={() => hide(false)}>
                    Close Drawer
                </Button>
            </div>
        );
    }
);

interface ComplexFormProps {
    titleText?: string;
    currentUser?: { name: string; email: string; role: string };
    onSave?: (user: { name: string; email: string; role: string }) => void;
}

interface ComplexFormResult {
    name: string;
    email: string;
    role: string;
}

// 2. Compound Sidebar using custom layouts and grid templates
export const CompoundFormSidebar = createSidebar<ComplexFormProps, ComplexFormResult>(
    'compound-sidebar',
    ({ props, hide }) => {
        const [name, setName] = React.useState(props.currentUser?.name ?? '');
        const [email, setEmail] = React.useState(props.currentUser?.email ?? '');
        const [role, setRole] = React.useState(props.currentUser?.role ?? 'Developer');

        // Allow props update while sidebar is open
        React.useEffect(() => {
            if (props.currentUser) {
                setName(props.currentUser.name);
                setEmail(props.currentUser.email);
                setRole(props.currentUser.role);
            }
        }, [props.currentUser]);

        const handleSave = () => {
            props.onSave?.({ name, email, role });
            // Resolve promise with results
            hide(true, { name, email, role });
        };

        return (
            <SidebarWrapper>
                <SidebarHeader className="flex-row items-center justify-between">
                    <div>
                        <SidebarTitle className="text-xl font-bold" />
                        <p className="text-xs text-muted-foreground mt-1">Configure workspace membership roles.</p>
                    </div>
                    <SidebarClose />
                </SidebarHeader>

                <SidebarContent innerClassName="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="Administrator">Administrator</option>
                                <option value="Manager">Manager</option>
                                <option value="Developer">Developer</option>
                                <option value="Guest">Guest</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                            <HelpCircle className="h-3 w-3" />
                            Compound Layout Detail
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This layout separates header, scrollable content and footer zones. Grid templates assure the middle zone fills the height and scrolling behaves properly.
                        </p>
                        <div className="space-y-1">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} className="text-xs text-muted-foreground/60 py-1 font-mono">
                                    Simulating height overflow element #{i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </SidebarContent>

                <SidebarFooter>
                    <Button variant="outline" size="sm" onClick={() => hide(false)}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        Save Membership
                    </Button>
                </SidebarFooter>
            </SidebarWrapper>
        );
    }
);

export function SidebarManagerDemo() {
    const sidebar = useSidebar();
    const [user, setUser] = React.useState({
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'Developer'
    });
    const [log, setLog] = React.useState<string | null>(null);

    // Sidebar config details
    const [selectedSide, setSelectedSide] = React.useState<'left' | 'right' | 'top' | 'bottom'>('right');
    const [selectedSize, setSelectedSize] = React.useState<string>('default');

    const triggerSimple = () => {
        sidebar.open(SimpleSidebar, {
            initialText: `Opened on ${new Date().toLocaleTimeString()} at side ${selectedSide}`
        });
    };

    const triggerCompound = async () => {
        setLog('Opening compound form...');
        try {
            // Test promise resolution
            const result = await sidebar.open(CompoundFormSidebar, {
                titleText: 'Membership Editor',
                currentUser: user,
                onSave: (nextUser) => {
                    setUser(nextUser);
                }
            });

            if (result) {
                setLog(`Promise resolved successfully! Result: ${JSON.stringify(result)}`);
            }
        } catch (err) {
            setLog('Promise rejected / Sidebar cancelled.');
        }
    };

    const triggerLiveUpdate = () => {
        // First open it
        sidebar.open(CompoundFormSidebar, {
            currentUser: user
        });

        // Simulating async data update 1 second later while open
        setTimeout(() => {
            sidebar.update(CompoundFormSidebar, {
                currentUser: {
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    role: 'Administrator'
                }
            });
            setLog('Dispatched live prop update: jane -> jane.smith');
        }, 1200);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            {/* Host mapping for playground sidebars */}
            <SimpleSidebar
                title="Simple Sidebar"
                description="Example of automatic headers and simple content layout."
                side={selectedSide}
                size={selectedSize as any}
            />

            <CompoundFormSidebar
                title="Workspace Access"
                side={selectedSide}
                size={selectedSize as any}
                promise
            />

            <div>
                <h3 className="text-lg font-semibold text-foreground">Programmatic Sidebar Manager</h3>
                <p className="text-sm text-muted-foreground">
                    Centralized sliding sheets/drawers opened programmatically via hook and managed via runtime singletons.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-card/30 backdrop-blur-md border-border/60">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-primary" />
                            Configuration Options
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Slide Side</label>
                            <div className="grid grid-cols-4 gap-1">
                                {(['left', 'right', 'top', 'bottom'] as const).map((s) => (
                                    <Button
                                        key={s}
                                        size="sm"
                                        variant={selectedSide === s ? 'default' : 'outline'}
                                        className="text-xs h-7 hover:cursor-pointer"
                                        onClick={() => setSelectedSide(s)}
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Drawer Sizing</label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="sm">sm (260px / 56px)</option>
                                <option value="default">default (320px / 72px)</option>
                                <option value="lg">lg (384px / 96px)</option>
                                <option value="xl">xl (448px / 112px)</option>
                                <option value="full">full (viewport height/width)</option>
                                <option value="420">Custom Numeric (420px)</option>
                                <option value="w-80">Custom Tailwind Width (w-80)</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/30 backdrop-blur-md border-border/60">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" />
                            Interactive Demos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex flex-col gap-2">
                        <Button
                            variant="outline"
                            onClick={triggerSimple}
                            className="w-full text-xs hover:cursor-pointer justify-between"
                        >
                            <span className="flex items-center gap-1.5">
                                <ArrowRight className="h-3.5 w-3.5" />
                                Simple Layout Sidebar
                            </span>
                        </Button>
                        <Button
                            variant="default"
                            onClick={triggerCompound}
                            className="w-full text-xs hover:cursor-pointer justify-between"
                        >
                            <span className="flex items-center gap-1.5">
                                <UserPlus className="h-3.5 w-3.5" />
                                Compound Form (Promise)
                            </span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={triggerLiveUpdate}
                            className="w-full text-xs hover:cursor-pointer justify-between"
                        >
                            <span className="flex items-center gap-1.5">
                                <RefreshCw className="h-3.5 w-3.5" />
                                Trigger Live Update while open
                            </span>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* User Access details */}
            <Card className="bg-card border-border/60">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-semibold">Workspace Member State</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-semibold text-foreground">{user.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-semibold text-foreground">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-semibold text-foreground">{user.role}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Logger updates */}
            {log && (
                <Card className="bg-muted/40 border-dashed border-border">
                    <CardContent className="p-3 text-[11px] font-mono leading-normal text-muted-foreground truncate">
                        LOG: {log}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default SidebarManagerDemo;
