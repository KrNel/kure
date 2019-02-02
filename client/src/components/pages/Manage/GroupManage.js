import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Form, Divider, Label } from "semantic-ui-react";
import axios from 'axios';

import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import GroupManagePosts from './GroupManagePosts';
import GroupManageUsers from './GroupManageUsers';
import ModalConfirm from '../../ModalConfirm/ModalConfirm';

class GroupManage extends Component {

  static propTypes = {
    showModal: PropTypes.func.isRequired,
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
    };

    this.existText = "Post already exists.";
  }

  static getDerivedStateFromProps(props, state) {
    const group = props.manageGroup[0].group['name'];
    if (group !== state.group) {
      return {
        group: group,
        posts: props.manageGroup[0].posts,
        users: props.manageGroup[0].users
      };
    }
    return null;
  }

  addPostFetch = (post, user, group) => {
console.log('addPostFetch: ', post);
    axios.post('/manage/posts/add', {
      post: post,
      user: user,
      group: group
    }, {
      headers: {
        "x-csrf-token": this.props.csrf
      }
    }).then((res) => {
      if (!res.data.invalidCSRF) {
        if (res.data.exists) {
          this.setState({
            postExists: true,
            addPostLoading: false,
          });
        }else if (res.data.post) {
          this.setState({
            posts: [
              res.data.post,
              ...this.state.posts,
            ],
            newPost: '',
            postExists: false,
            addPostLoading: false,
          });
        }else {
          //error adding in db...
          this.setState({
            postExists: false,
            addPostLoading: false,
          });
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleSubmitNewPost = (e) => {
    e.preventDefault();
    const newPost = this.state.newPost.trim();

    if (this.handlePostValidation(newPost)) {
      this.setState({addPostLoading: true});
      const user = this.props.user;
      const group = this.props.manageGroup[0].group['name']
      this.addPostFetch(newPost, user, group);
    }
  }

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

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
      postExists: false,
      errors: {}
     });
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
      const {post} = this.state.modalData;
      this.handleDeletePost(post, this.props.manageGroup[0].group['name'])
    }else this.onModalClose();

  }

  handleDeletePost = (post, group) => {
    //e.preventDefault();
    this.setState({
      modalData: {}
    });
    this.deletePostFetch(post, group);
  }

  deletePostFetch = (post, group) => {
    axios.post('/manage/posts/delete', {
      post: post,
      group: group,
      user: this.props.user
    }, {
      headers: {
        "x-csrf-token": this.props.csrf
      }
    }).then((res) => {
      if (res.data) {
        const {posts} = this.state;
        const newPosts = posts.filter(p => p.st_permlink !== post)
        this.setState({
          posts: newPosts
        })
      }/*else error deleting posts*/
    }).catch(err => {
      console.error(err);
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
    } = this.state;

    const {
      showModal,
    } = this.props;

    const manageGroup = this.props.manageGroup[0];

    let addError = '';

    if (postExists) addError = <ErrorLabel text={this.existText} />;
    if (errors["newPost"] !== undefined) addError = <ErrorLabel text={errors["newPost"]} />;

    return (
      <React.Fragment>

        <Divider />

        <Grid.Row className="header-row">
          <Grid.Column floated='left' width={10}>
            <Header as='h3'>
              <Label size='large' color='blue'>Managing Group:</Label>
              {manageGroup.group.display}
            </Header>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <div className="">
              <Form size="tiny" onSubmit={this.handleSubmitNewPost}>
                <Form.Group style={{float: 'right'}}>
                  <Form.Field>
                    <Form.Input
                      placeholder='Add a post'
                      name='newPost'
                      value={newPost}
                      onChange={this.handleChange}
                      errors={errors}
                      loading={addPostLoading}
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

        <Grid.Row className="content">
          <GroupManagePosts
            posts={posts}
            showModal={this.showModal}
          />
        </Grid.Row>

        <Grid.Row className="content">
          <GroupManageUsers users={users} />
        </Grid.Row>

        <Divider />

      </React.Fragment>
    )
  }
}

export default GroupManage;
