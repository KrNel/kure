import {
  WALLET_HISTORY_START, WALLET_HISTORY_SUCCESS
} from '../actions/walletActions';

/**
 *  Reducer function for wallet Redux state data.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const wallet = (state = {
  isFetching: false,
  username: '',
  account: {},
  globalProps: {},
}, action) => {

  switch (action.type) {
    case WALLET_HISTORY_START:
      return {
        ...state,
        isFetching: true,
        username: action.user,
        account: {},
      }
    case WALLET_HISTORY_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        username: action.user,
        account: action.account,
        globalProps: action.globalProps,
      }
    }
    /*case appTypes.REFRESH_CRYPTO_PRICE_HISTORY:
      return {
        ...state,
        cryptosPriceHistory: {
          ...state.cryptosPriceHistory,
          [action.payload]: null,
        },
      };
    case appTypes.GET_CRYPTO_PRICE_HISTORY.SUCCESS: {
      const { symbol, usdPriceHistory, btcPriceHistory } = action.payload;
      const usdPriceHistoryByClose = _.map(usdPriceHistory.Data, data => data.close);
      const btcPriceHistoryByClose = _.map(btcPriceHistory.Data, data => data.close);
      const priceDetails = getCryptoPriceIncreaseDetails(
        usdPriceHistoryByClose,
        btcPriceHistoryByClose,
      );
      const btcAPIError = btcPriceHistory.Response === 'Error';
      const usdAPIError = usdPriceHistory.Response === 'Error';

      return {
        ...state,
        cryptosPriceHistory: {
          ...state.cryptosPriceHistory,
          [symbol]: {
            usdPriceHistory: usdPriceHistoryByClose,
            priceDetails,
            btcAPIError,
            usdAPIError,
          },
        },
      };
    }*/
    default:
      return state
  }
}

export default wallet;
