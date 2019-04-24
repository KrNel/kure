import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Form, Label, Divider, Segment } from "semantic-ui-react";

import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import GroupManagePosts from './GroupManagePosts';
import GroupManageUsers from './GroupManageUsers';
import ModalConfirm from '../../Modal/ModalConfirm';
import Picker from '../../Picker/Picker';
import {roles} from '../../../settings';
import { addPost, deletePost, addUser, deleteUser, approveUser, denyUser, changeOwner, logger } from '../../../utils/fetchFunctions';
import { postValidation, userValidation } from '../../../utils/validationFunctions';

/**
 *  The communtiy group editing/managing section of the page.
 *
 *  Posts can be added and deleted.
 *  Users can be added with certain roles/access, and deleted.
 *
 *  @param {object} props Component props
 *  @param {string} props.user User name to use in Manage page
 *  @param {string} props.csrf CSRF token to prevent CSRF attacks
 *  @param {object} props.manageGroup The group being edited/managed
 *  @returns {Component} Shows both posts and users to edit/manage for selected group
 */
class GroupManage extends Component {

  static propTypes = {
    user: PropTypes.string.isRequired,
    csrf: PropTypes.string.isRequired,
    manageGroup: PropTypes.shape({
        group: PropTypes.object.isRequired,
        posts: PropTypes.array.isRequired,
        users: PropTypes.array.isRequired,
        pending: PropTypes.array.isRequired,
    }).isRequired,
    onPostUpdate: PropTypes.func.isRequired,
    onUserUpdate: PropTypes.func.isRequired,
    onJoinRequestUpdate: PropTypes.func.isRequired,
    handleChangeOwner: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      newPost: '',
      posts: [],
      addPostLoading: false,
      errors: {},
      postExists: false,
      users: [],
      pending: [],
      approvingUser: '',
      group: '',
      access: 4, //guest access
      groupName: '',
      modalOpen: false,
      modalData: {},
      newUser: '',
      userExists: false,
      addUserLoading: false,
      deletingPost: '',
      deletingUser: '',
      selectedAccess: Object.keys(roles.kGroupsAccess).find(key => roles.kGroupsAccess[key] === 'Member'),
      newOwner: '',
      newOwnerLoading: false,
    };

    this.existPost = "Post already in group.";
    this.existUser = "User already in group.";
    const {csrf, user} = this.props;
    this.csrf = csrf;
    this.user = user;
    this.steemPostData = {};
  }


  /**
   *  Need to populate state from props updates passed down from parents comp.
   *
   *  @param {object} props Current props object
   *  @param {object} state Current state object
   */
  static getDerivedStateFromProps(props, state) {
    const { manageGroup } = props;
    const group = manageGroup.group['name'];
    if (group !== state.group) {
      return {
        group: group,
        access: manageGroup.group.access.access,
        groupName: manageGroup.group.display,
        posts: manageGroup.posts,
        users: manageGroup.users,
        pending: manageGroup.pending
      };
    }
    return null;
  }

  /**
   *  Shows the popup modal for user confirmation.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {object} modalData Post and user data for the modal
   */
  showModal = (e, modalData) => {
    e.preventDefault();
    this.setState({ modalOpen: true, modalData });
  }

  /**
   *  Hides the popup modal.
   */
  onModalClose = () => this.setState({ modalOpen: false });

  /**
   *  Handle the Yes or No confirmation from the modal.
   *  If Yes, proceed with deletion of post or user.
   *
   *  @param {event} e Event triggered by element to handle
   */
  handleModalClick = (e) => {
    const confirm = e.target.dataset.confirm;
    if (confirm === 'true') {
      this.onModalClose();
      const {modalData, group} = this.state;
      const {author, post, user} = modalData;
      if (post) {
        this.handleDeletePost(author, post, group)
      }else {
        this.handleDeleteUser(user, group)
      }
    }else this.onModalClose();
  }

  /**
   *  Set state values for when post input changes.
   *  Reset post exists error flag.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} name Name of the element triggering the event
   *  @param {string} value Value of the element triggering the event
   */
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
      postExists: false,
      errors: {}
     });
  }

  /**
   *  Validate then add new group to database.
   *  Trim group name, validate it's structure, set loading flag.
   */
  handleSubmitNewPost = async () => {
    let {newPost} = this.state;
    newPost = newPost.trim();

    const validation = await this.handlePostValidation(newPost)
    if (validation) {
      this.setState({addPostLoading: true});
      const {group} = this.state;
      this.addPostFetch(group);
    }
  }

  /**
   *  Validate the new post to be added. Return errors through state.
   *
   *  @param {string} newPost New post to be validated
   *  @returns {boolean} Determines if validation succeeded
   */
  handlePostValidation = async (newPost) => {
    const {valid, errors, res} = await postValidation(newPost);
    this.steemPostData = res;
    this.setState({errors: errors});

    return await valid;
  }

  /**
   *  Send new post to be added to the database.
   *  Reset the flags depending on errors or not, add new post to posts state.
   *
   *  @param {string} post Post to add
   *  @param {string} group Group name to delete from
   */
  addPostFetch = (group) => {
    addPost({group, user: this.user, ...this.steemPostData}, this.csrf)
    .then(res => {
      if (!res.data.invalidCSRF) {
        if (res.data.exists) {
          this.setState({
            postExists: true,
            addPostLoading: false,
          });
        }else if (res.data.post) {
          const {posts} = this.state;
          this.setState({
            posts: [
              res.data.post,
              ...posts,
            ],
            newPost: '',
            postExists: false,
            addPostLoading: false,
          });
          const { onPostUpdate } = this.props;
          onPostUpdate(group, 'inc');
        }else {
          //error adding in db...
          this.setState({
            postExists: false,
            addPostLoading: false,
          });
        }
      }
    }).catch((err) => {
      throw new Error('Error adding post: ', err);
    });
  }

  /**
   *  When user confirms Yes to delete, set post that's being deleted.
   *  Clear modalData, then delete post.
   *
   *  @param {string} post Post to delete
   *  @param {string} group Group name to delete from
   */
  handleDeletePost = (author, post, group) => {
    this.setState({
      deletingPost: post,
      modalData: {}
    });
    this.deletePostFetch(author, post, group);
  }

  /**
   *  Delete the post from the group.
   *  On success, filter deleted post from posts state object.
   *
   *  @param {string} post Post to delete
   *  @param {string} group Group name to delete from
   */
  deletePostFetch = (author, post, group) => {
    deletePost({author, group, user: this.user, post}, this.csrf)
    .then(res => {
      if (res.data) {
        const {posts} = this.state;
        const newPosts = posts.filter(p => p.st_permlink !== post)
        this.setState({
          posts: newPosts,
          deletingPost: '',
        });
        const { onPostUpdate } = this.props;
        onPostUpdate(group, 'dec');
      }/*else error deleting post*/
    }).catch(err => {
      throw new Error('Error deleting post: ', err);
    })
  }

  /**
   *  Set state values for when user role option changes.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} value Value of the role selected
   */
  handleNewUserRoleChange = (e, {value}) => {
    this.setState({
      selectedAccess: value
     });
  }

  /**
   *  Validate then add new user to database.
   *  Trim user name, validate it's structure, set loading flag.
   */
  handleSubmitNewUser = () => {

    let { newUser, selectedAccess } = this.state;
    newUser = newUser.trim();

    if (this.handleUserValidation(newUser)) {
      this.setState({addUserLoading: true});
      const {group} = this.state;
      this.addUserFetch(newUser, group, selectedAccess);
    }
  }

  /**
   *  Validate the new user to be added. Return errors through state.
   *
   *  @param {string} newUser New user name to be validated
   *  @returns {boolean} Determines if validation succeeded
   */
  handleUserValidation = (newUser) => {
    const {valid, errors} = userValidation(newUser);

    this.setState({errors: errors});

    return valid;
  }

  /**
   *  Send new user to be added to the database.
   *  Reset the addUserLoading flag depending on errors or not, set users state.
   *
   *  @param {string} newUser User name to delete
   *  @param {string} group Group name to delete from
   *  @param {number} access Access role level of logged in user
   */
  addUserFetch = (newUser, group, access) => {
    addUser({group, user: this.user, newUser, access}, this.csrf)
    .then(res => {
      if (!res.data.invalidCSRF) {
        if (res.data.exists) {
          this.setState({
            userExists: true,
            addUserLoading: false,
          });
        }else if (res.data.user) {
          const {users} = this.state;
          this.setState({
            users: [
              res.data.user,
              ...users,
            ],
            newUser: '',
          });
          const { onUserUpdate } = this.props;
          onUserUpdate(group, 'inc');
        }
        this.setState({
          addUserLoading: false,
        });
      }
    }).catch(err => {
      throw new Error('Error adding user: ', err);
    });
  }

  /**
   *  When user confirms Yes to delete, set loading flag.
   *  Clear modalData, then delete user.
   *
   *  @param {string} user User name to delete
   *  @param {string} group Group name to delete from
   */
  handleDeleteUser = (user, group) => {
    this.setState({
      deletingUser: user,
      modalData: {}
    });
    this.deleteUserFetch(user, group);
  }

  /**
   *  Delete the user from the group.
   *  On success, filter deleted user from users state object.
   *  Reset loading flag.
   *
   *  @param {string} userToDel User name to delete
   *  @param {string} group Group name to delete from
   */
  deleteUserFetch = (userToDel, group) => {
    deleteUser({group, user: this.user, userToDel}, this.csrf)
    .then(res => {
      if (res.data) {
        const {users} = this.state;
        const newUsers = users.filter(u => u.user !== userToDel)

        this.setState({
          deletingUser: '',
          users: newUsers
        });
        const { onUserUpdate } = this.props;
        onUserUpdate(group, 'dec');
      }/*else error deleting user*/
    }).catch(err => {
      throw new Error('Error deleting user: ', err);
    })
  }

  /**
   *  Call databse function for approve/deny of user join request.
   *
   *  @param {string} newUser User name to approve
   *  @param {string} type Type of approval action (approve/deny)
   */
  handleApproval = (e, newUser, type) => {
    e.preventDefault();
    const {group} = this.state;
    this.setState({approvingUser: newUser});
    if (type === 'approve') this.approveUserFetch(group, newUser);
    else if (type === 'deny') this.denyUserFetch(group, newUser);
  }

  /**
   *  New user to be approved to a community group.
   *  Update the state with user list appended, and remove pending user.
   *  Clear the `approvingUser` string to remove loader.
   *
   *  @param {string} group Group name to approve for
   *  @param {string} newUser User name to aprove
   */
  approveUserFetch = (group, newUser) => {
    approveUser({group, newUser, user: this.user}, this.csrf)
    .then(res => {
      if (!res.data.invalidCSRF) {
        if (res.data) {
          const {users, pending} = this.state;
          const newPending = pending.filter(u => u.user !== newUser)
          this.setState({
            pending: newPending,
            users: [
              res.data.newUser,
              ...users,
            ],
            approvingUser: '',
          });
          const { onUserUpdate, onJoinRequestUpdate } = this.props;
          onUserUpdate(group, 'inc');
          onJoinRequestUpdate(group, 'dec');
        }else {
          this.setState({
            approvingUser: '',
          });
        }
      }
    }).catch(err => {
      throw new Error('Error adding user: ', err);
    });
  }

  /**
   *  New user to be denied joining a community group.
   *  Update the state newUser removed from pending user list.
   *  Clear the `approvingUser` string to remove loader.
   *
   *  @param {string} group Group name to deny for
   *  @param {string} newUser User name to deny
   */
  denyUserFetch = (group, newUser) => {
    denyUser({group, newUser, user: this.user}, this.csrf)
    .then(res => {
      if (!res.data.invalidCSRF) {
        if (res.data) {
          const {pending} = this.state;
          const newPending = pending.filter(u => u.user !== newUser)

          const { onJoinRequestUpdate } = this.props;
          onJoinRequestUpdate(group, 'dec');

          this.setState({
            pending: newPending,
            approvingUser: '',
          });
        }else {
          this.setState({
            approvingUser: '',
          });
        }
      }
    }).catch(err => {
      throw new Error('Error adding user: ', err);
    });
  }

  /**
   *  Validate then add new user to database.
   *  Trim user name, validate it's structure, set loading flag.
   */
  handleSubmitChangeOwner = () => {

    let { newOwner } = this.state;
    newOwner = newOwner.trim();

    if (this.handleOwnerValidation(newOwner)) {
      this.setState({ newOwnerLoading: true });
      const { group } = this.state;

      this.changeOwnerFetch(newOwner, group);
    }
  }

  handleOwnerValidation = (newOwner) => {
    let errors = {};
    const { users } = this.state;

    const valid = users.some(u => u.user === newOwner);

    if (!valid) errors['newOwner'] = 'New owner must be a member.'

    this.setState({ errors: errors });

    return valid;
  }

  changeOwnerFetch = (newOwner, group) => {
    changeOwner({group, user: this.user, newOwner}, this.csrf)
    .then(res => {
      if (!res.data.invalidCSRF) {
        if (res.data) {
          const { handleChangeOwner } = this.props;
          handleChangeOwner();
        }
      }
    }).catch(err => {
      logger('error', err, 'Error modifying ownership.');
    });
  }

  render() {
    const {
      newPost,
      posts,
      addPostLoading,
      errors,
      postExists,
      users,
      pending,
      approvingUser,
      modalOpen,
      modalData,
      newUser,
      userExists,
      addUserLoading,
      deletingPost,
      deletingUser,
      newOwner,
      newOwnerLoading,
      access,
      groupName,
    } = this.state;

    let addErrorPost = '';
    let addErrorUser = '';
    let addErrorOwner = '';

    if (postExists) addErrorPost = <ErrorLabel text={this.existPost} />;
    if (errors["newPost"] !== undefined) addErrorPost = <ErrorLabel text={errors["newPost"]} />;

    if (userExists) addErrorUser = <ErrorLabel text={this.existUser} />;
    if (errors["newUser"] !== undefined) addErrorUser = <ErrorLabel text={errors["newUser"]} />;

    if (errors["newOwner"] !== undefined) addErrorOwner = <ErrorLabel text={errors["newOwner"]} />;

    return (
      <React.Fragment>
        <Divider />
        <Grid.Row className="header-row">
          <Grid.Column floated='left' width={8}>
            <Header as='h2'>
              <Label size='big' color='blue'>Managing:</Label>
              {'   '}
              {groupName}
            </Header>
          </Grid.Column>
          <Grid.Column floated='right' width={8}>
            <div className='left'><Label size='big' basic>Posts</Label></div>
            <div>
              <Form size="tiny" onSubmit={this.handleSubmitNewPost}>
                <Form.Group className='right'>
                  <Form.Field>
                    <Form.Input
                      placeholder='Add a post'
                      name='newPost'
                      value={newPost}
                      onChange={this.handleChange}
                      errors={errors["newPost"]}
                      loading={addPostLoading}
                    />
                    {addErrorPost}
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

        <Grid.Row className="content">
          <GroupManagePosts
            posts={posts}
            showModal={this.showModal}
            deletingPost={deletingPost}
            access={access}
            user={this.user}
          />
        </Grid.Row>

        <Divider />
        <Grid.Row centered className='noPadBottom'>
          <Grid.Column width={8} floated='right'>
            <Label size='big' basic>Users</Label>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="content">
          <Grid stackable>
            <GroupManageUsers
              users={users}
              showModal={this.showModal}
              deletingUser={deletingUser}
              access={access}
              pending={pending}
              handleApproval={this.handleApproval}
              approvingUser={approvingUser}
            />
            {
              //if logged in user is mod or above, allow adding users to group
              access < 3 && (
                <Grid.Column width={6}>
                  <Grid.Row>
                    <Grid.Column>
                      <Segment.Group>
                        <Segment>
                          <Form size="tiny" onSubmit={this.handleSubmitNewUser}>
                            <Form.Group>
                              <Form.Field>
                                <Form.Input
                                  placeholder='Add a user'
                                  name='newUser'
                                  value={newUser}
                                  onChange={this.handleChange}
                                  errors={errors["newUser"]}
                                  loading={addUserLoading}
                                />
                                {addErrorUser}
                              </Form.Field>
                              <Form.Button icon size="tiny" color="blue">
                                <Icon name="plus" />
                              </Form.Button>
                            </Form.Group>
                            <Form.Group className='user-access'>
                              <Picker
                                onChange={this.handleNewUserRoleChange}
                                options={[
                                  {key: 0, text: 'Member', value: '3'},
                                  {key: 1, text: 'Moderator', value: '2'},
                                  {key: 2, text: 'Admin', value: '1'}
                                ]}
                                label='Role: '
                                type='role'
                              />
                            </Form.Group>
                          </Form>
                        </Segment>
                        {
                          access < 1 && (
                          <Segment>
                            <Label size='large' basic color='orange'>
                              {'Transfer Ownership'}
                            </Label>
                            <p />
                            <p>
                              {`WARNING: By transfering the ownership of community group`}
                              {' '}
                              <strong>
                                {`'${groupName}'`}
                              </strong>
                              {' '}
                              {`to someone else, you will no longer be the owner.`}
                            </p>
                            <Form size="tiny" onSubmit={this.handleSubmitChangeOwner}>
                              <Form.Group>
                                <Form.Field>
                                  <Form.Input
                                    placeholder='New owner'
                                    name='newOwner'
                                    value={newOwner}
                                    onChange={this.handleChange}
                                    errors={errors['newOwner']}
                                    loading={newOwnerLoading}
                                  />
                                  {addErrorOwner}
                                </Form.Field>
                                <Form.Button icon size="tiny" color="orange">
                                  {'Transfer'}
                                </Form.Button>
                              </Form.Group>
                            </Form>
                          </Segment>
                          )
                        }
                      </Segment.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid.Column>
              )
            }
          </Grid>
        </Grid.Row>

        <Divider className='section' />
      </React.Fragment>
    )
  }
}

export default GroupManage;
