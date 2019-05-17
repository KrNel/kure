import React from 'react';
import PropTypes from 'prop-types';
import { Label } from "semantic-ui-react";

import Category from './Category'
import './Tags.css';

const Tags = ({tags}) => (
  <ul className='tags'>
    {
      tags.map(tag => (
        <span key={tag}>
          <Label>
            <Category category={tag} />
          </Label>
          <span>{' '}</span>
        </span>
      ))
    }
  </ul>
)

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

Tags.defaultProps = {
  tags: [],
};

export default Tags;
