import * as React from 'react';

export type OverflowMode = 'scroll' | 'dropdown' | 'both';

export interface OverflowListProps<T> {
    items: readonly T[];
    renderItem: (item: T, index: number, isCollapsed: boolean) => React.ReactNode;
    renderMore: (collapsedItems: T[]) => React.ReactNode;
    
    overflow?: OverflowMode;
    scrollBehavior?: 'smooth' | 'auto';
    scrollStep?: number | 'half' | 'page';
    arrowTransitionDuration?: string;
    activeId?: string;
    isActive?: (item: T) => boolean;

    className?: string;
    listContainerClassName?: string;
    
    renderScrollArrow?: (direction: 'left' | 'right', onClick: () => void, isVisible: boolean) => React.ReactNode;
    renderScrollGradient?: (direction: 'left' | 'right', isVisible: boolean) => React.ReactNode;
}
