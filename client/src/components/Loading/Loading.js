import React from 'react';
import { Loader } from "semantic-ui-react";

const Loading = ({size= 'medium', text = ''}) => (
  <Loader active inline='centered' size={size} content={text}/>
);

export default Loading;
