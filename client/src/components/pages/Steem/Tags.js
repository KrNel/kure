import React from 'react';
import { Label } from "semantic-ui-react";

import Category from './Category'
import './Tags.css';

const Tags = ({tags}) => (
  <ul className='tags'>
    {
      tags.map(tag => (
        <li key={tag}>
          <Label>
            <Category category={tag} />
          </Label>
        </li>
      ))
    }
  </ul>
)

export default Tags;
