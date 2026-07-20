import type { ColumnProps, Density, MatchMode, RowRadius } from './data-table.types';

export const GAP_MAP: Record<number, string> = {
    1: 'border-separate border-spacing-x-0 border-spacing-y-1',
    2: 'border-separate border-spacing-x-0 border-spacing-y-2',
    3: 'border-separate border-spacing-x-0 border-spacing-y-3',
    4: 'border-separate border-spacing-x-0 border-spacing-y-4',
    5: 'border-separate border-spacing-x-0 border-spacing-y-5',
    6: 'border-separate border-spacing-x-0 border-spacing-y-6',
    7: 'border-separate border-spacing-x-0 border-spacing-y-7',
    8: 'border-separate border-spacing-x-0 border-spacing-y-8',
    9: 'border-separate border-spacing-x-0 border-spacing-y-9',
    10: 'border-separate border-spacing-x-0 border-spacing-y-10',
    11: 'border-separate border-spacing-x-0 border-spacing-y-11',
    12: 'border-separate border-spacing-x-0 border-spacing-y-12',
    13: 'border-separate border-spacing-x-0 border-spacing-y-13',
    14: 'border-separate border-spacing-x-0 border-spacing-y-14',
    15: 'border-separate border-spacing-x-0 border-spacing-y-15',
    16: 'border-separate border-spacing-x-0 border-spacing-y-16',
};

export const RADIUS_MAP: Record<RowRadius, { left: string; right: string }> = {
    none: {
        left: '[&>*:first-child]:rounded-l-none [&>*:first-child]:border-l [&>*:first-child]:border-l-1',
        right: '[&>*:last-child]:rounded-r-none [&>*:last-child]:border-r [&>*:last-child]:border-r-1',
    },
    sm: {
        left: '[&>*:first-child]:rounded-l-sm [&>*:first-child]:border-l [&>*:first-child]:border-l-1',
        right: '[&>*:last-child]:rounded-r-sm [&>*:last-child]:border-r [&>*:last-child]:border-r-1',
    },
    md: {
        left: '[&>*:first-child]:rounded-l-md [&>*:first-child]:border-l [&>*:first-child]:border-l-1',
        right: '[&>*:last-child]:rounded-r-md [&>*:last-child]:border-r [&>*:last-child]:border-r-1',
    },
    lg: {
        left: '[&>*:first-child]:rounded-l-lg [&>*:first-child]:border-l [&>*:first-child]:border-l-1',
        right: '[&>*:last-child]:rounded-r-lg [&>*:last-child]:border-r [&>*:last-child]:border-r-1',
    },
    xl: {
        left: '[&>*:first-child]:rounded-l-xl [&>*:first-child]:border-l [&>*:first-child]:border-l-1',
        right: '[&>*:last-child]:rounded-r-xl [&>*:last-child]:border-r [&>*:last-child]:border-r-1',
    },
    '2xl': {
        left: '[&>*:first-child]:rounded-l-2xl [&>*:first-child]:border-l [&>*:first-child]:border-l-1',
        right: '[&>*:last-child]:rounded-r-2xl [&>*:last-child]:border-r [&>*:last-child]:border-r-1',
    },
    '3xl': {
        left: '[&>*:first-child]:rounded-l-3xl [&>*:first-child]:border-l [&>*:first-child]:border-l-1',
        right: '[&>*:last-child]:rounded-r-3xl [&>*:last-child]:border-r [&>*:last-child]:border-r-1',
    },
    full: {
        left: '[&>*:first-child]:rounded-l-full [&>*:first-child]:border-l [&>*:first-child]:border-l-1',
        right: '[&>*:last-child]:rounded-r-full [&>*:last-child]:border-r [&>*:last-child]:border-r-1',
    },
};

export const DENSITY_MAP: Record<number, string> = {
    0: 'py-0',
    1: 'py-1',
    2: 'py-2',
    3: 'py-3',
    4: 'py-4',
    5: 'py-5',
    6: 'py-6',
    7: 'py-7',
    8: 'py-8',
    9: 'py-9',
    10: 'py-10',
    11: 'py-11',
    12: 'py-12',
    13: 'py-13',
    14: 'py-14',
    15: 'py-15',
    16: 'py-16',
};

export function alignCls(a?: 'left' | 'right' | 'center') {
    switch (a) {
        case 'center':
            return 'text-center';
        case 'right':
            return 'text-right';
        default:
            return 'text-left';
    }
}

export function densityCell(d: Density) {
    if (typeof d === 'number') {
        const n = Math.min(16, Math.max(0, d));
        return DENSITY_MAP[n];
    }
    return d === 'compact' ? 'py-2' : 'py-4';
}

export function isFrozenLeft<T>(c: ColumnProps<T>) {
    return c.frozen === true || c.frozen === 'left' || c.alignFrozen === 'left';
}
export function isFrozenRight<T>(c: ColumnProps<T>) {
    return c.frozen === 'right' || c.alignFrozen === 'right';
}

export function matchValue(mode: MatchMode, v: any, f: any) {
    if (v == null) return false;
    const val = typeof v === 'string' ? v.toLowerCase() : v;
    const filter = typeof f === 'string' ? f.toLowerCase() : f;

    switch (mode) {
        case 'startsWith':
            return String(val).startsWith(String(filter));
        case 'contains':
            return String(val).includes(String(filter));
        case 'endsWith':
            return String(val).endsWith(String(filter));
        case 'equals':
            return String(val) === String(filter);
        case 'notEquals':
            return String(val) !== String(filter);
        case 'lt':
            return Number(val) < Number(filter);
        case 'lte':
            return Number(val) <= Number(filter);
        case 'gt':
            return Number(val) > Number(filter);
        case 'gte':
            return Number(val) >= Number(filter);
        case 'in':
            return Array.isArray(filter) && filter.includes(val);
        case 'notIn':
            return Array.isArray(filter) && !filter.includes(val);
        default:
            return String(val).includes(String(filter));
    }
}
