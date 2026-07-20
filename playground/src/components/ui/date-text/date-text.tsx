import * as React from 'react';
import { Text } from '@/components/ui/text';

export type DateMask =
    // ISO-ish
    | 'isoDate' // 2025-12-24
    | 'isoDateTime' // 2025-12-24 16:30
    | 'isoDateTimeSeconds' // 2025-12-24 16:30:12
    | 'isoDateTimeZ' // 2025-12-24T16:30:12.123Z

    // Common numeric dates
    | 'dmySlash' // 24/12/2025
    | 'dmyDash' // 24-12-2025
    | 'mdySlash' // 12/24/2025
    | 'ymdDash' // 2025-12-24
    | 'ymdSlash' // 2025/12/24

    // Short/Medium/Long (Intl style)
    | 'dateShort' // 12/24/25
    | 'dateMedium' // Dec 24, 2025
    | 'dateLong' // December 24, 2025
    | 'dateFull' // Wednesday, December 24, 2025

    // With weekday
    | 'weekdayShort' // Wed, Dec 24, 2025
    | 'weekdayLong' // Wednesday, December 24, 2025

    // Month/Year
    | 'monthYearShort' // Dec 2025
    | 'monthYearLong' // December 2025
    | 'yearMonthNumeric' // 2025-12
    | 'yearOnly' // 2025
    | 'monthOnlyShort' // Dec
    | 'monthOnlyLong' // December

    // Day/Month (no year)
    | 'dayMonthShort' // 24 Dec
    | 'dayMonthLong' // 24 December

    // Time
    | 'time24' // 16:30
    | 'time24Seconds' // 16:30:12
    | 'time12' // 4:30 PM
    | 'time12Seconds' // 4:30:12 PM

    // Date + time
    | 'dateTimeShort' // Dec 24, 2025 16:30
    | 'dateTimeShort12' // Dec 24, 2025 4:30 PM
    | 'dateTimeLong' // December 24, 2025 16:30
    | 'dateTimeLong12' // December 24, 2025 4:30 PM

    // With seconds
    | 'dateTimeSeconds' // Dec 24, 2025 16:30:12
    | 'dateTimeSeconds12'; // Dec 24, 2025 4:30:12 PM

export type DateInput = Date | string | number | null | undefined;

export interface ColumnDateFormat {
    /**
     * Named mask (preset). You can also pass a custom Intl options object.
     */
    mask?: DateMask;

    /**
     * Optional: override locale/timeZone per column.
     * If omitted, your app defaults apply (browser locale, etc).
     */
    locale?: string;
    timeZone?: string;

    /**
     * Optional: renderers
     */
    emptyText?: React.ReactNode; // when value is null/undefined/""
    invalidText?: React.ReactNode; // when value can't be parsed

    /**
     * If you want full control, override formatting:
     * receives the parsed Date + raw value
     */
    format?: (date: Date, raw: DateInput) => React.ReactNode;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

export const DATE_MASK_PRESETS: Record<
    Exclude<
        DateMask,
        | 'isoDate'
        | 'isoDateTime'
        | 'isoDateTimeSeconds'
        | 'isoDateTimeZ'
        | 'dmySlash'
        | 'dmyDash'
        | 'mdySlash'
        | 'ymdDash'
        | 'ymdSlash'
        | 'yearMonthNumeric'
    >,
    Intl.DateTimeFormatOptions
> = {
    dateShort: { dateStyle: 'short' },
    dateMedium: { dateStyle: 'medium' },
    dateLong: { dateStyle: 'long' },
    dateFull: { dateStyle: 'full' },

    weekdayShort: { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' },
    weekdayLong: { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' },

    monthYearShort: { year: 'numeric', month: 'short' },
    monthYearLong: { year: 'numeric', month: 'long' },
    yearOnly: { year: 'numeric' },
    monthOnlyShort: { month: 'short' },
    monthOnlyLong: { month: 'long' },

    dayMonthShort: { day: '2-digit', month: 'short' },
    dayMonthLong: { day: '2-digit', month: 'long' },

    time24: { hour: '2-digit', minute: '2-digit', hour12: false },
    time24Seconds: { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
    time12: { hour: 'numeric', minute: '2-digit', hour12: true },
    time12Seconds: { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true },

    dateTimeShort: { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false },
    dateTimeShort12: { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true },

    dateTimeLong: { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false },
    dateTimeLong12: { year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true },

    dateTimeSeconds: { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
    dateTimeSeconds12: { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true },
};

export function parseDateInput(v: DateInput): Date | null {
    if (v == null || v === '') return null;
    if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
}

function formatIso(d: Date, mask: 'isoDate' | 'isoDateTime' | 'isoDateTimeSeconds' | 'isoDateTimeZ') {
    if (mask === 'isoDate') return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    if (mask === 'isoDateTime')
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    if (mask === 'isoDateTimeSeconds')
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
    return d.toISOString();
}

function formatNumeric(d: Date, mask: 'dmySlash' | 'dmyDash' | 'mdySlash' | 'ymdDash' | 'ymdSlash' | 'yearMonthNumeric') {
    const Y = d.getFullYear();
    const M = pad2(d.getMonth() + 1);
    const D = pad2(d.getDate());
    if (mask === 'dmySlash') return `${D}/${M}/${Y}`;
    if (mask === 'dmyDash') return `${D}-${M}-${Y}`;
    if (mask === 'mdySlash') return `${M}/${D}/${Y}`;
    if (mask === 'ymdDash') return `${Y}-${M}-${D}`;
    if (mask === 'ymdSlash') return `${Y}/${M}/${D}`;
    return `${Y}-${M}`;
}

export function formatColumnDate(raw: DateInput, date?: ColumnDateFormat | DateMask): React.ReactNode {
    const spec: ColumnDateFormat | undefined = typeof date === 'string' ? { mask: date } : date;

    const emptyText = spec?.emptyText ?? null;
    const invalidText = spec?.invalidText ?? null;

    if (raw == null || raw === '') return emptyText;

    const d = parseDateInput(raw);
    if (!d) return invalidText;

    if (spec?.format) return spec.format(d, raw);

    const mask = spec?.mask ?? 'dateMedium';

    if (mask === 'isoDate' || mask === 'isoDateTime' || mask === 'isoDateTimeSeconds' || mask === 'isoDateTimeZ') {
        return formatIso(d, mask);
    }

    if (
        mask === 'dmySlash' ||
        mask === 'dmyDash' ||
        mask === 'mdySlash' ||
        mask === 'ymdDash' ||
        mask === 'ymdSlash' ||
        mask === 'yearMonthNumeric'
    ) {
        return formatNumeric(d, mask);
    }

    const opts = DATE_MASK_PRESETS[mask] ?? DATE_MASK_PRESETS.dateMedium;
    return new Intl.DateTimeFormat(spec?.locale, {
        ...opts,
        timeZone: spec?.timeZone,
    }).format(d);
}

export interface DateTextProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'color'> {
    value: DateInput;
    date?: ColumnDateFormat | DateMask;
    emptyText?: React.ReactNode;
    invalidText?: React.ReactNode;
    fallback?: React.ReactNode;
    weight?: string | number;
}

export function DateText({
    value,
    date,
    emptyText = '—',
    invalidText = 'Invalid date',
    fallback = 'Unknown',
    ...textProps
}: DateTextProps) {
    const dateSpec: ColumnDateFormat | undefined = !date ? undefined : typeof date === 'string' ? { mask: date } : date;

    const mergedSpec: ColumnDateFormat | undefined = dateSpec
        ? {
              ...dateSpec,
              emptyText: dateSpec.emptyText ?? emptyText,
              invalidText: dateSpec.invalidText ?? invalidText,
          }
        : {
              emptyText,
              invalidText,
          };

    const formatted = formatColumnDate(value, mergedSpec);
    const content = formatted ?? fallback;

    return (
        <Text variant="small" weight={500} {...(textProps as any)}>
            {content}
        </Text>
    );
}
export default DateText;
