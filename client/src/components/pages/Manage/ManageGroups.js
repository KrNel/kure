import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Icon, Label } from "semantic-ui-react";

import GroupsGrid from './GroupsGrid';
import GroupManage from './GroupManage';
import ModalConfirm from '../../Modal/ModalConfirm';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import { addGroup, deleteGroup, getManageGroup, logger } from '../../../utils/fetchFunctions';
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
 *  @param {string} props.section Section of group list ['owned'|'joined']
 *  @param {string} props.headerText Text to show for group section
 *  @returns {Component} Loads various components to manage community groups
 */
class ManageGroups extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    csrf: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    headerText: PropTypes.string.isRequired,
    match: PropTypes.shape(PropTypes.object.isRequired),
    groups: PropTypes.arrayOf(PropTypes.object.isRequired),
    areGroupsLoading: PropTypes.bool,
    onChangeOwnership: PropTypes.func.isRequired,
  };

  static defaultProps = {
    match: {},
    groups: [],
    areGroupsLoading: true,
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
      errors: {},
      selectedGroup: '',
      modalOpen: false,
      modalData: {},
      prevGroups: [],
    }

    this.existText = "Group name taken. Try another.";
    this.exceededGrouplimit = "Limit of 4 groups reached.";
    const {user, csrf, section} = this.props;
    this.user = user;
    this.csrf = csrf;
    this.section = section;
  }

  /**
   *  Need to populate state from props updates passed down from parents comp.
   *  If the parent modifies the groups data, then grab it and set it as new
   *  state data.
   *
   *  @param {object} props Current props object
   *  @param {object} state Current state object
   */
  static getDerivedStateFromProps(props, state) {
    const { groups, areGroupsLoading } = props;
    if (state.prevGroups !== groups) {
      return {
        init: false,
        groups,
        prevGroups: groups,
        areGroupsLoading,
      };
    }
    return null;
  }

  /**
   *  Shows the popup modal for user confirmation.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {object} modalData Group data for the modal
   */
  showModal = (event, modalData) => {
    event.preventDefault()
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
  handleModalClick = (event) => {
    const confirm = event.target.dataset.confirm;
    if (confirm === 'true') {
      this.onModalClose();
      const {modalData} = this.state;
      const {group} = modalData;
      this.handleDeleteGroup(group)
    }else this.onModalClose();

  }

  /**
   *  Set state values for when group input text changes.
   *  Reset group exists or exceeded owned group limit from error.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} name Name of the element triggering the event
   *  @param {string} value Value of the element triggering the event
   */
  handleChange = (event, { name, value }) => {
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
          });
        }else if (res.data.exceeded) {
          this.setState({
            exceededGrouplimit: true,
            groupExists: false,
            addGroupLoading: false,
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
        const newGroup = groups.filter(group => group.name !== group);
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
  handleManageGroup = (event, group) => {
    event.preventDefault();
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
    const newGroups = groups.map(group => {
      if (groupToUpdate === group.name) {
        group = {
          ...group,
          posts: group.posts+(action === 'inc' ? 1 : -1)
        };
      }
      return group;
    });
    this.setState({groups: newGroups});
  }

  /**
   *  Increment or decrement the user value for group.
   *
   *  @param {string} groupToUpdate Group name to update
   *  @param {string} action Increment or decrement post quantity
   */
  onUserUpdate = (groupToUpdate, action) => {
    const { groups } = this.state;
    const newGroups = groups.map(group => {
      if (groupToUpdate === group.name) {
        group = {
          ...group,
          users: group.users+(action === 'inc' ? 1 : -1)
        };
      }
      return group;
    });
    this.setState({groups: newGroups});
  }

  /**
   *  Increment or decrement the pending 'Join Requests' value for group.
   *
   *  @param {string} groupToUpdate Group name to update
   *  @param {string} action Increment or decrement post quantity
   */
  onJoinRequestUpdate = (groupToUpdate, action) => {
    const { groups } = this.state;
    const newGroups = groups.map(group => {
      if (groupToUpdate === group.name) {
        group = {
          ...group,
          joinRequests: group.joinRequests+(action === 'inc' ? 1 : -1)
        };
      }
      return group;
    });
    this.setState({ groups: newGroups });
  }

  handleChangeOwner = () => {
    const { onChangeOwnership } = this.props;

    this.setState({
      manageGroup: {},
     });

    onChangeOwnership();
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
      errors,
      isGroupLoading,
      selectedGroup,
      modalOpen,
      modalData,
    } = this.state;

    const {
      user,
      csrf,
      section,
      headerText,
      match,
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
            <Label size='big' color='blue'>
              <Header as="h2">{headerText}</Header>
            </Label>
          </Grid.Column>
          {section === 'owned' &&
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

        <GroupsGrid
          groups={groups}
          areGroupsLoading={areGroupsLoading}
          handleManageGroup={this.handleManageGroup}
          isGroupLoading={isGroupLoading}
          selectedGroup={selectedGroup}
          showModal={this.showModal}
          section={section}
          match={match}
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
              onUserUpdate={this.onUserUpdate}
              onJoinRequestUpdate={this.onJoinRequestUpdate}
              handleChangeOwner={this.handleChangeOwner}
            />
          )
        }
      </React.Fragment>
    );
  }
}

export default ManageGroups;
