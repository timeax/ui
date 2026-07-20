import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { cn } from '@/lib/utils';

export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type DetectMode = 'smart' | 'extension' | 'network';
export type DefaultWhen = 'loading' | 'idle';

export type BaseProps = {
    /** Layout */
    size?: number | string; // width. If no ratio, also height (square)
    ratio?: number; // AspectRatio
    objectFit?: ObjectFit;
    asBackground?: boolean; // for URL images & non-inline SVG
    backgroundPosition?: string;
    rounded?: boolean | string;
    shadow?: boolean | string;
    className?: string;
    style?: React.CSSProperties;

    /** UX */
    loadingIndicator?: React.ReactNode;
    loadingClassName?: string;
    showLoader?: boolean; // default true
    fallback?: React.ReactNode | ((s: VisualState) => React.ReactNode);
    defaultVisual?: React.ReactNode | ((s: VisualState) => React.ReactNode);
    defaultWhen?: DefaultWhen[]; // default ['loading']
    defaultZ?: 'under' | 'over'; // default 'under'
    blurDataURL?: string;
    placeholderClassName?: string;

    /** A11y (used for img and labelling svg/icon) */
    alt?: string;

    /** Events */
    onLoad?: () => void;
    onError?: (err?: unknown) => void;

    /** Inner node styling (svg/icon/img parity) */
    contentClassName?: string;
};

export type SourceFactory = () => string | React.ReactNode;
export type SourceObject = { node: React.ReactNode; kind?: 'svg' | 'icon' };
export type SourceProp = string | React.ReactNode | SourceFactory | SourceObject;

export type ImgUrlProps = {
    src?: any; // legacy if you don’t pass `source`
    srcSet?: string;
    sizes?: string;
    fetchPriority?: 'high' | 'low' | 'auto';
    crossOrigin?: 'anonymous' | 'use-credentials';
    referrerPolicy?: React.HTMLAttributeReferrerPolicy;

    /** auto-detect options */
    detectMode?: DetectMode; // default 'smart'
    detectionTimeoutMs?: number; // default 1500
    detectCacheTtlMs?: number; // default 600_000 (10min)
    allowInlineSvg?: boolean; // default true
    forceInlineSvg?: boolean;
    sanitizeSvg?: (raw: string) => string;
};

export type SvgUrlProps = {
    kind: 'svg-url';
    src: string;
    inline?: boolean; // default true if allowInlineSvg
    sanitizeSvg?: (raw: string) => string;
};

export type SvgInlineProps = { kind: 'svg'; node: React.ReactElement<SVGSVGElement> };
export type IconProps = { kind: 'icon'; node?: React.ReactNode; source?: SourceProp };
export type ImgExplicitProps = { kind: 'img'; src: string };

export type VisualProps = BaseProps &
    ImgUrlProps &
    (
        | ({ kind?: 'auto' } & { source?: SourceProp })
        | SvgUrlProps
        | SvgInlineProps
        | IconProps
        | ImgExplicitProps
    );

export type ResolvedKind = 'img' | 'svg-url-inline' | 'svg-url-img' | 'svg' | 'icon';
export type VisualState = { kind: ResolvedKind; loading: boolean; error: boolean };

const DETECT_CACHE = new Map<string, { mode: Exclude<ResolvedKind, 'svg' | 'icon'>; ts: number }>();

const withinTtl = (ts: number, ttl: number) => Date.now() - ts < ttl;

const mapObjectFitToBg = (of?: ObjectFit) =>
    of === 'contain' || of === 'cover' ? of : of === 'fill' ? '100% 100%' : of === 'none' ? 'auto' : 'contain';

const getBoxSize = (size?: number | string) => (typeof size === 'number' ? `${size}px` : size ?? '60px');

function normalizeVisualUrl(value: unknown): unknown {
    if (typeof value !== 'string') return value;
    const raw = value.trim();
    if (!raw) return raw;
    if (raw.startsWith('data:') || raw.startsWith('blob:')) return raw;

    try {
        const parsed = new URL(raw);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.toString();
        }
        if (parsed.host) {
            return `https://${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
    } catch {
        if (raw.startsWith('//')) {
            const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
            return `${protocol}${raw}`;
        }
    }
    return raw;
}

function isUrlLikelySvgByExt(url: string) {
    try {
        const u = new URL(url, typeof window !== 'undefined' ? window.location.href : 'http://x/');
        return /\.svg(\?.*)?$/i.test(u.pathname);
    } catch {
        return /\.svg(\?.*)?$/i.test(url);
    }
}

async function detectUrlKind(
    src: string,
    opts: {
        detectMode: DetectMode;
        allowInlineSvg: boolean;
        forceInlineSvg?: boolean;
        detectionTimeoutMs: number;
        detectCacheTtlMs: number;
    }
): Promise<Exclude<ResolvedKind, 'svg' | 'icon'>> {
    const { detectMode, allowInlineSvg, forceInlineSvg, detectionTimeoutMs, detectCacheTtlMs } = opts;

    const cached = DETECT_CACHE.get(src);
    if (cached && withinTtl(cached.ts, detectCacheTtlMs)) return cached.mode;

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
    const timer =
        controller &&
        setTimeout(() => {
            try {
                controller.abort();
            } catch {}
        }, detectionTimeoutMs);
    const done = () => {
        if (timer) clearTimeout(timer);
    };

    const commit = (mode: Exclude<ResolvedKind, 'svg' | 'icon'>) => {
        DETECT_CACHE.set(src, { mode, ts: Date.now() });
        return mode;
    };

    const tryHead = async () => {
        try {
            const res = await fetch(src, { method: 'HEAD', signal: controller?.signal });
            const ct = res.headers.get('content-type') || '';
            if (/image\/svg\+xml/i.test(ct)) return commit(allowInlineSvg || forceInlineSvg ? 'svg-url-inline' : 'svg-url-img');
            if (/^image\//i.test(ct)) return commit('img');
        } catch {}
        return null;
    };

    const tryRangeGet = async () => {
        try {
            const res = await fetch(src, { method: 'GET', headers: { Range: 'bytes=0-2047' }, signal: controller?.signal });
            const ct = res.headers.get('content-type') || '';
            if (/image\/svg\+xml/i.test(ct)) return commit(allowInlineSvg || forceInlineSvg ? 'svg-url-inline' : 'svg-url-img');
            const text = await res.text();
            if (text.trim().toLowerCase().startsWith('<svg'))
                return commit(allowInlineSvg || forceInlineSvg ? 'svg-url-inline' : 'svg-url-img');
            return commit('img');
        } catch {}
        return null;
    };

    try {
        if (detectMode === 'extension') {
            const extSvg = isUrlLikelySvgByExt(src);
            return commit(extSvg ? (allowInlineSvg || forceInlineSvg ? 'svg-url-inline' : 'svg-url-img') : 'img');
        }
        if (detectMode !== 'network') {
            const h = await tryHead();
            if (h) return h;
            const g = await tryRangeGet();
            if (g) return g;
            const extSvg = isUrlLikelySvgByExt(src);
            return commit(extSvg ? (allowInlineSvg || forceInlineSvg ? 'svg-url-inline' : 'svg-url-img') : 'img');
        }
        const g = await tryRangeGet();
        if (g) return g;
        const h = await tryHead();
        if (h) return h;
        return commit('img');
    } finally {
        done();
    }
}

export const Visual = React.forwardRef<HTMLDivElement, VisualProps>((props, ref) => {
    const {
        size = 60,
        ratio,
        objectFit = 'cover',
        asBackground = false,
        backgroundPosition = 'center',
        className,
        style,
        rounded,
        shadow,
        loadingIndicator,
        loadingClassName,
        showLoader = true,
        fallback,
        defaultVisual,
        defaultWhen = ['loading'],
        defaultZ = 'under',
        blurDataURL,
        placeholderClassName,
        alt,
        onLoad,
        onError,
        contentClassName,
    } = props;

    const boxWidth = getBoxSize(size);
    const roundedClass = typeof rounded === 'string' ? rounded : rounded ? 'rounded-md' : undefined;
    const shadowClass = typeof shadow === 'string' ? shadow : shadow ? 'shadow-sm' : undefined;

    const resolvedSource = React.useMemo<string | React.ReactNode | undefined>(() => {
        let base = (props as any).source ?? (props as any).src;
        try {
            if (typeof base === 'function') {
                const out = (base as SourceFactory)();
                if (typeof (out as any)?.then === 'function') return undefined;
                return normalizeVisualUrl(out) as string | React.ReactNode;
            }
            if (base && typeof base === 'object' && !React.isValidElement(base) && 'node' in (base as SourceObject)) {
                const so = base as SourceObject;
                return so.node ?? undefined;
            }
            return normalizeVisualUrl(base) as string | React.ReactNode;
        } catch {
            return undefined;
        }
    }, [(props as any).source, (props as any).src]);

    const explicitObjectKind = React.useMemo<'svg' | 'icon' | undefined>(() => {
        const base = (props as any).source;
        if (base && typeof base === 'object' && !React.isValidElement(base) && 'node' in base) {
            return (base as SourceObject).kind;
        }
        return undefined;
    }, [props]);

    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [svgMarkup, setSvgMarkup] = React.useState<string | null>(null);
    const [resolvedKind, setResolvedKind] = React.useState<ResolvedKind>('img');

    React.useEffect(() => {
        setError(false);
        setSvgMarkup(null);

        if (props.kind === 'icon') {
            setResolvedKind('icon');
            setLoading(false);
            return;
        }
        if (props.kind === 'svg') {
            setResolvedKind('svg');
            setLoading(false);
            return;
        }
        if (props.kind === 'svg-url') {
            setResolvedKind(((props as any).inline ?? true) ? 'svg-url-inline' : 'svg-url-img');
            setLoading(true);
            return;
        }
        if (props.kind === 'img') {
            setResolvedKind('img');
            setLoading(true);
            return;
        }

        const srcLike = typeof resolvedSource === 'string' ? resolvedSource : undefined;
        const nodeLike = React.isValidElement(resolvedSource)
            ? resolvedSource
            : typeof resolvedSource !== 'string' && resolvedSource != null
                ? (resolvedSource as React.ReactNode)
                : undefined;

        if (nodeLike && explicitObjectKind) {
            setResolvedKind(explicitObjectKind === 'svg' ? 'svg' : 'icon');
            setLoading(false);
            return;
        }

        if (React.isValidElement(nodeLike)) {
            const typeAsAny = (nodeLike as any).type;
            const isSvgTag = typeof typeAsAny === 'string' && typeAsAny.toLowerCase() === 'svg';
            setResolvedKind(isSvgTag ? 'svg' : 'icon');
            setLoading(false);
            return;
        }
        if (nodeLike && typeof nodeLike !== 'string') {
            setResolvedKind('icon');
            setLoading(false);
            return;
        }

        if (srcLike?.startsWith('data:image/svg+xml')) {
            setResolvedKind('svg-url-inline');
            setLoading(false);
            setSvgMarkup(decodeURIComponent(srcLike.split(',')[1] || ''));
            return;
        }

        setResolvedKind('img');
        setLoading(true);
    }, [props.kind, resolvedSource, explicitObjectKind]);

    React.useEffect(() => {
        if (resolvedKind === 'svg' || resolvedKind === 'icon') return;

        const url = typeof resolvedSource === 'string' ? resolvedSource : (props as any).src;
        if (!url) return;

        if (resolvedKind === 'svg-url-inline' && svgMarkup) return;

        const {
            detectMode = 'smart',
            detectionTimeoutMs = 1500,
            detectCacheTtlMs = 600_000,
            allowInlineSvg = true,
            forceInlineSvg,
            sanitizeSvg,
        } = props as ImgUrlProps;

        let cancelled = false;

        (async () => {
            try {
                let mode: Exclude<ResolvedKind, 'svg' | 'icon'> = resolvedKind as any;

                if (props.kind === 'svg-url' && (props as any).inline === false) {
                    mode = 'svg-url-img';
                } else if (props.kind === 'svg-url' && ((props as any).inline ?? true)) {
                    mode = 'svg-url-inline';
                } else if (props.kind !== 'svg-url') {
                    mode = await detectUrlKind(url, {
                        detectMode,
                        allowInlineSvg,
                        forceInlineSvg,
                        detectionTimeoutMs,
                        detectCacheTtlMs,
                    });
                }

                if (cancelled) return;

                if (mode === 'svg-url-inline') {
                    try {
                        const res = await fetch(url);
                        const raw = await res.text();
                        const safe = sanitizeSvg ? sanitizeSvg(raw) : raw;
                        if (cancelled) return;
                        setSvgMarkup(safe);
                        setResolvedKind('svg-url-inline');
                        setLoading(false);
                        props.onLoad?.();
                    } catch {
                        setResolvedKind('svg-url-img');
                        setSvgMarkup(null);
                        setLoading(true);
                    }
                } else {
                    setResolvedKind(mode);
                    setLoading(true);
                }
            } catch {
                setResolvedKind('img');
                setLoading(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [resolvedKind, resolvedSource, props, svgMarkup]);

    const url = typeof resolvedSource === 'string' ? resolvedSource : (props as any).src;
    const { srcSet, sizes, fetchPriority = 'auto', crossOrigin, referrerPolicy } = props as ImgUrlProps;

    const imgEl = (
        <img
            ref={imgRef}
            src={url}
            alt={alt ?? ''}
            srcSet={srcSet}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            fetchPriority={fetchPriority}
            crossOrigin={crossOrigin}
            referrerPolicy={referrerPolicy}
            draggable={false}
            onLoad={() => {
                setLoading(false);
                onLoad?.();
            }}
            onError={(ev) => {
                setError(true);
                setLoading(false);
                onError?.(ev);
            }}
            className={cn('h-full w-full transition-opacity duration-300', loading ? 'opacity-0' : 'opacity-100', contentClassName)}
            style={{ objectFit }}
        />
    );

    const bgEl = (
        <div
            role={alt ? 'img' : undefined}
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true}
            className={cn('h-full w-full transition-opacity duration-300', loading ? 'opacity-0' : 'opacity-100', contentClassName)}
            style={{
                backgroundImage: error ? undefined : url ? `url("${url}")` : undefined,
                backgroundSize: mapObjectFitToBg(objectFit),
                backgroundRepeat: 'no-repeat',
                backgroundPosition,
            }}
        />
    );

    const inlineSvgEl =
        resolvedKind === 'svg' ? (
            React.isValidElement(resolvedSource) ? (
                React.cloneElement(resolvedSource as React.ReactElement<SVGSVGElement>, {
                    role: alt ? 'img' : undefined,
                    'aria-label': alt || undefined,
                    'aria-hidden': alt ? undefined : true,
                    className: cn(
                        'h-full w-full transition-opacity duration-300',
                        !loading && 'opacity-100',
                        contentClassName,
                        (resolvedSource as any).props?.className,
                    ),
                } as any)
            ) : null
        ) : svgMarkup ? (
            <div
                role={alt ? 'img' : undefined}
                aria-label={alt || undefined}
                aria-hidden={alt ? undefined : true}
                className={cn('h-full w-full transition-opacity duration-300', !loading && 'opacity-100', contentClassName)}
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
        ) : null;

    const iconEl =
        resolvedKind === 'icon' ? (
            (() => {
                const node = React.isValidElement(resolvedSource) ? resolvedSource : ((props as any).source ?? (props as any).node);
                const wrapperClass = cn('grid h-full w-full place-items-center transition-opacity duration-300', !loading && 'opacity-100');
                const labelled = alt ? ({ role: 'img' as const, 'aria-label': alt } as const) : ({ 'aria-hidden': true as const } as const);

                if (React.isValidElement(node)) {
                    const merged = cn('max-h-full max-w-full', contentClassName, (node.props as any)?.className);
                    return (
                        <div {...labelled} className={wrapperClass}>
                            {React.cloneElement(node as React.ReactElement<any>, { className: merged })}
                        </div>
                    );
                }

                return (
                    <div {...labelled} className={wrapperClass}>
                        {node as React.ReactNode}
                    </div>
                );
            })()
        ) : null;

    const mediaCore = error
        ? ((typeof fallback === 'function' ? fallback({ kind: resolvedKind, loading, error }) : fallback) ?? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted text-xs">⚠️</div>
        ))
        : resolvedKind === 'svg-url-inline' || resolvedKind === 'svg'
            ? inlineSvgEl
            : resolvedKind === 'icon'
                ? iconEl
                : asBackground
                    ? bgEl
                    : imgEl;

    const content = ratio ? (
        <AspectRatioPrimitive.Root ratio={ratio} className="relative w-full">
            <div className="absolute inset-0">{mediaCore}</div>
        </AspectRatioPrimitive.Root>
    ) : (
        mediaCore
    );

    const maybeDefault = typeof defaultVisual === 'function' ? defaultVisual({ kind: resolvedKind, loading, error }) : defaultVisual;
    const showDefaultLoading = !error && loading && (!showLoader || !loadingIndicator) && defaultWhen.includes('loading');
    const showDefaultIdle = !error && !loading && defaultWhen.includes('idle');

    return (
        <div
            ref={ref}
            className={cn('relative overflow-hidden flex items-center justify-center', roundedClass, shadowClass, className)}
            style={{ width: boxWidth, height: ratio ? undefined : boxWidth, ...style }}
        >
            {blurDataURL && !error && loading && (
                <div
                    aria-hidden
                    className={cn('absolute inset-0 scale-105 bg-center bg-no-repeat blur-sm', placeholderClassName)}
                    style={{ backgroundImage: `url("${blurDataURL}")`, backgroundSize: 'cover' }}
                />
            )}

            {!error && loading && showLoader && loadingIndicator && (
                <div className={cn('absolute inset-0 flex items-center justify-center', loadingClassName)} aria-label="Loading">
                    {loadingIndicator}
                </div>
            )}
            {!error && loading && showDefaultLoading && maybeDefault && (
                <div className="absolute inset-0 flex items-center justify-center" aria-label="Default visual (loading)">
                    {maybeDefault}
                </div>
            )}

            {!error && !loading && showDefaultIdle && maybeDefault && defaultZ === 'under' && (
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                    {maybeDefault}
                </div>
            )}

            {content}

            {!error && !loading && showDefaultIdle && maybeDefault && defaultZ === 'over' && (
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                    {maybeDefault}
                </div>
            )}
        </div>
    );
});

Visual.displayName = 'Visual';
export default Visual;
