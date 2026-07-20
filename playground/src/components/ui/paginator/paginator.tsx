import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type Mode = 'index' | 'page';
type NavigateType = 'goto' | 'next' | 'previous';

export type PaginatorToken =
    | 'PageInfo'
    | 'PageCount'
    | 'Total'
    | 'Range'
    | 'RowsPerPage'
    | 'First'
    | 'Prev'
    | 'PrevJump'
    | 'PageLinks'
    | 'PageNumber'
    | 'PageInput'
    | 'Next'
    | 'NextJump'
    | 'Last'
    | 'Spacer'
    | 'FlexSpacer'
    | 'Divider';

export type RenderPaginatorCtx<T> = {
    page: number; // 1-based
    pageCount: number; // total pages
    goto: (page: number) => void;
    next: () => void;
    previous: () => void;
    pageSize?: number; // only in page mode
    setPageSize?: (n: number) => void;
    source: readonly T[];
};

export type ChildCtx<T> = {
    index: number; // 0-based
    values: readonly T[];
    goto: (i: number) => void; // 0-based
    next: () => void;
    previous: () => void;
};

export type PaginatorProps<T> = {
    values: readonly T[];
    totalRecords?: number; // server-side total override for lazy loading

    defaultIndex?: number;
    mode?: Mode;

    pageSize?: number; // page mode
    rowsPerPageOptions?: number[]; // page mode

    pageLinkCount?: number; // visible numeric page links (PageLinks)
    jumpSize?: number; // how far PrevJump/NextJump move

    onIndexChange?: (index: number) => void;
    onPageSizeChange?: (size: number) => void;
    onNavigate?: (type: NavigateType, nextIndex: number) => void;

    renderPaginator?: (ctx: RenderPaginatorCtx<T>) => React.ReactNode;

    order?: PaginatorToken[] | string;
    orderZones?: { left?: PaginatorToken[] | string; right?: PaginatorToken[] | string };
    renderPiece?: Partial<Record<PaginatorToken, (ctx: RenderPaginatorCtx<T>) => React.ReactNode>>;

    position?: 'top' | 'bottom' | 'both' | 'none';

    className?: string;
    paginatorContainerClassName?: string;
    paginatorClassName?: string;

    pageInfoClassName?: string;
    pageCountClassName?: string;
    totalClassName?: string;
    rangeClassName?: string;

    rowSelectionContainerClassName?: string;

    navContainerClassName?: string;
    currentPageClassName?: string;

    pageLinksContainerClassName?: string;
    pageLinkButtonClassName?: string;
    pageLinkActiveClassName?: string;

    pageInputContainerClassName?: string;
    pageInputInputClassName?: string;

    dividerClassName?: string;
    spacerClassName?: string;
    flexSpacerClassName?: string;

    children?: (ctx: ChildCtx<T>) => React.ReactNode;
};

function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
}

function parseTemplate(input: PaginatorToken[] | string | undefined, fallback: PaginatorToken[]): PaginatorToken[] {
    if (!input) return fallback;
    if (Array.isArray(input)) return input;
    return (input || '')
        .split(/\s+/)
        .map((s) => s.trim())
        .filter(Boolean) as PaginatorToken[];
}

export function Paginator<T>(props: PaginatorProps<T>) {
    const {
        values,
        totalRecords,
        defaultIndex = 0,
        mode = 'page',
        pageSize: pageSizeProp = 10,
        rowsPerPageOptions = [10, 20, 50, 100],

        pageLinkCount = 5,
        jumpSize: jumpSizeProp,

        onIndexChange,
        onPageSizeChange,
        onNavigate,

        renderPaginator,
        order,
        orderZones,
        renderPiece,
        position = 'bottom',

        className,
        paginatorContainerClassName,
        paginatorClassName,

        pageInfoClassName,
        pageCountClassName,
        totalClassName,
        rangeClassName,

        rowSelectionContainerClassName,

        navContainerClassName,
        currentPageClassName,

        pageLinksContainerClassName,
        pageLinkButtonClassName,
        pageLinkActiveClassName,

        pageInputContainerClassName,
        pageInputInputClassName,

        dividerClassName,
        spacerClassName,
        flexSpacerClassName,

        children,
    } = props;

    const total = totalRecords !== undefined ? totalRecords : values.length;

    const [index, setIndex] = useState<number>(() =>
        clamp(defaultIndex, 0, Math.max(0, (mode === 'index' ? total : Math.ceil(total / pageSizeProp)) - 1)),
    );
    const [pageSize, setPageSize] = useState<number>(pageSizeProp);

    const jumpSize = jumpSizeProp ?? pageLinkCount;

    useEffect(() => {
        if (mode === 'page') {
            const pc = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
            setIndex((prev) => clamp(prev, 0, pc - 1));
        } else {
            setIndex((prev) => clamp(prev, 0, Math.max(0, total - 1)));
        }
    }, [mode, total, pageSize]);

    useEffect(() => {
        onIndexChange?.(index);
    }, [index, onIndexChange]);

    const pageCount = useMemo<number>(() => {
        if (mode === 'page') return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
        return total;
    }, [mode, total, pageSize]);

    const page1 = index + 1;

    // Slice for child
    const currentValues = useMemo<readonly T[]>(() => {
        if (mode === 'page') {
            const start = index * pageSize;
            const end = start + pageSize;
            return values.slice(start, end);
        }
        return values;
    }, [mode, values, index, pageSize]);

    // Internal navigation (0-based)
    const goto0 = useCallback(
        (nextIdx: number) => {
            const clamped = clamp(nextIdx, 0, pageCount - 1);
            if (clamped === index) return;
            onNavigate?.('goto', clamped);
            setIndex(clamped);
        },
        [index, onNavigate, pageCount],
    );

    const next0 = useCallback(() => {
        const clamped = clamp(index + 1, 0, pageCount - 1);
        if (clamped === index) return;
        onNavigate?.('next', clamped);
        setIndex(clamped);
    }, [index, onNavigate, pageCount]);

    const previous0 = useCallback(() => {
        const clamped = clamp(index - 1, 0, pageCount - 1);
        if (clamped === index) return;
        onNavigate?.('previous', clamped);
        setIndex(clamped);
    }, [index, onNavigate, pageCount]);

    // 1-based helpers
    const goto1 = useCallback((p: number) => goto0(p - 1), [goto0]);
    const next = useCallback(() => next0(), [next0]);
    const previous = useCallback(() => previous0(), [previous0]);

    // Change page size
    const handleChangePageSize = useCallback(
        (n: number) => {
            setPageSize((prev) => {
                if (prev === n) return prev;
                onPageSizeChange?.(n);
                return n;
            });
        },
        [onPageSizeChange],
    );

    // Stats for Range token
    const range = useMemo(() => {
        if (mode === 'page') {
            const start = (page1 - 1) * pageSize + 1;
            const end = Math.min(start + pageSize - 1, total);
            return { start, end, total };
        }
        return { start: page1, end: page1, total };
    }, [mode, page1, pageSize, total]);

    // Numbered page links window
    const pageWindow = useMemo(() => {
        const half = Math.floor(pageLinkCount / 2);
        let start = clamp(page1 - half, 1, Math.max(1, pageCount - pageLinkCount + 1));
        let end = Math.min(pageCount, start + pageLinkCount - 1);
        start = Math.max(1, end - pageLinkCount + 1);
        return { start, end };
    }, [page1, pageCount, pageLinkCount]);

    const tokenCtx: RenderPaginatorCtx<T> = useMemo(
        () => ({
            page: page1,
            pageCount,
            goto: goto1,
            next,
            previous,
            pageSize: mode === 'page' ? pageSize : undefined,
            setPageSize: mode === 'page' ? handleChangePageSize : undefined,
            source: values,
        }),
        [page1, pageCount, goto1, next, previous, mode, pageSize, handleChangePageSize, values],
    );

    const defaultPieces: Record<PaginatorToken, () => React.ReactNode> = {
        PageInfo: () => (
            <div className={cn('text-sm text-muted-foreground', pageInfoClassName)}>
                Page {page1} of {pageCount}
            </div>
        ),

        PageCount: () => <div className={cn('text-sm text-muted-foreground', pageCountClassName)}>{pageCount}</div>,

        Total: () => <div className={cn('text-sm text-muted-foreground', totalClassName)}>{total}</div>,

        Range: () => (
            <div className={cn('text-sm text-muted-foreground', rangeClassName)}>
                {range.start}&ndash;{range.end} of {range.total}
            </div>
        ),

        RowsPerPage: () =>
            mode === 'page' ? (
                <div className={cn('flex items-center gap-2 text-sm', rowSelectionContainerClassName)}>
                    <span>Rows:</span>
                    <Select value={String(pageSize)} onValueChange={(v) => handleChangePageSize(Number(v))}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue className="text-sm" placeholder={String(pageSize)} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {rowsPerPageOptions.map((n) => (
                                    <SelectItem className="text-sm cursor-pointer" key={n} value={String(n)}>
                                        {n}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            ) : null,

        First: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:cursor-pointer" onClick={() => goto1(1)} disabled={page1 <= 1}>
                <ChevronsLeft className="h-4 w-4" />
            </Button>
        ),

        Prev: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:cursor-pointer" onClick={() => goto1(page1 - 1)} disabled={page1 <= 1}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
        ),

        PrevJump: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:cursor-pointer" onClick={() => goto1(page1 - jumpSize)} disabled={page1 <= 1}>
                <ChevronsLeft className="h-4 w-4 opacity-50" />
            </Button>
        ),

        PageLinks: () => {
            const nodes: React.ReactNode[] = [];
            const { start, end } = pageWindow;

            if (start > 1) {
                nodes.push(
                    <Button key="p1" variant="ghost" size="icon" className={cn('h-8 w-8 hover:cursor-pointer', pageLinkButtonClassName)} onClick={() => goto1(1)}>
                        1
                    </Button>,
                );
                if (start > 2) {
                    nodes.push(
                        <span key="lead-ellipsis" className="px-1 text-muted-foreground select-none">
                            …
                        </span>,
                    );
                }
            }

            for (let p = start; p <= end; p++) {
                const active = p === page1;
                nodes.push(
                    <Button
                        key={`p-${p}`}
                        variant={active ? 'secondary' : 'ghost'}
                        size="icon"
                        className={cn('h-8 w-8 hover:cursor-pointer', pageLinkButtonClassName, active && pageLinkActiveClassName)}
                        onClick={() => goto1(p)}
                        aria-current={active ? 'page' : undefined}
                    >
                        {p}
                    </Button>,
                );
            }

            if (end < pageCount) {
                if (end < pageCount - 1) {
                    nodes.push(
                        <span key="trail-ellipsis" className="px-1 text-muted-foreground select-none">
                            …
                        </span>,
                    );
                }
                nodes.push(
                    <Button
                        key={`p-${pageCount}`}
                        variant="ghost"
                        size="icon"
                        className={cn('h-8 w-8 hover:cursor-pointer', pageLinkButtonClassName)}
                        onClick={() => goto1(pageCount)}
                    >
                        {pageCount}
                    </Button>,
                );
            }

            return <div className={cn('flex items-center gap-1', pageLinksContainerClassName)}>{nodes}</div>;
        },

        PageNumber: () => <span className={cn('px-2 text-sm font-medium tabular-nums', currentPageClassName)}>{page1}</span>,

        PageInput: () => {
            const [val, setVal] = useState<string>(String(page1));
            useEffect(() => setVal(String(page1)), [page1]);
            const commit = (raw: string) => {
                const n = Number(raw);
                if (Number.isFinite(n)) {
                    goto1(clamp(Math.trunc(n), 1, pageCount));
                } else {
                    setVal(String(page1));
                }
            };
            return (
                <div className={cn('ml-1 flex items-center gap-1.5', pageInputContainerClassName)}>
                    <Input
                        className={cn('h-8 w-12 px-1 text-center text-xs', pageInputInputClassName)}
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onBlur={() => commit(val)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur();
                        }}
                    />
                    <span className="text-xs text-muted-foreground select-none">/ {pageCount}</span>
                </div>
            );
        },

        Next: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:cursor-pointer" onClick={() => goto1(page1 + 1)} disabled={page1 >= pageCount}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        ),

        NextJump: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:cursor-pointer" onClick={() => goto1(page1 + jumpSize)} disabled={page1 >= pageCount}>
                <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
        ),

        Last: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:cursor-pointer" onClick={() => goto1(pageCount)} disabled={page1 >= pageCount}>
                <ChevronsRight className="h-4 w-4" />
            </Button>
        ),

        Spacer: () => <span className={cn('inline-block w-2', spacerClassName)} aria-hidden="true" />,

        FlexSpacer: () => <span className={cn('flex-1', flexSpacerClassName)} aria-hidden="true" />,

        Divider: () => <span className={cn('mx-2 inline-block h-4 w-px bg-border', dividerClassName)} aria-hidden="true" />,
    };

    const renderToken = (token: PaginatorToken): React.ReactNode => {
        const custom = renderPiece?.[token];
        if (custom) return custom(tokenCtx);
        return defaultPieces[token]();
    };

    const defaultSingleRow = parseTemplate(order, [
        'Range',
        'Spacer',
        'RowsPerPage',
        'Divider',
        'First',
        'Prev',
        'PrevJump',
        'PageLinks',
        'NextJump',
        'Next',
        'Last',
    ]);

    const defaultLeft = parseTemplate(orderZones?.left, ['Range']);
    const defaultRight = parseTemplate(orderZones?.right, ['RowsPerPage', 'First', 'Prev', 'PrevJump', 'PageLinks', 'NextJump', 'Next', 'Last']);

    const DefaultPaginator = React.useCallback(() => {
        const zones = !!orderZones;
        return (
            <div className={cn('mt-3', paginatorContainerClassName)}>
                <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', paginatorClassName)}>
                    {zones ? (
                        <div className="flex items-center gap-2">
                            {defaultLeft.map((t, i) => (
                                <React.Fragment key={`${t}-${i}`}>{renderToken(t)}</React.Fragment>
                            ))}
                        </div>
                    ) : null}

                    <div className={cn('flex items-center gap-2', navContainerClassName)}>
                        {(zones ? defaultRight : defaultSingleRow).map((t, i) => (
                            <React.Fragment key={`${t}-${i}`}>{renderToken(t)}</React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    }, [orderZones, paginatorContainerClassName, paginatorClassName, navContainerClassName, defaultLeft, defaultRight, defaultSingleRow]);

    const renderBar = useCallback(() => {
        if (position === 'none') return null;
        return renderPaginator?.(tokenCtx) ?? <DefaultPaginator />;
    }, [position, renderPaginator, tokenCtx, DefaultPaginator]);

    const top = position === 'top' || position === 'both';
    const bottom = position === 'bottom' || position === 'both';

    if (total === 0) return null;

    return (
        <div className={cn('w-full', className)}>
            {top && renderBar()}
            {children?.({ index, values: currentValues, goto: goto0, next: next0, previous: previous0 })}
            {bottom && renderBar()}
        </div>
    );
}
Paginator.displayName = 'Paginator';
