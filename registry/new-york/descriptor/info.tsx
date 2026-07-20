import * as React from 'react';
import { Text } from '@/components/ui/text';
import Visual from '@/components/ui/visual';
import type { VisualProps } from '@/components/ui/visual';
import { cn } from '@/lib/utils';

export type Direction = 'row' | 'row-reverse' | 'col' | 'col-reverse';

export interface InfoProps {
    title: React.ReactNode;
    desc?: React.ReactNode;
    className?: string;

    /** Layout */
    direction?: Direction; // default: 'col'
    gap?: number | string; // default: 12 (px)

    /** Visual (preferred) or icon (fallback) */
    visual?: VisualProps;
    icon?: React.ReactNode;

    /** Quick tweaks for the visual box */
    visualSize?: number | string; // width; if no ratio -> square
    visualClassName?: string;
    iconContainerClassName?: string;
    /** Text class overrides */
    titleClassName?: string;
    descClassName?: string;
}

export const Info: React.FC<InfoProps> = ({
    title,
    desc,
    className,
    direction = 'col',
    gap = 12,
    visual,
    icon,
    visualSize,
    visualClassName,
    titleClassName,
    iconContainerClassName,
    descClassName,
}) => {
    const stack = direction.startsWith('col');
    const visualComponent = visual ? (
        <Visual {...visual} size={visual.size ?? visualSize} className={cn(visual.className, visualClassName)} />
    ) : (
        icon ?? null
    );

    return (
        <div
            className={cn(
                'flex *:!select-text',
                stack ? 'flex-col items-start' : 'flex-row items-center',
                direction === 'row-reverse' && 'flex-row-reverse',
                direction === 'col-reverse' && 'flex-col-reverse',
                className,
            )}
            style={{ gap: typeof gap === 'number' ? `${gap}px` : gap }}
        >
            {visualComponent ? <span className={cn(!stack && 'self-start', iconContainerClassName)}>{visualComponent}</span> : null}

            <div className="flex flex-col">
                <Text weight={600} dark capitalise className={cn('text-sm text-foreground', titleClassName)}>
                    {title}
                </Text>
                {desc != null && desc !== '' && <Text className={cn('text-muted-foreground', descClassName)}>{desc}</Text>}
            </div>
        </div>
    );
};
Info.displayName = 'Info';
