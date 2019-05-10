import React from 'react';
import { Grid, Header, Segment, Label } from "semantic-ui-react";

import GroupLink from '../../kure/GroupLink';
import TitleLink from '../Steem/TitleLink';

/**
 *  Show the most recently active communities. Allow logged in users todo
 *  request to join a community with the `Join` link. Once clicked, user sees
 *  `Requested` which remains until request is approved or rejected.
 *
 *  @param {array} groupsActivity Data for active groups
 */
const GroupsRecent = ({ groupsActivity }) => {
  if (groupsActivity.length) {
    return (
      <React.Fragment>
        <Grid columns={1} stackable id='GroupPageRecent'>
          {
            groupsActivity.map((group,i) => (
              <Grid.Column key={group._id} width={8}>
                <Segment.Group className='box'>
                  <Segment>
                    <Label attached='top' className='head'>
                      <div className='left'>
                        <Header as='h3'>
                          <GroupLink display={group.display} name={group.name} />
                        </Header>
                      </div>
                      <div className='clear' />
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
          }
        </Grid>
      </React.Fragment>
    );
  }
}

export default GroupsRecent;
