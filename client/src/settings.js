/**
 *  Common data settings to use.
 */

export const BASE_STEEM_URL = "https://steemit.com";
export const roles = {
  kGroupsRoles: {
    0: 'Owner',
    1: 'Admin',
    2: 'Moderator',
    3: 'Member'
  },
  kGroupsRolesRev: {
    'Owner': 0,
    'Admin': 1,
    'Moderator': 2,
    'Member': 3
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

export default BASE_STEEM_URL;
