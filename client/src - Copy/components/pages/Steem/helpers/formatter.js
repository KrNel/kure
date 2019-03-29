/**
 *  Lifted from busy.org source:
 *  https://github.com/busyorg/busy/blob/develop/src/client/helpers/formatter.js
 */

export function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

export const epochToUTC = epochTimestamp => new Date(0).setUTCSeconds(epochTimestamp);
