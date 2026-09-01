import * as React from 'react';
import { cn } from '@/lib/utils';
import { edgePath, regionPath } from './section-background.geometry';
import type { SectionBackgroundProps, SectionLayer, SectionRegion, SectionRegionEdge, SectionRegionFill } from './section-background.types';

export type { SectionBackgroundProps, SectionBackgroundVariant, SectionFlow, SectionLayer, SectionLayerFrame, SectionRegion, SectionRegionEdge, SectionRegionFill } from './section-background.types';

const preserveAspectRatio = (fit?: React.CSSProperties['objectFit']) => fit === 'contain' ? 'xMidYMid meet' : fit === 'fill' ? 'none' : 'xMidYMid slice';
const cssFill = (fill: SectionRegionFill | undefined): React.CSSProperties => {
    if (!fill) return { backgroundColor: 'transparent' };
    if (typeof fill === 'string') return { backgroundColor: fill };
    if (fill.type === 'color') return { backgroundColor: fill.color };
    if (fill.type === 'gradient') return { backgroundImage: `linear-gradient(${fill.angle ?? 135}deg, ${fill.from}, ${fill.to})` };
    if (fill.type === 'image' || (fill.type === 'svg' && fill.src)) return { backgroundImage: `url("${fill.src}")`, backgroundSize: fill.fit ?? 'cover', backgroundPosition: fill.position ?? 'center', backgroundRepeat: 'no-repeat' };
    return {};
};
const regionFill = (region: SectionRegion) => region.fill ?? region.color ?? 'transparent';
const layerFill = (layer: SectionLayer): SectionRegionFill => layer.type === 'fill' ? layer.fill : layer.type === 'image' ? { type: 'image', src: layer.src, fit: layer.fit, position: layer.position } : layer.type === 'svg' ? { type: 'svg', src: layer.src, node: layer.node, fit: layer.fit, position: layer.position } : { type: 'node', node: layer.node };
const frameStyle = (frame: SectionLayer['frame']): React.CSSProperties => ({ left: `${frame.x}%`, top: `${frame.y}%`, width: `${frame.width}%`, height: `${frame.height}%` });

function normalize(regions: SectionRegion[]) {
    const usable = regions.filter((region) => region.size === undefined || (Number.isFinite(region.size) && region.size > 0));
    const total = usable.reduce((sum, region) => sum + (region.size ?? 1), 0) || 1;
    let cursor = 0;
    return usable.map((region, index) => {
        const start = cursor;
        cursor += ((region.size ?? 1) / total) * 1000;
        return { ...region, start, end: index === usable.length - 1 ? 1000 : cursor };
    });
}

function splitEdge(edge: SectionRegionEdge | undefined, angle: number): SectionRegionEdge | undefined {
    if (edge) return edge;
    if (!angle) return undefined;
    const drift = Math.tan((angle * Math.PI) / 180) * 50;
    return { type: 'straight', start: -drift, end: drift };
}

function RegionMaterial({ fill, path, id }: { fill: SectionRegionFill; path: string; id: string }) {
    if (typeof fill === 'string') return <path d={path} fill={fill} />;
    if (fill.type === 'color') return <path d={path} fill={fill.color} />;
    if (fill.type === 'gradient') return <path d={path} fill={`url(#${id}-gradient)`} />;
    if (fill.type === 'image' || (fill.type === 'svg' && fill.src)) return <path d={path} fill={`url(#${id}-media)`} />;
    if (fill.type === 'svg' || fill.type === 'node') return <foreignObject clipPath={`url(#${id}-clip)`} x="0" y="0" width="1000" height="1000"><div className="h-full w-full">{fill.node}</div></foreignObject>;
    return null;
}

function LayerMaterial({ layer }: { layer: SectionLayer }) {
    const fill = layerFill(layer);
    if (fill && typeof fill !== 'string' && (fill.type === 'node' || (fill.type === 'svg' && fill.node))) return <>{fill.node}</>;
    return <div className="h-full w-full" style={cssFill(fill)} />;
}

export const SectionBackground = React.forwardRef<HTMLElement, SectionBackgroundProps>(function SectionBackground(
    { variant, regions, split, direction, layers = [], radius, as: Component = 'section', contentClassName, backgroundClassName, bleed = 0, className, style, children, ...props }, ref
) {
    const reactId = React.useId().replace(/:/g, '');
    const normalized = normalize(regions);
    const flow = split?.direction ?? direction ?? 'horizontal';
    const angle = split?.angle ?? 0;
    const resolvedVariant = variant ?? (regions.some((region) => region.edge?.type && region.edge.type !== 'straight') ? 'path' : 'splits');
    const boundaries = normalized.slice(0, -1).map((region) => edgePath(resolvedVariant === 'splits' ? splitEdge(region.edge, angle) : region.edge, region.end));
    const paths = normalized.map((_, index) => regionPath(index === 0 ? null : boundaries[index - 1], index === normalized.length - 1 ? null : boundaries[index]));
    const radiusValue = typeof radius === 'number' ? `${radius}px` : radius;
    const freeLayers = (placement: 'below' | 'above') => layers.filter((layer) => (layer.placement ?? 'above') === placement && !(layer.type === 'node' && layer.clipTo !== undefined));
    const clippedLayers = layers.filter((layer): layer is Extract<SectionLayer, { type: 'node' }> => layer.type === 'node' && layer.clipTo !== undefined);
    const clipIdFor = (reference: string | number) => {
        const index = typeof reference === 'number' ? reference : normalized.findIndex((region) => region.id === reference);
        return index >= 0 ? `${reactId}-region-${index}` : undefined;
    };

    return <Component ref={ref as React.Ref<HTMLElement>} className={cn('relative isolate overflow-hidden', className)} style={{ borderRadius: radiusValue, ...style }} {...props}>
        <svg aria-hidden="true" className={cn('pointer-events-none absolute inset-0 h-full w-full', backgroundClassName)} preserveAspectRatio="none" viewBox="0 0 1000 1000" style={bleed ? { transform: `scale(${1 + bleed / 100})` } : undefined}>
            <defs>
                {normalized.map((region, index) => {
                    const fill = regionFill(region), id = `${reactId}-region-${index}`;
                    return <React.Fragment key={id}>
                        <clipPath id={`${id}-clip`}><path d={paths[index]} /></clipPath>
                        {typeof fill !== 'string' && fill.type === 'gradient' && <linearGradient id={`${id}-gradient`} gradientTransform={`rotate(${fill.angle ?? 135} .5 .5)`}><stop stopColor={fill.from} /><stop offset="1" stopColor={fill.to} /></linearGradient>}
                        {typeof fill !== 'string' && (fill.type === 'image' || (fill.type === 'svg' && fill.src)) && <pattern id={`${id}-media`} width="1000" height="1000" patternUnits="userSpaceOnUse"><image href={fill.src} width="1000" height="1000" preserveAspectRatio={preserveAspectRatio(fill.fit)} /></pattern>}
                    </React.Fragment>;
                })}
            </defs>
            <g transform={flow === 'vertical' ? 'rotate(90 500 500)' : undefined}>
                {normalized.map((region, index) => <RegionMaterial key={region.id ?? index} fill={regionFill(region)} path={paths[index]} id={`${reactId}-region-${index}`} />)}
            </g>
            {clippedLayers.map((layer, index) => {
                const clipId = layer.clipTo === undefined ? undefined : clipIdFor(layer.clipTo);
                return clipId ? <foreignObject key={layer.id ?? index} clipPath={`url(#${clipId}-clip)`} x={layer.frame.x * 10} y={layer.frame.y * 10} width={layer.frame.width * 10} height={layer.frame.height * 10}><div className="h-full w-full">{layer.node}</div></foreignObject> : null;
            })}
        </svg>
        {freeLayers('below').map((layer, index) => <div key={layer.id ?? index} className="pointer-events-none absolute z-0" style={frameStyle(layer.frame)}><LayerMaterial layer={layer} /></div>)}
        {freeLayers('above').map((layer, index) => <div key={layer.id ?? index} className="pointer-events-none absolute z-0" style={frameStyle(layer.frame)}><LayerMaterial layer={layer} /></div>)}
        <div className={cn('relative z-10', contentClassName)}>{children}</div>
    </Component>;
});
SectionBackground.displayName = 'SectionBackground';
