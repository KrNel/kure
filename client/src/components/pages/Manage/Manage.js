import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment, Form, Icon } from "semantic-ui-react";
import axios from 'axios';
import { connect } from 'react-redux';

import GroupsList from './GroupsList';
import GroupManage from './GroupManage';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import ModalConfirm from '../../ModalConfirm/ModalConfirm';
import './Manage.css';

class Manage extends Component {

  /*static propTypes = {
    user: PropTypes.string.isRequired,
    csrfToken: PropTypes.string.isRequired,
  };*/

  constructor(props) {
    super(props);

    this.state = {
      newGroup: '',
      groups: [],
      groupExists: false,
      exceededGrouplimit: false,
      isGroupsLoading: false,
      addGroupLoading: false,
      manageGroup: [],
      noOwned: true,
      errors: {},
      selectedGroup: '',
      modalOpen: false,
      modalData: {},
      /*searchResults: [],
      searchValue: ''*/
    }

    this.existText = "Group name taken. Try another.";
    this.exceededGrouplimit = "Limit of 4 groups reached.";
    //this.user = this.props.user;
  }



  componentDidMount() {
    const {user} = this.props;
    this.setState({isGroupsLoading: true});
    this.getGroupsFetch(user);
  }

  showModal = (e, modalData) => {
    e.preventDefault()
    this.setState({ modalOpen: true, modalData });
  }
  onModalClose = () => this.setState({ modalOpen: false });

  handleModalClick = (e) => {
    e.preventDefault();
    const confirm = e.target.dataset.confirm;
    if (confirm === 'true') {
      this.onModalClose();
      const {group} = this.state.modalData;
      if (group) {
        this.handleDeleteGroup(group)
      }
    }else this.onModalClose();

  }

  addGroupFetch = (group) => {
    axios.post('/manage/groups/add', {
      group: group,
      user: this.props.user
    }, {
      headers: {
        "x-csrf-token": this.props.csrf
      }
    }).then((res) => {
      if (!res.data.invalidCSRF) {
        if (res.data.exists) {
          this.setState({
            groupExists: true,
            exceededGrouplimit: false,
            addGroupLoading: false,
            noOwned: false
          });
        }else if (res.data.exceeded) {
          this.setState({
            exceededGrouplimit: true,
            groupExists: false,
            addGroupLoading: false,
            noOwned: false
          });
        } else {
          this.setState({
            groups: [
              res.data.group,
              ...this.state.groups,
            ],
            newGroup: '',
            groupExists: false,
            noOwned: false,
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
        manageGroup: []
     });
    }).catch((err) => {
      console.error(err);
    });
  }

  manageGroupFetch = (group) => {
    axios.get(`/api/groups/${group}/${this.props.user}`, {
    }).then(res => {
      this.setState({
        manageGroup: [res.data],
        isGroupLoading: false,
     });
    }).catch(err => {
      console.error(err);
    })
  }

  deleteGroupFetch = (group) => {
    axios.post('/manage/groups/delete', {
      group: group,
      user: this.props.user
    }, {
      headers: {
        "x-csrf-token": this.props.csrf
      }
    }).then((res) => {
      if (res.data) {
        const oldGroups = this.state.groups;
        const newGroup = oldGroups.filter(g => g.name !== group);
        this.setState({
          groups: newGroup,
          manageGroup: [],
          isGroupLoading: false
        })
      }
    }).catch(err => {
      console.error(err);
    })
  }

  /*deletePostFetch = (post, group) => {
console.log('deletePostFetch: ', post);
    axios.post('/manage/posts/delete', {
      post: post,
      group: group,
      user: this.props.user
    }, {
      headers: {
        "x-csrf-token": this.props.csrf
      }
    }).then((res) => {
console.log('res: ', res);
      if (res.data) {
        const oldManageGroups = {...this.state.manageGroup[0]};
console.log('oldManageGroups: ', oldManageGroups);
        const removeIndex = oldManageGroups.posts.findIndex((p) => p.st_permlink === post);
console.log('removeIndex: ', removeIndex);
        //const oldPost = oldMergeGroups.posts[index];

        const oldPosts = oldManageGroups.posts;
console.log('oldPosts: ', oldPosts);
        const newPosts = oldPosts.splice(removeIndex, 1);
console.log('newPosts: ', newPosts);
        let newManageGroups = Object.assign({}, oldManageGroups);
console.log('newManageGroups: ', newManageGroups);
        newManageGroups['posts'] = newPosts;
console.log('newManageGroups[posts]: ', newManageGroups['posts']);

        this.setState({
          manageGroup: [newManageGroups],
          //manageGroup: [],
          //isGroupLoading: false
        })
      }
    }).catch(err => {
      console.error(err);
    })
  }*/


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
    const newGroup = this.state.newGroup.trim();

    if (this.handleGroupValidation(newGroup)) {
      this.setState({addGroupLoading: true});
      this.addGroupFetch(newGroup);
    }
  }

  handleManageGroup = (e, group) => {
    e.preventDefault();
    this.setState({
      isGroupLoading: true,
      selectedGroup: group
    });
    this.manageGroupFetch(group);
  }

  handleDeleteGroup = (group) => {
    //e.preventDefault();
    this.setState({
      isGroupLoading: true,
      selectedGroup: group,
      modalData: {}
    });
    this.deleteGroupFetch(group);
  }

  /*handleDeletePost = (post, group) => {
    //e.preventDefault();
    this.setState({
      modalData: {}
    });
    this.deletePostFetch(post, group);
  }*/

  handleGroupValidation = (newGroup) => {
    let valid = true;
    let errors = {};

    if(!newGroup){
      errors["newGroup"] = "Cannot be empty";
      valid = false;
    }

    if(valid && (newGroup.length < 4 || newGroup.length > 17)){

      errors["newGroup"] = "Must be between 4 and 17 chars.";
      valid = false;
    }

    if(valid && !/^[\d\w\s_-]+$/.test(newGroup)) {
      errors["newGroup"] = "Only letters, numbers, spaces, underscores or hyphens.";
      valid = false;
    }
    this.setState({errors: errors});

    return valid;
  }



  render() {
    const {
      newGroup,
      groups,
      groupExists,
      exceededGrouplimit,
      isGroupsLoading,
      addGroupLoading,
      manageGroup,
      noOwned,
      errors,
      isGroupLoading,
      selectedGroup,
      modalOpen,
      modalData,
      /*searchResults,
      searchValue*/
    } = this.state;

    const {
      user,
      csrf,
    } = this.props;

    let addError = '';
    if (groupExists) addError = <ErrorLabel text={this.existText} />;
    if (exceededGrouplimit) addError = <ErrorLabel text={this.exceededGrouplimit} />;
    if (errors["newGroup"] !== undefined) addError = <ErrorLabel text={errors["newGroup"]} />;

    const newGroupError = groupExists || exceededGrouplimit;

    return (
      <div className="manage">
        <Grid columns={1} stackable>

          <Grid.Column width={16} className="main">
            <Grid>
              <Grid.Row className="header-row">
                <Grid.Column floated='left' width={10}>

                  <Header as="h2">Communities You Own</Header>
                  {
                      /*<SearchComponent
                      onResultSelect={this.handleResultSelect}
                      onSearchChange={this.handleSearchChange}
                      results={searchResults}
                      value={searchValue}
                    />*/
                }
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

              <ModalConfirm
                modalOpen={modalOpen}
                onModalClose={this.onModalClose}
                handleModalClick={this.handleModalClick}
                modalData={modalData}
              />

              <GroupsList
                groups={groups}
                handleManageGroup={this.handleManageGroup}
                isLoading={isGroupsLoading}
                noOwned={noOwned}
                isGroupLoading={isGroupLoading}
                selectedGroup={selectedGroup}
                showModal={this.showModal}
              />

              {
              (manageGroup && manageGroup.length)
                ? (
                  <GroupManage
                    manageGroup={manageGroup}
                    csrf={csrf}
                    user={user}
                    showModal={this.showModal}
                  />
                  )
                : ''
              }

              <Grid.Row className="header-row">
                <Grid.Column floated='left' width={6}>
                  <Header as="h2">Communities You Joined</Header>
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

//export default Manage;
const mapStateToProps = state => {
  const { userData, csrf } = state.auth;
  //const { userData, csrf } = state.manage;

  return {
    user: userData.name,
    csrf
  }
}

export default connect(mapStateToProps)(Manage)
