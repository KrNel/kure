import { Client } from 'dsteem';
import { unescape } from 'lodash';
import base58 from 'bs58';
import getSlug from 'speakingurl';
import secureRandom from 'secure-random';

import { getHtml } from '../Post/PostBody';
import { extractImageTags, extractLinks } from './parser';

const client = new Client('https://hive.anyx.io/');

const appVersion = require('../../../../../package.json').version;

/**
 *  Get the images in a post's content.
 */
export const getContentImages = (content, parsed = false) => {
  const parsedBody = parsed ? content : getHtml(content, {}, 'text');

  return extractImageTags(parsedBody).map(tag =>
    unescape(tag.src.replace('https://steemitimages.com/0x0/', '')),
  );
}

/**
 *  Code taken from busy.org open source github, and modified for my purposes.
 *  https://github.com/busyorg/busy/blob/develop/src/client/helpers/postHelpers.js
 */
export const createPostMetadata = (body, tags, oldMetadata = {}) => {
  let metaData = {
    community: 'kure',
    app: `kure/${appVersion}`,
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

/**
 * Generate permlink
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js
 */
export const createPermlink = (title, author, parent_author, parent_permlink) => {
  let permlink;
  if (title && title.trim() !== '') {
    let s = slug(title);
    if (s === '') {
      s = base58.encode(secureRandom.randomBuffer(4));
    }

    return client.database.call('get_content', [author, s])
      .then(content => {
        let prefix;
        if (content.body !== '') {
          // make sure slug is unique
          prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
        } else {
          prefix = '';
        }
        permlink = prefix + s;
        return checkPermLinkLength(permlink);
      })
      .catch(err => {
        console.warn('Error while getting content', err);
        return permlink;
      });
  }
  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  parent_permlink = parent_permlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parent_author}-${parent_permlink}-${timeStr}`;
  return Promise.resolve(checkPermLinkLength(permlink));
}

/**
 *  Check the structure of a permlink to see if it's valid.
 */
const checkPermLinkLength = (permlink) => {
  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
}

/**
 *  Generate a slug string for use in a permlink.
 */
const slug = (text) => {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

export default createPostMetadata;
