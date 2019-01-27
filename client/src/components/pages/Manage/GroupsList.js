import React from 'react';
import { Grid, Segment, Icon, Loader, Dimmer } from "semantic-ui-react";
import moment from 'moment';

import Loading from '../../Loading/Loading';

const GroupsList = (props) => {

  const {
    groups,
    handleManageGroup,
    isLoading,
    noOwned,
    isGroupLoading,
    loadingGroup,
    showModal,
  } = props;

  if (isLoading) {
    return <Loading />;
  }else {
    if (groups && groups.length && !noOwned) {
      return (
        <Grid.Row className="content">
          <Grid.Column>
            <Grid stackable>
              {
              groups.map((g, i) => {
                const date = moment(g.created).format("YYYY-MM-DD");
                return (
                  <Grid.Column key={i} width={4}>
                    <Segment key={i}>
                      {
                        (loadingGroup === g.name)
                          ? <Dimmer inverted active={isGroupLoading}><Loader /></Dimmer>
                          : ''
                      }
                      <div key={i}>
                        <h3 className='left'>
                          <a
                            href={'edit/'+g.name}
                            onClick={e => handleManageGroup(e, g.name)}
                            title="Manage group"
                          >
                            {g.display}
                          </a>
                        </h3>
                        <div className='right'>
                          <a
                            href={'edit/'+g.name}
                            onClick={e => handleManageGroup(e, g.name)}
                            title="Manage group"
                          >
                            <Icon name='edit' color='blue' />
                          </a>
                          <a
                            href={'/delete/'+g.name}
                            onClick={e => showModal(e, {group: g.name})}
                            title="Delete group"
                          >
                            <Icon name='minus circle' color='blue' />
                          </a>
                        </div>
                        <div className='clear' />
                        <div>
                          {`Created: ${date}`}
                        </div>
                        {/*<div>Posts: {g.posts}</div>*/}
                        {/*<div>Followers: {g.followers}</div>*/}
                        {/*<div>Likes: {g.likes}</div>*/}
                      </div>
                    </Segment>
                  </Grid.Column>
                )
              })
            }
            </Grid>
          </Grid.Column>
        </Grid.Row>
      )
    }else {
      return (
        <Grid.Column width={8}>
          <Segment>
            <p>
              {"You don't own any community groups."}
              <br />
              {"You can create up to 4 community groups."}
            </p>
          </Segment>
        </Grid.Column>
      )
    }
  }
}

export default GroupsList;
