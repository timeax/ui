import * as React from 'react';
import { CheckCircle2, Loader2, XCircle, AlertTriangle, Info, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/smart-button';
import type { ButtonProps, Tone } from '@/components/ui/smart-button';
import { cn } from '@/lib/utils';

export type StatusVariant = 'solid' | 'soft' | 'outline' | 'ghost';

export interface StatusButtonProps extends Omit<ButtonProps, 'tone' | 'emphasis'> {
    status: string;
    variant?: StatusVariant;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    defaultIcon?: 'left' | 'right';
    loading?: boolean;
}

const statusToneMap: Record<string, Tone> = {
    success: 'success',
    completed: 'success',
    active: 'success',
    pending: 'warning',
    processing: 'warning',
    warning: 'warning',
    failed: 'danger',
    error: 'danger',
    danger: 'danger',
    info: 'info',
    draft: 'grey',
    inactive: 'neutral',
    suspended: 'neutral',
};

const statusIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    success: CheckCircle2,
    completed: CheckCircle2,
    active: CheckCircle2,
    pending: Loader2,
    processing: Loader2,
    warning: AlertTriangle,
    failed: XCircle,
    error: XCircle,
    danger: XCircle,
    info: Info,
    draft: Info,
    inactive: MinusCircle,
    suspended: MinusCircle,
};

export const StatusButton = React.forwardRef<HTMLButtonElement, StatusButtonProps>(
    (
        {
            status,
            variant = 'soft',
            leftIcon,
            rightIcon,
            defaultIcon,
            loading = false,
            className,
            disabled,
            children,
            ...rest
        },
        ref
    ) => {
        const normalizedStatus = status.toLowerCase();
        const tone = statusToneMap[normalizedStatus] ?? 'primary';
        
        // Find mapped icon
        const DefaultIcon = statusIconMap[normalizedStatus] ?? Info;
        const isPending = normalizedStatus === 'pending' || normalizedStatus === 'processing';

        const showLeftIcon = leftIcon !== undefined ? leftIcon : (defaultIcon === 'left' && !loading) ? (
            <DefaultIcon className={cn('size-4 shrink-0', isPending && 'animate-spin')} />
        ) : null;

        const showRightIcon = rightIcon !== undefined ? rightIcon : (defaultIcon === 'right' && !loading) ? (
            <DefaultIcon className={cn('size-4 shrink-0', isPending && 'animate-spin')} />
        ) : null;

        return (
            <Button
                ref={ref}
                tone={tone}
                emphasis={variant}
                loading={loading}
                disabled={disabled}
                icon={showLeftIcon || undefined}
                iconPosition="left"
                className={cn('capitalize', className)}
                {...rest}
            >
                {/* Wrap children and right icon correctly */}
                {showRightIcon ? (
                    <span className="inline-flex items-center gap-2">
                        <span>{children ?? status}</span>
                        {showRightIcon}
                    </span>
                ) : (
                    children ?? status
                )}
            </Button>
        );
    }
);

StatusButton.displayName = 'StatusButton';
