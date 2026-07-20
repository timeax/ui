import { Visual } from '../ui/visual';
import { VisualImage } from '../ui/visual-image';

export function VisualDemo() {
    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <div>
                <h3 className="text-lg font-semibold mb-2">Visual Component (Polymorphic Media Frame)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Supports auto-detecting raster vs SVGs, inline SVG loading, custom icons/ReactNodes, and loaders.
                </p>
                <div className="flex flex-wrap gap-6 items-start">
                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">Standard Image</span>
                        <Visual
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60"
                            alt="Abstract painting"
                            size={100}
                            rounded
                            shadow
                        />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">Auto-inlined SVG (data URL)</span>
                        <Visual
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='m8 12 3 3 5-5'/%3E%3C/svg%3E"
                            alt="Check circle icon"
                            size={100}
                            className="text-emerald-500 bg-emerald-500/10 p-4"
                            rounded
                        />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">React Node (Icon)</span>
                        <Visual
                            node={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-8 w-8"
                                >
                                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                                </svg>
                            }
                            kind="icon"
                            size={100}
                            className="bg-primary/10 text-primary"
                            rounded
                        />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">As Background (Object Fit)</span>
                        <Visual
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60"
                            alt="Background fitting"
                            size={100}
                            asBackground
                            objectFit="cover"
                            rounded
                            shadow
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">VisualImage (Lightweight Image Component)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    A streamlined raster-only image component with built-in layout aspect ratios, blur LQIP, and error handling.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">Aspect Ratio 16:9</span>
                        <div className="w-64">
                            <VisualImage
                                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"
                                alt="Wide abstract"
                                size="100%"
                                ratio={16 / 9}
                                rounded
                                shadow
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-muted-foreground block font-medium">Broken Image with Fallback</span>
                        <VisualImage
                            src="https://broken-link.xyz/not-found.jpg"
                            fallback={
                                <div className="flex flex-col items-center justify-center h-full w-full bg-destructive/10 text-destructive text-xs p-3">
                                    <span>Failed to load image</span>
                                </div>
                            }
                            size={100}
                            rounded
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default VisualDemo;
