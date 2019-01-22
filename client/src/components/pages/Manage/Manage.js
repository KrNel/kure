import React, { Component } from 'react';
import { Grid, Header, Segment, Form, Divider, Icon, Label } from "semantic-ui-react";
import axios from 'axios';

import GroupsList from './GroupsList';
import GroupEdit from './GroupEdit';
import './Manage.css';

/*
var rootElement = document.getElementById('reactjs-root');
rootElement.getAttribute('data-rest-url')
*/
const ErrorLabel = ({text}) => {
  return (
    <Label basic color='red' pointing style={{position:"absolute", zIndex: 10}}>
      {text}
    </Label>
  )
}

class Manage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newGroup: '',
      groups: [],
      groupExists: false,
      exceededGrouplimit: false,
      noGroups: true,
      isGroupsLoading: false,
      addGroupLoading: false,
      editGroup: [],
      noOwned: true,
      errors: {}
      /*searchResults: [],
      searchValue: ''*/
    }

    this.existText = "Group name taken. Try another.";
    this.exceededGrouplimit = "Limit of 4 groups reached.";
    //const user = this.props.user;
  }

  addGroupFetch = (group) => {
    axios.post('/manage/groups/add', {
      group: group,
      user: this.props.user
    }, {
      headers: {
        "x-csrf-token": this.props.csrfToken
      }
    }).then((res) => {
console.log('res: ', res)
      if (!res.data.invalidCSRF) {
        if (res.data.exists) {
          this.setState({
            groupExists: true,
            exceededGrouplimit: false,
            addGroupLoading: false,
            noGroups: false
          });
        }else if (res.data.exceeded) {
          this.setState({
            exceededGrouplimit: true,
            groupExists: false,
            addGroupLoading: false,
            noGroups: false
          });
        } else {
          this.setState({
            groups: [
              res.data.group,
              ...this.state.groups,
            ],
            newGroup: '',
            groupExists: false,
            noGroups: false,
            addGroupLoading: false,
          });
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  getGroupsFetch = (user) => {
    axios.get(`/api/groups/user/${user}`, {
    }).then((res) => {
      this.setState({
        groups: res.data.groups,
        isGroupsLoading: false,
        noOwned: false,
        editGroup: []
     });
    }).catch((err) => {
      console.error(err);
    });
  }

  editGroupFetch = (group) => {
    axios.put(`/api/groups/${group}/${this.props.user}`, {
    }).then((res) => {
console.log('editGroupFetch: ', res);
      //if (!res.data.posts.length) res.data.posts = {empty:true}
      this.setState({
        editGroup: [res.data]
     });
    }).catch((err) => {
      console.error(err);
    });
  }

  deleteGroupFetch = (group) => {
    axios.post('/manage/groups/delete', {
      group: group,
      user: this.props.user
    }, {
      headers: {
        "x-csrf-token": this.props.csrfToken
      }
    }).then((res) => {
console.log('res: ', res)
    }).catch((err) => {
      console.error(err);
    });
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
      groupExists: false,
      exceededGrouplimit: false,
      errors: {}
     });
  }

  handleSubmitNewGroup = (e) => {
    e.preventDefault();

    if (this.handleValidation()) {
      const { newGroup } = this.state;
      this.setState({addGroupLoading: true});
      this.addGroupFetch(newGroup);
    }
  }

  handleEditGroup = (e, groupName) => {
    e.preventDefault();
    this.editGroupFetch(groupName);
//console.log('editing: ', group);
    //const toEdit = this.state.groups.filter(g => g.name === groupName);
//console.log('group: ', toEdit);
    /*this.setState({
      editGroup: toEdit
    });*/
//console.log('data-group: ', e.target.getAttribute('data-group'));
  }

  handleDeleteGroup = (e, groupName) => {
    e.preventDefault();
    this.deleteGroupFetch(groupName);
  }

  handleValidation = () => {
    let valid = true;
    const newGroup = this.state.newGroup.trim();
    let errors = {};

    if(!newGroup){
      errors["newGroup"] = "Cannot be empty";
      valid = false;
    }

    if(valid && (newGroup.length < 4 || newGroup.length > 20)){

      errors["newGroup"] = "Must be between 4 and 20 chars.";
      valid = false;
    }

    if(valid && !newGroup.match(/[\d\w_-]{4,20}/)){
      errors["newGroup"] = "Only letters, numbers, spaces, underscores or hyphens.";
      valid = false;
    }
    this.setState({errors: errors});

    return valid;
  }

  componentDidMount() {
    this.setState({isGroupsLoading: true});
    this.getGroupsFetch(this.props.user);
  }

  render() {
    const {
      newGroup,
      groups,
      groupExists,
      exceededGrouplimit,
      noGroups,
      isGroupsLoading,
      addGroupLoading,
      editGroup,
      noOwned,
      errors
      /*searchResults,
      searchValue*/
    } = this.state;

console.log('editGroup: ', editGroup);

    let addError = '';
    if (groupExists) addError = <ErrorLabel text={this.existText} />;
    if (exceededGrouplimit) addError = <ErrorLabel text={this.exceededGrouplimit} />;
    if (errors["newGroup"] !== undefined) addError =<ErrorLabel text={errors["newGroup"]} />;
    /*const addError = (groupExists)
      ? <ErrorLabel text={this.existText} />
      : (exceededGrouplimit)
          ? <ErrorLabel text={this.exceededGrouplimit} />
          : '';*/

    const groupsListDisplay = <GroupsList groups={groups} noGroups={noGroups} handleEditGroup={this.handleEditGroup} handleDeleteGroup={this.handleDeleteGroup} isLoading={isGroupsLoading} noOwned={noOwned} />;

    const groupEditDisplay = (editGroup && editGroup.length) ? <GroupEdit editGroup={editGroup} /> : '';

    const newGroupError = groupExists || exceededGrouplimit;



    return (
      <div className="manage">
        <Grid columns={1} stackable>

          <Grid.Column width={16} className="main">
            <Grid>
              <Grid.Row className="header-row">
                <Grid.Column floated='left' width={10}>
                  <Header as="h2">Communities You Own</Header>
                    {/*<SearchComponent
                      onResultSelect={this.handleResultSelect}
                      onSearchChange={this.handleSearchChange}
                      results={searchResults}
                      value={searchValue}
                    />*/}
                </Grid.Column>
                <Grid.Column floated='right' width={6}>
                  <div className="">
                    <Form size="tiny" onSubmit={this.handleSubmitNewGroup}>
                      <Form.Group style={{float: 'right'}}>
                        <Form.Field>
                          <Form.Input
                            placeholder='Create a group'
                            name='newGroup'
                            value={newGroup}
                            onChange={this.handleChange}
                            error={newGroupError}
                            loading={addGroupLoading}
                          />
                        {addError}
                      </Form.Field>
                      <Form.Button icon size="tiny" color="blue">
                        <Icon name="plus" />
                      </Form.Button>
                      </Form.Group>
                    </Form>
                  </div>
                </Grid.Column>
              </Grid.Row>

              {/*<Divider fitted />*/}

              <Grid.Row>
                <Grid.Column>
                  <Grid stackable className="groups">
                    {groupsListDisplay}
                  </Grid>
                </Grid.Column>
              </Grid.Row>

              {groupEditDisplay}

              <Grid.Row className="header-row">
                <Grid.Column floated='left' width={6}>
                  <Header as="h2">Communities You Belong To</Header>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Grid stackable className="groups">
                    <Grid.Column width={8}>
                      <Segment>
                        <p>
                          {"You don't belong to any other communities."}
                        </p>
                      </Segment>
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid.Row>

            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Manage;
