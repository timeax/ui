export type BulkRunResult<TId> = {
    successIds: TId[];
    failedIds: TId[];
    failed: Array<{ id: TId; reason: unknown }>;
};

export async function runBulkByIds<TId>(
    ids: TId[],
    run: (id: TId) => Promise<unknown>
): Promise<BulkRunResult<TId>> {
    const settled = await Promise.allSettled(ids.map((id) => run(id)));

    const successIds: TId[] = [];
    const failedIds: TId[] = [];
    const failed: Array<{ id: TId; reason: unknown }> = [];

    settled.forEach((result, index) => {
        const id = ids[index];
        if (result.status === 'fulfilled') {
            successIds.push(id);
            return;
        }

        failedIds.push(id);
        failed.push({ id, reason: result.reason });
    });

    return { successIds, failedIds, failed };
}

export function exportSelectedAsJson<TData>(rows: TData[], filenamePrefix: string) {
    if (typeof window === 'undefined') return;

    const payload = {
        exported_at: new Date().toISOString(),
        total: rows.length,
        rows,
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `${filenamePrefix}-${Date.now()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}
