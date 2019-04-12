import React from 'react';
import PropTypes from 'prop-types'
import { Grid, Image } from "semantic-ui-react";

import {long} from '../../../utils/dateFormatting';
import GroupLink from '../../kure/GroupLink';
import TitleLink from '../Steem/TitleLink';
import UserLink from '../Steem/UserLink';
import defaultImage from '../../../images/steemkure-600.png';
import './PostGrid.css'
/**
 *  Component to display the post data sent.
 *  If posts exist, display them. If not, display message.
 *
 *  @param {object} props Component props
 *  @param {object} props.post The post data to display
 *  @returns {element} Displays the post, or message if no posts are in the app
 */
const PostGrid = ({post}) => {
  if (post) {
    return (
      <Grid.Column width={8}>
        <div className='postBox'>
          <div className='cropImage'>
            {
              post.st_image
                ? <Image src={post.st_image} alt="image" />
                : <Image src={defaultImage} alt="image" />
            }
          </div>
          <div className='overlayImage'>
            <div className='recentTitle'>
              <div className='titleContent'>
                <TitleLink
                  title={post.st_title}
                  category={post.st_category}
                  author={post.st_author}
                  permlink={post.st_permlink}
                />
              </div>
            </div>
            <div className='left'>
              {'by '}
              <UserLink user={post.st_author} />
            </div>
            <div className='right'>
              <div><GroupLink display={post.display} name={post.group} /></div>
              <div>{long(post.created)}</div>
            </div>
          </div>
        </div>
      </Grid.Column>
    )
  }
}

PostGrid.propTypes = {
  post: PropTypes.shape(PropTypes.object.isRequired),
};

export default PostGrid;
