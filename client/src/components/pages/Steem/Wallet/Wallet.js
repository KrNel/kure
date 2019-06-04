import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader, Grid, Header, Segment } from "semantic-ui-react";

import { getUserHistory } from '../../../../actions/walletActions';
import DollarDisplay from '../DollarDisplay';
import './Wallet.css';

class Wallet extends React.Component {

  formatterDecimal = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })

  colLeft = 10;
  colRight = 6;

  static propTypes = {
    isFetching: PropTypes.bool,
    receivedVShares: PropTypes.string,
    delegatedVShares: PropTypes.string,
    steemBalance: PropTypes.string,
    userVShares: PropTypes.string,
    sbdBalance: PropTypes.string,
    vestingShares: PropTypes.string,
    vestingFund: PropTypes.string,
  }

  static defaultProps = {
    isFetching: false,
    receivedVShares: '',
    delegatedVShares: '',
    steemBalance: '',
    userVShares: '',
    sbdBalance: '',
    vestingShares: '',
    vestingFund: '',
  }

  componentDidMount() {

    const {
      userHistory,
      match: {
        params: {
          author: user,
        }
      }
    } = this.props;

    userHistory(user);
  }

  vestToSteem = (vestingShares, totalVestingShares, totalVestingFundSteem) => {
    return (
      parseFloat(totalVestingFundSteem) *
      (parseFloat(vestingShares) / parseFloat(totalVestingShares))
    );
  }

  calculateTotalDelegatedSP = (receivedVShares, delegatedVShares, totalVestingShares, totalVestingFundSteem) => {
    const receivedSP = parseFloat(
      this.vestToSteem(receivedVShares, totalVestingShares, totalVestingFundSteem),
    );
    const delegatedSP = parseFloat(
      this.vestToSteem(delegatedVShares, totalVestingShares, totalVestingFundSteem),
    );
    return receivedSP - delegatedSP;
  };

  /*alculateEstAccountValue = (
    vestingShares,
    steemBalance,
    sbdBalance,
    totalVestingShares,
    totalVestingFundSteem,
    steemRate,
    sbdRate,
  ) => {
    const steemPower = this.vestToSteem(
      vestingShares,
      totalVestingShares,
      totalVestingFundSteem,
    );
    return (
      parseFloat(steemRate) * (parseFloat(steemBalance) + parseFloat(steemPower)) +
      parseFloat(sbdBalance) * parseFloat(sbdRate)
    );
  }*/

/*
  currentSteemRate = _.get(
    cryptosPriceHistory,
    `${STEEM.symbol}.priceDetails.currentUSDPrice`,
    null,
  );

  currentSBDRate = _.get(
    cryptosPriceHistory,
    `${SBD.symbol}.priceDetails.currentUSDPrice`,
    null,
  );
*/

  render() {

    const {
      isFetching,
      receivedVShares,
      delegatedVShares,
      steemBalance,
      userVShares,
      sbdBalance,
      vestingShares,
      vestingFund,
      savingsSteem,
      savingsSBD,
      match: {
        params: {
          author: user,
        }
      },
    } = this.props;

    const stemPower = this.formatterDecimal.format(this.vestToSteem(userVShares, vestingShares, vestingFund));

    const totalDelegatedSP = this.formatterDecimal.format(this.calculateTotalDelegatedSP(receivedVShares, delegatedVShares, vestingShares, vestingFund));

    let delegated = null;
    if (totalDelegatedSP !== 0) {
      delegated = (
        <div>
          {totalDelegatedSP > 0 ? ' (+' : ' ('}
          {totalDelegatedSP}
          {')'}
        </div>
      )
    }

    return (
      <div className='wallet'>
        <Grid columns={3} stackable>
          <Grid.Column width={2} />
          <Grid.Column width={12}>

            <Segment.Group>
              <Segment>
                <Header as='h1'>{`${user}'s Wallet`}</Header>
              </Segment>
              <Segment>
                <div className='item'>
                  <div className='left label'>STEEM: </div>
                  <div className='right value'>{steemBalance}</div>
                  <div className='clear' />
                </div>

                <div className='item'>
                  <div className='left label'>STEEM POWER: </div>
                  <div className='right value'>
                    {
                      isFetching
                      ? <Loader inline />
                      : (
                        <span>
                          {`${stemPower} SP`}
                          {delegated}
                        </span>
                      )
                    }
                  </div>
                  <div className='clear' />
                </div>

                <div className='item'>
                  <div className='left label'>STEEM BASED DOLLAR: </div>
                  <div className='right value'>
                    <DollarDisplay value={sbdBalance.substring(0, sbdBalance.length-4)} />
                    {' SBD'}
                  </div>
                  <div className='clear' />
                </div>

                <div className='item'>
                  <div className='left label'>STEEM Savings: </div>
                  <div className='right value'>{savingsSteem}</div>
                  <div className='clear' />
                  <div className='left label'>SBD Savings: </div>
                  <div className='right value'>{savingsSBD}</div>
                  <div className='clear' />
                </div>
                {/*
                <div className='item'>
                  <div className='left label'>Estimated account value: </div>
                  <div className='right value'>
                    <DollarDisplay
                      value={this.calculateEstAccountValue(
                        vestingShares,
                        steemBalance,
                        sbdBalance,
                        vestingShares,
                        vestingFund,
                        steemRate,
                        sbdRate,
                      )}
                    />
                  </div>
                  <div className='clear' />
                </div>
                */}
              </Segment>
            </Segment.Group>

          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>

      </div>
    )
  }
}

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Object with recent activity data
 */
const mapStateToProps = state => {
  const {
    auth: {
      user,
    },
    wallet: {
      isFetching,
      username,
      account: {
        received_vesting_shares: receivedVShares,
        delegated_vesting_shares: delegatedVShares,
        balance: steemBalance,
        vesting_shares: userVShares,
        sbd_balance: sbdBalance,
        savings_balance: savingsSteem,
        savings_sbd_balance: savingsSBD,
      },
      globalProps: {
        total_vesting_shares: vestingShares,
        total_vesting_fund_steem: vestingFund,
      },
    }
  } = state;

  return {
    isFetching,
    username,
    receivedVShares,
    delegatedVShares,
    steemBalance,
    userVShares,
    sbdBalance,
    vestingShares,
    vestingFund,
    savingsSteem,
    savingsSBD,
  }
}

/**
 *  Map redux dispatch functions to component props.
 *
 *  @param {object} dispatch - Redux dispatch
 *  @returns {object} - Object with recent activity data
 */
const mapDispatchToProps = dispatch => (
  {
    userHistory: user => (
      dispatch(getUserHistory(user))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
