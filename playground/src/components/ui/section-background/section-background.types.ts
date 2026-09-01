import * as React from 'react';

export type SectionFlow = 'horizontal' | 'vertical';
export type SectionBackgroundVariant = 'splits' | 'path';
export type SectionEdgeDirection = 'in' | 'out';
export type SectionRegionEdge =
    | { type?: 'straight'; start?: number; end?: number }
    | { type: 'slant'; amount?: number; start?: number; end?: number }
    | { type: 'curve'; bend?: number; start?: number; end?: number; control1?: { position?: number; offset?: number }; control2?: { position?: number; offset?: number } }
    | { type: 's-curve'; amount?: number; tension?: number; start?: number; end?: number }
    | { type: 'arc'; depth?: number; start?: number; end?: number; direction?: SectionEdgeDirection }
    | { type: 'bulge' | 'notch'; amount?: number; position?: number; width?: number; direction?: SectionEdgeDirection }
    | { type: 'wave'; amplitude?: number; frequency?: number; phase?: number; start?: number; end?: number; segments?: number }
    | { type: 'step'; amount?: number; steps?: number; start?: number; end?: number }
    | { type: 'zigzag'; amount?: number; teeth?: number; start?: number; end?: number }
    | { type: 'path'; d: string };

export type SectionRegionFill =
    | string
    | { type: 'color'; color: string }
    | { type: 'gradient'; from: string; to: string; angle?: number }
    | { type: 'image'; src: string; fit?: React.CSSProperties['objectFit']; position?: string }
    | { type: 'svg'; src?: string; node?: React.ReactNode; fit?: React.CSSProperties['objectFit']; position?: string }
    | { type: 'node'; node: React.ReactNode };

export interface SectionRegion { fill?: SectionRegionFill; /** @deprecated Use fill. */ color?: string; size?: number; edge?: SectionRegionEdge; id?: string }
export interface SectionSplitOptions { direction?: SectionFlow; angle?: number }
export interface SectionLayerFrame { x: number; y: number; width: number; height: number }
export type SectionLayerPlacement = 'below' | 'above';
export type SectionLayer =
    | { type: 'fill'; fill: SectionRegionFill; frame: SectionLayerFrame; placement?: SectionLayerPlacement; id?: string }
    | { type: 'image'; src: string; fit?: React.CSSProperties['objectFit']; position?: string; frame: SectionLayerFrame; placement?: SectionLayerPlacement; id?: string }
    | { type: 'svg'; src?: string; node?: React.ReactNode; fit?: React.CSSProperties['objectFit']; position?: string; frame: SectionLayerFrame; placement?: SectionLayerPlacement; id?: string }
    | { type: 'node'; node: React.ReactNode; frame: SectionLayerFrame; placement?: SectionLayerPlacement; clipTo?: string | number; id?: string };

export interface SectionBackgroundProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    variant?: SectionBackgroundVariant;
    regions: SectionRegion[];
    split?: SectionSplitOptions;
    /** @deprecated Use split.direction. */ direction?: SectionFlow;
    layers?: SectionLayer[];
    radius?: number | string;
    as?: React.ElementType;
    contentClassName?: string;
    backgroundClassName?: string;
    bleed?: number;
}
