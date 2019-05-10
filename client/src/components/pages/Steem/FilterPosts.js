import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from "semantic-ui-react";

import Picker from '../../Picker/Picker';

/**
 *  Displays and sets state for filtering Steem contentActions
 */
class FitlerPosts extends Component {

  static propTypes = {
    handleSubmitFilter: PropTypes.func,
  };

  static defaultProps = {
    handleSubmitFilter: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      selectedFilter: 'created',
    }
  }

  /**
   *  Set state values for when tag input text changes.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} name Name of the element triggering the event
   *  @param {string} value Value of the element triggering the event
   */
  handleChange = (event, { name, value }) => {
    this.setState({
      [name]: value,
     });
  }

  /**
   *  Set state values for when filter option changes.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} value Value of the role selected
   */
  handleFilterSelect = (event, {value}) => {
    this.setState({
      selectedFilter: value
     });
  }

  render() {
    const {
      props: {
        handleSubmitFilter
      },
      state: {
        selectedFilter,
        tag
      }
    } = this;

    const filters = [
      {key: 0, value: 'created', text: 'New'},
      {key: 1, value: 'hot', text: 'Hot'},
      {key: 2, value: 'promoted', text: 'Promoted'},
      {key: 3, value: 'trending', text: 'Trending'}
    ];

    return (
      <div className='controlContent'>
        <Form>
          <Form.Group>
            <Button id='init' color='blue' onClick={() => handleSubmitFilter(selectedFilter, tag)}>Refresh Posts</Button>
            <Picker
              onChange={this.handleFilterSelect}
              options={filters}
              label=''
            />
            <Form.Input
              placeholder='Search a tag'
              name='tag'
              value={tag}
              onChange={this.handleChange}
            />
          </Form.Group>
        </Form>
      </div>
    )
  }

}

export default FitlerPosts;
