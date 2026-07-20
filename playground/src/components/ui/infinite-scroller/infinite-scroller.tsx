import { cn } from '@/lib/utils';
import * as React from 'react';

type Dir = 'left' | 'right' | 'up' | 'down';

interface InfiniteScrollerProps<T = string | React.ReactNode> {
    items: T[];
    direction?: Dir;
    speed?: number;
    gapClassName?: string;
    pauseOnHover?: boolean;
    renderItem?: (item: T, idx: number) => React.ReactNode;
    render?: (item: T, idx: number) => React.ReactNode;
    template?: (item: T, idx: number) => React.ReactNode;
    className?: string;
    pillClassName?: string;
    initialDelay?: number;
}

export const InfiniteScroller = <T,>(props: InfiniteScrollerProps<T>) => {
    const {
        items,
        direction = 'left',
        speed = 80,
        gapClassName = 'gap-3',
        pauseOnHover = true,
        renderItem,
        render,
        template,
        className,
        pillClassName,
        initialDelay = 0,
    } = props;

    const isVertical = direction === 'up' || direction === 'down';
    const reverse = direction === 'right' || direction === 'down';

    const laneRef = React.useRef<HTMLDivElement>(null);
    const [duration, setDuration] = React.useState<number>(12);

    React.useLayoutEffect(() => {
        const measure = () => {
            const lane = laneRef.current;
            if (!lane) return;
            const rect = lane.getBoundingClientRect();
            const distance = isVertical ? rect.height : rect.width;
            if (distance > 0) setDuration(distance / Math.max(1, speed));
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (laneRef.current) {
            ro.observe(laneRef.current);
        }
        window.addEventListener('resize', measure);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [isVertical, speed, items.length]);

    const defaultRender = (item: any, i: number) =>
        typeof item === 'string' || typeof item === 'number' ? (
            <span
                key={i}
                className={cn(
                    'shrink-0 rounded-xl px-3 py-1 text-sm font-medium',
                    'bg-muted/50 text-foreground/80 ring-1 ring-border/50',
                    pillClassName,
                )}
            >
                {String(item)}
            </span>
        ) : (
            <span key={i} className={cn('shrink-0', pillClassName)}>
                {item}
            </span>
        );

    const renderer = renderItem ?? render ?? template ?? defaultRender;

    return (
        <div className={cn('relative overflow-hidden', isVertical ? 'h-40' : 'h-12', className)}>
            <style>{`
                @keyframes scroller-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes scroller-y { from { transform: translateY(0); } to { transform: translateY(-50%); } }
                .scroller-anim {
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    will-change: transform;
                }
                ${pauseOnHover ? `.scroller:hover .scroller-anim { animation-play-state: paused; }` : ''}
            `}</style>

            <div className={cn('scroller absolute inset-0 flex', isVertical ? 'flex-col justify-center' : 'items-center')}>
                <div className={cn('flex', isVertical ? 'flex-col' : 'flex-row', isVertical ? '' : 'whitespace-nowrap')}>
                    <div
                        ref={laneRef}
                        className={cn('scroller-anim flex', isVertical ? 'flex-col' : 'flex-row', gapClassName)}
                        style={{
                            animationName: isVertical ? 'scroller-y' : 'scroller-x',
                            animationDuration: `${duration}s`,
                            animationDirection: reverse ? ('reverse' as const) : 'normal',
                            animationDelay: `${initialDelay}s`,
                        }}
                    >
                        {items.map((it, i) => renderer(it, i))}
                    </div>

                    <div
                        className={cn('scroller-anim flex', isVertical ? 'flex-col' : 'flex-row', gapClassName)}
                        style={{
                            animationName: isVertical ? 'scroller-y' : 'scroller-x',
                            animationDuration: `${duration}s`,
                            animationDirection: reverse ? ('reverse' as const) : 'normal',
                            animationDelay: `${initialDelay}s`,
                        }}
                        aria-hidden
                    >
                        {items.map((it, i) => renderer(it, i))}
                    </div>
                </div>
            </div>
        </div>
    );
};
InfiniteScroller.displayName = 'InfiniteScroller';
