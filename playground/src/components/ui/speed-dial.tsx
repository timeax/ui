import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SpeedDialPlacement = 'br' | 'bl' | 'tr' | 'tl' | 'center';
export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right';
export type SpeedDialLayout = 'radial' | 'linear';

export interface DialProps {
    layout?: SpeedDialLayout;
    direction?: SpeedDialDirection;
    spacing?: number;
    radius?: number;
    angleStart?: number;
    angleSweep?: number;
    staggerMs?: number;
    open: boolean;
    children: React.ReactNode;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

const Dial: React.FC<DialProps> = ({
    layout = 'radial',
    direction = 'up',
    spacing = 56,
    radius = 96,
    angleStart = 225,
    angleSweep = 90,
    staggerMs = 35,
    open,
    children,
}) => {
    const items = React.Children.toArray(children);

    return (
        <AnimatePresence>
            {open && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    {items.map((child, i) => {
                        let x = 0;
                        let y = 0;

                        if (layout === 'linear') {
                            const d = (i + 1) * spacing;
                            if (direction === 'up') y = -d;
                            else if (direction === 'down') y = d;
                            else if (direction === 'left') x = -d;
                            else x = d;
                        } else {
                            const count = items.length;
                            const step = count > 1 ? angleSweep / (count - 1) : 0;
                            const angle = angleStart + step * i;
                            x = Math.cos(toRad(angle)) * radius;
                            y = Math.sin(toRad(angle)) * radius;
                        }

                        const delay = (i * staggerMs) / 1000;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                                animate={{ opacity: 1, scale: 1, x, y }}
                                exit={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25, delay }}
                                className="pointer-events-auto absolute"
                            >
                                {child}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </AnimatePresence>
    );
};

export interface SpeedDialProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;

    trigger?: React.ReactNode;
    openOnHover?: boolean;
    closeOnAction?: boolean;
    closeOnOutside?: boolean;
    escToClose?: boolean;

    placement?: SpeedDialPlacement;
    offset?: number;
    zIndex?: number;
    portal?: boolean;
    backdrop?: boolean;

    size?: 'sm' | 'md' | 'lg';
    className?: string;
    
    // Fanout configurations
    layout?: SpeedDialLayout;
    direction?: SpeedDialDirection;
    spacing?: number;
    radius?: number;
    angleStart?: number;
    angleSweep?: number;
    staggerMs?: number;

    children: React.ReactNode;
}

export interface SpeedDialActionProps {
    icon: React.ReactNode;
    label?: React.ReactNode;
    onClick?(): void;
    href?: string;
    disabled?: boolean;
    tooltip?: string;
    className?: string;
    id?: string;
    placement?: SpeedDialPlacement;
}

function placementStyle(p: SpeedDialPlacement, offset: number): React.CSSProperties {
    const o = `${offset}px`;
    switch (p) {
        case 'br':
            return { right: o, bottom: o };
        case 'bl':
            return { left: o, bottom: o };
        case 'tr':
            return { right: o, top: o };
        case 'tl':
            return { left: o, top: o };
        case 'center':
            return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
    }
}

const sizeMap = {
    sm: 'h-11 w-11',
    md: 'h-14 w-14',
    lg: 'h-16 w-16',
};

export const SpeedDial: React.FC<SpeedDialProps> & { Action: React.FC<SpeedDialActionProps> } = ({
    open,
    defaultOpen = false,
    onOpenChange,
    trigger,
    openOnHover = false,
    closeOnAction = true,
    closeOnOutside = true,
    escToClose = true,
    placement = 'br',
    offset = 20,
    zIndex = 50,
    portal = true,
    backdrop = false,
    size = 'md',
    className,
    layout = 'radial',
    direction = 'up',
    spacing = 56,
    radius = 96,
    angleStart = 225,
    angleSweep = 90,
    staggerMs = 35,
    children,
}) => {
    const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const setOpen = (v: boolean) => {
        if (!isControlled) setInternalOpen(v);
        onOpenChange?.(v);
    };

    const rootRef = React.useRef<HTMLDivElement | null>(null);

    // outside click
    React.useEffect(() => {
        if (!closeOnOutside || !isOpen) return;
        const onDown = (e: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        window.addEventListener('mousedown', onDown);
        return () => window.removeEventListener('mousedown', onDown);
    }, [closeOnOutside, isOpen]);

    // ESC to close
    React.useEffect(() => {
        if (!escToClose || !isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [escToClose, isOpen]);

    const Host: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const style = placementStyle(placement, offset);
        const content = (
            <div
                ref={rootRef}
                style={{ ...style, zIndex }}
                className={cn('fixed flex items-center justify-center', className)}
                onMouseEnter={() => openOnHover && setOpen(true)}
                onMouseLeave={() => openOnHover && setOpen(false)}
            >
                <div className="relative flex items-center justify-center">
                    {/* Actions fan */}
                    <Dial
                        open={isOpen}
                        layout={layout}
                        direction={direction}
                        spacing={spacing}
                        radius={radius}
                        angleStart={angleStart}
                        angleSweep={angleSweep}
                        staggerMs={staggerMs}
                    >
                        {React.Children.map(children, (child) => {
                            if (React.isValidElement<SpeedDialActionProps>(child)) {
                                return React.cloneElement(child, {
                                    placement,
                                    onClick: () => {
                                        child.props.onClick?.();
                                        if (closeOnAction) setOpen(false);
                                    },
                                });
                            }
                            return child;
                        })}
                    </Dial>

                    {/* Trigger button */}
                    <motion.button
                        type="button"
                        aria-label="Toggle Speed Dial"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(!isOpen)}
                        className={cn(
                            'text-primary-foreground rounded-full bg-primary shadow-lg grid place-items-center hover:shadow-xl focus:ring-2 focus:ring-primary/40 focus:outline-hidden hover:cursor-pointer z-10 transition-shadow',
                            sizeMap[size]
                        )}
                        initial={false}
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    >
                        {trigger ?? <Plus className="size-6" />}
                    </motion.button>
                </div>
            </div>
        );

        if (!portal) return content;
        const mount = typeof window !== 'undefined' ? document.body : null;
        return mount ? createPortal(content, mount) : null;
    };

    return (
        <>
            <AnimatePresence>
                {backdrop && isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        style={{ zIndex: zIndex - 1 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>
            <Host>{children}</Host>
        </>
    );
};

export const SpeedDialAction: React.FC<SpeedDialActionProps> = ({
    icon,
    label,
    href,
    disabled,
    onClick,
    tooltip,
    className,
    id,
    placement = 'br',
}) => {
    const actionRef = React.useRef<HTMLDivElement | null>(null);
    const [labelSide, setLabelSide] = React.useState<'left' | 'right' | 'top' | 'bottom'>(() => {
        return placement === 'br' || placement === 'tr' ? 'left' : 'right';
    });

    const updateLabelSide = React.useCallback(() => {
        if (!actionRef.current) return;
        const rect = actionRef.current.getBoundingClientRect();
        const vw = typeof window !== 'undefined' ? window.innerWidth || document.documentElement.clientWidth : 1024;
        const vh = typeof window !== 'undefined' ? window.innerHeight || document.documentElement.clientHeight : 768;

        const spaceLeft = rect.left;
        const spaceRight = vw - rect.right;
        const minSpace = 110;

        if (spaceLeft < minSpace && spaceRight >= minSpace) {
            setLabelSide('right');
        } else if (spaceRight < minSpace && spaceLeft >= minSpace) {
            setLabelSide('left');
        } else if (spaceLeft < minSpace && spaceRight < minSpace) {
            if (rect.top > 60) {
                setLabelSide('top');
            } else {
                setLabelSide('bottom');
            }
        } else {
            const preferredLeft = placement === 'br' || placement === 'tr';
            setLabelSide(preferredLeft ? 'left' : 'right');
        }
    }, [placement]);

    React.useEffect(() => {
        updateLabelSide();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', updateLabelSide);
            return () => window.removeEventListener('resize', updateLabelSide);
        }
    }, [updateLabelSide]);

    const btnClass = cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full bg-card text-foreground shadow-md ring-1 ring-border hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-primary/40 hover:cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none z-10',
        className
    );

    const content = href && !disabled ? (
        <a href={href} className={btnClass} id={id} title={tooltip}>
            {icon}
        </a>
    ) : (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={btnClass}
            id={id}
            title={tooltip}
        >
            {icon}
        </button>
    );

    const sideClasses = {
        left: 'right-full mr-3 top-1/2 -translate-y-1/2 origin-right',
        right: 'left-full ml-3 top-1/2 -translate-y-1/2 origin-left',
        top: 'bottom-full mb-3 left-1/2 -translate-x-1/2 origin-bottom',
        bottom: 'top-full mt-3 left-1/2 -translate-x-1/2 origin-top',
    };

    return (
        <div
            ref={actionRef}
            className="group relative flex items-center justify-center"
            onMouseEnter={updateLabelSide}
            onFocus={updateLabelSide}
        >
            {content}
            {label && (
                <span
                    className={cn(
                        'absolute rounded-md bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-sm ring-1 ring-border whitespace-nowrap z-20',
                        'opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 scale-90 group-hover:scale-100',
                        sideClasses[labelSide]
                    )}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

SpeedDial.Action = SpeedDialAction;
SpeedDial.displayName = 'SpeedDial';
SpeedDialAction.displayName = 'SpeedDialAction';
export default SpeedDial;

