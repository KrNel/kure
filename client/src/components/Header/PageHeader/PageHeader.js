import React from 'react';
import { Helmet } from "react-helmet"

const Header = (props) => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta name='description' content={props.description} />
    </Helmet>
  )
}

export default Header;
