import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/smart-button';
import type { ButtonProps } from '@/components/ui/smart-button';
import { cn } from '@/lib/utils';

export interface MenuItem<T = string> {
    label: React.ReactNode;
    value: T;
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export interface MenuPlacement {
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    alignOffset?: number;
}

export interface SplitButtonProps<T = string> extends Omit<ButtonProps, 'onClick' | 'onSelect'> {
    items: MenuItem<T>[];
    onPrimaryClick?: React.MouseEventHandler<HTMLButtonElement>;
    onSelect?: (value: T, ev: Event) => void;
    menuClassName?: string;
    placement?: MenuPlacement;
    caret?: React.ReactNode;
}

export function SplitButton<T = string>({
    items,
    onPrimaryClick,
    onSelect,
    menuClassName,
    placement,
    caret,
    className,
    ...btn
}: SplitButtonProps<T>) {
    return (
        <div className="isolate inline-flex shadow-xs rounded-md">
            <Button
                {...btn}
                className={cn('rounded-r-none border-r-0 focus-visible:z-10', className)}
                onClick={onPrimaryClick}
            />
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <Button
                        aria-label="Open split menu"
                        tone={btn.tone}
                        emphasis={btn.emphasis}
                        size={btn.size}
                        rounding="md"
                        className="rounded-l-none px-2 focus-visible:z-10"
                    >
                        {caret ?? <ChevronDown className="size-4 shrink-0" />}
                    </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className={cn(
                            'z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
                            'data-[side=bottom]:animate-in data-[side=bottom]:slide-in-from-top-2',
                            'data-[side=top]:animate-in data-[side=top]:slide-in-from-bottom-2',
                            'data-[side=left]:animate-in data-[side=left]:slide-in-from-right-2',
                            'data-[side=right]:animate-in data-[side=right]:slide-in-from-left-2',
                            menuClassName
                        )}
                        side={placement?.side ?? 'bottom'}
                        align={placement?.align ?? 'end'}
                        sideOffset={placement?.sideOffset ?? 6}
                        alignOffset={placement?.alignOffset ?? 0}
                    >
                        {items.map((it, i) => (
                            <DropdownMenu.Item
                                key={i}
                                className={cn(
                                    'flex cursor-default items-center gap-2 px-3 py-2 text-sm outline-hidden select-none transition-colors',
                                    'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                                    it.className
                                )}
                                disabled={it.disabled}
                                onSelect={(ev) => {
                                    onSelect?.(it.value, ev);
                                }}
                            >
                                {it.icon && <span className="inline-flex items-center shrink-0">{it.icon}</span>}
                                <span className="flex-1">{it.label}</span>
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}

SplitButton.displayName = 'SplitButton';
