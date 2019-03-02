import React from 'react';
//import { Link } from 'react-router-dom';

const UserLink = ({user}) => (
  <a
    target='_blank'
    rel='noopener noreferrer'
    href={`https://steemit.com/@${user}`}
  >
    {user}
  </a>
)
{/*<Link
  to={'/@'+user}
>
  {user}
</Link>*/}

export default UserLink;
