import { Client } from 'dsteem';

const client = new Client('https://hive.anyx.io/');

export const WALLET_HISTORY_START = 'WALLET_HISTORY_START';
export const WALLET_HISTORY_SUCCESS = 'WALLET_HISTORY_SUCCESS';

/**
 *  Action creator to start a wallet history fetch.
 *
 *  @param {string} user User to get data for
 *  @returns {object} The action data
 */
const walletHistoryStart = user => ({
  type: WALLET_HISTORY_START,
  user,
});

/**
 *  Action creator for successful wallet history fetch.
 *
 *  @param {string} user User to get data for
 *  @returns {object} The action data
 */
const walletHistorySuccess = (account, globalProps) => ({
  type: WALLET_HISTORY_SUCCESS,
  account,
  globalProps,
});

/**
 *  Gets a user's wallet history
 *
 *  @param {string} user User to get data for
 *  @returns {function} Dispatches returned action object
 */
export const getUserHistory = (user, from = -1, limit = 500) => (dispatch, getState) => {
  dispatch(walletHistoryStart(user));

  //const { user } = getState().auth;

  //return client.call('get_account_history', [user, from, limit])
  return client.database.getAccounts([user])
    .then(account => {
      client.database.getDynamicGlobalProperties([])
        .then(globalProps => {
          dispatch(walletHistorySuccess(account[0], globalProps));
        })
    });
}

/*export const getCryptoPriceHistory = (symbol, refresh = false) => dispatch => {
  if (refresh) {
    dispatch(refreshCryptoPriceHistory(symbol));
  }
  dispatch({
    type: GET_CRYPTO_PRICE_HISTORY.ACTION,
    payload: {
      promise: Promise.all([
        fetch(
          `https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=USD&limit=6`,
        ).then(res => res.json()),
        fetch(
          `https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=BTC&limit=6`,
        ).then(res => res.json()),
      ]).then(response => {
        const usdPriceHistory = _.get(response, 0, {});
        const btcPriceHistory = _.get(response, 1, {});
        return {
          usdPriceHistory,
          btcPriceHistory,
          symbol,
        };
      }),
    },
  });
};*/
