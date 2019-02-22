/**
 *  Grabbed from Steemit's condenser:
 *  https://github.com/steemit/condenser/blob/master/src/shared/HtmlReady.js
 */

const urlChar = '[^\\s"<>\\]\\[\\(\\)]';
const urlCharEnd = urlChar.replace(/\]$/, ".,']"); // insert bad chars to end on
const imagePath =
    '(?<!img.*>)(?:(?:\\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs/[a-z\\d]{40,}))';
const domainPath = '(?:[-a-zA-Z0-9\\._]*[-a-zA-Z0-9])';
const urlChars = '(?:' + urlChar + '*' + urlCharEnd + ')?';
const urlSet = ({ domain = domainPath, path } = {}) => {
    // urlChars is everything but html or markdown stop chars
    //eslint-disable-next-line
    return `(?<!(?:img|a).*)https?:\/\/${domain}(?::\\d{2,5})?(?:[/\\?#]${urlChars}${
        path ? path : ''
    })${path ? '' : '?'}`;
    //(.[^>"]|[^=]")\b(https?|ftp|file)
    /*return `https?:\/\/${domain}(?::\\d{2,5})?(?:[/\\?#]${urlChars}${
        path ? path : ''
    })${path ? '' : '?'}`;*/
    //https://localhost:3000/news/@rebe.torres12/una-renegada-a-renegade
};

/**
 *  Replace http image links with real <img> html tags.
 *
 *  @param {string} body Content to scan.
 */
const replaceLinks = (body) => {
  return body = body.replace(new RegExp(urlSet(), 'gi'), ln => {

    //if (!new RegExp(urlSet({ path: imagePath }), 'i').test(ln))
      if (new RegExp(urlSet({ path: imagePath }), 'i').test(ln)) {
          //return `<img src="${ipfsPrefix(ln)}" />`;
          return `<img src="${ln}" />`;
      }
      // do not linkify .exe or .zip urls
      if (/\.(zip|exe)$/i.test(ln)) return ln;

      return `<a href="${ln}">${ln}</a>`;
    //}
  });
}

export default replaceLinks;
