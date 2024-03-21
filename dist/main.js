import React, { useState, useRef, useCallback } from 'react';

function ListVirtualization({ items, itemHeight, numberOfItems, containerStyle, loadingIndicator, itemRenderer, initialScrollTop, getKey, onReachEnd, elementWrapperStyle, fetchItems }) {
    // Calculate the total height of the container based on item height and number of items
    const outerHeight = typeof itemHeight === 'number'
        ? itemHeight * numberOfItems
        : itemHeight(0) * numberOfItems;
    // Calculate the total height of all items
    const innerHeight = items.reduce((acc, _, index) => acc &&
        (acc +
            (typeof itemHeight === 'number'
                ? itemHeight
                : itemHeight(index))), 0);
    // State for the current scroll position
    const [scrollTop, setScrollTop] = useState(initialScrollTop || 0);
    // Reference to the container element
    const containerRef = useRef(null);
    // Calculate the start and end index of visible items based on the scroll position
    const startIndex = Math.floor(scrollTop / (typeof itemHeight === 'number' ? itemHeight : itemHeight(0)));
    const endIndex = Math.min(items.length, Math.floor((scrollTop + outerHeight) /
        (typeof itemHeight === 'number' ? itemHeight : itemHeight(0))));
    // Get the visible items based on the start and end index
    const visibleItems = items.slice(startIndex, endIndex + 1);
    // Handle scroll event
    const handleScroll = useCallback((e) => {
        setScrollTop(e.currentTarget.scrollTop);
        // Check if scrolling has reached the end of the list
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
            e.currentTarget.clientHeight) {
            onReachEnd?.();
            fetchItems?.();
        }
    }, [onReachEnd, fetchItems]);
    // Get a unique key for each item
    const getItemKey = useCallback((index) => {
        return getKey?.(index) || index.toString();
    }, [getKey]);
    // Get the updated container style
    const getUpdatedContainerStyle = useCallback(() => {
        return {
            overflowY: 'scroll',
            border: '1px solid black',
            height: outerHeight + 'px',
            ...containerStyle,
        };
    }, [outerHeight, containerStyle]);
    return (React.createElement("div", { style: getUpdatedContainerStyle(), onScroll: handleScroll, ref: containerRef },
        React.createElement("div", { style: {
                height: innerHeight + 'px',
                position: 'relative',
            } },
            React.createElement("div", { style: {
                    position: 'absolute',
                    top: (typeof itemHeight === 'number' ? itemHeight : itemHeight(0)) *
                        startIndex +
                        'px',
                    width: '100%',
                } },
                visibleItems.map((item, index) => {
                    const itemKey = getItemKey?.(startIndex + index) ||
                        (startIndex + index).toString();
                    return (React.createElement("div", { key: itemKey, style: { ...(elementWrapperStyle ? elementWrapperStyle : {}) } }, itemRenderer ? itemRenderer(item, startIndex + index) : item));
                }),
                loadingIndicator))));
}

const useTest = () => {
    const [first, setfirst] = useState(0);
    return {
        first,
        setfirst,
    };
};

export { ListVirtualization, useTest };
