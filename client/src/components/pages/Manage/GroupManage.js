import React, {Component} from 'react';
import { Grid, Header, Icon, Form, Divider, Label } from "semantic-ui-react";
import axios from 'axios';

import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import GroupManagePosts from './GroupManagePosts';
import GroupManageUsers from './GroupManageUsers';

class GroupManage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newPost: '',
      posts: this.props.manageGroup[0].posts,
      addPostLoading: false,
      errors: {},
      postExists: false,
      users: this.props.manageGroup[0].users,
      group: this.props.manageGroup[0].group['name']
    };

    this.existText = "Post already exists.";
  }

  addPostFetch = (post, user, group) => {
    axios.post('/manage/posts/add', {
      post: post,
      user: user,
      group: group
    }, {
      headers: {
        "x-csrf-token": this.props.csrfToken
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

  /*componentWillReceiveProps(nextProps) {
    if (this.props.manageGroup[0].posts !== this.nextProps.manageGroup[0].posts) {
      this.setState({
        posts: this.nextProps.manageGroup[0].posts,
        users: this.nextProps.manageGroup[0].users,
      })
    }
    if (this.props.manageGroup[0].users !== this.nextProps.manageGroup[0].users) {
      this.setState({
        users: this.nextProps.manageGroup[0].users,
      })
    }
  }*/

  /*componentWillReceiveProps(nextProps) {
    this.setState({
      posts: this.nextProps.manageGroup[0].posts,
      users: this.nextProps.manageGroup[0].users,
    })
  }*/
  static getDerivedStateFromProps(props, state) {
    if (props.manageGroup[0].group['name'] !== state.group) {
      return {
        group: props.manageGroup[0].group['name'],
        posts: props.manageGroup[0].posts
      };
    }
    return null;
  }

  render() {
    const {
      newPost,
      posts,
      addPostLoading,
      errors,
      postExists,
      users,
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
            <Header as='h3'><Label size='large' color='blue'>Managing Group:</Label> {manageGroup.group.display}</Header>
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

        <Grid.Row className="content">
          <GroupManagePosts
            posts={posts}
            showModal={showModal}
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
