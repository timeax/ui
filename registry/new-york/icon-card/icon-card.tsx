import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type IconLike = React.ReactNode | React.ComponentType<{ className?: string }>;

export interface IconCardProps extends React.ComponentPropsWithoutRef<'div'> {
    icon: IconLike;
    badgeSize?: number;
    badgeClassName?: string;
    contentClassName?: string;
    cardClassName?: string;
    cardStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

export const IconCard = React.forwardRef<HTMLDivElement, IconCardProps>(
    (
        {
            icon,
            badgeSize = 72,
            badgeClassName,
            className,
            style,
            cardClassName,
            cardStyle,
            children,
            contentClassName,
            ...cardProps
        },
        ref
    ) => {
        const badgeHalf = Math.ceil(badgeSize / 2);

        const renderIcon = () => {
            if (React.isValidElement(icon)) return icon;
            if (
                typeof icon === 'function' ||
                (icon && typeof icon === 'object' && ('render' in (icon as any) || '$$typeof' in (icon as any)))
            ) {
                const Comp = icon as React.ComponentType<{ className?: string }>;
                return <Comp className="size-8" />;
            }
            return <span className="text-sm">?</span>;
        };

        const mergedStyle: React.CSSProperties = {
            paddingTop: cardStyle?.paddingTop ?? badgeHalf + 16,
            ...cardStyle,
        };

        return (
            <div ref={ref} className={cn('relative flex flex-col', className)} style={style} {...cardProps}>
                {/* Icon badge */}
                <div
                    className={cn(
                        'absolute left-1/2 z-10 grid -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground border shadow-sm',
                        badgeClassName
                    )}
                    style={{ width: badgeSize, height: badgeSize, top: -badgeHalf }}
                >
                    {renderIcon()}
                </div>

                <Card
                    className={cn('h-full w-full bg-card px-6 pb-6 border', cardClassName)}
                    style={mergedStyle}
                >
                    <div className={cn('flex flex-col h-full', contentClassName)}>
                        {children}
                    </div>
                </Card>
            </div>
        );
    },
);

IconCard.displayName = 'IconCard';
export default IconCard;
