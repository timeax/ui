import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { cn } from '@/lib/utils';

export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type DefaultWhen = 'loading' | 'idle';

function normalizeImageSrc(value: string): string {
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

export interface VisualImageProps extends React.ComponentPropsWithoutRef<'div'> {
    src: string;
    alt?: string;
    fallback?: React.ReactNode;

    loadingIndicator?: React.ReactNode;
    loadingClassName?: string;
    imgClassName?: string;

    size?: number | string;
    ratio?: number;
    objectFit?: ObjectFit;

    srcSet?: string;
    sizes?: string;

    fetchPriority?: 'high' | 'low' | 'auto';
    crossOrigin?: 'anonymous' | 'use-credentials';
    referrerPolicy?: React.HTMLAttributeReferrerPolicy;

    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;

    asBackground?: boolean;
    backgroundPosition?: string;

    rounded?: boolean | string;
    shadow?: boolean | string;

    blurDataURL?: string;
    placeholderClassName?: string;

    showLoader?: boolean; // default true
    defaultVisual?: React.ReactNode | ((s: { kind: 'img' | 'background'; loading: boolean; error: boolean }) => React.ReactNode);
    defaultWhen?: DefaultWhen[]; // default ['loading']
    defaultZ?: 'under' | 'over'; // default 'under'

    contentClassName?: string;
}

export const VisualImage = React.forwardRef<HTMLDivElement, VisualImageProps>(({
    src,
    alt = '',
    fallback,
    className,
    loadingIndicator,
    onError,
    loadingClassName = '',
    imgClassName,
    size = 60,
    ratio,
    objectFit = 'cover',
    srcSet,
    sizes,
    fetchPriority = 'auto',
    crossOrigin,
    referrerPolicy,
    asBackground = false,
    backgroundPosition = 'center',
    style,
    rounded,
    shadow,
    blurDataURL,
    placeholderClassName,

    showLoader = true,
    defaultVisual,
    defaultWhen = ['loading'],
    defaultZ = 'under',

    contentClassName,
    ...rest
}, ref) => {
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const normalizedSrc = normalizeImageSrc(src);

    const boxWidth = typeof size === 'number' ? `${size}px` : size;

    React.useEffect(() => {
        if (asBackground) return;
        setError(false);
        setLoading(true);
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            setLoading(false);
        }
    }, [normalizedSrc, srcSet, sizes, asBackground]);

    React.useEffect(() => {
        if (!asBackground) return;
        setError(false);
        setLoading(true);

        if (typeof window === 'undefined' || typeof (window as any).Image === 'undefined') {
            setLoading(false);
            return;
        }

        const pre = new window.Image();
        if (crossOrigin) pre.crossOrigin = crossOrigin;
        pre.src = normalizedSrc;
        pre.onload = () => setLoading(false);
        pre.onerror = () => {
            setError(true);
            setLoading(false);
        };
        return () => {
            pre.onload = null;
            pre.onerror = null;
        };
    }, [normalizedSrc, asBackground, crossOrigin]);

    const ImgTag = (
        <img
            ref={imgRef}
            src={normalizedSrc}
            alt={alt}
            srcSet={srcSet}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            fetchPriority={fetchPriority}
            crossOrigin={crossOrigin}
            referrerPolicy={referrerPolicy}
            draggable={false}
            onError={(ev) => {
                setError(true);
                setLoading(false);
                onError?.(ev);
            }}
            onLoad={() => setLoading(false)}
            className={cn(
                'h-full w-full transition-opacity duration-300',
                loading ? 'opacity-0' : 'opacity-100',
                imgClassName,
                contentClassName
            )}
            style={{ objectFit }}
        />
    );

    const backgroundSize =
        objectFit === 'cover' || objectFit === 'contain' ? objectFit : objectFit === 'fill' ? '100% 100%' : objectFit === 'none' ? 'auto' : 'contain';

    const BackgroundTag = (
        <div
            role={alt ? 'img' : undefined}
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true}
            className={cn(
                'h-full w-full transition-opacity duration-300',
                loading ? 'opacity-0' : 'opacity-100',
                contentClassName
            )}
            style={{
                backgroundImage: error ? undefined : `url("${normalizedSrc}")`,
                backgroundSize,
                backgroundRepeat: 'no-repeat',
                backgroundPosition,
            }}
        />
    );

    const mediaCore = error ? (
        fallback ?? <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted text-xs">⚠️</div>
    ) : ratio ? (
        <AspectRatioPrimitive.Root ratio={ratio} className="relative w-full">
            <div className="absolute inset-0">{asBackground ? BackgroundTag : ImgTag}</div>
        </AspectRatioPrimitive.Root>
    ) : asBackground ? (
        BackgroundTag
    ) : (
        ImgTag
    );

    const roundedClass = typeof rounded === 'string' ? rounded : rounded ? 'rounded-md' : undefined;
    const shadowClass = typeof shadow === 'string' ? shadow : shadow ? 'shadow-sm' : undefined;

    const state = { kind: asBackground ? ('background' as const) : ('img' as const), loading, error };
    const maybeDefault = typeof defaultVisual === 'function' ? defaultVisual(state) : defaultVisual;

    const showDefaultLoading = !error && loading && (!showLoader || !loadingIndicator) && defaultWhen.includes('loading');
    const showDefaultIdle = !error && !loading && defaultWhen.includes('idle');

    return (
        <div
            ref={ref}
            className={cn('relative overflow-hidden flex items-center justify-center', roundedClass, shadowClass, className)}
            style={{ width: boxWidth, height: ratio ? undefined : boxWidth, ...style }}
            {...rest}
        >
            {blurDataURL && !error && loading && (
                <div
                    aria-hidden
                    className={cn('absolute inset-0 scale-105 bg-center bg-no-repeat blur-sm', placeholderClassName)}
                    style={{ backgroundImage: `url("${blurDataURL}")`, backgroundSize: 'cover' }}
                />
            )}

            {!error && loading && showLoader && loadingIndicator && (
                <div
                    className={cn('absolute inset-0 flex items-center justify-center', loadingClassName)}
                    aria-label="Loading image"
                >
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

            {mediaCore}

            {!error && !loading && showDefaultIdle && maybeDefault && defaultZ === 'over' && (
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                    {maybeDefault}
                </div>
            )}
        </div>
    );
});

VisualImage.displayName = 'VisualImage';
export default VisualImage;
