import React from 'react';
import { Grid } from 'semantic-ui-react';

import Editor from './Editor'

const Write = () => (
  <Grid verticalAlign='middle' columns={1} centered>
    <Grid.Row>
      <Grid.Column width={13}>
        <Editor />
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default Write;
