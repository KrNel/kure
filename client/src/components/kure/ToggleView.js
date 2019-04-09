import React from 'react';
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
      <a href="/view" onClick={(e) => toggleView(e)}>
        {
          showGrid
          ? <Icon size='large' name='list layout' />
          : <Icon size='large' name='grid layout' />
        }
      </a>
    </span>
  </div>
)

export default ToggleView;
