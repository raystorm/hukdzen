import { existsSync } from 'fs';
import { join } from 'path';

describe('shared directory structure', () =>
{
   it('should not have resource.ts (shared is not a Lambda)', () =>
   {
      const resourcePath = join(__dirname, '..', 'resource.ts');
      expect(existsSync(resourcePath)).toBe(false);
   });

   it('should not have backend.ts (shared is not a Lambda)', () =>
   {
      const backendPath = join(__dirname, '..', 'backend.ts');
      expect(existsSync(backendPath)).toBe(false);
   });
});
