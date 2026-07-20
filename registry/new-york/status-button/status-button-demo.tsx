import { StatusButton } from './status-button';
import { RefreshCw } from 'lucide-react';

export default function StatusButtonDemo() {
    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto">
            {/* Standard status mapping matrix */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Standard Status Mapping</h2>
                <div className="flex flex-wrap gap-4">
                    <StatusButton status="success" defaultIcon="left" />
                    <StatusButton status="completed" defaultIcon="left" />
                    <StatusButton status="active" defaultIcon="left" />
                    <StatusButton status="pending" defaultIcon="left" />
                    <StatusButton status="warning" defaultIcon="left" />
                    <StatusButton status="failed" defaultIcon="left" />
                    <StatusButton status="error" defaultIcon="left" />
                    <StatusButton status="info" defaultIcon="left" />
                    <StatusButton status="draft" defaultIcon="left" />
                    <StatusButton status="inactive" defaultIcon="left" />
                    <StatusButton status="suspended" defaultIcon="left" />
                </div>
            </section>

            {/* Custom variant emphases */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Variant Emphases</h2>
                <div className="flex flex-wrap gap-4">
                    <StatusButton status="success" variant="solid" defaultIcon="left">Solid Success</StatusButton>
                    <StatusButton status="success" variant="soft" defaultIcon="left">Soft Success</StatusButton>
                    <StatusButton status="success" variant="outline" defaultIcon="left">Outline Success</StatusButton>
                    <StatusButton status="success" variant="ghost" defaultIcon="left">Ghost Success</StatusButton>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                    <StatusButton status="failed" variant="solid" defaultIcon="left">Solid Failed</StatusButton>
                    <StatusButton status="failed" variant="soft" defaultIcon="left">Soft Failed</StatusButton>
                    <StatusButton status="failed" variant="outline" defaultIcon="left">Outline Failed</StatusButton>
                    <StatusButton status="failed" variant="ghost" defaultIcon="left">Ghost Failed</StatusButton>
                </div>
            </section>

            {/* Custom sizing and icon overrides */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Sizing & Icon Overrides</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <StatusButton status="success" size="sm" defaultIcon="right">Small Right Icon</StatusButton>
                    <StatusButton status="pending" size="md" defaultIcon="right">Medium Right Icon</StatusButton>
                    <StatusButton status="failed" size="lg" defaultIcon="left">Large Left Icon</StatusButton>
                    <StatusButton status="info" size="xl" defaultIcon="left" leftIcon={<RefreshCw className="size-4 animate-spin" />}>
                        Custom Animated Left Icon
                    </StatusButton>
                </div>
            </section>
        </div>
    );
}
