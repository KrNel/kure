import React, {Component} from 'react';
import { Button, Modal, Form, Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types'
import Picker from '../Picker/Picker';

/**
 *  Modal popup to confirm user action.
 *
 *  User can choose to confirm the action by clicking Yes or No.
 *
 *  @param {object} props Component props
 *  @param {bool} props.modalOpen Determines if modal is shown or not
 *  @param {function} props.onModalClose Function to hide model when user closes
 *  @param {function} props.handleModalClick Function process action
 *  @param {object} props.modalData Function to set state when choice is made
 *  @returns {Component} Displays a confirm modal component
 */
class ModalGroup extends Component {
  state = {
    addErrorPost: '',
  }

  static getDerivedStateFromProps(props, state) {
    const addErrorPost = props.addErrorPost;
    if (addErrorPost !== state.addErrorPost) {
      return {
        addErrorPost: addErrorPost,
      };
    }
    return null;
  }

  onGroupSelect = (event, {value}) => {
    const { handleGroupSelect } = this.props;
    handleGroupSelect(value);
  }

  onClick = () => {
    this.setState({addErrorPost: ''})
  }

  render() {

    const {modalOpen, onModalClose, handleModalClick, groups, addPostLoading} = this.props;
    const {addErrorPost} = this.state;

    return (
      <Modal size='small' open={modalOpen} onClose={onModalClose}>
        {
          <Dimmer inverted active={addPostLoading}><Loader /></Dimmer>
        }
        <Modal.Header>
          {'Add to Community Group'}
        </Modal.Header>
        <Modal.Content>
          <div>
            {'Select the community you want to add the post to:'}
            <br />
            <br />
            <Form>
              <Form.Group>
                <Picker
                  onClick={this.onClick}
                  onChange={this.onGroupSelect}
                  options={groups}
                  label=''
                  addErrorPost={addErrorPost}
                  type='community'
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button data-confirm='false' onClick={event => handleModalClick(event)} negative content='Cancel' />
          <Button data-confirm='true' onClick={event => handleModalClick(event)} positive content='Add' />
        </Modal.Actions>
      </Modal>
    )
  }
}

ModalGroup.propTypes = {
  modalOpen: PropTypes.bool,
  onModalClose: PropTypes.func,
  handleModalClick: PropTypes.func,
  addErrorPost: PropTypes.string,
  handleGroupSelect: PropTypes.func,
  groups: PropTypes.arrayOf(PropTypes.object.isRequired),
  addPostLoading: PropTypes.bool,
};

ModalGroup.defaultProps = {
  modalOpen: false,
  onModalClose: () => {},
  handleModalClick: () => {},
  addErrorPost: '',
  handleGroupSelect: () => {},
  groups: [],
  addPostLoading: false,
};

export default ModalGroup
