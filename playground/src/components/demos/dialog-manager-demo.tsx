import * as React from 'react';
import { useDialog } from '../ui/dialog-manager/dialog-provider';
import { createDialog } from '../ui/dialog-manager/create-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { UserCheck, Trash2, HelpCircle, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface ProfileProps {
    initialName?: string;
    initialRole?: string;
    onSave?: (name: string, role: string) => void;
}

// Define the EditProfileModal using createDialog
export const EditProfileModal = createDialog<ProfileProps, { name: string; role: string }>(
    'edit-profile',
    ({ props, hide }) => {
        const [name, setName] = React.useState(props.initialName ?? '');
        const [role, setRole] = React.useState(props.initialRole ?? '');

        const handleSave = () => {
            props.onSave?.(name, role);
            hide(true, { name, role });
        };

        return (
            <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                    This dialog dynamically switches to a swipeable bottom sheet on mobile screens (viewport &le; 768px).
                </p>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">User Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="David Miller" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">User Role</label>
                        <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="System Administrator" />
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => hide(false)} className="hover:cursor-pointer">
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="hover:cursor-pointer">
                        Save Changes
                    </Button>
                </div>
            </div>
        );
    }
);

export function DialogManagerDemo() {
    const dialog = useDialog();
    const [profile, setProfile] = React.useState({ name: 'David Mercer', role: 'Support Agent' });
    const [lastAction, setLastAction] = React.useState<string | null>(null);

    const openEditProfile = () => {
        // Trigger programmatic dialog opening with props
        dialog.open(EditProfileModal, {
            initialName: profile.name,
            initialRole: profile.role,
            onSave: (name, role) => {
                setProfile({ name, role });
                setLastAction(`Profile updated: ${name} (${role})`);
            },
        });
    };

    const handleDeleteUser = async () => {
        // Programmatic promise-based confirmation alert
        const confirmed = await dialog.confirm({
            title: 'Delete System Account',
            content: 'Are you sure you want to permanently delete Alice Vance? This will purge all associated support ticket attachments.',
            acceptLabel: 'Delete Permanently',
            cancelLabel: 'Cancel Action',
        });

        if (confirmed) {
            setLastAction('Account deletion confirmed.');
        } else {
            setLastAction('Account deletion rejected/cancelled.');
        }
    };

    const handleAnchorPopover = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // Programmatic anchored popover confirmation
        const confirmed = await dialog.popup(e).confirm({
            title: 'Verify Approvals',
            content: 'Do you want to sign off this payout report?',
            acceptLabel: 'Approve Payout',
            cancelLabel: 'Reject',
        });

        if (confirmed) {
            setLastAction('Payout approved.');
        } else {
            setLastAction('Payout rejected/cancelled.');
        }
    };

    const handleSimulateLoader = () => {
        // Toggle async spinner overlay
        dialog.loader(true);
        setTimeout(() => {
            dialog.loader(false);
            setLastAction('Simulated loading overlay completed.');
        }, 1500);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            {/* Modal components registration host (required so they are mounted once somewhere) */}
            <EditProfileModal 
                title="Edit Account Details" 
                drawerAt={768} 
                outsideClosable={true} 
            />

            <div>
                <h3 className="text-lg font-semibold text-foreground">Programmatic Dialog Manager</h3>
                <p className="text-sm text-muted-foreground">
                    A centralized controller context handling modals, promise-based confirm alerts, popovers, and overlays.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Section 1: Dialog Triggers */}
                <Card className="bg-card/30 backdrop-blur-md border-border/60">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Programmatic Viewports
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                        <div className="p-3 border rounded-lg bg-background/50 space-y-1 text-xs">
                            <div className="flex justify-between font-mono">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-semibold text-foreground">{profile.name}</span>
                            </div>
                            <div className="flex justify-between font-mono">
                                <span className="text-muted-foreground">Role:</span>
                                <span className="font-semibold text-foreground">{profile.role}</span>
                            </div>
                        </div>
                        <Button 
                            onClick={openEditProfile} 
                            className="w-full text-xs hover:cursor-pointer"
                        >
                            Open Edit Profile Modal
                        </Button>
                    </CardContent>
                </Card>

                {/* Section 2: Quick Confirms */}
                <Card className="bg-card/30 backdrop-blur-md border-border/60">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-primary" />
                            Alerts & Popups
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex flex-col gap-2">
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteUser} 
                            className="w-full text-xs hover:cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Programmatic Confirm Alert
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleAnchorPopover} 
                            className="w-full text-xs hover:cursor-pointer flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Anchored Popover Dialog
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={handleSimulateLoader} 
                            className="w-full text-xs hover:cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Show Fullscreen Loader
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Display status logs */}
            {lastAction && (
                <Card className="bg-card border-border/60 shadow-xs animate-in fade-in-0 duration-200">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2 space-y-0">
                        <UserCheck className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-sm font-semibold">Store Log Dispatcher</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-xs">
                        <div className="p-3 rounded-lg border bg-muted/40 font-mono text-foreground truncate">
                            {lastAction}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
export default DialogManagerDemo;
