import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Measurable {
    getBoundingClientRect(): DOMRect;
}

export type PopoverAnchorTarget = 
    | React.RefObject<Measurable | null>
    | Measurable
    | null;

export interface PopoverProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {
    /**
     * An optional ref, DOM element, or virtual element to anchor the popover content to.
     * When provided, it overrides the default trigger anchoring.
     */
    anchor?: PopoverAnchorTarget;
}

function Popover({ anchor, children, ...props }: PopoverProps) {
    return (
        <PopoverPrimitive.Root data-slot="popover" {...props}>
            {anchor && <PopoverAnchor anchor={anchor} />}
            {children}
        </PopoverPrimitive.Root>
    );
}

const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverPortal = PopoverPrimitive.Portal;
const PopoverClose = PopoverPrimitive.Close;
const PopoverArrow = PopoverPrimitive.Arrow;

export interface PopoverAnchorProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor> {
    /**
     * An optional ref, DOM element, or virtual element to anchor the popover content to.
     */
    anchor?: PopoverAnchorTarget;
}

const PopoverAnchor = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Anchor>,
    PopoverAnchorProps
>(({ anchor, ...props }, ref) => {
    // Dynamically calculate the element's client rect for positioning
    const virtualRef = React.useMemo(() => {
        if (!anchor) return undefined;
        return {
            current: {
                getBoundingClientRect: () => {
                    const element = anchor && 'current' in anchor ? anchor.current : anchor;
                    return element ? element.getBoundingClientRect() : new DOMRect(0, 0, 0, 0);
                }
            }
        };
    }, [anchor]);

    return <PopoverPrimitive.Anchor ref={ref} virtualRef={virtualRef} {...props} />;
});
PopoverAnchor.displayName = 'PopoverAnchor';

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
    /**
     * Whether the content should be rendered inside a Portal.
     * @default true
     */
    portalled?: boolean;
    /**
     * Optional props to pass to the Portal wrapper.
     */
    portalProps?: Omit<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>, 'children'>;
}

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    PopoverContentProps
>(({ className, align = 'center', sideOffset = 4, portalled = true, portalProps, ...props }, ref) => {
    const content = (
        <PopoverPrimitive.Content
            ref={ref}
            data-slot="popover-content"
            align={align}
            sideOffset={sideOffset}
            className={cn(
                'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    );

    if (portalled) {
        return <PopoverPrimitive.Portal {...portalProps}>{content}</PopoverPrimitive.Portal>;
    }

    return content;
});
PopoverContent.displayName = 'PopoverContent';

export {
    Popover,
    PopoverTrigger,
    PopoverAnchor,
    PopoverContent,
    PopoverPortal,
    PopoverClose,
    PopoverArrow,
};
