import React from 'react';
import { Label } from "semantic-ui-react";

const ErrorLabel = ({text}) => {
  return (
    <Label basic color='red' pointing style={{position:"absolute", zIndex: 10}}>
      {text}
    </Label>
  )
}

export default ErrorLabel;
