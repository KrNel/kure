import React from 'react';
import { Icon } from "semantic-ui-react";

import './ToggleView.css';

const ToggleView = ({toggleView, showGrid}) => (
  <div className='right'>
    <span className='viewToggle'>
      {'View: '}
      <a href="/view" onClick={(e) => toggleView(e)}>
        {
          showGrid
          ? <Icon size='large' name='list' />
          : <Icon size='large' name='grid layout' />
        }
      </a>
    </span>
  </div>
)

export default ToggleView;
