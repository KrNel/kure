import React from 'react';
import { Loader, Dimmer, Grid, Header, Segment, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';

/**
 *  Show the most recently active communities. Allow logged in users todo
 *  request to join a community with the `Join` link. Once clicked, user sees
 *  `Requested` which remains until request is approved or rejected.
 *
 *  @param {boolean} isAuth Determines if user is authenticated
 *  @param {array} groupsActivity Data for active groups
 *  @param {string} groupRequested The name of the group being requested to join
 *  @param {function} onJoinGroup Handles a join request
 */
const GroupsRecent = ({ isAuth, groupsActivity, groupRequested, onJoinGroup }) => {
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
                          {g.display}
                        </Header>
                      </div>
                      <div className='right'>
                        {
                          (isAuth)
                          ? (groupRequested === g.name)
                            ? <Dimmer inverted active><Loader /></Dimmer>
                            : (g.access && g.access.access !== 100)
                              ? ''
                              : (g.access && g.access.access === 100)
                                ? 'Requested'
                                : (
                                  <a
                                    href={`/join/${g.name}`}
                                    onClick={e => onJoinGroup(e, g.name)}
                                  >
                                    {'Join'}
                                  </a>
                                )
                          : 'Login to Join'
                        }
                      </div>
                      <div className='clear' />
                    </Label>
                    <ul className='custom-list'>
                      {
                        g.posts.length
                        ? g.posts.map(p => (
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
