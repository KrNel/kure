import React from 'react'
import PropTypes from 'prop-types';
import { Form, Select, Label } from "semantic-ui-react";

/**
 *  Dropdown selector for choosing user access/role.
 *
 *  When a new user is created, an access/role can be selected.
 *  Roles are pass into the component through 'options'. Changes are sent
 *  back up component hierarchy to find parent function for updating state.
 *
 *  @param {object} props Component props
 *  @param {object} props.options Array of objects for access roles to choose
 *  @param {function} props.onChange Function to set state when choice is made
 *  @returns {Component} Displays a dropdown menu to choose a user role.
 */
const Picker = ({ options, onChange, onClick, addErrorPost, label, type }) => {
  let controlContent;
  if (type) {
    controlContent =
    (
      <Form.Field
        control={Select}
        placeholder={`Select ${type}`}
        options={options}
        onChange={onChange}
        onClick={onClick}
      />
    );
  }else {
    controlContent =
    (
      <Form.Field
        control={Select}
        defaultValue={options[0].value}
        options={options}
        onChange={onChange}
        onClick={onClick}
      />
    );
  }
  return (
    <React.Fragment>
      {
        (label) ? <Label size='large' color='blue'>{label}</Label> : ''
      }
      {controlContent}
      {addErrorPost}
    </React.Fragment>
  )
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  onClick: PropTypes.func,
  addErrorPost: PropTypes.string,
  type: PropTypes.string,
};

Picker.defaultProps = {
  label: '',
  onClick: () => {},
  addErrorPost: '',
  type: '',
};

export default Picker
