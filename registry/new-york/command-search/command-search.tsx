import * as React from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import type {
    CommandSearchProps,
    CommandSearchResult,
    CommandSearchContextValue,
} from './command-search.types';

const CommandSearchContext = React.createContext<CommandSearchContextValue | null>(null);

export function useCommandSearch() {
    const value = React.useContext(CommandSearchContext);
    if (!value) {
        throw new Error('useCommandSearch must be used within CommandSearchProvider');
    }
    return value;
}

function useQuerySearch(
    isOpen: boolean,
    subject: string | undefined,
    query: string,
    onSearch: CommandSearchProps['onSearch']
) {
    const deferredQuery = React.useDeferredValue(query);
    const [results, setResults] = React.useState<CommandSearchResult[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isOpen || !subject || deferredQuery.trim().length === 0) {
            setResults([]);
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        onSearch(deferredQuery.trim(), subject)
            .then((data) => {
                if (cancelled) return;
                React.startTransition(() => {
                    setResults(Array.isArray(data) ? data : []);
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err?.message ?? 'Unable to search right now.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [deferredQuery, isOpen, subject, onSearch]);

    return { error, loading, results };
}

export const CommandSearchProvider: React.FC<CommandSearchProps> = ({
    entries,
    onSearch,
    onSelectResult,
    children,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [subject, setSubject] = React.useState<string | undefined>(undefined);
    const [query, setQuery] = React.useState('');
    const { error, loading, results } = useQuerySearch(isOpen, subject, query, onSearch);

    const open = React.useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = React.useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setSubject(undefined);
    }, []);

    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setIsOpen((current) => !current);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const activeEntry = React.useMemo(
        () => entries.find((e) => e.subject === subject),
        [entries, subject]
    );
    const ActiveIcon = activeEntry?.icon;

    return (
        <CommandSearchContext.Provider value={{ open }}>
            {children}

            <CommandDialog
                open={isOpen}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) close();
                    else setIsOpen(true);
                }}
                title="Workspace Search"
                description="Navigate and search datasets globally."
                className="max-w-2xl"
            >
                <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder={activeEntry?.placeholder ?? 'Search in...'}
                />

                <CommandList>
                    {!subject ? (
                        <CommandGroup heading="Search in">
                            {entries.map((entry) => {
                                const Icon = entry.icon;
                                return (
                                    <CommandItem
                                        key={entry.subject}
                                        value={entry.label}
                                        onSelect={() => {
                                            setSubject(entry.subject);
                                            setQuery('');
                                        }}
                                    >
                                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                                        <div className="flex min-w-0 flex-col">
                                            <span>{entry.label}</span>
                                            <span className="text-xs text-muted-foreground">{entry.description}</span>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    ) : (
                        <>
                            <CommandGroup heading="Active Category">
                                <CommandItem
                                    value={`back-${subject}`}
                                    onSelect={() => {
                                        setSubject(undefined);
                                        setQuery('');
                                    }}
                                >
                                    <ArrowLeft className="size-4 shrink-0" />
                                    <span>Back to categories</span>
                                </CommandItem>
                                <CommandItem value={`active-${subject}`} className="pointer-events-none opacity-70">
                                    {ActiveIcon ? <ActiveIcon className="size-4 shrink-0" /> : <Search className="size-4 shrink-0" />}
                                    <span>{activeEntry?.label ?? 'Search'}</span>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator />

                            <CommandGroup heading="Switch category">
                                {entries
                                    .filter((entry) => entry.subject !== subject)
                                    .map((entry) => {
                                        const Icon = entry.icon;
                                        return (
                                            <CommandItem
                                                key={entry.subject}
                                                value={`switch-${entry.subject}`}
                                                onSelect={() => {
                                                    setSubject(entry.subject);
                                                    setQuery('');
                                                }}
                                            >
                                                <Icon className="size-4 shrink-0 text-muted-foreground" />
                                                <span>{entry.label}</span>
                                            </CommandItem>
                                        );
                                    })}
                            </CommandGroup>

                            <CommandSeparator />

                            <CommandGroup heading="Query Results">
                                {loading && (
                                    <div className="flex items-center gap-2 px-2 py-4 text-sm text-muted-foreground">
                                        <Loader2 className="size-4 animate-spin shrink-0" />
                                        <span>Searching {activeEntry?.label?.toLowerCase()}...</span>
                                    </div>
                                )}

                                {!loading && error && (
                                    <div className="px-2 py-4 text-sm text-destructive">{error}</div>
                                )}

                                {!loading &&
                                    !error &&
                                    results.map((result) => {
                                        const entry = entries.find((e) => e.subject === result.subject);
                                        const Icon = entry?.icon ?? Search;

                                        return (
                                            <CommandItem
                                                key={`${result.subject}-${result.id}`}
                                                value={`${result.title} ${result.subtitle ?? ''} ${result.badge ?? ''}`}
                                                onSelect={() => {
                                                    close();
                                                    onSelectResult(result);
                                                }}
                                            >
                                                <Icon className="size-4 shrink-0 text-muted-foreground" />
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <span className="truncate font-medium">{result.title}</span>
                                                    {result.subtitle && (
                                                        <span className="truncate text-xs text-muted-foreground">{result.subtitle}</span>
                                                    )}
                                                </div>
                                                {result.badge && (
                                                    <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
                                                        {result.badge}
                                                    </span>
                                                )}
                                            </CommandItem>
                                        );
                                    })}
                            </CommandGroup>
                        </>
                    )}

                    {!subject ? (
                        <CommandEmpty>Select a category to search first.</CommandEmpty>
                    ) : !loading && !error && query.trim().length === 0 ? (
                        <CommandEmpty>Start typing to search {activeEntry?.label?.toLowerCase()}.</CommandEmpty>
                    ) : !loading && !error && results.length === 0 ? (
                        <CommandEmpty>No results found.</CommandEmpty>
                    ) : null}
                </CommandList>
            </CommandDialog>
        </CommandSearchContext.Provider>
    );
};
CommandSearchProvider.displayName = 'CommandSearchProvider';

interface CommandSearchTriggerProps {
    className?: string;
    compact?: boolean;
}

export const CommandSearchTrigger: React.FC<CommandSearchTriggerProps> = ({
    className,
    compact = false,
}) => {
    const { open } = useCommandSearch();

    return (
        <button
            type="button"
            onClick={open}
            className={cn(
                'flex w-full items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-3 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-background hover:cursor-pointer',
                compact ? 'h-9 justify-start' : 'h-10 w-[16rem] justify-between',
                className
            )}
        >
            <span className="flex items-center gap-2">
                <Search className="size-4 shrink-0" />
                <span>Search</span>
            </span>
            {!compact && (
                <span className="rounded-md border px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                    Ctrl K
                </span>
            )}
        </button>
    );
};
CommandSearchTrigger.displayName = 'CommandSearchTrigger';
