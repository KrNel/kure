import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Label } from "semantic-ui-react";

/**
 *  Dropdown selector for choosing user access/role.
 *
 *  When a new user is created, an access/role can be selected.
 *
 *  @param {object} props - Component props
 *  @param {object} props.options - Array of objects for access roles to choose
 *  @param {function} props.onChange - Function to set state when choice is made
 *  @returns {Component} - Displays a dropdown menu to choose a user role.
 */
const Picker = ({ options, onChange }) => (

  <React.Fragment>
    <Label size='large' color='blue'>Role:</Label>
    <Form.Field
      control={Select}
      defaultValue={options[0].value}
      options={options}
      onChange={onChange}
    />
  </React.Fragment>
)

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Picker
