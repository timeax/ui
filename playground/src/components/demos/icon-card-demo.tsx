import { IconCard } from '../ui/icon-card';
import { ShieldCheck, Flame, Compass } from 'lucide-react';

export default function IconCardDemo() {
    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto">
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-zinc-900 dark:text-zinc-50">Icon Overlap Badges</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-8">
                    {/* Basic Shield Icon */}
                    <IconCard
                        icon={ShieldCheck}
                        badgeClassName="bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20"
                    >
                        <h3 className="text-lg font-bold text-center mt-2">Security Audited</h3>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                            All smart contracts have been thoroughly compiled, analyzed, and audited by our core developer team.
                        </p>
                    </IconCard>

                    {/* Hot Flame Icon */}
                    <IconCard
                        icon={Flame}
                        badgeClassName="bg-orange-500 text-white border-orange-600 shadow-orange-500/20"
                        badgeSize={80}
                    >
                        <h3 className="text-lg font-bold text-center mt-2">Trending Analytics</h3>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                            View active visitor volumes, load frequencies, conversion metrics, and system activity logs.
                        </p>
                    </IconCard>

                    {/* Compass Navigation */}
                    <IconCard
                        icon={Compass}
                        badgeClassName="bg-blue-500 text-white border-blue-600 shadow-blue-500/20"
                    >
                        <h3 className="text-lg font-bold text-center mt-2">Quick Navigation</h3>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                            Access settings panels, team workspaces, databases, global API integrations, and billing history.
                        </p>
                    </IconCard>
                </div>
            </section>
        </div>
    );
}
