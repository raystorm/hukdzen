/**
 * System User - owns system resources like the default box
 * Fixed ID across all environments for consistency
 * Not an admin - system resources should be managed by actual admins
 */
export const SystemUser = {
   __typename: 'User',
   id:         '00000000-0000-0000-0000-000000000001',
   name:       'System',
   email:      'noreply@smalgyax-files.org',
   isAdmin:    false,
   createdAt:  '2023-01-01T00:00:00.000Z',
   updatedAt:  '2023-01-01T00:00:00.000Z',
};