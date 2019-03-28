import React from 'react';
import PropTypes from 'prop-types'
import { Grid, Image } from "semantic-ui-react";

import {long} from '../../../utils/timeFromNow';
import GroupLink from '../../common/GroupLink';
import TitleLink from '../../common/TitleLink';
import UserLink from '../../common/UserLink';
import defaultImage from '../../../images/steemkure-600.png';
import './RecentPostsBoxes.css'
/**
 *  Component to display the post data sent.
 *  If posts exist, display them. If not, display message.
 *
 *  @param {object} props Component props
 *  @param {object} props.post The post data to display
 *  @param {function} props.isAuth Determines if user is authenticated
 *  @returns {element} Displays the post, or message if no posts are in the app
 */
const RecentPostsBoxes = ({posts, isAuth}) => {
  if (posts.length) {

    return posts.map((p, i) => (
      <Grid.Column key={i} width={8}>
        <div className='recentBox'>
          <div className='cropImage'>
            {
              p.st_image
                ? <Image src={p.st_image} alt="image" />
                : <Image src={defaultImage} alt="image" />
            }
          </div>
          <div className='overlayImage'>
            <div className='recentTitle'>
              <TitleLink
                title={p.st_title}
                category={p.st_category}
                author={p.st_author}
                permlink={p.st_permlink}
              />
            </div>
            <div className='left'>
              {'by '}
              <UserLink user={p.st_author} />
            </div>
            <div className='right'>
              <div><GroupLink display={p.display} name={p.group} /></div>
              <div>{long(p.created)}</div>
            </div>
          </div>
        </div>
      </Grid.Column>
    ))
  }
}

RecentPostsBoxes.propTypes = {
  post: PropTypes.shape(PropTypes.object),
  isAuth: PropTypes.bool.isRequired,
};

export default RecentPostsBoxes;
