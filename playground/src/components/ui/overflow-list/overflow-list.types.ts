import * as React from 'react';

export type OverflowMode = 'scroll' | 'dropdown' | 'both';
export type OverflowDirection = 'horizontal' | 'vertical';
export type ScrollDirection = 'left' | 'right' | 'top' | 'bottom';

export interface OverflowListProps<T> {
    items: readonly T[];
    renderItem: (item: T, index: number, isCollapsed: boolean) => React.ReactNode;
    renderMore?: (collapsedItems: T[], trigger?: React.ReactNode) => React.ReactNode;
    moreTrigger?: React.ReactNode | ((collapsedCount: number) => React.ReactNode);
    
    overflow?: OverflowMode;
    direction?: OverflowDirection;
    scrollBehavior?: 'smooth' | 'auto';
    scrollStep?: number | 'half' | 'page';
    arrowTransitionDuration?: string;
    activeId?: string;
    isActive?: (item: T) => boolean;

    className?: string;
    listContainerClassName?: string;
    moreClassName?: string;
    
    renderScrollArrow?: (direction: ScrollDirection, onClick: () => void, isVisible: boolean) => React.ReactNode;
    renderScrollGradient?: (direction: ScrollDirection, isVisible: boolean) => React.ReactNode;
}
