import React from 'react';
import PropTypes from 'prop-types';
import { Image } from "semantic-ui-react";

import logo from '../../../images/steemLogo.svg';

const FullPower = () => (
  <span className='fullPower'>
    <Image inline src={logo} height={17} width={17} title='Payout 100% Steem Power' />
    {`\u00A0`}
  </span>
)

export default FullPower;
