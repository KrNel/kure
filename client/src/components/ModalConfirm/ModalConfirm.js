import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types'

/**
 *  Modal popup to confirm user action.
 *
 *  User can choose to confirm the action by clicking Yes or No.
 *
 *  @param {object} props - Component props
 *  @param {bool} props.modalOpen - Determines if modal is shown or not
 *  @param {function} props.onModalClose - Function to hide model when user closes
 *  @param {function} props.handleModalClick - Function process action
 *  @param {object} props.modalData - Function to set state when choice is made
 *  @returns {Component} - Displays a confirm modal component
 */
const ModalConfirm = ({modalOpen, onModalClose, handleModalClick, modalData}) => {
  let title = '';
  let content = '';

  if (modalData !== undefined) {
    if (modalData.group !== undefined) {
      title = 'Group';
      content = modalData.group;
    }else {
      if (modalData.post !== undefined) {
        title = 'Post';
        content = modalData.post
      }else {
        title = 'User';
        content = modalData.user;
      }
    }
  }else title = content = ''

  return (
    <Modal size='small' open={modalOpen} onClose={onModalClose}>
      <Modal.Header>
        {`Delete ${title}`}
      </Modal.Header>
      <Modal.Content>
        <p>
          {'Confirm delete of:'}
          <br />
          <br />
          <strong>
            {content}
          </strong>
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button data-confirm='false' onClick={e => handleModalClick(e)} negative content='No' />
        <Button data-confirm='true' onClick={e => handleModalClick(e)} positive icon='checkmark' labelPosition='right' content='Yes' />
      </Modal.Actions>
    </Modal>
  )
}

ModalConfirm.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  handleModalClick: PropTypes.func.isRequired,
  modalData: PropTypes.shape(PropTypes.object.isRequired).isRequired,
};

export default ModalConfirm
