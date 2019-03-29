import React from 'react';
import { Grid } from "semantic-ui-react";

import PostGrid from '../pages/Kurated/PostGrid';

import './GroupPostsGrid.css';

const GroupPostsGrid = ({posts}) => (
  <div className='postsGrid'>
    <Grid>
      {
        posts.map(post => <PostGrid key={post._id} post={post} /> )
      }
    </Grid>
  </div>
)

export default GroupPostsGrid;
