import React from 'react';
import { Grid, Header, Segment, Label } from "semantic-ui-react";

import GroupLink from '../../common/GroupLink';
import TitleLink from '../../common/TitleLink';

const CommunityActivity = ({groups}) => (
  <React.Fragment>
    {
      groups.length
      ?
        groups.map(g => (
          <Grid.Column key={g.name} width={8}>
            <Segment.Group className='box'>
              <Segment>
                <Label attached='top' className='head'>
                  <Header as='h3'>
                    <GroupLink display={g.display} name={g.name} />
                  </Header>
                </Label>
                <ul className='custom-list'>
                  {
                    g.kposts.length
                    ? g.kposts.map(p => (
                      <li key={p._id} className='ellipsis'>
                        {`\u2022\u00A0`}
                        <TitleLink
                          title={p.st_title}
                          category={p.st_category}
                          author={p.st_author}
                          permlink={p.st_permlink}
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

export default CommunityActivity;
