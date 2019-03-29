import React  from 'react';
import PropTypes from 'prop-types';

import Posts from './Posts'


/**
 *  Kurate gets the Steem blockchain content and dusplays a list of post
 *  summaries for browsing. Content can be added to a community group
 *  to which the user belongs.
 */
const Kurate = ({match}) => (
  <Posts
    page='kurate'
    match={match}
  />
)

Kurate.propTypes = {
  match: PropTypes.shape(PropTypes.object.isRequired)
}

Kurate.defaultProps = {
  match: {}
}

export default Kurate;
