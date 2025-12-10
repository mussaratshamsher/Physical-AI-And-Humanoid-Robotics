import React from 'react';
import { UserProvider } from '@site/src/components/UserContext';

export default function Root({ children }) {
  return <UserProvider>{children}</UserProvider>;
}