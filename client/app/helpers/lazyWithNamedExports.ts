import React from 'react';

export const lazyWithNamedExports = <T>(path: string, exportName: string): React.LazyExoticComponent<React.ComponentType<T>> => {
  return React.lazy(() => import(`${path}`).then(module => ({ default: module[exportName] })));
}