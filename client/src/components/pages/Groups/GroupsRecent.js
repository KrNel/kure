import React from 'react';
import { Grid, Header, Segment, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import GroupLink from '../../Common/GroupLink';

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
                            <Link
                              to={p.st_category+'/@'+p.st_author+'/'+p.st_permlink}
                            >
                              {`\u2022\u00A0`}
                              {(p.st_title.length > 40)
                                ? p.st_title.substr(0,40) + " ..."
                                : p.st_title}
                            </Link>
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
