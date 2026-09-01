import { SectionBackground } from '../ui/section-background/section-background';

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT: "splits" + split.angle
//   The simplest variant. No edge geometry needed — just set an angle and the
//   regions are divided by a straight diagonal line. Perfect for bold,
//   geometric section breaks.
// ─────────────────────────────────────────────────────────────────────────────
function SplitsAngleSection() {
    return (
        <SectionBackground
            variant="splits"
            split={{ direction: 'horizontal', angle: -18 }}
            className="min-h-[400px]"
            regions={[
                { fill: '#2d1c1e', size: 3 },
                { fill: '#100304', size: 2.3 },
                { fill: '#2d1c1e', size: 3 },
            ]}
        >
            <div className="mx-auto grid min-h-[400px] max-w-6xl grid-cols-1 gap-10 px-10 py-20 text-center md:grid-cols-3 md:items-center">
                {[
                    ['&lt; /&gt;', 'Web Development'],
                    ['●●', 'Graphics Design'],
                    ['◇', 'Software Development'],
                ].map(([icon, title]) => (
                    <div key={title} className="space-y-4">
                        <div className="text-4xl font-light text-white" dangerouslySetInnerHTML={{ __html: icon }} />
                        <h2 className="text-2xl font-semibold text-white">{title}</h2>
                        <p className="mx-auto max-w-xs text-sm leading-6 text-white/55">Three full background panels with one shared diagonal angle. Content remains a regular responsive grid.</p>
                    </div>
                ))}
            </div>
        </SectionBackground>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILL: gradient regions
//   Each region can now carry a linear gradient fill instead of a flat colour.
//   Angle controls the gradient direction per-region independently.
// ─────────────────────────────────────────────────────────────────────────────
function GradientFillSection() {
    return (
        <SectionBackground
            split={{ direction: 'vertical' }}
            className="min-h-[420px]"
            bleed={4}
            regions={[
                {
                    fill: { type: 'gradient', from: '#fdf4ff', to: '#e0f2fe', angle: 160 },
                    size: 3,
                    edge: { type: 'wave', amplitude: 7, frequency: 1.2, segments: 60 },
                },
                {
                    fill: { type: 'gradient', from: '#f0fdf4', to: '#ecfdf5', angle: 200 },
                    size: 1,
                },
            ]}
        >
            <div className="mx-auto max-w-5xl px-10 py-20 min-h-[420px] flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-500 mb-3">fill: gradient</p>
                <h2 className="text-4xl font-extrabold leading-tight text-slate-900 max-w-xl">
                    Gradient fills — one per region, independent angles.
                </h2>
                <p className="mt-4 text-slate-500 max-w-md text-base leading-relaxed">
                    Each region takes <code className="text-fuchsia-600 text-sm">&#123; type: 'gradient', from, to, angle &#125;</code>.
                    The two-region gradient wave here fades purple→sky at top, green tint below.
                </p>
                <div className="mt-8 flex gap-3">
                    {[
                        { from: '#a78bfa', to: '#60a5fa' },
                        { from: '#f472b6', to: '#fb923c' },
                        { from: '#34d399', to: '#22d3ee' },
                        { from: '#facc15', to: '#f97316' },
                    ].map(({ from, to }) => (
                        <div
                            key={from}
                            className="h-8 w-16 rounded-lg shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                        />
                    ))}
                </div>
            </div>
        </SectionBackground>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILL: image region
//   A region's fill can be a photo. fit controls cover/contain/fill.
//   Great for split-image heroes.
// ─────────────────────────────────────────────────────────────────────────────
function ImageFillSection() {
    return (
        <SectionBackground
            split={{ direction: 'vertical' }}
            className="min-h-[440px]"
            bleed={2}
            regions={[
                {
                    fill: {
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
                        fit: 'cover',
                    },
                    size: 3,
                    edge: { type: 'arc', depth: 14, direction: 'out' },
                },
                { fill: '#0f172a', size: 2 },
            ]}
        >
            <div className="mx-auto max-w-5xl px-10 py-16 min-h-[440px] flex flex-col justify-end">
                <div className="max-w-sm space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-sky-400">fill: image</p>
                    <h2 className="text-3xl font-extrabold text-white leading-tight">
                        A full photo as a region fill.
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Pass <code className="text-sky-400">&#123; type: 'image', src, fit: 'cover' &#125;</code> to any region.
                        The SVG clips the photo into whatever shape the edge geometry defines.
                    </p>
                </div>
            </div>
        </SectionBackground>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYERS: free-floating fill / gradient layers
//   Layers live outside the region geometry, placed by frame: {x,y,width,height}
//   in percentages. placement='below' puts them under the content.
// ─────────────────────────────────────────────────────────────────────────────
function LayersFillSection() {
    return (
        <SectionBackground
            split={{ direction: 'vertical' }}
            className="min-h-[440px]"
            bleed={4}
            regions={[
                { fill: '#0c1a2e', size: 4, edge: { type: 'wave', amplitude: 8, frequency: 1, segments: 64 } },
                { fill: '#0f172a', size: 1 },
            ]}
            layers={[
                // Soft glow orb — top-left
                {
                    type: 'fill',
                    fill: { type: 'gradient', from: '#6366f188', to: '#6366f100', angle: 135 },
                    frame: { x: -10, y: -10, width: 60, height: 60 },
                    placement: 'below',
                },
                // Second orb — bottom-right
                {
                    type: 'fill',
                    fill: { type: 'gradient', from: '#8b5cf688', to: '#8b5cf600', angle: 315 },
                    frame: { x: 55, y: 40, width: 55, height: 55 },
                    placement: 'below',
                },
                // Accent streak
                {
                    type: 'fill',
                    fill: { type: 'gradient', from: '#22d3ee44', to: '#22d3ee00', angle: 45 },
                    frame: { x: 30, y: 10, width: 40, height: 30 },
                    placement: 'below',
                },
            ]}
        >
            <div className="mx-auto max-w-5xl px-10 py-20 min-h-[440px] flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">layers — fill / gradient</p>
                <h2 className="text-4xl font-extrabold text-white leading-tight max-w-xl">
                    Ambient glow orbs<br />from free-floating layers.
                </h2>
                <p className="mt-4 text-slate-400 max-w-md text-base leading-relaxed">
                    <code className="text-indigo-300 text-sm">layers</code> are absolute overlays placed by
                    <code className="text-indigo-300 text-sm"> frame</code> percentages.
                    These three gradient orbs sit <code className="text-indigo-300 text-sm">below</code> the content,
                    behind the wave region but adding depth to the dark background.
                </p>
            </div>
        </SectionBackground>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYERS: image layer — floating photo card
//   An image layer positioned in the right half, independent of region geometry.
// ─────────────────────────────────────────────────────────────────────────────
function LayersImageSection() {
    return (
        <SectionBackground
            split={{ direction: 'vertical' }}
            className="min-h-[460px]"
            bleed={3}
            regions={[
                {
                    fill: { type: 'gradient', from: '#fef9c3', to: '#fef3c7', angle: 180 },
                    size: 3,
                    edge: { type: 's-curve', amount: 12, tension: 0.6 },
                },
                { fill: '#fffbeb', size: 2 },
            ]}
            layers={[
                // Big photo placed in the right 45% of the section
                {
                    type: 'image',
                    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
                    fit: 'cover',
                    frame: { x: 55, y: 5, width: 42, height: 90 },
                    placement: 'below',
                },
            ]}
        >
            <div className="max-w-5xl mx-auto px-10 py-20 min-h-[460px] flex flex-col justify-center">
                <div className="max-w-md space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-600">layers — image</p>
                    <h2 className="text-4xl font-extrabold text-amber-950 leading-tight">
                        Photo layers,<br />zero markup.
                    </h2>
                    <p className="text-amber-800 text-base leading-relaxed">
                        An <code className="text-amber-600 text-sm">image</code> layer fills its frame rectangle with a photo,
                        clipped naturally by the browser — no extra
                        <code className="text-amber-600 text-sm"> &lt;img&gt;</code> in your JSX.
                    </p>
                    <button className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-white shadow">
                        Explore →
                    </button>
                </div>
            </div>
        </SectionBackground>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYERS: node layer + clipTo
//   A node layer with clipTo clips arbitrary React content to the shape of a
//   specific region — the node is masked by the SVG path of that region.
// ─────────────────────────────────────────────────────────────────────────────
function LayersClipToSection() {
    return (
        <SectionBackground
            split={{ direction: 'vertical' }}
            className="min-h-[460px]"
            bleed={3}
            regions={[
                {
                    id: 'dark',
                    fill: '#0f172a',
                    size: 3,
                    edge: { type: 'curve', bend: 50 },
                },
                { fill: '#f8fafc', size: 2 },
            ]}
            layers={[
                // This node is clipped to the 'dark' region's bezier shape
                {
                    type: 'node',
                    clipTo: 'dark',
                    frame: { x: 0, y: 0, width: 100, height: 100 },
                    node: (
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundImage: 'radial-gradient(ellipse at 30% 40%, #6366f133 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, #8b5cf633 0%, transparent 50%)',
                            }}
                        />
                    ),
                },
            ]}
        >
            <div className="mx-auto max-w-5xl px-10 py-20 min-h-[460px] flex items-center gap-16">
                <div className="flex-1 space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">layers — node + clipTo</p>
                    <h2 className="text-4xl font-extrabold text-white leading-tight">
                        Clip any React node<br />to a region's shape.
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                        Set <code className="text-indigo-300 text-sm">clipTo: 'region-id'</code> on a node layer
                        and its content is SVG-clipped to that region's exact bezier boundary — here,
                        a radial gradient perfectly masked inside the curve.
                    </p>
                </div>
                <div className="shrink-0 w-56 space-y-3">
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4 text-xs text-slate-400 font-mono space-y-1">
                        <div><span className="text-indigo-400">type</span>: 'node'</div>
                        <div><span className="text-indigo-400">clipTo</span>: 'dark'</div>
                        <div><span className="text-indigo-400">frame</span>: 0/0/100/100</div>
                    </div>
                </div>
            </div>
        </SectionBackground>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED: everything at once — gradient region + image layer + node layer
//   A full hero showing how all new features compose together.
// ─────────────────────────────────────────────────────────────────────────────
function ComposedHeroSection() {
    return (
        <SectionBackground
            split={{ direction: 'vertical' }}
            className="min-h-[520px]"
            bleed={5}
            regions={[
                {
                    id: 'hero',
                    fill: { type: 'gradient', from: '#020617', to: '#0c1445', angle: 160 },
                    size: 4,
                    edge: { type: 'wave', amplitude: 9, frequency: 1.1, segments: 72 },
                },
                { fill: '#020617', size: 1 },
            ]}
            layers={[
                // Glow orb behind headline
                {
                    type: 'fill',
                    fill: { type: 'gradient', from: '#4f46e566', to: '#4f46e500', angle: 135 },
                    frame: { x: 0, y: 0, width: 55, height: 80 },
                    placement: 'below',
                },
                // Right-side accent glow
                {
                    type: 'fill',
                    fill: { type: 'gradient', from: '#7c3aed44', to: '#7c3aed00', angle: 225 },
                    frame: { x: 55, y: 20, width: 50, height: 60 },
                    placement: 'below',
                },
                // Photo placed in the right column, above background
                {
                    type: 'image',
                    src: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&auto=format&fit=crop&q=80',
                    fit: 'cover',
                    frame: { x: 58, y: 8, width: 38, height: 72 },
                    placement: 'below',
                },
                // Radial mask over the photo to blend it into the dark BG
                {
                    type: 'node',
                    clipTo: 'hero',
                    frame: { x: 55, y: 0, width: 45, height: 100 },
                    node: (
                        <div
                            className="h-full w-full"
                            style={{
                                background: 'linear-gradient(to right, #020617 0%, transparent 40%, transparent 60%, #020617 100%)',
                            }}
                        />
                    ),
                },
            ]}
        >
            <div className="mx-auto max-w-5xl px-10 py-24 min-h-[520px] flex flex-col justify-center">
                <div className="max-w-lg space-y-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                        ✦ New in v2 — fills, layers, clipTo
                    </span>
                    <h2 className="text-5xl font-extrabold text-white leading-[1.1]">
                        Every feature,<br />
                        <span className="text-indigo-400">composed together.</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Gradient region fill · image layer · two glow orbs ·
                        node layer clipped to the wave boundary — all in one component.
                    </p>
                    <div className="flex gap-3 pt-1">
                        <button className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                            Read the docs →
                        </button>
                        <button className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5 transition-colors">
                            View source
                        </button>
                    </div>
                </div>
            </div>
        </SectionBackground>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function SectionBackgroundDemo() {
    return (
        <div className="flex flex-col font-sans antialiased">

            {/* Section label helper */}
            {([
                ['variant="splits" + split.angle', <SplitsAngleSection />],
                ['fill: gradient (per-region linear gradients)', <GradientFillSection />],
                ['fill: image (photo clipped by edge geometry)', <ImageFillSection />],
                ['layers: fill/gradient (ambient glow orbs)', <LayersFillSection />],
                ['layers: image (floating photo frame)', <LayersImageSection />],
                ['layers: node + clipTo (content clipped to region path)', <LayersClipToSection />],
                ['composed — gradient + layers + clipTo together', <ComposedHeroSection />],
            ] as const).map(([label, section]) => (
                <div key={label as string}>
                    <div className="border-b border-t bg-zinc-50 dark:bg-zinc-900 px-6 py-2">
                        <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">{label as string}</p>
                    </div>
                    {section}
                </div>
            ))}

        </div>
    );
}
