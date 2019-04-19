/**
 *  Common data settings to use.
 */

export const BASE_URL = "https://localhost:3000";
export const roles = {
  kGroupsRoles: {
    0: 'Owner',
    1: 'Admin',
    2: 'Moderator',
    3: 'Member',
    4: 'Guest',
    100: 'Requested'
  },
  kGroupsRolesRev: {
    'Owner': 0,
    'Admin': 1,
    'Moderator': 2,
    'Member': 3,
    'Guest': 4,
    'Requested': 100
  },
  kGroupsAccess: {
    post: {
      delete: {
        3: {3: 0, 2: 0, 1: 0},
        2: {3: 1, 2: 0, 1: 0},
        1: {3: 1, 2: 1, 1: 0},
        0: {3: 1, 2: 1, 1: 1}
      }
    }
  }
}

export const SC_COOKIE = "SC-TOKEN";

export default BASE_URL;
