import { useCallback } from 'react';
import { matchPath, useLocation } from 'react-router';

/**
 * Hook to determine if component should skip rendering based on current route
 * @param expectedPath The path this component should render on
 * @returns Function that returns true if component should skip rendering
 */
export const useSkipRender = (expectedPath: string) => {
   const location = useLocation();
   
   return useCallback(
      (): boolean => !matchPath(expectedPath, location.pathname),
      [expectedPath, location]
   );
};