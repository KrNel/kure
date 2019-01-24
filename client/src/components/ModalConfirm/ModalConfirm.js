import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

const ModalConfirm = ({modalOpen, onModalClose, handleModalClick}) => (
  <Modal size='small' open={modalOpen} onClose={onModalClose}>
    <Modal.Header>Delete Your Group</Modal.Header>
    <Modal.Content>
      <p>Are you sure you want to delete your group?</p>
    </Modal.Content>
    <Modal.Actions>
      <Button data-confirm='false' onClick={e => handleModalClick(e)} negative content='No' />
      <Button data-confirm='true' onClick={e => handleModalClick(e)} positive icon='checkmark' labelPosition='right' content='Yes' />
    </Modal.Actions>
  </Modal>
)

export default ModalConfirm
