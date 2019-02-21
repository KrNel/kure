import React, { Component } from 'react';
import { Loader, Dimmer, Grid, Header, Segment, Label } from "semantic-ui-react";
import { Link } from 'react-router-dom';

class GroupsRecent extends Component {
  state = {
    //reqJoinSent: false,
    //groupRequested: '',
  }

  render() {

    const {
      /*state: {
        //reqJoinSent,
      },*/
      props: {
        isAuth,
        groupsActivity,
        groupRequested,
        onJoinGroup
      }
    } = this;

    if (groupsActivity.length) {
      return (

        <Grid columns={1} stackable id='GroupPage'>
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
                        g.length
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
      );
    }else {
      return (
        <div>
          No communities.
        </div>
      )
    }
  }

}

export default GroupsRecent;
