import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button as SmartButton } from '@/components/ui/smart-button';
import { cn } from '@/lib/utils';
import * as React from 'react';

type Tone = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'theme' | 'white' | 'grey' | 'secondary' | 'neutral';
type Emphasis = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
type BtnSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'icon-sm' | 'icon-md' | 'icon-lg' | 'icon-xl' | 'icon-2xl' | 'icon-3xl' | 'icon';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

type CloseFn = () => void;
type RenderProp = (ctx: { close: CloseFn }) => React.ReactNode;

export type SmartPopoverProps = {
    /** controlled/uncontrolled */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;

    /** Popover placement & behavior */
    side?: Side;
    align?: Align;
    sideOffset?: number;
    alignOffset?: number;
    avoidCollisions?: boolean;
    collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
    contentClassName?: string;

    /** Match content min-width to the SmartButton we render here (ignored if using child trigger) */
    matchTriggerWidth?: boolean;

    /** Test id for the button trigger we render */
    testId?: string;

    /** Children may include <PopoverTrigger> and/or <PopoverContent>.
     *  If no <PopoverContent>, remaining children are auto-wrapped.
     *  Children can be a function: ({ close }) => ReactNode
     */
    children?: React.ReactNode | RenderProp;

    /* ---------- SmartButton props for prop-driven trigger (child trigger overrides) ---------- */
    /** Button inner content (wins over label) */
    button?: React.ReactNode;
    /** Short text label for button (used when `button` not provided) */
    label?: React.ReactNode;
    /** Left/right icon */
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';

    /** Styling forwarded to SmartButton */
    tone?: Tone;
    emphasis?: Emphasis;
    size?: BtnSize;
    rounding?: 'md' | 'full' | 'none';
    loading?: boolean;
    disabled?: boolean;
    /** Class for the SmartButton trigger */
    className?: string;
    /** Class for SmartButton’s inner label span */
    contentInnerClassName?: string;
    /** Icon size for SmartButton */
    iconSize?: number | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
};

const DEFAULT_MAX_H_CLASS = 'max-h-[calc(var(--radix-popper-available-height)-0.75rem)] overflow-y-auto overscroll-contain';

export const SmartPopover: React.FC<SmartPopoverProps> = ({
    /* state */
    open: openProp,
    defaultOpen,
    onOpenChange,

    /* position */
    side,
    align,
    sideOffset = 6,
    alignOffset,
    avoidCollisions,
    collisionPadding,
    contentClassName,

    matchTriggerWidth,
    testId,

    /* smart content (children or render-prop) */
    children,

    /* SmartButton config (no "trigger" prefix) */
    button,
    label,
    icon,
    iconPosition = 'left',
    tone = 'grey',
    emphasis = 'outline',
    size = 'md',
    rounding = 'md',
    loading,
    disabled,
    className,
    contentInnerClassName,
    iconSize,
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(!!defaultOpen);
    const controlled = typeof openProp === 'boolean';
    const open = controlled ? (openProp as boolean) : uncontrolledOpen;

    const setOpen = (val: boolean) => {
        if (!controlled) setUncontrolledOpen(val);
        onOpenChange?.(val);
    };

    const close = React.useCallback<CloseFn>(() => setOpen(false), [controlled, onOpenChange]);

    // ---- Inspect children for PopoverTrigger / PopoverContent ----
    // @ts-ignore
    const nodes = React.Children.toArray(children ?? []);
    let hasChildTrigger = false;
    let hasChildContent = false;

    const triggerNodes: React.ReactNode[] = [];
    const contentNodes: React.ReactNode[] = [];

    nodes.forEach((child) => {
        if (!React.isValidElement(child)) {
            contentNodes.push(child);
            return;
        }
        if (child.type === PopoverTrigger) {
            hasChildTrigger = true;
            triggerNodes.push(child);
            return;
        }
        if (child.type === PopoverContent) {
            hasChildContent = true;
            contentNodes.push(child);
            return;
        }
        contentNodes.push(child);
    });

    // ---- Build prop-driven SmartButton trigger (only if no child trigger) ----
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);

    const propButtonTrigger =
        !hasChildTrigger && (button || label || icon) ? (
            <PopoverTrigger asChild>
                <SmartButton
                    ref={triggerRef as any}
                    tone={tone}
                    emphasis={emphasis}
                    size={size}
                    rounding={rounding}
                    loading={loading}
                    disabled={disabled}
                    className={className}
                    contentClassName={contentInnerClassName}
                    icon={icon}
                    iconPosition={iconPosition}
                    iconSize={iconSize}
                    data-testid={testId}
                >
                    {button ?? label}
                </SmartButton>
            </PopoverTrigger>
        ) : null;

    // When matching width, compute CSS var from our SmartButton trigger
    const contentStyle = React.useMemo<React.CSSProperties | undefined>(() => {
        if (!matchTriggerWidth || !triggerRef.current) return undefined;
        const w = triggerRef.current.offsetWidth;
        return { ['--sp-trigger-w' as any]: `${w}px` };
    }, [matchTriggerWidth, open]);

    // ---- Build final content ----
    const builtContent = hasChildContent
        ? contentNodes.map((child: any) => {
              if (!React.isValidElement(child) || child.type !== PopoverContent) return child;

              return React.cloneElement(child as React.ReactElement<any>, {
                  side: ((child.props as any).side ?? side) as Side,
                  align: ((child.props as any).align ?? align) as Align,
                  sideOffset: (child.props as any).sideOffset ?? sideOffset,
                  alignOffset: (child.props as any).alignOffset ?? alignOffset,
                  avoidCollisions: (child.props as any).avoidCollisions ?? avoidCollisions,
                  collisionPadding: (child.props as any).collisionPadding ?? collisionPadding,

                  // ✅ enforce width-match + viewport-safe height on content
                  className: cn(matchTriggerWidth && 'min-w-[--sp-trigger-w]', DEFAULT_MAX_H_CLASS, (child.props as any).className),

                  // keep their style, add our vars if needed
                  style: { ...((child.props as any).style || {}), ...(contentStyle || {}) },
              });
          })
        : [
              <PopoverContent
                  key="__auto"
                  side={side}
                  align={align}
                  sideOffset={sideOffset}
                  alignOffset={alignOffset}
                  avoidCollisions={avoidCollisions}
                  collisionPadding={collisionPadding}
                  className={cn(matchTriggerWidth && 'min-w-[--sp-trigger-w]', DEFAULT_MAX_H_CLASS, contentClassName)}
                  style={contentStyle}
              >
                  {typeof children === 'function' ? (children as RenderProp)({ close }) : contentNodes}
              </PopoverContent>,
          ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {/* Child trigger (wins) or our SmartButton trigger */}
            {hasChildTrigger ? triggerNodes : propButtonTrigger}

            {/* Content (child-provided or auto-wrapped; render-prop supported) */}
            {builtContent}
        </Popover>
    );
};
SmartPopover.displayName = 'SmartPopover';
