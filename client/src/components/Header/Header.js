import React from 'react';
import { Grid } from "semantic-ui-react";

import NavMenu from './Nav/NavMenu';
import HelmetComponent from './PageHeader/PageHeader';

const Header = ({loginURL}) => (
  <React.Fragment>
    <HelmetComponent title='KURE - Curation Network Remedy for Steem' description='Kindred United to Reward Everyone' />

    {/*
    //hambuger menu https://codepen.io/markcaron/pen/pPZVWO
    //https://codepen.io/designosis/pen/LbMgya
    */}

    <Grid className="navMenu">
      <Grid.Column>
        <NavMenu loginURL={loginURL} />
      </Grid.Column>
    </Grid>
  </React.Fragment>
)

export default Header;
