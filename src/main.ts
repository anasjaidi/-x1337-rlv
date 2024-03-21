import { useState } from 'react';

export const useTest = () => {
  const [first, setfirst] = useState(0);
  return {
    first,
    setfirst,
  };
};

export * from './lib/__list';
