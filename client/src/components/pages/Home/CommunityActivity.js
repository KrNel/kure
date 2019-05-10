import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment, Label } from "semantic-ui-react";

import GroupLink from '../../kure/GroupLink';
import TitleLink from '../Steem/TitleLink';

/**
 *  Shows the most recently active communities that have had curated posts
 *  added to the group. Each community group shows the most recently added
 *  posts.
 */
const CommunityActivity = ({groups}) => (
  <React.Fragment>
    {
      groups.length
      ?
        groups.map(group => (
          <Grid.Column key={group.name} width={8}>
            <Segment.Group className='box'>
              <Segment>
                <Label attached='top' className='head'>
                  <Header as='h3'>
                    <GroupLink display={group.display} name={group.name} />
                  </Header>
                </Label>
                <ul className='custom-list'>
                  {
                    group.kposts.length
                    ? group.kposts.map(post => (
                      <li key={post._id} className='ellipsis'>
                        {`\u2022\u00A0`}
                        <TitleLink
                          title={post.st_title}
                          category={post.st_category}
                          author={post.st_author}
                          permlink={post.st_permlink}
                        />
                      </li>
                    )) : 'No posts.'
                  }
                </ul>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        ))
      : (
        <Grid.Row columns={1}>
          <Grid.Column>
            <Segment>
              {'No communities.'}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    }
  </React.Fragment>
)

CommunityActivity.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object.isRequired),
};

CommunityActivity.defaultProps = {
  groups: [],
};

export default CommunityActivity;
