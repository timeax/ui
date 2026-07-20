import * as React from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useDialog } from '../ui/dialog-manager/dialog-provider';
import { createDialog } from '../ui/dialog-manager/create-dialog';
import {
    DialogWrapper,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogContent,
    DialogFooter,
} from '../ui/dialog-manager/dialog-compound';
import { CheckCircle2, Smartphone } from 'lucide-react';

// 1. Existing dialog without DialogWrapper
const ExistingSimpleModal = createDialog('existing-simple', () => (
    <div className="space-y-2">
        <p className="text-sm">This dialog uses the default default shell template.</p>
        <p className="text-xs text-muted-foreground">It does not import or mount DialogWrapper.</p>
    </div>
));

// 2. Fully composed dialog with all layout components (using custom classes for highlights)
const FullyComposedModal = createDialog<{ customColor?: string }, { saved: boolean }>(
    'fully-composed',
    ({ hide }) => (
        <DialogWrapper className="flex flex-col h-full bg-slate-900/10 border-2 border-primary/20 rounded-xl">
            <DialogHeader className="flex flex-row items-center justify-between border-b border-primary/10 px-6 py-4 bg-primary/5">
                <DialogTitle className="text-xl font-bold text-primary" />
                <DialogClose className="hover:bg-primary/10 text-primary rounded-full p-1" />
            </DialogHeader>

            <DialogContent className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <p className="text-sm">
                    This compound layout is custom colored and styled via Tailwind props. It uses every single subcomponent.
                </p>
                <div className="p-3 bg-muted border rounded-lg text-xs font-mono space-y-1">
                    <div><strong>Wrapper:</strong> flex-col border-primary/20</div>
                    <div><strong>Header:</strong> border-primary/10 bg-primary/5</div>
                    <div><strong>Title:</strong> text-xl font-bold text-primary</div>
                    <div><strong>Close:</strong> hover:bg-primary/10 rounded-full</div>
                </div>
            </DialogContent>

            <DialogFooter className="flex justify-end gap-2 border-t border-primary/10 px-6 py-4 bg-primary/5">
                <Button variant="outline" size="sm" onClick={() => hide(false)} className="hover:cursor-pointer">
                    Discard (hide false)
                </Button>
                <Button size="sm" onClick={() => hide(true, { saved: true })} className="hover:cursor-pointer">
                    Save (hide true)
                </Button>
            </DialogFooter>
        </DialogWrapper>
    )
);

// 3. Dialog with only DialogWrapper and arbitrary children
const WrapperOnlyModal = createDialog('wrapper-only', () => (
    <DialogWrapper className="p-6 space-y-4 bg-destructive/5 rounded-xl border border-destructive/20 text-center">
        <h3 className="text-md font-bold text-destructive">Completely Freeform Layout</h3>
        <p className="text-xs text-muted-foreground">
            This dialog contains no DialogHeader, DialogTitle, DialogClose, DialogContent or DialogFooter. It is completely custom.
        </p>
    </DialogWrapper>
));

// 4. Dialog without a header
const HeaderlessModal = createDialog('headerless', ({ hide }) => (
    <DialogWrapper className="flex flex-col bg-amber-500/5 rounded-xl border border-amber-500/20">
        <DialogContent className="p-6 space-y-4">
            <h4 className="font-semibold text-amber-500 text-sm">Headerless Container</h4>
            <p className="text-xs text-muted-foreground">
                There is no header. The dialog content starts immediately.
            </p>
        </DialogContent>
        <DialogFooter className="p-4 border-t border-amber-500/10">
            <Button size="sm" variant="outline" onClick={() => hide(false)} className="w-full hover:cursor-pointer">
                Close
            </Button>
        </DialogFooter>
    </DialogWrapper>
));

// 5. Dialog without a title
const TitlelessModal = createDialog('titleless', () => (
    <DialogWrapper className="flex flex-col rounded-xl border">
        <DialogHeader className="flex flex-row justify-between items-center bg-muted/20">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Custom Header (No Title)
            </span>
            <DialogClose />
        </DialogHeader>
        <DialogContent className="p-6">
            <p className="text-xs text-muted-foreground">
                This custom header is rendered with a close control, but the DialogTitle placeholder is omitted entirely.
            </p>
        </DialogContent>
    </DialogWrapper>
));

// 6. Dialog without a close button
const CloselessModal = createDialog('closeless', ({ hide }) => (
    <DialogWrapper className="flex flex-col rounded-xl border">
        <DialogHeader className="bg-destructive/5 border-destructive/10">
            <DialogTitle className="text-destructive font-bold" />
        </DialogHeader>
        <DialogContent className="p-6 space-y-3">
            <p className="text-xs text-muted-foreground">
                This dialog contains no close button. Closing is locked to the footer buttons or programmatic controllers.
            </p>
        </DialogContent>
        <DialogFooter className="bg-destructive/5 border-destructive/10">
            <Button size="sm" onClick={() => hide(false)} className="hover:cursor-pointer">
                Understood
            </Button>
        </DialogFooter>
    </DialogWrapper>
));

// 7. Dialog without a footer
const FooterlessModal = createDialog('footerless', () => (
    <DialogWrapper className="flex flex-col rounded-xl border">
        <DialogHeader>
            <DialogTitle />
            <DialogClose className="absolute top-4 right-4" />
        </DialogHeader>
        <DialogContent className="p-6">
            <p className="text-xs text-muted-foreground">
                This layout finishes with the content zone. There is no footer line or footer padding block.
            </p>
        </DialogContent>
    </DialogWrapper>
));

// 8. Dialog with vertical scrolling DialogContent for overflows
// DialogWrapper uses CSS Grid internally — no flex classes needed.
// DialogHeader → row 1 (auto), DialogContent → row 2 (1fr, scrollable), DialogFooter → row 3 (auto).
const ScrollingLogsModal = createDialog('scrolling-logs', ({ hide }) => {
    const logs = Array.from({ length: 30 }, (_, idx) => `[10:44:${10 + idx}] Process event checkpoint logs #${idx + 1}...`);
    return (
        <DialogWrapper className="bg-background border rounded-xl">
            <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
                <DialogTitle className="text-lg font-semibold" />
                <DialogClose className="ml-auto" />
            </DialogHeader>
            <DialogContent innerClassName="space-y-4">
                <p className="text-xs text-muted-foreground">
                    Audit logs database dump records:
                </p>
                <div className="space-y-1.5 font-mono text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border">
                    {logs.map((log, index) => (
                        <div key={index} className="truncate border-b border-border/40 pb-1 last:border-0">
                            {log}
                        </div>
                    ))}
                </div>
            </DialogContent>
            <DialogFooter className="border-t px-6 py-4 bg-muted/20">
                <Button variant="outline" size="sm" onClick={() => hide(false)} className="hover:cursor-pointer">
                    Close Logs
                </Button>
            </DialogFooter>
        </DialogWrapper>
    );
});


export function DialogCompoundDemo() {
    const dialog = useDialog();
    const [log, setLog] = React.useState<string | null>(null);

    const openWithPromise = async (id: string, modalComp: any, props: any = {}) => {
        try {
            setLog(`Opening dialog: ${id}...`);
            const res = await dialog.open(modalComp, {
                title: `${id.toUpperCase().replace('-', ' ')} Test Modal`,
                promise: true,
                ...props,
            });
            setLog(`Dialog ${id} resolved successfully! Result: ${JSON.stringify(res)}`);
        } catch (err) {
            setLog(`Dialog ${id} dismissed/cancelled. Error/Dismiss: ${err}`);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            {/* Mount all modal definitions so they registry register on load */}
            <ExistingSimpleModal title="Simple Modal" />
            <FullyComposedModal title="Fully Composed" promise={true} />
            <WrapperOnlyModal title="Wrapper Only" />
            <HeaderlessModal title="Headerless" />
            <TitlelessModal title="Titleless" />
            <CloselessModal title="Closeless Locked" />
            <FooterlessModal title="Footerless" />
            <ScrollingLogsModal title="System Audit Logs" />

            <div>
                <h3 className="text-lg font-semibold text-foreground">Compound Layout Dialog Modals</h3>
                <p className="text-sm text-muted-foreground">
                    Create custom styled modular interfaces with subcomponent placeholders while retaining accessible titles and drag close listeners.
                </p>
            </div>

            <div className="rounded-xl border bg-card/30 backdrop-blur-md p-6 flex flex-col gap-6">
                <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                        variant="outline"
                        onClick={() => openWithPromise('existing-simple', ExistingSimpleModal)}
                        className="text-xs hover:cursor-pointer"
                    >
                        1. Existing Simple (Default Shell)
                    </Button>
                    <Button
                        onClick={() => openWithPromise('fully-composed', FullyComposedModal)}
                        className="text-xs hover:cursor-pointer"
                    >
                        2. Fully Composed (All subcomponents)
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => openWithPromise('wrapper-only', WrapperOnlyModal)}
                        className="text-xs hover:cursor-pointer"
                    >
                        3. Wrapper Only (Arbitrary Children)
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => openWithPromise('headerless', HeaderlessModal)}
                        className="text-xs hover:cursor-pointer"
                    >
                        4. Headerless Custom
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => openWithPromise('titleless', TitlelessModal)}
                        className="text-xs hover:cursor-pointer"
                    >
                        5. Custom Header (Titleless)
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => openWithPromise('closeless', CloselessModal)}
                        className="text-xs hover:cursor-pointer"
                    >
                        6. Locked (No Close button)
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => openWithPromise('footerless', FooterlessModal)}
                        className="text-xs hover:cursor-pointer"
                    >
                        7. Footerless Custom
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => openWithPromise('scrolling-logs', ScrollingLogsModal)}
                        className="text-xs hover:cursor-pointer"
                    >
                        8. Vertical Scrolling Content (DialogContent Overflow)
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => openWithPromise('fully-composed', FullyComposedModal, { drawerAt: 1200 })}
                        className="text-xs hover:cursor-pointer flex items-center justify-center gap-1.5 sm:col-span-2"
                    >
                        <Smartphone className="h-3.5 w-3.5" />
                        9. Drawer Mode (Wide break 1200px)
                    </Button>
                </div>

                {log && (
                    <Card className="bg-card border-border/60 shadow-xs animate-in fade-in-0 duration-200">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2 space-y-0">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <CardTitle className="text-sm font-semibold">Callback Resolution Monitor</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs">
                            <div className="p-3 rounded-lg border bg-muted/40 font-mono text-foreground break-all">
                                {log}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
export default DialogCompoundDemo;
