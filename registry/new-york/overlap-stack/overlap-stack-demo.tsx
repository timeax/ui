import * as React from 'react';
import { OverlapStack, OverlapItem, OverlapStackOverflow } from './overlap-stack';
import { VisualImage } from '@/components/ui/visual-image';

const DEMO_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60',
];

export function OverlapStackDemo() {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-2">Horizontal Stacking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Avatars stack horizontally with customizable overlap and hover elevation zoom.
                </p>
                <div className="flex flex-col gap-6">
                    {/* Default stack (overlap 3) */}
                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">Default Stacking (overlap=3)</span>
                        <OverlapStack direction="horizontal" overlap={3}>
                            {DEMO_AVATARS.slice(0, 4).map((src, i) => (
                                <OverlapItem key={i}>
                                    <VisualImage
                                        src={src}
                                        alt={`User avatar ${i + 1}`}
                                        size={40}
                                        rounded="rounded-full"
                                        imgClassName="border-2 border-background"
                                    />
                                </OverlapItem>
                            ))}
                            <OverlapItem>
                                <OverlapStackOverflow count={12} size={40} />
                            </OverlapItem>
                        </OverlapStack>
                    </div>

                    {/* Tight stack (overlap 5) */}
                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">Tight Stacking (overlap=5, reversed)</span>
                        <OverlapStack direction="horizontal" overlap={5} reverse>
                            {DEMO_AVATARS.map((src, i) => (
                                <OverlapItem key={i}>
                                    <VisualImage
                                        src={src}
                                        alt={`User avatar ${i + 1}`}
                                        size={40}
                                        rounded="rounded-full"
                                        imgClassName="border-2 border-background"
                                    />
                                </OverlapItem>
                            ))}
                        </OverlapStack>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">Vertical Stacking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Stack elements vertically (useful for timeline elements or stacked cards/badges).
                </p>
                <div className="flex gap-12 items-start">
                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">Vertical Stack (overlap=4)</span>
                        <OverlapStack direction="vertical" overlap={4}>
                            {DEMO_AVATARS.slice(0, 3).map((src, i) => (
                                <OverlapItem key={i}>
                                    <VisualImage
                                        src={src}
                                        alt={`User avatar ${i + 1}`}
                                        size={44}
                                        rounded="rounded-full"
                                        imgClassName="border-2 border-background"
                                    />
                                </OverlapItem>
                            ))}
                        </OverlapStack>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OverlapStackDemo;
