import {unescape} from 'lodash';
import { getHtml } from '../Post/PostBody';
import { extractImageTags, extractLinks } from './parser';

/*const totalPayout =
  parseFloat(post.pending_payout_value) +
  parseFloat(post.total_payout_value) +
  parseFloat(post.curator_payout_value);
const totalRShares = post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
const ratio = totalRShares === 0 ? 0 : totalPayout / totalRShares;*/

export function getContentImages(content, parsed = false) {
  const parsedBody = parsed ? content : getHtml(content, {}, 'text');

  return extractImageTags(parsedBody).map(tag =>
    unescape(tag.src.replace('https://steemitimages.com/0x0/', '')),
  );
}

export function createPostMetadata(body, tags, oldMetadata = {}) {
  let metaData = {
    community: 'kure',
    app: `kure/v0.1`,
    //app: `kure/${appVersion}`,
    format: 'markdown',
  };

  metaData = {
    ...oldMetadata,
    ...metaData,
  };

  const users = [];
  const userRegex = /@([a-zA-Z.0-9-]+)/g;
  let matches;

  // eslint-disable-next-line no-cond-assign
  while ((matches = userRegex.exec(body))) {
    if (users.indexOf(matches[1]) === -1) {
      users.push(matches[1]);
    }
  }

  const parsedBody = getHtml(body, {}, 'text');

  const images = getContentImages(parsedBody, true);
  const links = extractLinks(parsedBody);

  metaData.tags = tags;
  metaData.users = users;
  metaData.links = links.slice(0, 10);
  metaData.image = images;

  return metaData;
}

/**
 * This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://github.com/steemit/steemit.com/blob/edac65e307bffc23f763ed91cebcb4499223b356/app/redux/TransactionSaga.js#L340
 *
 */
export const createCommentPermlink = (parentAuthor, parentPermlink) => {
  let permlink;

  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  const newParentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parentAuthor}-${newParentPermlink}-${timeStr}`;

  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
};

export default createPostMetadata;
