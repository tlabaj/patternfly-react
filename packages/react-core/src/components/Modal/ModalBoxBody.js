import React from 'react';
import { css } from '@patternfly/react-styles';
import PropTypes from 'prop-types';
import styles from '@patternfly/patternfly-next/components/ModalBox/styles.css';

const propTypes = {
  /** content rendered inside the ModalBoxBody */
  children: PropTypes.node,
  /** additional classes added to the ModalBoxBody */
  className: PropTypes.string
};

const defaultProps = {
  children: null,
  className: ''
};

const ModalBoxBody = ({ children, className, ...props }) => (
  <div
    {...props}
    className={css(styles.modalBoxBody, className)}
    id="modal-description"
  >
    {children}
  </div>
);

ModalBoxBody.propTypes = propTypes;
ModalBoxBody.defaultProps = defaultProps;

export default ModalBoxBody;
