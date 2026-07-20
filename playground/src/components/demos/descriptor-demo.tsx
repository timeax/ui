import * as React from 'react';
import {
    Descriptor,
    DescriptorLeading,
    DescriptorBody,
    DescriptorTitle,
    DescriptorDescription,
    DescriptorTrailing,
    Info,
} from '@/components/ui/descriptor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, AlertTriangle, Calendar, Settings, FileText } from 'lucide-react';

export default function DescriptorDemo() {
    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Descriptor Layouts</h1>
                <p className="text-muted-foreground mt-2">
                    Visual presentation primitives for key-value row metadata lists, status definitions, and content summaries.
                </p>
            </div>

            {/* 1. Prop-Based Descriptor List */}
            <Card>
                <CardHeader>
                    <CardTitle>Prop-Based Properties</CardTitle>
                    <CardDescription>
                        Classic configuration-based metadata list rendering with vertical dividers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="divide-y divide-border/60">
                    <Descriptor
                        title="Username"
                        subtitle="Used for logins and system identity."
                        leading={<User className="size-4 text-muted-foreground" />}
                        trailingPrimary="janedoe"
                        trailingSecondary="Updated 2 hours ago"
                        density="cozy"
                    />
                    <Descriptor
                        title="Primary Email"
                        subtitle="Communications and verification alerts."
                        leading={<Mail className="size-4 text-muted-foreground" />}
                        trailingPrimary="jane@example.com"
                        trailingSecondary={
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                                Verified
                            </Badge>
                        }
                        density="cozy"
                    />
                    <Descriptor
                        title="Account Role"
                        subtitle="Access permissions control level."
                        leading={<Shield className="size-4 text-muted-foreground" />}
                        trailingPrimary="Administrator"
                        density="cozy"
                    />
                </CardContent>
            </Card>

            {/* 2. Compound Component Layout */}
            <Card>
                <CardHeader>
                    <CardTitle>Compound Composition</CardTitle>
                    <CardDescription>
                        Modern composition using custom children components (`DescriptorLeading`, `DescriptorBody`, `DescriptorTrailing`).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Descriptor divider="bottom" density="spacious">
                        <DescriptorLeading>
                            <div className="p-2.5 bg-yellow-500/10 text-yellow-600 rounded-lg">
                                <AlertTriangle className="size-5" />
                            </div>
                        </DescriptorLeading>
                        <DescriptorBody>
                            <DescriptorTitle className="text-amber-600 dark:text-amber-500 font-semibold">
                                Security Alert
                            </DescriptorTitle>
                            <DescriptorDescription>
                                Someone attempted to sign in to your account from a new device in Tokyo, Japan.
                            </DescriptorDescription>
                        </DescriptorBody>
                        <DescriptorTrailing as="inline">
                            <Button size="sm" variant="outline" className="mr-2">
                                Ignore
                            </Button>
                            <Button size="sm" variant="destructive">
                                Secure Account
                            </Button>
                        </DescriptorTrailing>
                    </Descriptor>

                    <Descriptor divider="bottom" density="spacious">
                        <DescriptorLeading>
                            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg">
                                <Calendar className="size-5" />
                            </div>
                        </DescriptorLeading>
                        <DescriptorBody>
                            <DescriptorTitle>Billing Renewal</DescriptorTitle>
                            <DescriptorDescription>
                                Your annual subscription will automatically renew on July 31, 2026.
                            </DescriptorDescription>
                        </DescriptorBody>
                        <DescriptorTrailing>
                            <span className="font-bold text-sm">$299.00 / yr</span>
                            <span className="text-[11px] text-muted-foreground">Auto-debit active</span>
                        </DescriptorTrailing>
                    </Descriptor>
                </CardContent>
            </Card>

            {/* 3. Densities comparison */}
            <Card>
                <CardHeader>
                    <CardTitle>Density Spacings</CardTitle>
                    <CardDescription>
                        Compare the horizontal density configurations: `compact`, `cozy`, and `spacious`.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compact</span>
                        <div className="border rounded-lg p-3 bg-muted/20 divide-y divide-border/60 mt-1.5">
                            <Descriptor title="Build Version" trailingPrimary="v1.4.0-stable" density="compact" />
                            <Descriptor title="Environment" trailingPrimary="Production" density="compact" />
                            <Descriptor title="Cluster Nodes" trailingPrimary="16 Online" density="compact" />
                        </div>
                    </div>

                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cozy (Default)</span>
                        <div className="border rounded-lg p-4 bg-muted/20 divide-y divide-border/60 mt-1.5">
                            <Descriptor title="Database Type" subtitle="PostgreSQL v16" trailingPrimary="Main-DB Cluster" density="cozy" />
                            <Descriptor title="SSL Certificates" subtitle="Valid until Dec 2026" trailingPrimary="Let's Encrypt" density="cozy" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Simple Info Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Simple Info Layouts</CardTitle>
                        <CardDescription>
                            Simpler metadata groups with leading icons and column-stacked descriptions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Info
                            title="Workspace Preferences"
                            desc="Customize your theme, sidebar layout, hotkeys, and profile settings."
                            icon={<Settings className="size-5 text-indigo-600 mt-0.5" />}
                            direction="row"
                            gap={16}
                        />
                        <Info
                            title="Documentation Portal"
                            desc="Read guides, instructions, reference endpoints, and release logs."
                            icon={<FileText className="size-5 text-emerald-600 mt-0.5" />}
                            direction="row"
                            gap={16}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Info Grid (Vertical)</CardTitle>
                        <CardDescription>
                            Clean vertical metadata block layouts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-between">
                        <Info
                            title="Developer API"
                            desc="Access tokens and credentials."
                            icon={<Settings className="size-8 text-primary mb-2" />}
                            direction="col"
                            gap={8}
                        />
                        <Info
                            title="Invoices & Reports"
                            desc="View history and receipts."
                            icon={<FileText className="size-8 text-muted-foreground mb-2" />}
                            direction="col"
                            gap={8}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
