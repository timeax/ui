import * as React from 'react';
import { PeekDots } from './peek-dots';
import { SmartCard } from '../smart-card/smart-card';

const ITEMS = [
    { title: 'Project Alpha', desc: 'Design tokens and system variables definition.' },
    { title: 'Project Beta', desc: 'Migration of button component family extensions.' },
    { title: 'Project Gamma', desc: 'Container-query grid layouts for card surfaces.' },
    { title: 'Project Delta', desc: 'Polymorphic visual media frames and overlays.' },
    { title: 'Project Epsilon', desc: 'Scrollable carousel with dots indicator.' },
    { title: 'Project Zeta', desc: 'Programmatic modal orchestration and triggers.' },
];

export function PeekDotsDemo() {
    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h3 className="text-lg font-semibold mb-2">PeekDots Carousel</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    A simple carousel that detects overflow and adds dot navigation dynamically. Drag/scroll or click dots.
                </p>
            </div>

            <PeekDots
                values={ITEMS}
                titlebar={({ total }) => (
                    <div className="flex justify-between items-center text-xs text-muted-foreground font-medium px-1">
                        <span>ALL PROJECTS</span>
                        <span>{total} TOTAL</span>
                    </div>
                )}
            >
                {({ value }) => (
                    <SmartCard
                        title={value.title}
                        description={value.desc}
                        variant="outlined"
                        className="w-56 h-36"
                    />
                )}
            </PeekDots>
        </div>
    );
}
export default PeekDotsDemo;
