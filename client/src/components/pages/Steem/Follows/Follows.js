import React from 'react';
import PropTypes from 'prop-types';

import Posts from '../Posts'

const Follows = ({match}) => (
  <Posts
    page='follows'
    match={match}
  />
)

Follows.propTypes = {
  match: PropTypes.shape(PropTypes.object.isRequired),
};

Follows.defaultProps = {
  match: {},
};

export default Follows;
