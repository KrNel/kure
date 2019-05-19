import React from 'react';
import { Image } from "semantic-ui-react";

import logo from '../../../images/steemLogo.svg';

/**
 *  The image is created from the Semantic-UI react package which places the
 *  svg image inline so that other data can be placed on the same line.
 */
const FullPower = () => (
  <span className='fullPower'>
    <Image inline src={logo} height={17} width={17} title='100% Steem Power payout' />
    {`\u00A0`}
  </span>
)

export default FullPower;
