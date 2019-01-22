import React from 'react';
import { Grid, Segment, Icon } from "semantic-ui-react";
import moment from 'moment';

import Loading from '../../Loading/Loading';
import './GroupsList.css';

const GroupsList = ({groups, handleEditGroup, handleDeleteGroup, isLoading, noOwned}) => {
  if (isLoading) {
    return <Loading />;
  }else {
    if (groups && groups.length && !noOwned) {
      return groups.map((g, i) => {
        const date = moment(g.created).format("YYYY-MM-DD");
        return (
          <Grid.Column key={i} width={4}>
            <Segment key={i}>
              <div key={i}>
                <h3 className='left'>
                  <a
                    href={'edit/'+g.name}
                    onClick={(e) => handleEditGroup(e, g.name)}
                  >
                    {g.display}
                  </a>
                </h3>
                <div className='right'>
                  <a href={'edit/'+g.name}
                  onClick={(e) => handleEditGroup(e, g.name)}>
                    <Icon name='edit' color='blue' />
                  </a>
                  <a href={'/delete/'+g.name} onClick={(e) => handleDeleteGroup(e, g.name)}><Icon name='minus circle' color='blue' /></a>
                </div>
                <div class='clear'></div>
                <div>Owner: {g.owner}</div>
                <div>Created: {date}</div>
                <div>Posts: {g.posts}</div>
                {/*<div>Followers: {g.followers}</div>*/}
                <div>Likes: {g.likes}</div>
              </div>
            </Segment>
          </Grid.Column>
        )
      })
    }else {
      return (
          <Grid.Column width={8}>
            <Segment>
              <p>
                {"You don't own any community groups."}<br/>
                {"You can create up to 4."}
              </p>
            </Segment>
          </Grid.Column>
      )
    }
  }
}

export default GroupsList;
