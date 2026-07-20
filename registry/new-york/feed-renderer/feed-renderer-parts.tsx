import { Button } from '@/components/ui/smart-button';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import * as React from 'react';
import type {
    MessageActionCore,
    MessageActionPayload,
    MessageIconPayload,
    MessageLinePayload,
    MessageLineType,
} from './feed-renderer.types';

/* =========================================================================
 * MessageIcon
 * ========================================================================= */

export interface MessageIconProps {
    data: MessageIconPayload;
    className?: string;
    resolveIcon?: (icon: string) => React.ReactNode;
}

const MAX_ICON_SIZE = 28;

function sanitizeIconPayload(icon: MessageIconPayload | undefined | null): MessageIconPayload | undefined {
    if (!icon) return undefined;

    const clampedWidth = typeof icon.width === 'number' ? Math.min(icon.width, MAX_ICON_SIZE) : (icon.width ?? undefined);
    const clampedHeight = typeof icon.height === 'number' ? Math.min(icon.height, MAX_ICON_SIZE) : (icon.height ?? undefined);

    const rawProps = (icon.props ?? {}) as Record<string, unknown>;
    const props: Record<string, unknown> = { ...rawProps };

    if ('width' in props) delete props.width;
    if ('maxWidth' in props) delete props.maxWidth;

    return {
        ...icon,
        width: clampedWidth ?? undefined,
        height: clampedHeight ?? undefined,
        props,
    };
}

export const MessageIcon: React.FC<MessageIconProps> = ({ data, className, resolveIcon }) => {
    const { icon, width, height, bgColor, position, fullLine, type, props: stylePropsRaw } = data;
    const editorId = data.__editorId;

    const rawStyles = (stylePropsRaw ?? {}) as { container?: React.CSSProperties; icon?: React.CSSProperties };
    const containerStyleProps = rawStyles.container ?? {};
    const iconStyleProps = rawStyles.icon ?? {};

    const wrapperStyle: React.CSSProperties = {
        ...containerStyleProps,
        ...(bgColor ? { backgroundColor: bgColor } : null),
    };

    const hasWidthClass = !!className && /\bw-[-\w/]+\b/.test(className);
    const hasHeightClass = !!className && /\bh-[-\w/]+\b/.test(className);

    const fallbackWidthClass = !width && !hasWidthClass ? 'w-5' : '';
    const fallbackHeightClass = !height && !hasHeightClass ? 'h-5' : '';

    const wrapperClasses = cn('inline-flex flex-shrink-0 items-center justify-center', fallbackWidthClass, fallbackHeightClass, className);

    const wrapperDataAttrs = {
        'data-icon-position': position ?? undefined,
        'data-icon-full-line': fullLine ? 'true' : undefined,
        'data-icon-type': type ?? 'icon',
    };

    if (resolveIcon) {
        const customIcon = resolveIcon(icon);
        if (customIcon) {
            return (
                <span
                    className={wrapperClasses}
                    style={wrapperStyle}
                    {...wrapperDataAttrs}
                    data-renderable-kind="icon"
                    data-renderable-id={editorId}
                >
                    {customIcon}
                </span>
            );
        }
    }

    if (type === 'image') {
        const imageWrapperStyle: React.CSSProperties = {
            ...wrapperStyle,
            ...(width != null ? { width: typeof width === 'number' ? `${width}px` : width } : null),
            ...(height != null ? { height: typeof height === 'number' ? `${height}px` : height } : null),
        };

        return (
            <span
                className={wrapperClasses}
                style={imageWrapperStyle}
                {...wrapperDataAttrs}
                data-renderable-kind="icon"
                data-renderable-id={editorId}
            >
                <img src={icon} alt="" className="max-h-full max-w-full object-contain" style={iconStyleProps} />
            </span>
        );
    }

    const logicalSize = width ?? height;
    const iconStyle: React.CSSProperties = {
        ...iconStyleProps,
        ...(logicalSize != null
            ? {
                  fontSize: typeof logicalSize === 'number' ? `${logicalSize}px` : logicalSize,
              }
            : null),
    };

    return (
        <span
            className={wrapperClasses}
            style={wrapperStyle}
            {...wrapperDataAttrs}
            data-renderable-kind="icon"
            data-renderable-id={editorId}
        >
            <Icon icon={icon} className="h-full w-full" style={iconStyle} />
        </span>
    );
};

/* =========================================================================
 * MessageAction
 * ========================================================================= */

export interface MessageActionProps {
    data: MessageActionPayload;
    className?: string;
    onInteract?: () => void;
    onActionClick?: (action: MessageActionCore, event: React.MouseEvent) => void;
    resolveIcon?: (icon: string) => React.ReactNode;
}

function isButtonPayload(payload: MessageActionPayload): payload is {
    text: string;
    variant: string | null;
    color: string | null;
    weight: string | null;
    action: MessageActionCore;
    icon?: MessageIconPayload | null;
    fullWidth?: boolean | null;
    canDismiss?: boolean | null;
    __editorId?: string;
} {
    return 'text' in payload;
}

type ButtonTone = React.ComponentProps<typeof Button>['tone'];
type ButtonEmphasis = React.ComponentProps<typeof Button>['emphasis'];

function mapColorToTone(color: string | null | undefined): ButtonTone {
    switch (color) {
        case 'success':
            return 'success';
        case 'info':
            return 'info';
        case 'warning':
            return 'warning';
        case 'destructive':
        case 'error':
            return 'danger';
        case 'primary':
            return 'primary';
        case 'white':
            return 'white';
        case 'grey':
            return 'grey';
        default:
            return 'theme';
    }
}

function mapVariantToEmphasis(variant: string | null | undefined): ButtonEmphasis {
    if (!variant) return 'solid';

    switch (variant) {
        case 'solid':
        case 'filled':
        case 'primary':
            return 'solid';
        case 'soft':
        case 'subtle':
            return 'soft';
        case 'outline':
        case 'outlined':
            return 'outline';
        case 'ghost':
            return 'ghost';
        case 'link':
            return 'link';
        default:
            return 'solid';
    }
}

export const MessageAction: React.FC<MessageActionProps> = ({ data, className, onInteract, onActionClick, resolveIcon }) => {
    const isButton = isButtonPayload(data);
    const buttonData = isButton ? data : null;
    const core = isButton ? buttonData!.action : data;
    const editorId = data.__editorId;

    const handleClick = (e: React.MouseEvent) => {
        if (onActionClick) {
            onActionClick(core, e);
            return;
        }

        if (core.handler === 'blank' && core.route) {
            return;
        }

        e.preventDefault();

        if (core.canDismiss) {
            onInteract?.();
        }

        if (core.route) {
            window.location.href = core.route;
        }
    };

    const rawIconPayload = isButton ? (buttonData!.icon ?? core.icon) : core.icon;
    const iconPayload = sanitizeIconPayload(rawIconPayload);

    if (isButton) {
        const tone = mapColorToTone(buttonData!.color);
        const emphasis = mapVariantToEmphasis(buttonData!.variant);

        const asLink = !!core.route && core.handler === 'blank';
        const Comp: React.ElementType = asLink ? 'a' : 'button';

        return (
            <Button
                as={Comp}
                // @ts-ignore
                href={asLink ? (core.route! ?? undefined) : undefined}
                target={asLink ? '_blank' : undefined}
                rel={asLink ? 'noreferrer' : undefined}
                onClick={handleClick}
                data-renderable-kind="action"
                data-renderable-id={editorId}
                tone={tone}
                emphasis={emphasis}
                className={cn(core.fullWidth && 'w-full justify-center', className)}
                icon={iconPayload ? <MessageIcon data={iconPayload} className="shrink-0" resolveIcon={resolveIcon} /> : undefined}
                iconPosition="left"
            >
                {buttonData!.text}
            </Button>
        );
    }

    const InlineComp: React.ElementType = core.route ? 'a' : 'button';
    const inlineBase = 'inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4 focus:outline-none';

    return (
        <InlineComp
            href={core.route || undefined}
            target={core.handler === 'blank' ? '_blank' : undefined}
            rel={core.handler === 'blank' ? 'noreferrer' : undefined}
            onClick={handleClick}
            data-renderable-kind="action"
            data-renderable-id={editorId}
            className={cn(inlineBase, className, core.fullWidth && 'w-full justify-center')}
        >
            {iconPayload && <MessageIcon data={iconPayload} className="shrink-0" resolveIcon={resolveIcon} />}
            <span>Action</span>
        </InlineComp>
    );
};

/* =========================================================================
 * MessageLine
 * ========================================================================= */

export interface MessageLineProps {
    data: MessageLinePayload;
    className?: string;
    onActionInteract?: () => void;
    onActionClick?: (action: MessageActionCore, event: React.MouseEvent) => void;
    resolveIcon?: (icon: string) => React.ReactNode;
    contentMode?: 'normal' | 'centered';
}

function lineTypeToClasses(type: MessageLineType | string | null | undefined): string {
    switch (type) {
        case 'title':
            return 'font-semibold text-sm text-foreground';
        case 'subtitle':
            return 'text-xs text-muted-foreground';
        case 'body':
        case null:
        case undefined:
            return 'text-md text-foreground';
        case 'emphasis':
            return 'text-sm font-semibold text-foreground';
        case 'hint':
            return 'text-xs text-muted-foreground';
        case 'meta':
            return 'text-[11px] text-muted-foreground/90';
        case 'code':
            return 'font-mono text-xs bg-muted/60 px-1.5 py-0.5 rounded';
        case 'kbd':
            return 'text-[11px] font-medium tracking-wide inline-flex items-center rounded border px-1.5 py-0.5 bg-muted/70';
        case 'tag':
            return 'inline-flex items-center rounded-full bg-muted text-[11px] px-2 py-0.5 font-medium text-muted-foreground';
        case 'inline':
            return 'text-sm text-foreground';
        case 'list':
            return 'text-sm text-foreground';
        default:
            return 'text-sm text-foreground';
    }
}

type IconLayoutMode = 'flex' | 'vertical' | 'inline';

function getLineIconStyle(data: MessageLinePayload): IconLayoutMode {
    const raw = (data.props?.iconStyle ?? data.props?.icon_style) as IconLayoutMode | string | undefined;
    if (raw === 'vertical') return 'vertical';
    if (raw === 'inline') return 'inline';
    return 'flex';
}

function hasFullLineIcon(icons: MessageIconPayload[] | undefined): boolean {
    if (!icons || !icons.length) return false;
    return icons.some((i) => i.fullLine);
}

function splitIcons(icons: MessageIconPayload[] | undefined) {
    const left: MessageIconPayload[] = [];
    const right: MessageIconPayload[] = [];
    const inline: MessageIconPayload[] = [];
    const background: MessageIconPayload[] = [];

    if (!icons) {
        return { left, right, inline, background };
    }

    for (const icon of icons) {
        const pos = icon.position || undefined;
        if (pos === 'left') {
            left.push(icon);
        } else if (pos === 'right') {
            right.push(icon);
        } else if (pos === 'inline' || (typeof pos === 'string' && pos.startsWith('inline-'))) {
            inline.push(icon);
        } else if (pos === 'background') {
            background.push(icon);
        } else {
            left.push(icon);
        }
    }

    return { left, right, inline, background };
}

function getActionCoreFullWidth(action: MessageActionPayload | undefined): boolean {
    if (!action) return false;
    if ('text' in action) {
        return !!action.action.fullWidth;
    }
    return !!action.fullWidth;
}

export const MessageLine: React.FC<MessageLineProps> = ({
    data,
    className,
    onActionInteract,
    onActionClick,
    resolveIcon,
    contentMode = 'normal',
}) => {
    const { text, type, icons, action, newline } = data;
    const editorId = data.__editorId;

    const iconLayoutBase = getLineIconStyle(data);
    const { left, right, inline: inlineIcons } = splitIcons(icons);
    const actionFullWidth = getActionCoreFullWidth(action);
    const iconLayout: IconLayoutMode = hasFullLineIcon(icons) || iconLayoutBase === 'vertical' ? 'vertical' : iconLayoutBase;

    const textClasses = lineTypeToClasses(type);
    const isList = type === 'list';
    const isCentered = contentMode === 'centered';

    const renderAction = () =>
        action && (
            <MessageAction
                data={action}
                onInteract={onActionInteract}
                onActionClick={onActionClick}
                resolveIcon={resolveIcon}
            />
        );

    if (iconLayout === 'vertical') {
        return (
            <div
                className={cn('flex flex-col gap-1', newline && 'mt-1', className)}
                data-renderable-kind="line"
                data-renderable-id={editorId}
            >
                {icons && icons.length > 0 && (
                    <div className="flex flex-row flex-wrap items-center gap-1">
                        {icons.map((icon, idx) => (
                            <MessageIcon key={idx} data={icon} className="shrink-0" resolveIcon={resolveIcon} />
                        ))}
                    </div>
                )}

                <div className="flex items-start gap-2">
                    {isList && <span className="mt-[0.4em] inline-block h-1.5 w-1.5 rounded-full bg-foreground/70" />}
                    <span
                        className={cn('min-w-0 break-words', textClasses, isCentered && 'text-center')}
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                    {!actionFullWidth && action && <span className="ml-2 shrink-0">{renderAction()}</span>}
                </div>

                {actionFullWidth && action && <div className="mt-1">{renderAction()}</div>}
            </div>
        );
    }

    if (iconLayout === 'inline') {
        return (
            <div
                className={cn('flex flex-col', newline && 'mt-1', className)}
                data-renderable-kind="line"
                data-renderable-id={editorId}
            >
                <div className="inline-flex flex-wrap items-baseline gap-1">
                    {left.map((icon, idx) => (
                        <MessageIcon key={`left-${idx}`} data={icon} className="shrink-0" resolveIcon={resolveIcon} />
                    ))}

                    {isList && <span className="mt-[0.3em] inline-block h-1.5 w-1.5 rounded-full bg-foreground/70" />}

                    <span
                        className={cn('break-words', textClasses, isCentered && 'text-center')}
                        dangerouslySetInnerHTML={{ __html: text }}
                    />

                    {inlineIcons.map((icon, idx) => (
                        <MessageIcon key={`inline-${idx}`} data={icon} className="shrink-0" resolveIcon={resolveIcon} />
                    ))}

                    {right.map((icon, idx) => (
                        <MessageIcon key={`right-${idx}`} data={icon} className="shrink-0" resolveIcon={resolveIcon} />
                    ))}

                    {!actionFullWidth && action && <span className="ml-2">{renderAction()}</span>}
                </div>

                {actionFullWidth && action && <div className="mt-1">{renderAction()}</div>}
            </div>
        );
    }

    return (
        <div
            className={cn('flex flex-col', newline && 'mt-1', className)}
            data-renderable-kind="line"
            data-renderable-id={editorId}
        >
            <div className="flex items-start gap-2">
                {left.length > 0 && (
                    <div className="flex items-center gap-1 pt-0.5">
                        {left.map((icon, idx) => (
                            <MessageIcon key={`left-${idx}`} data={icon} className="shrink-0" resolveIcon={resolveIcon} />
                        ))}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-1">
                        {isList && <span className="mt-[0.3em] inline-block h-1.5 w-1.5 rounded-full bg-foreground/70" />}
                        <span
                            className={cn('break-words', textClasses, isCentered && 'w-full text-center')}
                            dangerouslySetInnerHTML={{ __html: text }}
                        />
                        {inlineIcons.length > 0 && (
                            <span className="inline-flex items-center gap-1">
                                {inlineIcons.map((icon, idx) => (
                                    <MessageIcon key={`inline-${idx}`} data={icon} className="shrink-0" resolveIcon={resolveIcon} />
                                ))}
                            </span>
                        )}
                    </div>
                </div>

                {!actionFullWidth && action && <div className="ml-2 shrink-0">{renderAction()}</div>}

                {right.length > 0 && (
                    <div className="flex items-center gap-1 pt-0.5">
                        {right.map((icon, idx) => (
                            <MessageIcon key={`right-${idx}`} data={icon} className="shrink-0" resolveIcon={resolveIcon} />
                        ))}
                    </div>
                )}
            </div>

            {actionFullWidth && action && <div className="mt-1">{renderAction()}</div>}
        </div>
    );
};

/* =========================================================================
 * MessageLines
 * ========================================================================= */

export interface MessageLinesProps {
    lines: MessageLinePayload[];
    className?: string;
    readMore?: boolean;
    maxChars?: number;
    onActionInteract?: () => void;
    onActionClick?: (action: MessageActionCore, event: React.MouseEvent) => void;
    resolveIcon?: (icon: string) => React.ReactNode;
    contentMode?: 'normal' | 'centered';
}

export const MessageLines: React.FC<MessageLinesProps> = ({
    lines,
    className,
    readMore = false,
    maxChars = 220,
    onActionInteract,
    onActionClick,
    resolveIcon,
    contentMode = 'normal',
}) => {
    const [expanded, setExpanded] = React.useState(false);

    const { visibleLines, hiddenCount, canToggle } = React.useMemo(() => {
        if (!readMore || !maxChars || lines.length === 0) {
            return { visibleLines: lines, hiddenCount: 0, canToggle: false };
        }

        const totalChars = lines.reduce((sum, line) => sum + (line.text ? line.text.length : 0), 0);

        if (totalChars <= maxChars) {
            return { visibleLines: lines, hiddenCount: 0, canToggle: false };
        }

        let running = 0;
        let idx = 0;
        for (; idx < lines.length; idx++) {
            const len = lines[idx].text ? lines[idx].text.length : 0;
            if (idx > 0 && running + len > maxChars) {
                break;
            }
            running += len;
        }

        const visible = lines.slice(0, Math.max(1, idx));
        const hidden = lines.length - visible.length;

        return {
            visibleLines: visible,
            hiddenCount: hidden,
            canToggle: hidden > 0,
        };
    }, [lines, readMore, maxChars]);

    const allLines = expanded ? lines : visibleLines;
    const showToggle = canToggle;

    if (!lines.length) return null;

    const isCentered = contentMode === 'centered';

    return (
        <div className={cn('space-y-1 text-sm text-muted-foreground', isCentered && 'text-center', className)}>
            {allLines.map((line, idx) => (
                <MessageLine
                    key={idx}
                    data={line}
                    contentMode={contentMode}
                    onActionInteract={onActionInteract}
                    onActionClick={onActionClick}
                    resolveIcon={resolveIcon}
                />
            ))}

            {showToggle && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className={cn(
                        'mt-1 inline-flex text-xs font-medium text-primary hover:underline focus:outline-none',
                        isCentered && 'mx-auto justify-center',
                    )}
                >
                    {expanded ? 'Show less' : 'Show more'}
                    {!expanded && hiddenCount > 0 && ` (${hiddenCount} more line${hiddenCount > 1 ? 's' : ''})`}
                </button>
            )}
        </div>
    );
};
