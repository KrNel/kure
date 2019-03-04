import React from 'react';
import { Grid, Header, Segment, Label } from "semantic-ui-react";

import GroupLink from '../../common/GroupLink';
import TitleLink from '../../common/TitleLink';

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
        <Label size='large' color='blue' className='adjMarginBot'><Header>Recently Active</Header></Label>
        <Grid columns={1} stackable id='GroupPageRecent'>
          {
            groupsActivity.map((g,i) => (
              <Grid.Column key={i} width={8}>
                <Segment.Group className='box'>
                  <Segment>
                    <Label attached='top' className='head'>
                      <div className='left'>
                        <Header as='h3'>
                          <GroupLink display={g.display} name={g.name} />
                        </Header>
                      </div>
                      <div className='clear' />
                    </Label>
                    <ul className='custom-list'>
                      {
                        g.kposts.length
                        ? g.kposts.map(p => (
                          <li key={p._id}>
                            {`\u2022\u00A0`}
                            <TitleLink
                              title={p.st_title}
                              category={p.st_category}
                              author={p.st_author}
                              permlink={p.st_permlin}
                              cutoff={40}
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
