/**
 *  Shows the popup modal for user confirmation.
 */
export const showModal = (e, modalData) => {
  e.preventDefault()
  this.setState({ modalOpen: true, modalData });
}

/**
 *  Hides the popup modal.
 */
export const onModalClose = () => this.setState({ modalOpen: false });
