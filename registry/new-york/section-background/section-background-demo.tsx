import { SectionBackground } from './section-background';

const art = <svg viewBox="0 0 100 100" className="h-full w-full opacity-35" aria-hidden="true"><circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M50 12v76M12 50h76M23 23l54 54M77 23 23 77" stroke="currentColor" strokeWidth="1" /></svg>;

export function SectionBackgroundDemo() {
    return <div className="space-y-8">
        <SectionBackground variant="splits" split={{ angle: -18 }} className="min-h-72 text-white" radius="1rem" regions={[{ fill: '#2d1c1e', size: 1 }, { fill: '#120405', size: 1.15 }, { fill: '#2d1c1e', size: 1 }]} layers={[{ type: 'svg', node: art, frame: { x: 67, y: 8, width: 25, height: 76 }, placement: 'above' }]}>
            <div className="grid min-h-72 grid-cols-1 gap-8 px-8 py-12 text-center md:grid-cols-3 md:items-center">
                <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-white/50">Split 01</p><h3 className="mt-3 text-2xl font-semibold">Color panels</h3></div>
                <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-white/50">Split 02</p><h3 className="mt-3 text-2xl font-semibold">One shared angle</h3></div>
                <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-white/50">Split 03</p><h3 className="mt-3 text-2xl font-semibold">Normal content</h3></div>
            </div>
        </SectionBackground>

        <div className="grid gap-6 md:grid-cols-2">
            <SectionBackground variant="splits" split={{ direction: 'vertical', angle: 0 }} className="min-h-64 overflow-hidden rounded-xl text-white" regions={[{ fill: { type: 'image', src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7454?auto=format&fit=crop&w=1200&q=80' }, size: 3 }, { fill: { type: 'gradient', from: '#0f172a', to: '#312e81', angle: 130 }, size: 2 }]}>
                <div className="p-8"><p className="text-sm text-white/65">Image fill</p><h3 className="mt-2 text-3xl font-semibold">Media belongs in a background region.</h3></div>
            </SectionBackground>
            <SectionBackground variant="path" direction="vertical" className="min-h-64 rounded-xl text-white" regions={[{ fill: '#0f766e', size: 3, edge: { type: 'wave', amplitude: 5, frequency: 1.5 } }, { fill: '#042f2e', size: 2 }]} layers={[{ type: 'node', node: <div className="grid h-full w-full place-items-center text-7xl font-black text-white/15">SB</div>, frame: { x: 48, y: 8, width: 42, height: 70 }, clipTo: 0 }]}>
                <div className="p-8"><p className="text-sm text-white/65">Path mode</p><h3 className="mt-2 text-3xl font-semibold">Curves are optional dividers.</h3></div>
            </SectionBackground>
        </div>
    </div>;
}
