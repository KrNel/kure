import React, {Component} from 'react';
import { Grid, Header, Segment, Icon, Form, Divider, Label } from "semantic-ui-react";
import axios from 'axios';

import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import GroupManagePosts from './GroupManagePosts';
import GroupManageUsers from './GroupManageUsers';

class GroupManage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newPost: '',
      posts: props.manageGroup[0].post,
      addPostLoading: false,
      errors: {},
      postExists: false,
      noPosts: true,
      users: props.manageGroup[0].users,
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
console.log('res: ', res)
      if (!res.data.invalidCSRF) {
        if (res.data.exists) {
          this.setState({
            postExists: true,
            addPostLoading: false,
          });
        }else {
          this.setState({
            posts: [
              res.data.posts,
              ...this.state.posts,
            ],
            users: [
              res.data.users,
              ...this.state.users,
            ],
            newPost: '',
            postExists: false,
            noPosts: false,
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

    if (this.handleValidation(newPost)) {
      this.setState({addPostLoading: true});
      const user = this.props.user;
      const group = this.props.manageGroup[0].group['name']
      this.addPostFetch(newPost, user, group);
    }
  }

  handleValidation = (newPost) => {
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
      /*groupExists: false,
      exceededGrouplimit: false,
      errors: {}*/
     });
  }

  render() {
    const {
      newPost,
      posts,
      addPostLoading,
      errors,
      postExists,
      noPosts,
      users,
    } = this.state;
console.log('users: ', users)
    /*const {
      isEditGroupLoading,
      loadingGroup,
    } = this.props;*/
    const manageGroup = this.props.manageGroup[0];
    let addError = '';

    if (postExists) addError = <ErrorLabel text={this.existText} />;
    if (errors["newPost"] !== undefined) addError = <ErrorLabel text={errors["newPost"]} />;

    return (
      <React.Fragment>
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
          <GroupManagePosts noPosts={noPosts} posts={posts} />
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
