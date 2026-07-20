import Actions, { type ActionItem } from './actions';
import Toolbox from './toolbox';

export interface BulkToolbarProps {
    selectedCount: number;
    items: ActionItem[];
    totalCount: number;
    className?: string;
    noun?: string;
}

export function BulkToolbar({
    selectedCount,
    items,
    totalCount,
    className,
    noun = 'Items',
}: BulkToolbarProps) {
    if (selectedCount > 0) {
        return (
            <Toolbox.Group className={className}>
                <Actions.Toolbar selectedCount={selectedCount} items={items} />
            </Toolbox.Group>
        );
    }

    return (
        <Toolbox.Item className={className}>
            <div className="text-sm text-muted-foreground font-medium">
                {totalCount} {noun}
            </div>
        </Toolbox.Item>
    );
}

export default BulkToolbar;
