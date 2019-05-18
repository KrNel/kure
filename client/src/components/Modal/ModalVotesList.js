import React from 'react';
import { Button, Modal, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import UserCard from '../pages/Steem/UserCard';
import DollarDisplay from '../pages/Steem/DollarDisplay';
import PercentDisplay from '../pages/Steem/PercentDisplay';

import './ModalVotesList.css';

/**
 *  Modal popup to show the full list of voters and data, including
 *  vote value and percentage applied.
 *
 *  @param {bool} modalOpen Determines if modal is shown or not
 *  @param {function} onModalClose Function to hide model when user closes
 *  @param {object} voterData Data sent to modal
 *  @returns {Component} Displays a confirm modal component
 */
const ModalVotesList = ({modalOpen, onModalClose, voterData}) => {
  const { voters, ratio } = voterData;

  const list = !!voters.length && voters.map(vote => {
    const user = vote.voter;

    return (
      <div key={user}>
        <UserCard user={user}>
          <span>
            {`\u00A0\u00A0`}
            <DollarDisplay value={vote.rshares * ratio} />
          </span>

          <span>
            {`\u00A0\u2022\u00A0`}
            <PercentDisplay value={vote.percent / 10000} />
          </span>
        </UserCard>
      </div>
    )
  })

  return (
    <Modal closeIcon size='small' open={modalOpen} onClose={onModalClose} className='votersList'>
      <Modal.Header>
        {voters.length}
        {' Votes'}
      </Modal.Header>
      <Modal.Content>
        {list}
      </Modal.Content>
      <Modal.Actions>
        <Button data-confirm='false' onClick={onModalClose} negative content='Close' />
      </Modal.Actions>
    </Modal>
  )
}

ModalVotesList.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  voterData: PropTypes.shape(PropTypes.object.isRequired).isRequired,
};

export default ModalVotesList
