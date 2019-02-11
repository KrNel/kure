/**
 * Based on ExtractContent.js from Steem condenser front-end by Steemit Inc. @ https://github.com/steemit/condenser/blob/master/src/app/utils/ExtractContent.js
 *
 *
 */

import Remarkable from 'remarkable';
import sanitize from 'sanitize-html';
import remarkableStripper from './remarkablestripper';
import HtmlReady from './htmlready';

export const remarkable = new Remarkable({ html: true, linkify: false });

const getValidImage = array => {
    return array &&
        Array.isArray(array) &&
        array.length >= 1 &&
        typeof array[0] === 'string'
        ? array[0]
        : null;
};


const htmlDecode = txt =>
  txt.replace(/&[a-z]+;/g, ch => {
    const char = htmlCharMap[ch.substring(1, ch.length - 1)];
    return char ? char : ch;
  });

const htmlCharMap = {
  amp: '&',
  quot: '"',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
  hearts: '♥',
  trade: '™',
  hellip: '…',
  pound: '£',
  copy: '',
};

export function extractContent(post) {
  //console.log(post);
  const {
    author,
    body,
    permlink,
    parent_author,
    parent_permlink,
    json_metadata,
    category,
    title,
    created,
    net_rshares,
    children,
    url,
    pending_payout_value,
    depth,
  } = post;

  //const body = get(content, 'body');
  let jsonMetadata = JSON.parse(json_metadata);
  let image_link;
  try {
    //in case of metadata being double encoded
    if (typeof jsonMetadata == 'string') {
      jsonMetadata = JSON.parse(jsonMetadata);
    }
    // First, attempt to find an image url in the json metadata
    if (jsonMetadata && jsonMetadata.image) {
      image_link = getValidImage(jsonMetadata.image);
    }
  } catch (error) {
      console.error('Invalid json metadata string', json_metadata, 'in post', author, permlink);
  }

  // If nothing found in json metadata, parse body and check images/links
  if (!image_link) {
    let rtags;
    {
      const isHtml = /^<html>([\S\s]*)<\/html>$/.test(body);
      const htmlText = isHtml
        ? body
        : remarkable.render(
            body.replace(
              /<!--([\s\S]+?)(-->|$)/g,
              '(html comment removed: $1)'
            )
          );

      rtags = HtmlReady(htmlText, { mutate: false });
    }

    [image_link] = Array.from(rtags.images);
  }


  let desc;
  let desc_complete = false;

  // Short description.
  // Remove bold and header, etc.
  // Stripping removes links with titles (so we got the links above)..
  // Remove block quotes if detected at beginning of comment preview if comment has a parent
  const body2 = remarkableStripper.render(
    depth > 1
      ? body.replace(/(^(\n|\r|\s)*)>([\s\S]*?).*\s*/g, '')
      : body
  );
  desc = sanitize(body2, { allowedTags: [] }); // remove all html, leaving text
  desc = htmlDecode(desc);

  // Strip any raw URLs from preview text
  desc = desc.replace(/https?:\/\/[^\s]+/g, '');

  // Grab only the first line (not working as expected. does rendering/sanitizing strip newlines?)
  desc = desc.trim().split('\n')[0];

  if (desc.length > 140) {
    desc = desc
      .substring(0, 120)
      .trim()
      .replace(/[,!\?]?\s+[^\s]+$/, '…'); // eslint-disable-line no-useless-escape
  }
  desc_complete = body2 === desc; // is the entire body in desc?

  return {
    author,
    permlink,
    parent_author,
    parent_permlink,
    json_metadata: jsonMetadata,
    category,
    title,
    created,
    net_rshares,
    children,
    url,
    pending_payout_value,
    image_link,
    desc,
    desc_complete,
    body
  };


}
export const slugify = (string) => {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(p, c => b.charAt(a.indexOf(c)))
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')// eslint-disable-line no-useless-escape
      .replace(/\-\-+/g, '-')// eslint-disable-line no-useless-escape
      .replace(/^-+/, '')
      .replace(/-+$/, '')
};

export const shortid = () => Math.random().toString(36).substr(2, 9);
