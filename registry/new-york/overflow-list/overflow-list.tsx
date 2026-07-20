import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { OverflowListProps } from './overflow-list.types';

export function OverflowList<T>(props: OverflowListProps<T>) {
    const {
        items,
        renderItem,
        renderMore,
        overflow = 'scroll',
        scrollBehavior = 'smooth',
        scrollStep = 'half',
        arrowTransitionDuration = 'duration-200',
        className,
        listContainerClassName,
        renderScrollArrow,
        renderScrollGradient,
        activeId,
        isActive,
    } = props;

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Scroll metrics
    const [isOverflowing, setIsOverflowing] = React.useState(false);
    const [showLeftArrow, setShowLeftArrow] = React.useState(false);
    const [showRightArrow, setShowRightArrow] = React.useState(false);

    // Dropdown visible count
    const [visibleCount, setVisibleCount] = React.useState(items.length);

    // ─── Scroll Detection ────────────────────────────────────────────
    const checkScroll = React.useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const overflowed = el.scrollWidth > el.clientWidth;
        setIsOverflowing(overflowed);

        setShowLeftArrow(overflowed && el.scrollLeft > 1);
        setShowRightArrow(
            overflowed &&
                Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1
        );
    }, []);

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

    const handleArrowScroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const stepValue =
            scrollStep === 'half'
                ? el.clientWidth / 2
                : scrollStep === 'page'
                ? el.clientWidth
                : scrollStep;

        el.scrollBy({
            left: direction === 'left' ? -stepValue : stepValue,
            behavior: scrollBehavior,
        });
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

                const availableWidth = updatedContainer.clientWidth - 70; // 70px buffer for "More..." button
                let totalWidth = 0;
                let count = 0;

                const children = Array.from(updatedContainer.children) as HTMLElement[];
                for (const child of children) {
                    if (child.getAttribute('data-ignore-measure') === 'true') continue;
                    
                    totalWidth += child.offsetWidth + 6; // item width + standard layout gaps/margins
                    if (totalWidth > availableWidth) break;
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
    }, [items, overflow]);

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
                    'relative flex w-full flex-row items-center justify-start gap-1.5',
                    className
                )}
            >
                {visibleItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {renderItem(item, index, false)}
                    </React.Fragment>
                ))}

                {hiddenItems.length > 0 && (
                    <div data-ignore-measure="true" className="flex items-center">
                        {renderMore(hiddenItems)}
                    </div>
                )}
            </div>
        );
    }

    // Modes: Scroll & Both
    const isBoth = overflow === 'both';
    const showMore = isBoth && isOverflowing;

    const defaultScrollArrow = (dir: 'left' | 'right', onClick: () => void, isVisible: boolean) => (
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
            {dir === 'left' ? (
                <ChevronLeft className="h-3.5 w-3.5" />
            ) : (
                <ChevronRight className="h-3.5 w-3.5" />
            )}
        </button>
    );

    const defaultScrollGradient = (dir: 'left' | 'right', isVisible: boolean) => (
        <div
            className={cn(
                'absolute top-0 bottom-0 z-10 pointer-events-none w-10 transition-opacity',
                arrowTransitionDuration,
                dir === 'left'
                    ? 'left-0 bg-gradient-to-r from-background to-transparent pr-4'
                    : cn('bg-gradient-to-l from-background to-transparent pl-4', showMore ? 'right-10' : 'right-0'),
                isVisible ? 'opacity-100' : 'opacity-0'
            )}
        />
    );

    return (
        <div className={cn('group relative flex w-full flex-row items-center justify-start', className)}>
            {/* Left fade gradient */}
            {renderScrollGradient
                ? renderScrollGradient('left', showLeftArrow)
                : defaultScrollGradient('left', showLeftArrow)}

            {/* Scroll arrow Left (visible on hover, only when scrollable left) */}
            <div
                className={cn(
                    'absolute left-1 z-20 flex h-full items-center transition-opacity',
                    arrowTransitionDuration,
                    showLeftArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                )}
            >
                {renderScrollArrow
                    ? renderScrollArrow('left', () => handleArrowScroll('left'), showLeftArrow)
                    : defaultScrollArrow('left', () => handleArrowScroll('left'), showLeftArrow)}
            </div>

            {/* Scrollable list content */}
            <div
                ref={scrollContainerRef}
                className={cn(
                    'no-scrollbar relative flex w-full flex-row justify-start overflow-x-auto scroll-smooth gap-1.5',
                    showMore ? 'pr-12' : '',
                    listContainerClassName
                )}
            >
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {renderItem(item, index, false)}
                    </React.Fragment>
                ))}
            </div>

            {/* Scroll arrow Right (visible on hover, only when scrollable right) */}
            <div
                className={cn(
                    'absolute z-20 flex h-full items-center transition-opacity',
                    arrowTransitionDuration,
                    showMore ? 'right-11' : 'right-1',
                    showRightArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                )}
            >
                {renderScrollArrow
                    ? renderScrollArrow('right', () => handleArrowScroll('right'), showRightArrow)
                    : defaultScrollArrow('right', () => handleArrowScroll('right'), showRightArrow)}
            </div>

            {/* Right fade gradient */}
            {renderScrollGradient
                ? renderScrollGradient('right', showRightArrow)
                : defaultScrollGradient('right', showRightArrow)}

            {/* More dropdown button in both mode */}
            {showMore && (
                <div
                    data-ignore-measure="true"
                    className="absolute top-0 bottom-0 right-0 z-30 flex items-center bg-background pl-1 border-l border-border"
                >
                    {renderMore(items.slice())}
                </div>
            )}
        </div>
    );
}
OverflowList.displayName = 'OverflowList';
