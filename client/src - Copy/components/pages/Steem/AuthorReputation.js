import React from 'react';

import Author from './Author';
import RepLog10 from '../../../utils/reputationCalc';

/**
 *  Displays the author hyperlink.
 *
 *  @param {string} author Author of post
 *  @returns {component} createdFromNow Time since post was created
 */
const AuthorReputation = ({author, reputation}) => (
  <React.Fragment>
    <Author author={author} />
    {`\u00A0(${RepLog10(reputation)})`}
  </React.Fragment>
)

export default AuthorReputation;
