import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreHorizontal, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { OverflowListProps, ScrollDirection } from './overflow-list.types';

export function OverflowList<T>(props: OverflowListProps<T>) {
    const {
        items,
        renderItem,
        renderMore,
        moreTrigger,
        overflow = 'scroll',
        direction = 'horizontal',
        scrollBehavior = 'smooth',
        scrollStep = 'half',
        arrowTransitionDuration = 'duration-200',
        className,
        listContainerClassName,
        moreClassName,
        renderScrollArrow,
        renderScrollGradient,
        activeId,
        isActive,
    } = props;

    const isVertical = direction === 'vertical';

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const moreRef = React.useRef<HTMLDivElement>(null);

    // Scroll metrics
    const [isOverflowing, setIsOverflowing] = React.useState(false);
    const [showStartArrow, setShowStartArrow] = React.useState(false);
    const [showEndArrow, setShowEndArrow] = React.useState(false);

    // Dropdown visible count
    const [visibleCount, setVisibleCount] = React.useState(items.length);

    // ─── Trigger & Dropdown Resolution ──────────────────────────────
    const resolveMoreTrigger = (collapsedItems: T[]) => {
        if (typeof moreTrigger === 'function') {
            return moreTrigger(collapsedItems.length);
        }
        if (moreTrigger) {
            return moreTrigger;
        }
        return (
            <button
                className={cn(
                    'flex h-8 items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:text-foreground hover:bg-accent hover:cursor-pointer transition-colors',
                    isVertical ? 'w-full gap-2 px-3' : 'w-8'
                )}
                aria-label="More actions"
            >
                {isVertical ? (
                    <>
                        <MoreVertical className="h-4 w-4" />
                        <span className="text-xs font-medium">More ({collapsedItems.length})</span>
                    </>
                ) : (
                    <MoreHorizontal className="h-4 w-4" />
                )}
            </button>
        );
    };

    const renderMoreContent = (collapsedItems: T[]) => {
        const triggerNode = resolveMoreTrigger(collapsedItems);

        if (renderMore) {
            return renderMore(collapsedItems, triggerNode);
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {triggerNode}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align={isVertical ? 'start' : 'end'}
                    className="w-56 max-h-64 overflow-y-auto"
                >
                    {collapsedItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {renderItem(item, index, true)}
                        </React.Fragment>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    // ─── Scroll Detection ────────────────────────────────────────────
    const checkScroll = React.useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        if (isVertical) {
            const overflowed = el.scrollHeight > el.clientHeight;
            setIsOverflowing(overflowed);

            setShowStartArrow(overflowed && el.scrollTop > 1);
            setShowEndArrow(
                overflowed &&
                    Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight - 1
            );
        } else {
            const overflowed = el.scrollWidth > el.clientWidth;
            setIsOverflowing(overflowed);

            setShowStartArrow(overflowed && el.scrollLeft > 1);
            setShowEndArrow(
                overflowed &&
                    Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1
            );
        }
    }, [isVertical]);

    React.useEffect(() => {
        if (overflow === 'dropdown') return;
        
        checkScroll();
        const el = scrollContainerRef.current;
        if (el) el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        return () => {
            if (el) el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll, items, overflow]);

    const handleArrowScroll = (dir: ScrollDirection) => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const viewportSize = isVertical ? el.clientHeight : el.clientWidth;
        const stepValue =
            scrollStep === 'half'
                ? viewportSize / 2
                : scrollStep === 'page'
                ? viewportSize
                : scrollStep;

        if (isVertical) {
            el.scrollBy({
                top: dir === 'top' ? -stepValue : stepValue,
                behavior: scrollBehavior,
            });
        } else {
            el.scrollBy({
                left: dir === 'left' ? -stepValue : stepValue,
                behavior: scrollBehavior,
            });
        }
    };

    // ─── Dropdown Collapsing (Measurement) ───────────────────────────
    React.useEffect(() => {
        if (overflow !== 'dropdown') return;

        const measure = () => {
            const container = containerRef.current;
            if (!container) return;

            // Reset visibleCount temporarily to render all items for measurement
            setVisibleCount(items.length);

            requestAnimationFrame(() => {
                const updatedContainer = containerRef.current;
                if (!updatedContainer) return;

                // Measure actual More element size if present, fallback to defaults (70px horizontal, 40px vertical)
                let moreSize = isVertical ? 40 : 70;
                if (moreRef.current) {
                    moreSize = isVertical
                        ? moreRef.current.offsetHeight
                        : moreRef.current.offsetWidth;
                }

                const availableSpace = isVertical
                    ? updatedContainer.clientHeight - moreSize
                    : updatedContainer.clientWidth - moreSize;

                let totalSpace = 0;
                let count = 0;

                const children = Array.from(updatedContainer.children) as HTMLElement[];
                for (const child of children) {
                    if (child.getAttribute('data-ignore-measure') === 'true') continue;
                    
                    const childSize = isVertical
                        ? child.offsetHeight + 6
                        : child.offsetWidth + 6;
                    totalSpace += childSize;
                    if (totalSpace > availableSpace) break;
                    count++;
                }

                setVisibleCount(count > 0 ? count : 1);
            });
        };

        const observer = new ResizeObserver(measure);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        measure();

        return () => observer.disconnect();
    }, [items, overflow, isVertical]);

    // ─── Scroll Active Item Into View ────────────────────────────────
    React.useEffect(() => {
        if (overflow === 'dropdown') return;

        requestAnimationFrame(() => {
            const container = scrollContainerRef.current;
            if (!container) return;

            const activeEl = container.querySelector(
                '[data-state="active"], .active, [aria-selected="true"]'
            ) as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({
                    behavior: scrollBehavior,
                    block: 'nearest',
                    inline: 'nearest',
                });
            }
        });
    }, [activeId, overflow, scrollBehavior]);

    // ─── Renderers ───────────────────────────────────────────────────

    // Mode: Dropdown Menu
    if (overflow === 'dropdown') {
        let visibleItems = items.slice();
        let hiddenItems: T[] = [];

        const activeIndex = isActive ? items.findIndex((item) => isActive(item)) : -1;
        if (activeIndex !== -1 && activeIndex >= visibleCount) {
            const rearranged = [...items];
            const activeItem = rearranged[activeIndex];
            rearranged.splice(activeIndex, 1);
            rearranged.splice(visibleCount - 1, 0, activeItem);

            visibleItems = rearranged.slice(0, visibleCount);
            hiddenItems = rearranged.slice(visibleCount);
        } else {
            visibleItems = items.slice(0, visibleCount);
            hiddenItems = items.slice(visibleCount);
        }

        return (
            <div
                ref={containerRef}
                className={cn(
                    'relative flex justify-start gap-1.5',
                    isVertical ? 'h-full flex-col items-start' : 'w-full flex-row items-center',
                    className
                )}
            >
                {visibleItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {renderItem(item, index, false)}
                    </React.Fragment>
                ))}

                {hiddenItems.length > 0 && (
                    <div
                        ref={moreRef}
                        data-ignore-measure="true"
                        className={cn('flex items-center', moreClassName)}
                    >
                        {renderMoreContent(hiddenItems)}
                    </div>
                )}
            </div>
        );
    }

    // Modes: Scroll & Both
    const isBoth = overflow === 'both';
    const showMore = isBoth && isOverflowing;

    const startDir: ScrollDirection = isVertical ? 'top' : 'left';
    const endDir: ScrollDirection = isVertical ? 'bottom' : 'right';

    const defaultScrollArrow = (dir: ScrollDirection, onClick: () => void, isVisible: boolean) => {
        let Icon = ChevronRight;
        if (dir === 'left') Icon = ChevronLeft;
        if (dir === 'top') Icon = ChevronUp;
        if (dir === 'bottom') Icon = ChevronDown;

        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
                disabled={!isVisible}
                className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border bg-background text-foreground shadow-xs hover:bg-accent hover:cursor-pointer transition-opacity',
                    arrowTransitionDuration,
                    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
            >
                <Icon className="h-3.5 w-3.5" />
            </button>
        );
    };

    const defaultScrollGradient = (dir: ScrollDirection, isVisible: boolean) => {
        let gradientClasses = '';
        if (dir === 'left') {
            gradientClasses = 'left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent pr-4';
        } else if (dir === 'right') {
            gradientClasses = cn(
                'top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent pl-4',
                showMore ? 'right-10' : 'right-0'
            );
        } else if (dir === 'top') {
            gradientClasses = 'top-0 left-0 right-0 h-10 bg-gradient-to-b from-background to-transparent pb-4';
        } else if (dir === 'bottom') {
            gradientClasses = cn(
                'left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pt-4',
                showMore ? 'bottom-10' : 'bottom-0'
            );
        }

        return (
            <div
                className={cn(
                    'absolute z-10 pointer-events-none transition-opacity',
                    arrowTransitionDuration,
                    gradientClasses,
                    isVisible ? 'opacity-100' : 'opacity-0'
                )}
            />
        );
    };

    return (
        <div
            className={cn(
                'group relative flex justify-start',
                isVertical ? 'h-full flex-col items-stretch' : 'w-full flex-row items-center',
                className
            )}
        >
            {/* Start fade gradient (Left or Top) */}
            {renderScrollGradient
                ? renderScrollGradient(startDir, showStartArrow)
                : defaultScrollGradient(startDir, showStartArrow)}

            {/* Start scroll arrow (visible on hover) */}
            <div
                className={cn(
                    'absolute z-20 flex transition-opacity',
                    arrowTransitionDuration,
                    isVertical ? 'top-1 left-1/2 -translate-x-1/2 items-center' : 'left-1 h-full items-center',
                    showStartArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                )}
            >
                {renderScrollArrow
                    ? renderScrollArrow(startDir, () => handleArrowScroll(startDir), showStartArrow)
                    : defaultScrollArrow(startDir, () => handleArrowScroll(startDir), showStartArrow)}
            </div>

            {/* Scrollable list content */}
            <div
                ref={scrollContainerRef}
                className={cn(
                    'no-scrollbar relative flex justify-start scroll-smooth gap-1.5',
                    isVertical
                        ? 'h-full flex-col overflow-y-auto'
                        : 'w-full flex-row overflow-x-auto',
                    isVertical && showMore ? 'pb-12' : '',
                    !isVertical && showMore ? 'pr-12' : '',
                    listContainerClassName
                )}
            >
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {renderItem(item, index, false)}
                    </React.Fragment>
                ))}
            </div>

            {/* End scroll arrow (visible on hover) */}
            <div
                className={cn(
                    'absolute z-20 flex transition-opacity',
                    arrowTransitionDuration,
                    isVertical
                        ? cn('left-1/2 -translate-x-1/2 items-center', showMore ? 'bottom-11' : 'bottom-1')
                        : cn('h-full items-center', showMore ? 'right-11' : 'right-1'),
                    showEndArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                )}
            >
                {renderScrollArrow
                    ? renderScrollArrow(endDir, () => handleArrowScroll(endDir), showEndArrow)
                    : defaultScrollArrow(endDir, () => handleArrowScroll(endDir), showEndArrow)}
            </div>

            {/* End fade gradient (Right or Bottom) */}
            {renderScrollGradient
                ? renderScrollGradient(endDir, showEndArrow)
                : defaultScrollGradient(endDir, showEndArrow)}

            {/* More dropdown button in both mode */}
            {showMore && (
                <div
                    ref={moreRef}
                    data-ignore-measure="true"
                    className={cn(
                        'absolute z-30 flex items-center bg-background',
                        isVertical
                            ? 'bottom-0 left-0 right-0 justify-center pt-1 border-t border-border'
                            : 'top-0 bottom-0 right-0 pl-1 border-l border-border',
                        moreClassName
                    )}
                >
                    {renderMoreContent(items.slice())}
                </div>
            )}
        </div>
    );
}
OverflowList.displayName = 'OverflowList';
