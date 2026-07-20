import * as React from 'react';
import type { ColumnProps } from './data-table.types';
import { isFrozenLeft, isFrozenRight } from './data-table.utils';

/* Measure columns for sticky offsets */
export function useStickyOffsets<T>(cols: ColumnProps<T>[], deps: any[]) {
    const headerRefs = React.useRef<Array<HTMLTableCellElement | null>>([]);
    const [leftOffsets, setLeft] = React.useState<number[]>([]);
    const [rightOffsets, setRight] = React.useState<number[]>([]);

    React.useEffect(() => {
        const elms = headerRefs.current.filter(Boolean) as HTMLTableCellElement[];
        if (!elms.length) {
            setLeft([]);
            setRight([]);
            return;
        }

        const compute = () => {
            const widths = elms.map((el) => el.offsetWidth);
            const left: number[] = new Array(widths.length).fill(0);
            let acc = 0;
            for (let i = 0; i < widths.length; i++) {
                left[i] = acc;
                if (isFrozenLeft(cols[i])) acc += widths[i];
            }

            const right: number[] = new Array(widths.length).fill(0);
            acc = 0;
            for (let i = widths.length - 1; i >= 0; i--) {
                right[i] = acc;
                if (isFrozenRight(cols[i])) acc += widths[i];
            }
            setLeft(left);
            setRight(right);
        };

        compute(); // initial

        const obs = new ResizeObserver(compute);
        elms.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { headerRefs, leftOffsets, rightOffsets };
}
