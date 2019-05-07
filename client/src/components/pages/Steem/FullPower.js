import React from 'react';
import PropTypes from 'prop-types';
import { Image } from "semantic-ui-react";

import logo from '../../../images/steemLogo.svg';

const FullPower = () => (
  <li className="item">{`\u00A0\u2022\u00A0`}<Image inline src={logo} height={18} width={18} title='Payout 100% Steem Power' /></li>
)

export default FullPower;
