import React, { Component } from 'react';
import { CaretDownIcon } from '@patternfly/react-icons';
import styles from '@patternfly/patternfly/components/ContextSelector/context-selector.css';
import { css } from '@patternfly/react-styles';
import PropTypes from 'prop-types';
import { KEY_CODES } from '../../helpers/constants';

const propTypes = {
  /** HTML ID of toggle */
  id: PropTypes.string.isRequired,
  /** Classes applied to root element of toggle */
  className: PropTypes.string,
  /** Text that appears in the Context Selector Toggle */
  toggleText: PropTypes.string,
  /** Flag to indicate if menu is opened */
  isOpen: PropTypes.bool,
  /** Callback called when toggle is clicked */
  onToggle: PropTypes.func,
  /** Callback for toggle open on keyboard entry */
  onEnter: PropTypes.func,
  /** Element which wraps toggle */
  parentRef: PropTypes.any,
  /** Forces focus state */
  isFocused: PropTypes.bool,
  /** Forces hover state */
  isHovered: PropTypes.bool,
  /** Forces active state */
  isActive: PropTypes.bool,
  /** Additional props are spread to the container <button> */
  '': PropTypes.any
};

const defaultProps = {
  className: '',
  toggleText: '',
  isOpen: false,
  onEnter: () => {},
  parentRef: null,
  isFocused: false,
  isHovered: false,
  isActive: false,
  onToggle: () => {}
};

class ContextSelectorToggle extends Component {
  componentDidMount = () => {
    document.addEventListener('mousedown', this.onDocClick);
    document.addEventListener('touchstart', this.onDocClick);
    document.addEventListener('keydown', this.onEscPress);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.onDocClick);
    document.removeEventListener('touchstart', this.onDocClick);
    document.removeEventListener('keydown', this.onEscPress);
  };

  onDocClick = event => {
    if (this.props.isOpen && this.props.parentRef && !this.props.parentRef.contains(event.target)) {
      this.props.onToggle && this.props.onToggle(false);
      this.toggle.focus();
    }
  };

  onEscPress = event => {
    const { parentRef } = this.props;
    const keyCode = event.keyCode || event.which;
    if (this.props.isOpen && keyCode === KEY_CODES.ESCAPE_KEY && parentRef && parentRef.contains(event.target)) {
      this.props.onToggle && this.props.onToggle(false);
      this.toggle.focus();
    }
  };

  onKeyDown = event => {
    if (event.keyCode === KEY_CODES.TAB && !this.props.isOpen) return;
    event.preventDefault();
    if (
      (event.keyCode === KEY_CODES.TAB || event.keyCode === KEY_CODES.ENTER || event.key === ' ') &&
      this.props.isOpen
    ) {
      this.props.onToggle(!this.props.isOpen);
    } else if ((event.keyCode === KEY_CODES.ENTER || event.key === ' ') && !this.props.isOpen) {
      this.props.onToggle(!this.props.isOpen);
      this.props.onEnter();
    }
  };

  render() {
    const {
      className,
      toggleText,
      isOpen,
      isFocused,
      isActive,
      isHovered,
      onToggle,
      onEnter,
      parentRef,
      id,
      ...props
    } = this.props;
    return (
      <button
        {...props}
        id={id}
        ref={toggle => {
          this.toggle = toggle;
        }}
        className={css(
          styles.contextSelectorToggle,
          isFocused && styles.modifiers.focus,
          isHovered && styles.modifiers.hover,
          isActive && styles.modifiers.active,
          className
        )}
        type="button"
        onClick={_event => {
          onToggle && onToggle(!isOpen);
        }}
        aria-expanded={isOpen}
        onKeyDown={this.onKeyDown}
      >
        <span className={css(styles.contextSelectorToggleText)}>{toggleText}</span>
        <CaretDownIcon className={css(styles.contextSelectorToggleIcon)} aria-hidden />
      </button>
    );
  }
}

ContextSelectorToggle.propTypes = propTypes;
ContextSelectorToggle.defaultProps = defaultProps;

export default ContextSelectorToggle;
