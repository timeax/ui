import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Table as UiTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';
import { StatusButton } from '@/components/ui/status-button';
import { formatColumnDate } from '@/components/ui/date-text';
import { ArrowUpDown, Loader2, ChevronRight, Columns3 } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { ColumnProps, SortOrder, MatchMode, RowGap, RowRadius, TableProps, CheckboxCellArgs, DisplayVariant } from './data-table.types';
import { useStickyOffsets } from './data-table.hooks';
import { GAP_MAP, RADIUS_MAP, alignCls, densityCell, isFrozenLeft, isFrozenRight, matchValue } from './data-table.utils';
import { Paginator } from '@/components/ui/paginator';

export function Column<T>(_props: ColumnProps<T>) {
    return null;
}

function valuesMatch(left: unknown, right: unknown) {
    if (left == null || right == null) return false;
    return String(left) === String(right);
}

/* -------------------------------------------------------------------------- */
/* ColumnVisibilityButton                                                     */
/* -------------------------------------------------------------------------- */
export function ColumnVisibilityButton({
    columns,
    visibility,
    onChange,
}: {
    columns: ColumnProps<any>[];
    visibility: Record<string, boolean>;
    onChange: (key: string, val: boolean) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto gap-2 hover:cursor-pointer">
                    <Columns3 className="h-4 w-4" /> Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[300px] min-w-48 overflow-y-auto">
                {columns.map((c, idx) => {
                    const key = c.columnKey ?? (c.field as string) ?? `col-${idx}`;
                    const label = typeof c.header === 'string' ? c.header : (c.field ?? key);
                    const isChecked = !(key in visibility) || visibility[key] !== false;
                    return (
                        <DropdownMenuCheckboxItem
                            key={key}
                            checked={isChecked}
                            onCheckedChange={(checked: boolean | 'indeterminate') => onChange(key, Boolean(checked))}
                        >
                            {String(label)}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}



/* -------------------------------------------------------------------------- */
/* BodyRow                                                                    */
/* -------------------------------------------------------------------------- */
export const BodyRow = React.memo(
    function BodyRow({
        row,
        rowIndex,
        columns,
        hasCheckboxCol,
        isSelected,
        toggleRow,
        onRowClick,
        onRowDoubleClick,
        rowClassName,
        selectOnRowClick,
        checkbox,
        frozenZIndex,
        leftOffsets,
        rightOffsets,
        highlightColumnSet,
        isHighlightedRow,
        highlightMatchField,
        highlightMatchValue,
        densityCls,
        rowCls,
        onGoto,
        display,
        isExpanded,
        toggleRowExpanded,
        rowExpansionTemplate,
        hasExpanderCol,
    }: {
        row: any;
        rowIndex: number;
        columns: ColumnProps<any>[];
        hasCheckboxCol: boolean;
        isSelected: boolean;
        toggleRow: (r: any) => void;
        onRowClick?: (r: any, i: number) => void;
        onRowDoubleClick?: (r: any) => void;
        onGoto?: (r: any) => any;
        rowClassName?: (r: any, i: number) => string;
        selectOnRowClick?: boolean;
        checkbox: any;
        frozenZIndex: number;
        leftOffsets: number[];
        rightOffsets: number[];
        highlightColumnSet: Set<string>;
        isHighlightedRow: boolean;
        highlightMatchField?: string;
        highlightMatchValue?: string | number;
        densityCls: string;
        rowCls: string;
        display: DisplayVariant;
        isExpanded: boolean;
        toggleRowExpanded: (row: any) => void;
        rowExpansionTemplate?: (row: any, index: number) => React.ReactNode;
        hasExpanderCol: boolean;
    }) {
        const rowRef = React.useRef<HTMLTableRowElement | null>(null);

        const renderExpanderCell = () => {
            return (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleRowExpanded(row);
                    }}
                    aria-label="Expand row"
                >
                    <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-90")} />
                </Button>
            );
        };

        const onClick = React.useCallback(() => {
            if (selectOnRowClick) toggleRow(row);
            if (onRowClick) onRowClick(row, rowIndex);
        }, [selectOnRowClick, toggleRow, onRowClick, row, rowIndex]);

        const onDoubleClick = React.useCallback(() => {
            if (onRowDoubleClick) {
                onRowDoubleClick(row);
                return;
            }
            if (onGoto) {
                const href = onGoto(row);
                if (href && typeof href === 'string') {
                    window.location.assign(href);
                }
            }
        }, [onRowDoubleClick, onGoto, row]);

        React.useEffect(() => {
            if (!isHighlightedRow || !rowRef.current) return;
            rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, [isHighlightedRow]);

        const renderCheckboxCell = () => {
            const args: CheckboxCellArgs<any> = {
                row,
                index: rowIndex,
                selected: isSelected,
                select: (checked) => {
                    if (checked && !isSelected) toggleRow(row);
                    if (!checked && isSelected) toggleRow(row);
                },
            };

            if (typeof checkbox === 'object' && checkbox.cell) return checkbox.cell(args);
            if (typeof checkbox === 'function') return checkbox(args);

            return <Checkbox checked={args.selected} onCheckedChange={(checked) => args.select(Boolean(checked))} aria-label="Select row" />;
        };

        const resolveFieldValue = (row: any, field?: string | number): any => {
            if (row == null || field == null) return undefined;
            if (typeof field !== 'string' || !field.includes('.')) {
                return row[field];
            }
            return field.split('.').reduce<any>((acc, key) => {
                if (acc == null) return undefined;
                return acc[key];
            }, row);
        };

        const renderCell = (c: ColumnProps<any>, ci: number) => {
            const value = c.field != null ? resolveFieldValue(row, c.field as any) : undefined;
            const columnIdentity = c.columnKey ?? (c.field as string | undefined) ?? `col-${ci}`;
            const isHighlightedColumn = highlightColumnSet.has(columnIdentity);
            const matchesHighlightValue =
                highlightMatchField && highlightMatchValue != null
                    ? String(resolveFieldValue(row, highlightMatchField)) === String(highlightMatchValue)
                    : false;

            const bodyCls =
                typeof c.bodyClassName === 'function'
                    ? c.bodyClassName(row, { rowIndex, field: c.field, value })
                    : c.bodyClassName;

            const stickySide = isFrozenLeft(c) ? 'left' : isFrozenRight(c) ? 'right' : undefined;
            const stickyOffset =
                stickySide === 'left'
                    ? leftOffsets[ci]
                    : stickySide === 'right'
                        ? rightOffsets[ci]
                        : undefined;
            const stickyCls = stickySide
                ? cn('sticky bg-card/95', stickySide === 'left' ? 'left-0' : 'right-0')
                : undefined;

            const cellBorderCls =
                display === 'bordered'
                    ? 'border-r border-b border-border/80 last:border-r-0 dark:border-border/40'
                    : '';

            const content = c.body
                ? typeof c.body === 'function'
                    ? c.body(row, {
                        rowIndex,
                        field: c.field,
                        value,
                    })
                    : c.body
                : c.field
                    ? (() => {
                        const raw = value;
                        const unknown = (
                            <Text variant="small" weight={500}>
                                Unknown
                            </Text>
                        );

                        if (c.date) {
                            return formatColumnDate(raw as any, c.date) ?? unknown;
                        }

                        if (c.status) {
                            return (
                                <StatusButton size={'sm'} status={raw}>
                                    <span>{raw}</span>
                                </StatusButton>
                            );
                        }

                        return raw ?? unknown;
                    })()
                    : null;

            return (
                <TableCell
                    key={ci}
                    style={{
                        width: c.width,
                        zIndex: stickySide ? frozenZIndex : undefined,
                        ...(stickySide ? ({ [stickySide]: stickyOffset } as any) : {}),
                        ...c.bodyStyle,
                    }}
                    className={cn(
                        densityCls,
                        alignCls(c.align),
                        bodyCls,
                        stickyCls,
                        c.className,
                        cellBorderCls,
                        isHighlightedColumn && 'bg-primary/5',
                        (isHighlightedRow || matchesHighlightValue) && isHighlightedColumn && 'bg-primary/12 ring-1 ring-primary/20',
                    )}
                >
                    {content}
                </TableCell>
            );
        };

        return (
            <>
            <TableRow
                ref={rowRef}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                data-state={isSelected ? 'selected' : undefined}
                className={cn(
                    rowCls,
                    rowClassName?.(row, rowIndex),
                    'cursor-pointer transition-colors duration-200',
                    isHighlightedRow && 'ring-2 ring-primary/30',
                )}
            >
                {hasCheckboxCol && (
                    <TableCell
                        style={{ width: 48, zIndex: frozenZIndex, left: 0 }}
                        className={cn(
                            densityCls,
                            'sticky left-0 bg-card/95 text-center',
                            display === 'bordered' && 'border-r border-b border-border/80 dark:border-border/40'
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center">{renderCheckboxCell()}</div>
                    </TableCell>
                )}
                {hasExpanderCol && (
                    <TableCell
                        style={{
                            width: 40,
                            zIndex: frozenZIndex,
                            left: hasCheckboxCol ? 48 : 0
                        }}
                        className={cn(
                            densityCls,
                            'sticky bg-card/95 text-center',
                            display === 'bordered' && 'border-r border-b border-border/80 dark:border-border/40'
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center">{renderExpanderCell()}</div>
                    </TableCell>
                )}
                {columns.map((c, i) => {
                    if (c.columnKey === '__select__' || c.columnKey === '__expand__') return null;
                    return renderCell(c, i);
                })}
            </TableRow>
            {isExpanded && rowExpansionTemplate && (
                <TableRow className="hover:bg-transparent bg-muted/5 border-b border-border/40 transition-all duration-300">
                    <TableCell
                        colSpan={columns.length}
                        className={cn(
                            "p-6 bg-muted/10",
                            display === 'bordered' && 'border-r border-b border-border/80 dark:border-border/40'
                        )}
                    >
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                            {rowExpansionTemplate(row, rowIndex)}
                        </div>
                    </TableCell>
                </TableRow>
            )}
            </>
        );
    },
    (prev, next) => {
        return (
            prev.display === next.display &&
            prev.row === next.row &&
            prev.isSelected === next.isSelected &&
            prev.rowIndex === next.rowIndex &&
            prev.hasCheckboxCol === next.hasCheckboxCol &&
            prev.columns === next.columns &&
            prev.leftOffsets === next.leftOffsets &&
            prev.highlightColumnSet === next.highlightColumnSet &&
            prev.isHighlightedRow === next.isHighlightedRow &&
            prev.highlightMatchField === next.highlightMatchField &&
            prev.highlightMatchValue === next.highlightMatchValue &&
            prev.isExpanded === next.isExpanded &&
            prev.hasExpanderCol === next.hasExpanderCol
        );
    },
);
BodyRow.displayName = 'BodyRow';

/* -------------------------------------------------------------------------- */
/* Table / DataTable Main                                                     */
/* -------------------------------------------------------------------------- */
export function Table<T>(props: TableProps<T>) {
    const {
        value,
        children,
        display = 'spaced',
        rowGap,
        rowRadius,
        density = 'compact',
        striped = false,
        rowHover = true,
        loading = false,
        emptyMessage = 'No records found',
        selectionMode = 'none',
        selection,
        onSelectionChange,
        selectOnRowClick,
        checkbox,
        paginator = true,
        rows = 10,
        first,
        rowsPerPageOptions = [10, 25, 50, 100],
        onPage,
        renderPaginator,
        paginatorClassName,
        pageInfoClassName,
        rowSelectionContainerClassName,
        navContainerClassName,
        sortField,
        sortOrder = 0,
        onSort,
        lazy = false,
        totalRecords,
        onQueryChange,
        columnVisibility,
        onColumnVisibilityChange,
        showColumnVisibility = false,
        scrollX = true,
        frozenShadow = true,
        frozenZIndex = 2,
        frozenHeaderZIndex = 5,
        selectionKey,
        highlightColumns = [],
        highlightRowKey,
        highlightMatchField,
        highlightMatchValue,
        rowKey = (_, i) => i,
        onRowClick,
        onGoto,
        rowClassName,
        toolbar,
        footer,
        className,
        stickyHeader = true,
        stickyHeaderOffset = 0,
        viewportHeight,
        virtualScroll = false,
        rowHeight,
    } = props;

    const [scrollTop, setScrollTop] = React.useState(0);
    const [viewportHeightState, setViewportHeightState] = React.useState(300);
    const viewportRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (viewportRef.current) {
            setViewportHeightState(viewportRef.current.clientHeight);
        }
    }, []);

    const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        setScrollTop(target.scrollTop);
        if (target.clientHeight !== viewportHeightState) {
            setViewportHeightState(target.clientHeight);
        }
    }, [viewportHeightState]);

    const rawColumns = React.useMemo<ColumnProps<T>[]>(() => {
        const list: ColumnProps<T>[] = [];
        React.Children.forEach(children, (child: any) => {
            if (!child) return;
            if (child.type === Column) list.push(child.props);
        });
        return list;
    }, [children]);

    const [innerVis, setInnerVis] = React.useState<Record<string, boolean>>({});
    const vis = columnVisibility ?? innerVis;
    const setVis = (key: string, v: boolean) => {
        const next = { ...vis, [key]: v };
        if (onColumnVisibilityChange) onColumnVisibilityChange(next);
        else setInnerVis(next);
    };

    const hasCheckboxCol = selectionMode !== 'none' && Boolean(checkbox);
    const hasExpanderCol = Boolean(props.rowExpansionTemplate);

    const columns = React.useMemo<ColumnProps<T>[]>(() => {
        const visible = rawColumns.filter((c, idx) => {
            const key = c.columnKey ?? (c.field as string) ?? `col-${idx}`;
            if (key in vis) return vis[key] !== false;
            return !c.hidden;
        });

        const list = [...visible];

        if (hasExpanderCol) {
            const expCol: ColumnProps<T> = {
                columnKey: '__expand__',
                width: 40,
                align: 'center',
                frozen: 'left',
                sortable: false,
                filter: false,
            };
            list.unshift(expCol);
        }

        if (hasCheckboxCol) {
            const chkCol: ColumnProps<T> = {
                columnKey: '__select__',
                width: 48,
                align: 'center',
                frozen: 'left',
                sortable: false,
                filter: false,
            };
            list.unshift(chkCol);
        }

        return list;
    }, [rawColumns, vis, hasCheckboxCol, hasExpanderCol]);

    const isSelectionControlled = selection !== undefined && typeof onSelectionChange === 'function';
    const [innerSel, setInnerSel] = React.useState<any[]>(() => (Array.isArray(selection) ? selection : []));

    React.useEffect(() => {
        if (!isSelectionControlled && selection !== undefined) {
            setInnerSel(Array.isArray(selection) ? selection : []);
        }
    }, [isSelectionControlled, selection]);

    const normalizeSelection = React.useCallback(
        (items: any[]) => {
            if (!selectionKey) return items;
            return items.map((item) => (item && typeof item === 'object' ? item[selectionKey!] : item));
        },
        [selectionKey],
    );

    const sel = React.useMemo(() => normalizeSelection(isSelectionControlled ? (selection ?? []) : innerSel), [
        normalizeSelection,
        isSelectionControlled,
        selection,
        innerSel,
    ]);

    const setSel = React.useCallback(
        (next: any[]) => {
            const normalized = normalizeSelection(next);
            if (isSelectionControlled) onSelectionChange?.(normalized);
            else setInnerSel(normalized);
        },
        [isSelectionControlled, normalizeSelection, onSelectionChange],
    );

    const getSelectionValue = React.useCallback((row: T) => (selectionKey ? row[selectionKey] : row), [selectionKey]);

    const getResolvedRowKey = React.useCallback(
        (row: T, index: number) => {
            if (selectionKey) return row[selectionKey];
            return rowKey(row, index);
        },
        [rowKey, selectionKey],
    );

    // Expansion state
    const isExpansionControlled = props.expandedRows !== undefined && typeof props.onRowToggle === 'function';
    const [innerExpanded, setInnerExpanded] = React.useState<any[]>([]);
    const expandedList = isExpansionControlled ? (props.expandedRows ?? []) : innerExpanded;

    const isRowExpanded = React.useCallback(
        (row: T, index: number) => {
            const key = getResolvedRowKey(row, index);
            return expandedList.some((e) => Object.is(e, key));
        },
        [expandedList, getResolvedRowKey],
    );

    const toggleRowExpanded = React.useCallback(
        (row: T, index: number) => {
            const key = getResolvedRowKey(row, index);
            const currentlyExpanded = isRowExpanded(row, index);
            let next: any[];
            if (currentlyExpanded) {
                next = expandedList.filter((e) => !Object.is(e, key));
            } else {
                next = [...expandedList, key];
            }

            if (isExpansionControlled) {
                props.onRowToggle?.(next);
            } else {
                setInnerExpanded(next);
            }
        },
        [expandedList, getResolvedRowKey, isExpansionControlled, isRowExpanded, props.onRowToggle],
    );

    const isRowSelected = React.useCallback(
        (row: T) => {
            const rowValue = getSelectionValue(row);
            return sel.some((s) => Object.is(s, rowValue));
        },
        [sel, getSelectionValue],
    );

    const toggleRow = React.useCallback(
        (row: T) => {
            if (selectionMode === 'none') return;

            const isSelected = isRowSelected(row);
            const rowValue = getSelectionValue(row);

            if (selectionMode === 'single') {
                if (isSelected) {
                    setSel([]);
                } else {
                    setSel([rowValue]);
                }
                return;
            }

            if (isSelected) {
                setSel(sel.filter((s) => !Object.is(s, rowValue)));
            } else {
                setSel([...sel, rowValue]);
            }
        },
        [selectionMode, sel, setSel, isRowSelected, getSelectionValue],
    );

    const [innerSort, setInnerSort] = React.useState<{ field?: string; order: SortOrder }>({ field: sortField, order: sortOrder });
    React.useEffect(() => setInnerSort({ field: sortField, order: sortOrder ?? 0 }), [sortField, sortOrder]);

    const onHeaderSort = (field?: string, sortable?: boolean, disabled?: boolean) => {
        if (!sortable || disabled || !field) return;
        const next: SortOrder = innerSort.field !== field ? 1 : innerSort.order === 1 ? -1 : innerSort.order === -1 ? 0 : 1;
        const payload = { field: next ? field : undefined, order: next };
        setInnerSort(payload);
        onSort?.({ sortField: payload.field, sortOrder: payload.order });
        if (lazy) emitQuery({ sortField: payload.field, sortOrder: payload.order });
    };

    const [innerFilters] = React.useState<Record<string, any>>({});
    const activeFilters = props.filters ?? innerFilters;

    const [innerGlobal] = React.useState<string>('');
    const gf = props.globalFilter ?? innerGlobal;

    const [innerFirst, setInnerFirst] = React.useState(first ?? 0);
    React.useEffect(() => {
        if (typeof first === 'number') setInnerFirst(first);
    }, [first]);

    const [innerRows, setInnerRows] = React.useState(rows);
    React.useEffect(() => {
        setInnerRows(rows);
    }, [rows]);

    const page = Math.floor(innerFirst / innerRows) + 1;

    const emitQuery = (patch: any) => {
        onQueryChange?.({
            page,
            rows: innerRows,
            sortField: innerSort.field,
            sortOrder: innerSort.order,
            filters: activeFilters,
            globalFilter: gf,
            ...patch,
        });
    };

    const filtered = React.useMemo(() => {
        if (lazy) return value;
        let list = value;

        if (gf) {
            list = list.filter((row) => {
                return rawColumns.some((c) => {
                    if (c.excludeGlobalFilter) return false;
                    const colKey = (c.field as string) ?? (c.filterField as string);
                    if (!colKey) return false;
                    const v = (row as any)[colKey];
                    return v != null && String(v).toLowerCase().includes(String(gf).toLowerCase());
                });
            });
        }

        list = list.filter((row) => {
            for (const col of rawColumns) {
                if (!col.filter) continue;
                const key = (col.filterField ?? col.field) as string | undefined;
                if (!key) continue;
                const fv = activeFilters[key];
                if (fv == null || fv === '') continue;
                const mode: MatchMode = (col.filterMatchMode as MatchMode) ?? 'contains';
                if (!matchValue(mode, (row as any)[key], fv)) return false;
            }
            return true;
        });

        if (innerSort.field && innerSort.order) {
            list = [...list].sort((a, b) => {
                const av = (a as any)[innerSort.field!];
                const bv = (b as any)[innerSort.field!];
                if (av == null && bv == null) return 0;
                if (av == null) return -1 * innerSort.order;
                if (bv == null) return 1 * innerSort.order;
                if (av < bv) return -1 * innerSort.order;
                if (av > bv) return 1 * innerSort.order;
                return 0;
            });
        }
        return list;
    }, [value, gf, activeFilters, rawColumns, innerSort, lazy]);

    const effectiveTotal = lazy ? (totalRecords ?? value.length) : filtered.length;
    const pageCount = Math.max(1, Math.ceil(effectiveTotal / innerRows));
    const shouldRenderPaginator = paginator && pageCount > 1 && !virtualScroll;

    const goto = (nextPage: number) => {
        const clamped = Math.min(Math.max(nextPage, 1), pageCount);
        const nextFirst = (clamped - 1) * innerRows;
        if (typeof first === 'number') onPage?.({ first: nextFirst, rows: innerRows, page: clamped, pageCount });
        else setInnerFirst(nextFirst);
        if (lazy) emitQuery({ page: clamped, rows: innerRows });
    };

    const onChangePageSize = (sz: number) => {
        if (typeof first !== 'number') {
            setInnerFirst(0);
            setInnerRows(sz);
        }
        onPage?.({ first: 0, rows: sz, page: 1, pageCount: Math.max(1, Math.ceil(effectiveTotal / sz)) });
        if (lazy) emitQuery({ page: 1, rows: sz });
    };

    const paged = React.useMemo(() => {
        if (lazy || !paginator) return filtered;
        return filtered.slice(innerFirst, innerFirst + innerRows);
    }, [filtered, innerFirst, innerRows, paginator, lazy]);

    const resolvedRowHeight = rowHeight ?? (density === 'compact' ? 40 : 52);
    const activeViewportHeight = viewportHeight ?? (virtualScroll ? 400 : undefined);
    
    const virtualBuffer = 5;
    const totalRows = filtered.length;

    const startIndex = React.useMemo(() => {
        if (!virtualScroll) return 0;
        return Math.max(0, Math.floor(scrollTop / resolvedRowHeight) - virtualBuffer);
    }, [virtualScroll, scrollTop, resolvedRowHeight]);

    const endIndex = React.useMemo(() => {
        if (!virtualScroll) return totalRows - 1;
        const limit = Math.floor((scrollTop + viewportHeightState) / resolvedRowHeight) + virtualBuffer;
        return Math.min(totalRows - 1, limit);
    }, [virtualScroll, scrollTop, viewportHeightState, resolvedRowHeight, totalRows]);

    const topSpacerHeight = React.useMemo(() => {
        if (!virtualScroll) return 0;
        return startIndex * resolvedRowHeight;
    }, [virtualScroll, startIndex, resolvedRowHeight]);

    const bottomSpacerHeight = React.useMemo(() => {
        if (!virtualScroll) return 0;
        return Math.max(0, (totalRows - endIndex - 1) * resolvedRowHeight);
    }, [virtualScroll, totalRows, endIndex, resolvedRowHeight]);

    const visibleRows = React.useMemo(() => {
        if (!virtualScroll) return paged;
        return filtered.slice(startIndex, endIndex + 1);
    }, [virtualScroll, paged, filtered, startIndex, endIndex]);

    const offsetIndex = virtualScroll ? startIndex : innerFirst;

    React.useEffect(() => {
        if (!paginator) return;

        const maxFirst = Math.max(0, (pageCount - 1) * innerRows);
        if (innerFirst <= maxFirst) return;

        const nextFirst = maxFirst;
        const nextPage = Math.floor(nextFirst / innerRows) + 1;

        if (typeof first === 'number') {
            onPage?.({ first: nextFirst, rows: innerRows, page: nextPage, pageCount });
        } else {
            setInnerFirst(nextFirst);
        }

        if (lazy) {
            onQueryChange?.({
                page: nextPage,
                rows: innerRows,
                sortField: innerSort.field,
                sortOrder: innerSort.order,
                filters: activeFilters,
                globalFilter: gf,
            });
        }
    }, [paginator, pageCount, innerRows, innerFirst, first, onPage, lazy, onQueryChange, innerSort.field, innerSort.order, activeFilters, gf]);

    React.useEffect(() => {
        if (lazy || !paginator || highlightRowKey == null) return;

        const index = filtered.findIndex((row, rowIndex) => valuesMatch(getResolvedRowKey(row, rowIndex), highlightRowKey));
        if (index < 0) return;

        const nextFirst = Math.floor(index / innerRows) * innerRows;
        if (typeof first === 'number') {
            onPage?.({
                first: nextFirst,
                rows: innerRows,
                page: Math.floor(nextFirst / innerRows) + 1,
                pageCount,
            });
            return;
        }

        setInnerFirst((current) => (current === nextFirst ? current : nextFirst));
    }, [filtered, first, getResolvedRowKey, highlightRowKey, innerRows, lazy, onPage, pageCount, paginator]);

    const visibleSelectionValues = React.useMemo(() => paged.map((row) => getSelectionValue(row)), [paged, getSelectionValue]);

    const visibleSelectedCount = React.useMemo(
        () => visibleSelectionValues.filter((v) => sel.some((s) => Object.is(s, v))).length,
        [visibleSelectionValues, sel],
    );

    const allChecked = selectionMode === 'multiple' && visibleSelectionValues.length > 0 && visibleSelectedCount === visibleSelectionValues.length;

    const indeterminate = selectionMode === 'multiple' && visibleSelectedCount > 0 && !allChecked;

    const selectAll = React.useCallback(
        (checked: boolean) => {
            if (selectionMode !== 'multiple') return;

            if (!checked) {
                setSel(sel.filter((s) => !visibleSelectionValues.some((v) => Object.is(v, s))));
                return;
            }

            const merged = [...sel];
            for (const value of visibleSelectionValues) {
                if (!merged.some((v) => Object.is(v, value))) merged.push(value);
            }
            setSel(merged);
        },
        [selectionMode, sel, setSel, visibleSelectionValues],
    );

    const { headerRefs, leftOffsets, rightOffsets } = useStickyOffsets(columns, [
        columns.map((c) => c.columnKey ?? c.field).join(','),
        display,
        density,
        hasCheckboxCol,
        hasExpanderCol,
        selectionKey,
    ]);

    const effectiveGap: RowGap = (typeof rowGap === 'number' ? Math.min(16, Math.max(1, rowGap)) : 2) as RowGap;
    const gapCls = GAP_MAP[effectiveGap];
    const radiusToken: RowRadius = (rowRadius ?? 'xl') as RowRadius;
    const highlightColumnSet = React.useMemo(() => new Set(highlightColumns), [highlightColumns]);

    const rowBase = React.useMemo(() => {
        if (display === 'spaced') {
            return ['bg-card shadow-xs ring-1 ring-input/60 rounded-xl hover:shadow-md transition-all duration-200', gapCls, RADIUS_MAP[radiusToken].left, RADIUS_MAP[radiusToken].right].join(' ');
        }
        if (display === 'bordered') {
            return 'bg-card border-b border-border/80 dark:border-border/40 hover:bg-muted/30';
        }
        if (display === 'glass') {
            return 'bg-background/20 backdrop-blur-sm border-b border-border/20 hover:bg-background/40';
        }
        if (display === 'minimal') {
            return 'hover:bg-muted/30 border-none';
        }
        // default/normal
        return 'border-b border-border hover:bg-muted/40';
    }, [display, gapCls, radiusToken]);

    const hoverCls = rowHover ? 'hover:shadow-md hover:bg-accent/5 transition-all duration-200' : '';
    const densityCls = densityCell(density);
    const tableCls = display === 'spaced' ? gapCls : 'border-separate border-spacing-y-0';

    const renderHeaderCell = (c: ColumnProps<T>, idx: number) => {
        const field = (c.sortField ?? c.field) as string | undefined;
        const columnIdentity = c.columnKey ?? (c.field as string | undefined) ?? `col-${idx}`;
        const isHighlightedColumn = highlightColumnSet.has(columnIdentity);
        const sortable = Boolean(c.sortable && !c.sortableDisabled && field);
        const active = innerSort.field === field && innerSort.order !== 0;
        const isHeaderSticky = stickyHeader;
        const stickySide = isFrozenLeft(c) ? 'left' : isFrozenRight(c) ? 'right' : undefined;
        const stickyOffset = stickySide === 'left' ? leftOffsets[idx] : stickySide === 'right' ? rightOffsets[idx] : undefined;
        const stickyCls = (stickySide || isHeaderSticky)
            ? cn(
                'sticky',
                stickySide === 'left' && 'left-0',
                stickySide === 'right' && 'right-0',
                isHeaderSticky && 'top-0'
              )
            : undefined;

        let bgCls = 'bg-background';
        if (display === 'bordered') {
            bgCls = isHeaderSticky ? 'bg-muted/95 backdrop-blur-xs' : 'bg-muted/60';
        } else if (display === 'glass') {
            bgCls = 'bg-background/60 backdrop-blur-xs';
        } else if (display === 'minimal') {
            bgCls = isHeaderSticky ? 'bg-background/95 backdrop-blur-xs' : 'bg-transparent';
        } else if (isHeaderSticky) {
            bgCls = 'bg-background/95 backdrop-blur-xs';
        }

        const headerBorderCls =
            display === 'bordered'
                ? 'border-r border-b border-border/80 last:border-r-0 dark:border-border/40'
                : '';

        const zClass = isHeaderSticky ? (stickySide ? 'z-[60]' : 'z-40') : (stickySide ? 'z-30' : 'z-10');

        return (
            <TableHead
                key={idx}
                ref={(el: any) => (headerRefs.current[idx] = el)}
                style={{
                    width: c.width,
                    ...(stickySide ? ({ [stickySide]: stickyOffset } as any) : {}),
                }}
                className={cn(
                    alignCls(c.alignHeader ?? c.align),
                    c.headerClassName,
                    c.className,
                    sortable && 'cursor-pointer transition-colors select-none hover:text-foreground',
                    stickyCls,
                    zClass,
                    bgCls,
                    isHighlightedColumn && 'bg-primary/10 text-primary',
                    headerBorderCls,
                    frozenShadow && stickySide === 'left' && 'shadow-[inset_-10px_0_10px_-10px_rgba(0,0,0,0.05)]',
                    frozenShadow && stickySide === 'right' && 'shadow-[inset_10px_0_10px_-10px_rgba(0,0,0,0.05)]',
                )}
                onClick={() => onHeaderSort(field, sortable, c.sortableDisabled)}
            >
                <div
                    className={cn(
                        'flex items-center gap-2',
                        alignCls(c.alignHeader ?? c.align) === 'text-center' && 'justify-center',
                        alignCls(c.alignHeader ?? c.align) === 'text-right' && 'justify-end',
                    )}
                >
                    {typeof c.header === 'function'
                        ? c.header({
                              sortState: { active, order: innerSort.order },
                              toggleSort: () => onHeaderSort(field, sortable, c.sortableDisabled),
                          })
                        : (c.header ?? c.field)}
                    {sortable && (
                        <ArrowUpDown
                            className={cn('h-3.5 w-3.5 transition-opacity', active ? 'text-primary opacity-100' : 'opacity-30 hover:opacity-50')}
                        />
                    )}
                </div>
            </TableHead>
        );
    };

    const renderCheckboxHeader = () => {
        if (!checkbox) return null;
        if (typeof checkbox === 'object' && checkbox.header) {
            return checkbox.header({ selectedAll: allChecked, indeterminate, selectAll });
        }
        if (typeof checkbox === 'function') return null;

        return selectionMode === 'multiple' ? (
            <div className="flex justify-center">
                <Checkbox
                    checked={allChecked ? true : indeterminate ? 'indeterminate' : false}
                    onCheckedChange={(checked) => selectAll(Boolean(checked))}
                    aria-label="Select all rows"
                />
            </div>
        ) : null;
    };

    return (
        <div className={cn('flex w-full flex-col gap-2', className)}>
            {(toolbar || showColumnVisibility) && (
                <div className="flex items-center justify-between gap-2 p-1">
                    <div className="flex items-center gap-2">{toolbar}</div>
                    {showColumnVisibility && <ColumnVisibilityButton columns={rawColumns} visibility={vis} onChange={setVis} />}
                </div>
            )}

            <div className={cn(
                "relative w-full overflow-hidden transition-all duration-300",
                display !== 'spaced' && "border rounded-md bg-card",
                display === 'glass' && "bg-card/30 backdrop-blur-md border-border/30 shadow-xs",
                display === 'minimal' && "border-none bg-transparent"
            )}>
                {loading && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                        <div className="flex flex-col items-center gap-2 rounded-lg border bg-background/80 p-4 shadow-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">Loading...</span>
                        </div>
                    </div>
                )}

                <ScrollArea
                    className={cn('relative w-full', scrollX && 'overflow-x-auto')}
                    style={{ height: activeViewportHeight }}
                    viewportClassName="w-full overflow-y-auto"
                    viewportRef={viewportRef}
                    viewportProps={{
                        onScroll: handleScroll,
                    }}
                >
                    <UiTable className={tableCls}>
                        <TableHeader
                            className={cn(
                                stickyHeader && 'sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-xs'
                            )}
                            style={stickyHeader ? { top: stickyHeaderOffset } : undefined}
                        >
                            <TableRow
                                className={cn(
                                    'border-b shadow-sm hover:bg-transparent',
                                    display === 'spaced' && [
                                        RADIUS_MAP[radiusToken].left,
                                        RADIUS_MAP[radiusToken].right,
                                    ]
                                )}
                            >
                                {hasCheckboxCol && (
                                    <TableHead
                                        ref={(el: any) => (headerRefs.current[0] = el)}
                                        style={{
                                            width: 48,
                                            left: 0,
                                            zIndex: stickyHeader ? 60 : frozenHeaderZIndex
                                        }}
                                        className={cn(
                                            'sticky left-0 bg-background/95 backdrop-blur-xs text-center',
                                            stickyHeader && 'top-0',
                                            display === 'bordered' && 'border-r border-b border-border/80 dark:border-border/40',
                                            frozenShadow && 'shadow-[inset_-10px_0_10px_-10px_rgba(0,0,0,0.05)]'
                                        )}
                                    >
                                        {renderCheckboxHeader()}
                                    </TableHead>
                                )}
                                {hasExpanderCol && (
                                    <TableHead
                                        ref={(el: any) => (headerRefs.current[hasCheckboxCol ? 1 : 0] = el)}
                                        style={{
                                            width: 40,
                                            left: hasCheckboxCol ? 48 : 0,
                                            zIndex: stickyHeader ? 60 : frozenHeaderZIndex
                                        }}
                                        className={cn(
                                            'sticky bg-background/95 backdrop-blur-xs text-center',
                                            stickyHeader && 'top-0',
                                            display === 'bordered' && 'border-r border-b border-border/80 dark:border-border/40',
                                            frozenShadow && 'shadow-[inset_-10px_0_10px_-10px_rgba(0,0,0,0.05)]'
                                        )}
                                    >
                                    </TableHead>
                                )}
                                {columns.map((c, i) => {
                                    if (c.columnKey === '__select__' || c.columnKey === '__expand__') return null;
                                    return renderHeaderCell(c, i);
                                })}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {!loading && visibleRows.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={columns.length} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <p>{emptyMessage}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {topSpacerHeight > 0 && (
                                        <tr style={{ height: topSpacerHeight }}>
                                            <td colSpan={columns.length} style={{ padding: 0, border: 'none' }} />
                                        </tr>
                                    )}
                                    {visibleRows.map((row, ri) => (
                                        <BodyRow
                                            key={String(getResolvedRowKey(row, ri + offsetIndex))}
                                            row={row}
                                            rowIndex={ri + offsetIndex}
                                            columns={columns}
                                            hasCheckboxCol={hasCheckboxCol}
                                            isSelected={isRowSelected(row)}
                                            toggleRow={toggleRow}
                                            onRowClick={onRowClick}
                                            onRowDoubleClick={props.onRowDoubleClick}
                                            onGoto={onGoto}
                                            rowClassName={rowClassName}
                                            selectOnRowClick={selectOnRowClick}
                                            checkbox={checkbox}
                                            frozenZIndex={frozenZIndex}
                                            leftOffsets={leftOffsets}
                                            rightOffsets={rightOffsets}
                                            highlightColumnSet={highlightColumnSet}
                                            isHighlightedRow={valuesMatch(getResolvedRowKey(row, ri + offsetIndex), highlightRowKey)}
                                            highlightMatchField={highlightMatchField}
                                            highlightMatchValue={highlightMatchValue}
                                            densityCls={densityCls}
                                            rowCls={cn(rowBase, hoverCls, striped && 'odd:bg-muted/30')}
                                            display={display}
                                            isExpanded={isRowExpanded(row, ri + offsetIndex)}
                                            toggleRowExpanded={(r) => toggleRowExpanded(r, ri + offsetIndex)}
                                            rowExpansionTemplate={props.rowExpansionTemplate}
                                            hasExpanderCol={hasExpanderCol}
                                        />
                                    ))}
                                    {bottomSpacerHeight > 0 && (
                                        <tr style={{ height: bottomSpacerHeight }}>
                                            <td colSpan={columns.length} style={{ padding: 0, border: 'none' }} />
                                        </tr>
                                    )}
                                </>
                            )}
                        </TableBody>
                    </UiTable>
                    <ScrollBar orientation="horizontal" />
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </div>

            {footer && <div className="mt-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">{footer}</div>}

            {shouldRenderPaginator &&
                (renderPaginator ? (
                    renderPaginator({ page, pageCount, innerRows, onChangePageSize, goto })
                ) : (
                    <Paginator
                        values={filtered}
                        totalRecords={lazy ? totalRecords : undefined}
                        pageSize={innerRows}
                        rowsPerPageOptions={rowsPerPageOptions}
                        defaultIndex={page - 1}
                        onIndexChange={(idx: number) => goto(idx + 1)}
                        onPageSizeChange={onChangePageSize}
                        position="bottom"
                        paginatorContainerClassName={paginatorClassName}
                        pageInfoClassName={pageInfoClassName}
                        rowSelectionContainerClassName={rowSelectionContainerClassName}
                        navContainerClassName={navContainerClassName}
                        pageLinkActiveClassName="bg-primary/10 text-primary hover:bg-primary/20"
                    />
                ))}
        </div>
    );
}

Table.displayName = 'Table';
export default Table;
