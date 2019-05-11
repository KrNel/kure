import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from "semantic-ui-react";

import './ToggleView.css';

/**
 *  Shows the grid and list icons when the opposite view is selected.
 *  Calls toggle function when clicked to change selection.
 */
const ToggleView = ({toggleView, showGrid}) => (
  <div className='right'>
    <span className='viewToggle'>
      {'View: '}
      <a href="/view" onClick={event => toggleView(event)}>
        {
          showGrid
          ? <Icon size='large' name='list layout' title='Show list layout' />
        : <Icon size='large' name='grid layout' title='Show grid layout' />
        }
      </a>
    </span>
  </div>
)

ToggleView.propTypes = {
  toggleView: PropTypes.func,
  showGrid: PropTypes.bool,
};

ToggleView.defaultProps = {
  toggleView: () => {},
  showGrid: false,
};

export default ToggleView;
