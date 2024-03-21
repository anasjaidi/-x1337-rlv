import React, {
  ReactNode,
  UIEventHandler,
  useCallback,
  useState,
  useRef,
  CSSProperties,
} from 'react';

export interface ListVirtualizationProps {
  items: ReactNode[]; // Array of items to render
  itemHeight: number | ((index: number) => number); // Height of each item or a function to calculate the height dynamically
  numberOfItems: number; // Total number of items
  containerStyle?: React.CSSProperties; // Custom styles for the container
  elementWrapperStyle?: React.CSSProperties; // Custom styles for the element wrapper
  loadingIndicator?: ReactNode; // Loading indicator to show when new items are being loaded
  itemRenderer?: (item: ReactNode, index: number) => ReactNode; // Custom renderer for each item
  initialScrollTop?: number; // Initial scroll position
  getKey?: (index: number) => string; // Function to get a unique key for each item
  onReachEnd?: () => void; // Callback when scrolling reaches the end of the list
  fetchItems?: () => Promise<ReactNode[]> | Promise<void>;
}

export function ListVirtualization({
  items,
  itemHeight,
  numberOfItems,
  containerStyle,
  loadingIndicator,
  itemRenderer,
  initialScrollTop,
  getKey,
  onReachEnd,
  elementWrapperStyle,
  fetchItems
}: ListVirtualizationProps) {
  // Calculate the total height of the container based on item height and number of items
  const outerHeight =
    typeof itemHeight === 'number'
      ? itemHeight * numberOfItems
      : itemHeight(0) * numberOfItems;

  // Calculate the total height of all items
  const innerHeight = items.reduce(
    (acc, _, index) =>
      acc &&
      (((acc as number) +
        (typeof itemHeight === 'number'
          ? itemHeight
          : itemHeight(index))) as number),
    0
  );

  // State for the current scroll position
  const [scrollTop, setScrollTop] = useState(initialScrollTop || 0);

  // Reference to the container element
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate the start and end index of visible items based on the scroll position
  const startIndex = Math.floor(
    scrollTop / (typeof itemHeight === 'number' ? itemHeight : itemHeight(0))
  );
  const endIndex = Math.min(
    items.length,
    Math.floor(
      (scrollTop + outerHeight) /
        (typeof itemHeight === 'number' ? itemHeight : itemHeight(0))
    )
  );

  // Get the visible items based on the start and end index
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // Handle scroll event
  const handleScroll = useCallback<UIEventHandler<HTMLDivElement>>(
    (e) => {
      setScrollTop(e.currentTarget.scrollTop);
      // Check if scrolling has reached the end of the list
      if (
        e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
        e.currentTarget.clientHeight
      ) {
        onReachEnd?.();
        fetchItems?.();
      }
    },
    [onReachEnd, fetchItems]
  );
  // Get a unique key for each item
  const getItemKey = useCallback(
    (index: number) => {
      return getKey?.(index) || index.toString();
    },
    [getKey]
  );

  // Get the updated container style
  const getUpdatedContainerStyle = useCallback(() => {
    return {
      overflowY: 'scroll',
      border: '1px solid black',
      height: outerHeight + 'px',
      ...(containerStyle as CSSProperties),
    } as CSSProperties;
  }, [outerHeight, containerStyle]);

  return (
    <div
      style={getUpdatedContainerStyle()}
      onScroll={handleScroll}
      ref={containerRef}
    >
      <div
        style={{
          height: innerHeight + 'px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top:
              (typeof itemHeight === 'number' ? itemHeight : itemHeight(0)) *
                startIndex +
              'px',
            width: '100%',
          }}
        >
          {visibleItems.map((item, index) => {
            const itemKey =
              getItemKey?.(startIndex + index) ||
              (startIndex + index).toString();

            return (
              <div
                key={itemKey}
                style={{ ...(elementWrapperStyle ? elementWrapperStyle : {}) }}
              >
                {itemRenderer ? itemRenderer(item, startIndex + index) : item}
              </div>
            );
          })}
          {loadingIndicator}
        </div>
      </div>
    </div>
  );
}

export default ListVirtualization;
