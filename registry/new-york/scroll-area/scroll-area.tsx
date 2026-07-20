import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
    viewportClassName?: string;
    viewportRef?: React.Ref<HTMLDivElement>;
    viewportProps?: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ className, children, viewportClassName, viewportRef, viewportProps, ...props }, ref) => {
        return (
            <ScrollAreaPrimitive.Root
                ref={ref}
                data-slot="scroll-area"
                className={cn('relative overflow-hidden', className)}
                {...props}
            >
                <ScrollAreaPrimitive.Viewport
                    {...viewportProps}
                    ref={viewportRef}
                    data-slot="scroll-area-viewport"
                    className={cn('h-full w-full rounded-[inherit] outline-hidden', viewportClassName, viewportProps?.className)}
                >
                    {children}
                </ScrollAreaPrimitive.Viewport>
                <ScrollBar />
                <ScrollAreaPrimitive.Corner />
            </ScrollAreaPrimitive.Root>
        );
    }
);
ScrollArea.displayName = 'ScrollArea';

function ScrollBar({
    className,
    orientation = 'vertical',
    ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) {
    return (
        <ScrollAreaPrimitive.Scrollbar
            data-slot="scroll-area-scrollbar"
            orientation={orientation}
            className={cn(
                'flex select-none touch-none transition-colors',
                orientation === 'vertical' && 'h-full w-2 border-l border-l-transparent p-[1px]',
                orientation === 'horizontal' && 'h-2 flex-col border-t border-t-transparent p-[1px]',
                className
            )}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot="scroll-area-thumb"
                className="relative flex-1 rounded-full bg-muted-foreground/30 transition-colors hover:bg-muted-foreground/45"
            />
        </ScrollAreaPrimitive.Scrollbar>
    );
}

export { ScrollArea, ScrollBar };
