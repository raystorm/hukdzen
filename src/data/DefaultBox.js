import { SystemUser } from './SystemUser.js';

/**
 * Default Box — the global shared box available to all users.
 * Owned by the SystemUser and created exactly once during initialization.
 * All authenticated users can create, edit, and share content in this box.
 * Serves as the shared space for community documents and public resources.
 */
export const DefaultBox = {
  __typename:   'Xbiis',
  id:           '75ca183f-a199-4d3d-9ac3-e10432965276',
  name:         'Public',      //belongs to everyone
  waa:          "Nlip 'gynnm", //belongs to everyone
  owner:        SystemUser,
  ownerUserId:  SystemUser.id,
  xbiisOwnerId: SystemUser.id,
  purpose:      'DEFAULT',
  defaultRole:  'WRITE',
  createdAt:    '2023-01-01T00:00:00.000Z',
  updatedAt:    '2023-01-01T00:00:00.000Z',
}