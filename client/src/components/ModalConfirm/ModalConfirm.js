import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

const ModalConfirm = ({modalOpen, onModalClose, handleModalClick, modalData}) => {
  let title = '';
  let content = '';

  if (modalData !== undefined) {
    if (modalData.group !== undefined) {
      title = 'Group'
      content = modalData.group
    }else {
      if (modalData.post !== undefined) {
        title = 'Post'
        content = modalData.post
      }else {
        title = 'User'
        //content = modalData.user
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

export default ModalConfirm
