import React, {Component}  from 'react';
import PropTypes from 'prop-types'

import { logger } from '../../utils/fetchFunctions';

/**
 *  Handles React-only errors, such as compone lifecycle errors.
 *  User will not see the error on their screen.
 *  Error will be logged in file by sending the error to the server.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  /**
   *  Catch the errors from child components.
   *
   *  @param {object} error Name of the error
   *  @param {object} errorInfo Contains stcak trace info
   */
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    })
    logger('error', {name: error.toString(), message:'', stack: errorInfo})
  }

  render() {
    const {errorInfo} = this.state;
    if (errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
        </div>
      );
    }
    // Normally, just render children
    const {children} = this.props;
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.shape(PropTypes.object.isRequired),
};

ErrorBoundary.defaultProps = {
  children: {}
};

export default ErrorBoundary;
