import React, { ReactNode } from 'react';
export interface ListVirtualizationProps {
    items: ReactNode[];
    itemHeight: number | ((index: number) => number);
    numberOfItems: number;
    containerStyle?: React.CSSProperties;
    elementWrapperStyle?: React.CSSProperties;
    loadingIndicator?: ReactNode;
    itemRenderer?: (item: ReactNode, index: number) => ReactNode;
    initialScrollTop?: number;
    getKey?: (index: number) => string;
    onReachEnd?: () => void;
    fetchItems?: () => Promise<ReactNode[]> | Promise<void>;
}
export declare function ListVirtualization({ items, itemHeight, numberOfItems, containerStyle, loadingIndicator, itemRenderer, initialScrollTop, getKey, onReachEnd, elementWrapperStyle, fetchItems }: ListVirtualizationProps): React.JSX.Element;
export default ListVirtualization;
