import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Icon, Label } from "semantic-ui-react";

import GroupsList from './GroupsList';
import GroupManage from './GroupManage';
import ModalConfirm from '../../Modal/ModalConfirm';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import { addGroup, deleteGroup, getUserGroups, getManageGroup, logger } from '../../../utils/fetchFunctions';
import { groupValidation } from '../../../utils/validationFunctions';

/**
 *  Managment component to display the group lists a user has access to.
 *
 *  User will see two groups: Owned and Joined.
 *  Owned Groups are ones the user has created.
 *  Joined Groups are ones the user has joined.
 *
 *  Each group type will show a group that can be edited/maanged,
 *  or deleted. Managing a group will show additional group data:
 *  Posts and Users, which is handled by the GroupManage compoenent.
 *
 *  @param {object} props Component props
 *  @param {string} props.user User name to use in Manage page
 *  @param {string} props.csrf CSRF token to prevent CSRF attacks
 *  @param {string} props.type Type of group list ['owned'|'joined']
 *  @param {string} props.headerText Text to show for group type
 *  @returns {Component} Loads various components to manage community groups
 */
class ManageGroups extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    csrf: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    headerText: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      newGroup: '',
      groups: [],
      groupExists: false,
      exceededGrouplimit: false,
      areGroupsLoading: false,
      isGroupLoading: false,
      addGroupLoading: false,
      manageGroup: {},
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
    const {user, csrf, type} = this.props;
    this.user = user;
    this.csrf = csrf;
    this.type = type;
  }

  componentDidMount() {
    this.setState({areGroupsLoading: true});
    this.getGroupsFetch(this.user);
  }

  /**
   *  Shows the popup modal for user confirmation.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {object} modalData Group data for the modal
   */
  showModal = (e, modalData) => {
    e.preventDefault()
    this.setState({ modalOpen: true, modalData });
  }

  /**
   *  Hides the popup modal.
   */
  onModalClose = () => this.setState({ modalOpen: false });

  /**
   *  Handle the Yes or No confirmation from the modal.
   *  If Yes, proceed with deletion of group.
   *
   *  @param {event} e Event triggered by element to handle
   */
  handleModalClick = (e) => {
    const confirm = e.target.dataset.confirm;
    if (confirm === 'true') {
      this.onModalClose();
      const {modalData} = this.state;
      const {group} = modalData;
      this.handleDeleteGroup(group)
    }else this.onModalClose();

  }

  /**
   *  Get the groups from the database.
   *  Set groups state, reset loading and owned flag, clear manageGroup.
   *
   *  @param {string} user logged in user name
   */
  getGroupsFetch = (user) => {
    getUserGroups(user, this.type)
    .then(res => {
      this.setState({
        groups: res.data.groups,
        areGroupsLoading: false,
        noOwned: false,
        manageGroup: {}
     });
    }).catch(err => {
      logger('error', err);
    });
  }

  /**
   *  Set state values for when group input text changes.
   *  Reset group exists or exceeded owned group limit from error.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} name Name of the element triggering the event
   *  @param {string} value Value of the element triggering the event
   */
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
      groupExists: false,
      exceededGrouplimit: false,
      errors: {}
     });
  }

  /**
   *  Validate then add new group to database.
   *  Trim group name, validate it's structure, set loading flag.
   */
  handleSubmitNewGroup = () => {
    let {newGroup} = this.state;
    newGroup = newGroup.trim();

    if (this.handleGroupValidation(newGroup)) {
      this.setState({addGroupLoading: true});
      this.addGroupFetch(newGroup);
    }
  }

  /**
   *  Validate the new group to be added. Return errors through state.
   *
   *  @param {string} newGroup New group name to be validated
   *  @returns {boolean} Determines if validation succeeded
   */
  handleGroupValidation = (newGroup) => {
    const {valid, errors} = groupValidation(newGroup);
    this.setState({errors: errors});

    return valid;
  }

  /**
   *  Send new group to be added to the database.
   *  Reset various flags depending on errors or not, set groups state.
   *
   *  @param {string} group Group name to create
   */
  addGroupFetch = (group) => {
    addGroup({group, user: this.user}, this.csrf)
    .then(res => {
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
          const {groups} = this.state;
          this.setState({
            groups: [
              res.data.group,
              ...groups,
            ],
            newGroup: '',
            groupExists: false,
            noOwned: false,
            addGroupLoading: false,
          });
        }
      }
    }).catch(err => {
      logger('error', err);
    });
  }

  /**
   *  When user confirms Yes to delete, set loading flag, and selected group.
   *  Clear modalData, then delete post.
   *
   *  @param {string} group Group name to delete
   */
  handleDeleteGroup = (group) => {
    this.setState({
      isGroupLoading: true,
      selectedGroup: group,
      modalData: {}
    });
    this.deleteGroupFetch(group);
  }

  /**
   *  Delete the group from the database.
   *  On success, filter deleted group from group state object.
   *  Reset loading flag.
   *
   *  @param {string} group Group name to delete
   */
  deleteGroupFetch = (group) => {
    deleteGroup({group, user: this.user}, this.csrf)
    .then((res) => {
      if (res.data) {
        const {groups} = this.state;
        //const oldGroups = groups;
        const newGroup = groups.filter(g => g.name !== group);
        this.setState({
          groups: newGroup,
          manageGroup: {},
          isGroupLoading: false
        })
      }
    }).catch(err => {
      logger('error', err);
    })
  }

  /**
   *  Get ready to fetch group data to be edited/managed.
   *  Set loading flag and selected group in state, then get data.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} group Group name to get data Form
   */
  handleManageGroup = (e, group) => {
    e.preventDefault();
    this.setState({
      isGroupLoading: true,
      selectedGroup: group
    });
    this.manageGroupFetch(group);
  }

  /**
   *  Get the group, posts and users data for the group to be managed.
   *  Set state data to fetched data, reset loading flag.
   *
   *  @param {string} group Group name to get post and user data for
   */
  manageGroupFetch = (group) => {
    getManageGroup(group, this.user)
    .then(res => {
      this.setState({
        manageGroup: res.data,
        isGroupLoading: false,
     });
    }).catch(err => {
      logger('error', err);
    })
  }

  /**
   *  Increment or decrement the post value for group.
   *
   *  @param {string} groupToUpdate Group name to update
   *  @param {string} action Increment or decrement post quantity
   */
  onPostUpdate = (groupToUpdate, action) => {
    const { groups } = this.state;
    const newGroups = groups.map(g => {
      if (groupToUpdate === g.name) {
        g = {
          ...g,
          posts: g.posts+(action === 'inc' ? 1 : -1)
        };
      }
      return g;
    });
    this.setState({groups: newGroups});
  }

  render() {
    const {
      newGroup,
      groups,
      groupExists,
      exceededGrouplimit,
      areGroupsLoading,
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
      type,
      headerText,
    } = this.props;

    //If there were errors during validation, show them in an ErrroLabel.
    let addError = '';
    if (groupExists) addError = <ErrorLabel text={this.existText} />;
    if (exceededGrouplimit) addError = <ErrorLabel text={this.exceededGrouplimit} />;
    if (errors["newGroup"] !== undefined) addError = <ErrorLabel text={errors["newGroup"]} />;

    //Flag to know if there is an error to show.
    const newGroupError = groupExists || exceededGrouplimit;

    return (
      <React.Fragment>
        <Grid.Row className="header-row">
          <Grid.Column floated='left' width={10}>

            <Label size='big' color='blue'><Header as="h2">{headerText}</Header></Label>
            {
                /*<SearchComponent
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                results={searchResults}
                value={searchValue}
              />*/
          }
          </Grid.Column>
          {type === 'owned' &&
            (
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
            )
          }
        </Grid.Row>

        <ModalConfirm
          modalOpen={modalOpen}
          onModalClose={this.onModalClose}
          handleModalClick={this.handleModalClick}
          modalData={modalData}
        />

        <GroupsList
          groups={groups}
          areGroupsLoading={areGroupsLoading}
          handleManageGroup={this.handleManageGroup}
          noOwned={noOwned}
          isGroupLoading={isGroupLoading}
          selectedGroup={selectedGroup}
          showModal={this.showModal}
          type={type}
        />

        {
          (manageGroup && Object.entries(manageGroup).length > 0)
          &&
          (
            <GroupManage
              manageGroup={manageGroup}
              csrf={csrf}
              user={user}
              onPostUpdate={this.onPostUpdate}
            />
          )
        }
      </React.Fragment>
    );
  }
}

export default ManageGroups;
