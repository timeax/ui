import type { SectionRegionEdge } from './section-background.types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const num = (value: number | undefined, fallback: number) => Number.isFinite(value) ? value! : fallback;
const offset = (value: number | undefined) => num(value, 0) * 10;
const fmt = (value: number) => Number(value.toFixed(3));
type Point = { x: number; y: number };
type Cubic = { c1: Point; c2: Point; to: Point };

function path(start: Point, curves: Cubic[]) {
    return `M ${fmt(start.x)} ${fmt(start.y)} ${curves.map((c) => `C ${fmt(c.c1.x)} ${fmt(c.c1.y)} ${fmt(c.c2.x)} ${fmt(c.c2.y)} ${fmt(c.to.x)} ${fmt(c.to.y)}`).join(' ')}`;
}
function samples(points: Point[]) {
    const [first, ...rest] = points;
    return `M ${fmt(first.x)} ${fmt(first.y)} ${rest.map((p) => `L ${fmt(p.x)} ${fmt(p.y)}`).join(' ')}`;
}
const pos = (value: number | undefined, fallback: number) => clamp(num(value, fallback), 0, 1) * 1000;

export function edgePath(edge: SectionRegionEdge | undefined, base: number) {
    const current: any = edge ?? { type: 'straight' as const };
    const type = current.type ?? 'straight';
    const start = base + offset((edge as { start?: number } | undefined)?.start);
    const end = base + offset((edge as { end?: number } | undefined)?.end);
    const amount = offset((edge as { amount?: number } | undefined)?.amount);
    if (type === 'path') return current.d;
    if (type === 'straight') return path({ x: start, y: 0 }, [{ c1: { x: start, y: 333.333 }, c2: { x: start, y: 666.667 }, to: { x: end, y: 1000 } }]);
    if (type === 'slant') return path({ x: start, y: 0 }, [{ c1: { x: start, y: 333.333 }, c2: { x: end + amount, y: 666.667 }, to: { x: end + amount, y: 1000 } }]);
    if (type === 'curve') {
        const bend = clamp(num(current.bend, 0), -100, 100) * 4;
        return path({ x: start, y: 0 }, [{ c1: { x: start + offset(current.control1?.offset) + bend, y: pos(current.control1?.position, .33) }, c2: { x: end + offset(current.control2?.offset) + bend, y: pos(current.control2?.position, .67) }, to: { x: end, y: 1000 } }]);
    }
    if (type === 's-curve') {
        const bend = amount || 120, tension = clamp(num(current.tension, .5), 0, 1);
        return path({ x: start, y: 0 }, [{ c1: { x: start + bend * tension, y: 166.667 }, c2: { x: start + bend * tension, y: 333.333 }, to: { x: base, y: 500 } }, { c1: { x: base - bend * tension, y: 666.667 }, c2: { x: base - bend * tension, y: 833.333 }, to: { x: end, y: 1000 } }]);
    }
    if (type === 'arc') {
        const depth = offset(current.depth) || 120, direction = current.direction === 'in' ? -1 : 1;
        return path({ x: start, y: 0 }, [{ c1: { x: start + depth * direction, y: 250 }, c2: { x: end + depth * direction, y: 750 }, to: { x: end, y: 1000 } }]);
    }
    if (type === 'wave') {
        const segments = clamp(Math.round(num(current.segments, 16)), 2, 64), frequency = Math.max(0, num(current.frequency, 2));
        const amplitude = offset(current.amplitude) || 30, phase = num(current.phase, 0) * Math.PI / 180;
        return samples(Array.from({ length: segments + 1 }, (_, i) => { const t = i / segments; return { x: start + (end - start) * t + Math.sin(t * frequency * Math.PI * 2 + phase) * amplitude, y: t * 1000 }; }));
    }
    const position = pos((edge as { position?: number }).position, .5), width = offset((edge as { width?: number }).width) || 160;
    const direction = (edge as { direction?: 'in' | 'out' }).direction === 'in' ? -1 : 1;
    const depth = offset((edge as { depth?: number }).depth ?? (edge as { amount?: number }).amount) || 100;
    if (type === 'bulge' || type === 'notch') {
        const left = clamp(position - width / 2, 0, 1000), right = clamp(position + width / 2, 0, 1000), signed = depth * direction * (type === 'notch' ? -1 : 1);
        return `M ${fmt(start)} 0 L ${fmt(start)} ${fmt(left)} C ${fmt(start + signed)} ${fmt(left + width * .25)} ${fmt(end + signed)} ${fmt(right - width * .25)} ${fmt(end)} ${fmt(right)} L ${fmt(end)} 1000`;
    }
    if (type === 'step') {
        const steps = clamp(Math.round(num(current.steps, 3)), 1, 16), step = 1000 / steps;
        return samples(Array.from({ length: steps * 2 + 1 }, (_, i) => ({ x: i === 0 ? start : i === steps * 2 ? end : i % 2 ? start + amount : end, y: Math.min(1000, i * step / 2) })));
    }
    if (type === 'zigzag') {
        const teeth = clamp(Math.round(num(current.teeth, 5)), 1, 32);
        return samples(Array.from({ length: teeth * 2 + 1 }, (_, i) => ({ x: i === teeth * 2 ? end : i % 2 ? base + amount : start, y: i / (teeth * 2) * 1000 })));
    }
    return path({ x: start, y: 0 }, [{ c1: { x: start, y: 333.333 }, c2: { x: start, y: 666.667 }, to: { x: end, y: 1000 } }]);
}

export function regionPath(start: string | null, end: string | null) {
    const startBoundary = start ?? 'M 0 0 L 0 1000';
    const endBoundary = end ?? 'M 1000 0 L 1000 1000';
    // Continue from the first boundary instead of starting a disconnected
    // subpath. Disconnected paths collapse split regions into thin wedges.
    return `${startBoundary} ${reverseBoundary(endBoundary).replace(/^M\s+/, 'L ')} Z`;
}

function reverseBoundary(value: string) {
    const tokens = value.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
    if (tokens[0] !== 'M' || tokens.length < 3) return value;
    const points: Array<{ x: number; y: number; c1?: { x: number; y: number }; c2?: { x: number; y: number } }> = [];
    let index = 1;
    points.push({ x: Number(tokens[index++]), y: Number(tokens[index++]) });
    while (index < tokens.length) {
        const command = tokens[index++];
        if (command === 'L' && index + 1 < tokens.length) points.push({ x: Number(tokens[index++]), y: Number(tokens[index++]) });
        else if (command === 'C' && index + 5 < tokens.length) {
            points.push({ x: Number(tokens[index + 4]), y: Number(tokens[index + 5]), c1: { x: Number(tokens[index]), y: Number(tokens[index + 1]) }, c2: { x: Number(tokens[index + 2]), y: Number(tokens[index + 3]) } });
            index += 6;
        } else return value;
    }
    const reversed = points.reverse();
    return `M ${reversed[0].x} ${reversed[0].y} ${reversed.slice(0, -1).map((segment, i) => {
        const destination = reversed[i + 1];
        if (segment.c1 && segment.c2) return `C ${segment.c2.x} ${segment.c2.y} ${segment.c1.x} ${segment.c1.y} ${destination.x} ${destination.y}`;
        return `L ${destination.x} ${destination.y}`;
    }).join(' ')}`;
}
