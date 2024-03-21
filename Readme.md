# List Virtualization

List Virtualization is a React component for efficiently rendering large lists by only rendering the visible items, improving performance and reducing memory consumption.

## Installation

You can install the List Virtualization component via npm:

```
npm install @x1337/rlv
```

## Usage

### Basic Example

```jsx
import React, { useState, useEffect } from 'react';
import { ListVirtualization } from '@x1337/rlv';

function MyComponent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial items
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    // Simulate fetching items from an API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newItems = [...items, ...Array.from({ length: 10 }, (_, index) => `Item ${items.length + index}`)];
    setItems(newItems);
    setLoading(false);
  };

  return (
    <div>
      <h1>Virtualized List Example</h1>
      <ListVirtualization
        items={items}
        itemHeight={50}
        numberOfItems={100}
        loadingIndicator={loading && <div>Loading...</div>}
        fetchItems={fetchItems}
        containerStyle={{ height: '300px', border: '1px solid #ccc' }}
        elementWrapperStyle={{ padding: '5px', borderBottom: '1px solid #eee' }}
        itemRenderer={(item, index) => <div>{item}</div>}
        onReachEnd={() => {
          if (!loading) {
            fetchItems();
          }
        }}
      />
    </div>
  );
}

export default MyComponent;
```

### Advanced Example with Dynamic Item Heights

```jsx
import React, { useState, useEffect } from 'react';
import { ListVirtualization } from '@x1337/rlv';

function MyComponent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial items
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    // Simulate fetching items from an API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newItems = [...items, ...Array.from({ length: 10 }, (_, index) => `Item ${items.length + index}`)];
    setItems(newItems);
    setLoading(false);
  };

  const calculateItemHeight = (index) => {
    // Simulate dynamic item heights
    return Math.floor(Math.random() * 100) + 50; // Random height between 50 and 150
  };

  return (
    <div>
      <h1>Virtualized List Example with Dynamic Heights</h1>
      <ListVirtualization
        items={items}
        itemHeight={calculateItemHeight}
        numberOfItems={100}
        loadingIndicator={loading && <div>Loading...</div>}
        fetchItems={fetchItems}
        containerStyle={{ height: '300px', border: '1px solid #ccc' }}
        elementWrapperStyle={{ padding: '5px', borderBottom: '1px solid #eee' }}
        itemRenderer={(item, index) => <div>{item}</div>}
        onReachEnd={() => {
          if (!loading) {
            fetchItems();
          }
        }}
      />
    </div>
  );
}

export default MyComponent;
```

## Props

- `items` (Array): Array of items to render.
- `itemHeight` (Number | Function): Height of each item or a function to calculate the height dynamically.
- `numberOfItems` (Number): Total number of items.
- `containerStyle` (Object): Custom styles for the container.
- `elementWrapperStyle` (Object): Custom styles for the element wrapper.
- `loadingIndicator` (ReactNode): Loading indicator to show when new items are being loaded.
- `itemRenderer` (Function): Custom renderer for each item.
- `initialScrollTop` (Number): Initial scroll position.
- `getKey` (Function): Function to get a unique key for each item.
- `onReachEnd` (Function): Callback when scrolling reaches the end of the list.
- `fetchItems` (Function): Function to fetch more items when scrolling reaches the end.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
