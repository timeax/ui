import * as React from 'react';
import type { ColumnDateFormat, DateMask } from '../date-text/date-text';

export type DisplayVariant = 'spaced' | 'normal' | 'bordered' | 'minimal' | 'glass';
export type DensityLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type Density = 'comfortable' | 'compact' | DensityLevel;
export type SelectionMode = 'none' | 'single' | 'multiple';
export type SortOrder = 1 | -1 | 0;

export type RowGap = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type RowRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export type ColumnBodyOptions = { rowIndex: number; field?: string; value: any };
export type ColumnHeaderOptions = { sortState?: { active: boolean; order: SortOrder }; toggleSort?: () => void };
export type ColumnFilterElementTemplateOptions = {
    value: any;
    setValue: (v: any) => void;
    matchMode: string;
    setMatchMode: (m: string) => void;
};
export type ColumnFooterOptions = { columnKey: string };

export type MatchMode = 'startsWith' | 'contains' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'notIn' | 'lt' | 'lte' | 'gt' | 'gte' | 'custom';

export interface ColumnProps<T> {
    /* Data & templates */
    field?: keyof T & string;
    header?: React.ReactNode | ((o: ColumnHeaderOptions) => React.ReactNode);
    body?: React.ReactNode | ((row: T, o: ColumnBodyOptions) => React.ReactNode);
    footer?: React.ReactNode | ((o: ColumnFooterOptions) => React.ReactNode);
    status?: boolean;
    /* Style */
    align?: 'left' | 'right' | 'center';
    alignHeader?: 'left' | 'right' | 'center';
    width?: number | string;
    className?: string;
    style?: React.CSSProperties;
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
    bodyClassName?: string | ((row: T, o: ColumnBodyOptions) => string);
    bodyStyle?: React.CSSProperties;
    hidden?: boolean;

    /* Sorting */
    sortable?: boolean;
    sortField?: string;
    sortableDisabled?: boolean;

    /* Filtering */
    dataType?: 'text' | 'numeric' | 'date' | string;
    filter?: boolean;
    filterField?: string;
    filterType?: 'text' | 'number' | 'date' | 'enum';
    filterMatchMode?: MatchMode;
    filterElement?: React.ReactNode | ((o: ColumnFilterElementTemplateOptions) => React.ReactNode);
    filterPlaceholder?: string;
    excludeGlobalFilter?: boolean;

    /* Frozen / fixed */
    frozen?: true | 'left' | 'right';
    alignFrozen?: 'left' | 'right';

    /* Identity */
    columnKey?: string;

    /* ✅ Date formatting (only meaningful when dataType/filterType = "date") */
    date?: ColumnDateFormat | DateMask;
}

export interface CheckboxHeaderArgs {
    selectedAll: boolean;
    indeterminate: boolean;
    selectAll: (checked: boolean) => void;
}
export interface CheckboxCellArgs<T> {
    row: T;
    index: number;
    selected: boolean;
    select: (checked: boolean) => void;
}

export interface TableProps<T> {
    value: T[];
    children: React.ReactNode;
    display?: DisplayVariant;
    rowGap?: RowGap;
    rowRadius?: RowRadius;
    density?: Density;
    striped?: boolean;
    rowHover?: boolean;
    loading?: boolean;
    emptyMessage?: React.ReactNode;
    selectionMode?: SelectionMode;
    selection?: any[];
    onSelectionChange?: (next: any[]) => void;
    selectOnRowClick?: boolean;
    checkbox?:
        | true
        | ((args: CheckboxCellArgs<T>) => React.ReactNode)
        | { header?: (args: CheckboxHeaderArgs) => React.ReactNode; cell?: (args: CheckboxCellArgs<T>) => React.ReactNode };
    paginator?: boolean;
    rows?: number;
    first?: number;
    rowsPerPageOptions?: number[];
    onPage?: (e: { first: number; rows: number; page: number; pageCount: number }) => void;
    renderPaginator?: (args: {
        page: number;
        pageCount: number;
        innerRows: number;
        onChangePageSize: (sz: number) => void;
        goto: (page: number) => void;
    }) => React.ReactNode;
    paginatorClassName?: string;
    pageInfoClassName?: string;
    rowSelectionContainerClassName?: string;
    navContainerClassName?: string;
    currentPageClassName?: string;
    sortField?: string;
    sortOrder?: SortOrder;
    onSort?: (e: { sortField?: string; sortOrder: SortOrder }) => void;
    globalFilter?: string;
    onGlobalFilterChange?: (val: string) => void;
    filters?: Record<string, any>;
    onFilter?: (filters: Record<string, any>) => void;
    lazy?: boolean;
    totalRecords?: number;
    onQueryChange?: (q: {
        page: number;
        rows: number;
        sortField?: string;
        sortOrder: SortOrder;
        filters: Record<string, any>;
        globalFilter?: string;
    }) => void;
    columnVisibility?: Record<string, boolean>;
    onColumnVisibilityChange?: (next: Record<string, boolean>) => void;
    showColumnVisibility?: boolean;
    scrollX?: boolean;
    frozenShadow?: boolean;
    frozenZIndex?: number;
    frozenHeaderZIndex?: number;
    selectionKey?: keyof T & string;
    highlightColumns?: string[];
    highlightRowKey?: string | number;
    highlightMatchField?: string;
    highlightMatchValue?: string | number;
    rowKey?: (row: T, index: number) => string | number;
    onRowClick?: (row: T, index: number) => void;
    onRowDoubleClick?: (row: T) => void;
    onGoto?: (row: T) => any;
    rowClassName?: (row: T, index: number) => string;
    toolbar?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;

    // Sticky header prop
    stickyHeader?: boolean;
    // Sticky header offset
    stickyHeaderOffset?: number | string;
    // Table viewport container height for ScrollArea vertical scroll
    viewportHeight?: string | number;

    // Row expansion support
    rowExpansionTemplate?: (row: T, index: number) => React.ReactNode;
    expandedRows?: any[];
    onRowToggle?: (expandedRows: any[]) => void;

    // Virtual scroll support
    virtualScroll?: boolean;
    rowHeight?: number;
}
