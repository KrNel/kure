import React from 'react';
import { Icon } from "semantic-ui-react";

import './ToggleView.css';

const ToggleView = ({toggleView, showGrid}) => (
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
)

export default ToggleView;
