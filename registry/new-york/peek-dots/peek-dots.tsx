import * as React from 'react';
import { cn } from '@/lib/utils';

type RenderItemArgs<T> = { value: T; index: number };
type TitlebarRenderArgs = { total: number };

export interface PeekDotsProps<T> extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
    values: T[];
    children: (args: RenderItemArgs<T>) => React.ReactNode;
    titlebar?: React.ReactNode | ((args: TitlebarRenderArgs) => React.ReactNode);
    allowDot?: boolean;
    dotClickable?: boolean;

    titlebarClassName?: string;
    scrollerClassName?: string;
    itemClassName?: string;
    dotsClassName?: string;
    dotClassName?: string;
    activeDotClassName?: string;
}

function computeState(scroller: HTMLElement) {
    const viewport = scroller.getBoundingClientRect();
    const children = Array.from(scroller.children) as HTMLElement[];

    const hiddenLeftSet = new Set<number>();
    const hiddenRightSet = new Set<number>();

    children.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.left < viewport.left) hiddenLeftSet.add(i);
        if (r.right > viewport.right) hiddenRightSet.add(i);
    });

    const hiddenLeft = hiddenLeftSet.size;
    const hiddenTotal = new Set([...hiddenLeftSet, ...hiddenRightSet]).size;

    const leftTargets = children.map((el) => {
        const leftInContent = el.offsetLeft - scroller.offsetLeft;
        return leftInContent;
    });

    return { hiddenLeft, hiddenTotal, leftTargets, count: children.length };
}

export function PeekDots<T>({
    values,
    children,
    titlebar,
    allowDot = true,
    dotClickable = true,
    className,
    titlebarClassName,
    scrollerClassName,
    itemClassName,
    dotsClassName,
    dotClassName,
    activeDotClassName,
    ...props
}: PeekDotsProps<T>) {
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const [{ hiddenLeft, hiddenTotal, leftTargets }, setState] = React.useState<{
        hiddenLeft: number;
        hiddenTotal: number;
        leftTargets: number[];
    }>({ hiddenLeft: 0, hiddenTotal: 0, leftTargets: [] });

    const recompute = React.useCallback(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        const { hiddenLeft, hiddenTotal, leftTargets } = computeState(scroller);
        const clampedLeft = hiddenTotal > 0 ? Math.min(hiddenTotal - 1, hiddenLeft) : 0;
        setState({ hiddenLeft: clampedLeft, hiddenTotal, leftTargets });
    }, []);

    React.useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const raf = requestAnimationFrame(recompute);
        const ro = new ResizeObserver(recompute);
        ro.observe(scroller);

        const onScroll = () => recompute();
        scroller.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', recompute);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            scroller.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', recompute);
        };
    }, [recompute]);

    const total = values.length;
    const renderTitle = typeof titlebar === 'function' ? (titlebar as (a: TitlebarRenderArgs) => React.ReactNode)({ total }) : titlebar;

    const activeIndex = hiddenTotal > 0 ? hiddenLeft : 0;

    const handleDotClick = (i: number) => {
        if (!dotClickable) return;
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const target = leftTargets[i] ?? 0;
        scroller.scrollTo({ left: target, behavior: 'smooth' });
    };

    return (
        <div className={cn('flex flex-col gap-3', className)} {...props}>
            {renderTitle ? <div className={cn('', titlebarClassName)}>{renderTitle}</div> : null}

            <div className="relative">
                <div
                    ref={scrollerRef}
                    className={cn('scrollbar-none flex items-center gap-4 overflow-auto snap-x snap-mandatory', scrollerClassName)}
                >
                    {values.map((value, index) => (
                        <div key={index} className={cn('flex-shrink-0 snap-start', itemClassName)}>
                            {children({ value, index })}
                        </div>
                    ))}
                </div>

                {allowDot && hiddenTotal > 0 && (
                    <div className={cn('mt-3 flex items-center justify-center gap-2', dotsClassName)} role="tablist" aria-label="Carousel position">
                        {Array.from({ length: hiddenTotal }).map((_, i) => {
                            const isActive = i === activeIndex;
                            return (
                                <button
                                    type="button"
                                    key={i}
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => handleDotClick(i)}
                                    className={cn(
                                        'block h-1.5 w-1.5 rounded-full bg-foreground/30 outline-none transition-all duration-200',
                                        isActive && 'w-4 bg-foreground/70',
                                        dotClassName,
                                        isActive && activeDotClassName
                                    )}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

PeekDots.displayName = 'PeekDots';
export default PeekDots;
