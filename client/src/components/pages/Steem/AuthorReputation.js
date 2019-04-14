import React from 'react';
import PropTypes from 'prop-types';

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

AuthorReputation.propTypes = {
  author: PropTypes.string,
  reputation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

AuthorReputation.defaultProps = {
  author: '',
  reputation: '',
};

export default AuthorReputation;
