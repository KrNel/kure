import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Form, Label, Divider } from "semantic-ui-react";
import axios from 'axios';

import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import GroupManagePosts from './GroupManagePosts';
import GroupManageUsers from './GroupManageUsers';
import ModalConfirm from '../../ModalConfirm/ModalConfirm';
import Picker from '../../Picker/Picker';
import Settings from '../../../settings';

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
    }).isRequired,
    onPostUpdate: PropTypes.func.isRequired,
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
      group: '',
      modalOpen: false,
      modalData: {},
      newUser: '',
      userExists: false,
      addUserLoading: false,
      deletingPost: '',
      deletingUser: '',
      selectedAccess: Object.keys(Settings.kGroupsAccess).find(key => Settings.kGroupsAccess[key] === 'Member')

    };

    this.existPost = "Post already in group.";
    this.existUser = "User already in group.";
    const {csrf, user, manageGroup} = this.props;
    this.csrf = csrf;
    this.user = user;
    this.groupName = manageGroup.group['name'];

  }

  /**
   *  Prevent updates for simply selecting a different User Access/Role
   *
   *  @param {object} nextProps Next props before it becomes current props
   *  @param {object} nextState Next state before it becomes current state
   */
  shouldComponentUpdate(nextProps, nextState) {
    const {selectedAccess} = this.state;
     if(selectedAccess !== nextState.selectedAccess) {
          return false
     }
     return true
   }

  /**
   *  Need to populate state from props updates passed down from parents comp.
   *
   *  @param {object} props Current props object
   *  @param {object} state Current state object
   */
  static getDerivedStateFromProps(props, state) {
    const group = props.manageGroup.group['name'];
    if (group !== state.group) {
      return {
        group: group,
        posts: props.manageGroup.posts,
        users: props.manageGroup.users
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
      const {modalData} = this.state;
      const {post, user} = modalData;
      if (post) {
        this.handleDeletePost(post, this.groupName)
      }else {
        this.handleDeleteUser(user, this.groupName)
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
  handleSubmitNewPost = () => {
    let {newPost} = this.state;
    newPost = newPost.trim();

    if (this.handlePostValidation(newPost)) {
      this.setState({addPostLoading: true});
      this.addPostFetch(newPost, this.groupName);
    }
  }

  /**
   *  Validate the new post to be added. Return errors through state.
   *
   *  @param {string} newPost New post to be validated
   *  @returns {boolean} Determines if validation succeeded
   */
  handlePostValidation = (newPost) => {
    let valid = true;
    let errors = {};

    if(!newPost){
      errors["newPost"] = "Cannot be empty";
      valid = false;
    }

    if(valid && !/^https?:\/\/([\w\d-]+\.)+\w{2,}(\/.+)?$/.test(newPost)) {
      errors["newPost"] = "Must be a valid URL";
      valid = false;
    }

    this.setState({errors: errors});

    return valid;
  }

  /**
   *  Send new post to be added to the database.
   *  Reset the flags depending on errors or not, add new post to posts state.
   *
   *  @param {string} post Post to delete
   *  @param {string} group Group name to delete from
   */
  addPostFetch = (post, group) => {
    const {csrf, user} = this.props;
    axios.post('/manage/posts/add', {
      post: post,
      user: user,
      group: group
    }, {
      headers: {
        "x-csrf-token": csrf
      }
    }).then((res) => {
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
  handleDeletePost = (post, group) => {
    this.setState({
      deletingPost: post,
      modalData: {}
    });
    this.deletePostFetch(post, group);
  }

  /**
   *  Delete the post from the group.
   *  On success, filter deleted post from posts state object.
   *
   *  @param {string} post Post to delete
   *  @param {string} group Group name to delete from
   */
  deletePostFetch = (post, group) => {
    axios.post('/manage/posts/delete', {
      post: post,
      group: group,
      user: this.user
    }, {
      headers: {
        "x-csrf-token": this.csrf
      }
    }).then(res => {
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
      this.addUserFetch(newUser, this.groupName, selectedAccess);
    }
  }

  /**
   *  Validate the new user to be added. Return errors through state.
   *
   *  @param {string} newUser New user name to be validated
   *  @returns {boolean} Determines if validation succeeded
   */
  handleUserValidation = (newUser) => {
    let valid = true;
    let errors = {};

    if(!newUser){
      errors["newUser"] = "Cannot be empty";
      valid = false;
    }

    if(valid && !/^[a-z\d\.-]{3,16}$/.test(newUser)) { // eslint-disable-line no-useless-escape
      errors["newUser"] = "Invaid Steem name.";
      valid = false;
    }

    /*//if user exists (check users obj)
    if(valid)) {
      errors["newUser"] = "Must be a valid URL";
      valid = false;
    }*/

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
    axios.post('/manage/users/add', {
      user: this.user,
      newUser: newUser,
      group: group,
      access: access
    }, {
      headers: {
        "x-csrf-token": this.csrf
      }
    }).then(res => {
      if (!res.data.invalidCSRF) {
        if (res.data.user) {
          const {users} = this.state;
          this.setState({
            users: [
              res.data.user,
              ...users,
            ],
            newUser: '',
          });
        }
        this.setState({
          addUserLoading: false,
        });
      }
    }).catch((err) => {
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
    axios.post('/manage/users/delete', {
      group: group,
      user: this.user,
      userToDel: userToDel
    }, {
      headers: {
        "x-csrf-token": this.csrf
      }
    }).then(res => {
      if (res.data) {
        const {users} = this.state;
        const newUsers = users.filter(u => u.user !== userToDel)

        this.setState({
          deletingUser: '',
          users: newUsers
        })
      }/*else error deleting user*/
    }).catch(err => {
      throw new Error('Error deleting user: ', err);
    })
  }

  render() {
    const {
      newPost,
      posts,
      addPostLoading,
      errors,
      postExists,
      users,
      modalOpen,
      modalData,
      newUser,
      userExists,
      addUserLoading,
      deletingPost,
      deletingUser,
    } = this.state;

    const {
      manageGroup,
    } = this.props;

    const access = manageGroup.group.access;

    let addErrorPost = '';
    let addErrorUser = '';

    if (postExists) addErrorPost = <ErrorLabel text={this.existPost} />;
    if (errors["newPost"] !== undefined) addErrorPost = <ErrorLabel text={errors["newPost"]} />;

    if (userExists) addErrorUser = <ErrorLabel text={this.existUser} />;
    if (errors["newUser"] !== undefined) addErrorUser = <ErrorLabel text={errors["newUser"]} />;

    return (
      <React.Fragment>

        <Grid.Row className="header-row">
          <Grid.Column floated='left' width={10}>
            <Header as='h2'>
              <Label size='big' color='blue'>Managing Group:</Label>
              {'   '}
              {manageGroup.group.display}
            </Header>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <div className="">
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

        <Grid.Row className="content">
          <GroupManageUsers
            users={users}
            showModal={this.showModal}
            deletingUser={deletingUser}
            access={access}
          />

          {
            //if logged in user is mod or above, allow adding users to group
            access < 3 &&
            (
              <Grid.Column floated='right' width={6}>
                <Form size="tiny" onSubmit={this.handleSubmitNewUser}>
                  <Form.Group className='right'>
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
                  <Form.Group className='right user-access'>
                    <Picker
                      onChange={this.handleNewUserRoleChange}
                      options={[
                        {key: 0, text: 'Member', value: '3'},
                        {key: 1, text: 'Moderator', value: '2'},
                        {key: 2, text: 'Admin', value: '1'}
                      ]}
                    />
                  </Form.Group>
                </Form>
              </Grid.Column>
            )
          }
        </Grid.Row>

        <Divider />
      </React.Fragment>
    )
  }
}

export default GroupManage;
