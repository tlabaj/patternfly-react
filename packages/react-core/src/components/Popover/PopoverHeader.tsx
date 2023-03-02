import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Popover/popover';
import { PopoverHeaderIcon } from './PopoverHeaderIcon';
import { PopoverHeaderText } from './PopoverHeaderText';

export interface PopoverHeaderProps extends Omit<React.HTMLProps<HTMLHeadingElement>, 'size'> {
  /** Content of the popover header. */
  children: React.ReactNode;
  /** Indicates the header contains an icon. */
  icon?: React.ReactNode;
  /** Class to be applied to the header. */
  className?: string;
  /** Heading level of the header title */
  titleHeadingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Severity variants for an alert popover. This modifies the color of the header to match the severity. */
  alertSeverityVariant?: 'default' | 'info' | 'warning' | 'success' | 'danger';
  /** Id of the header */
  id?: string;
  /** Text announced by screen reader when alert severity variant is set to indicate severity level */
  alertSeverityScreenReaderText?: string;
}

export const PopoverHeader: React.FunctionComponent<PopoverHeaderProps> = ({
  children,
  icon,
  className,
  titleHeadingLevel = 'h6',
  alertSeverityVariant,
  id,
  alertSeverityScreenReaderText,
  ...props
}: PopoverHeaderProps) => (
  <header className={css('pf-c-popover__header', className)} id={id} {...props}>
    <div className={css(styles.popoverTitle, icon && 'pf-m-icon')}>
      {icon && <PopoverHeaderIcon>{icon}</PopoverHeaderIcon>}
      <PopoverHeaderText headingLevel={titleHeadingLevel}>
        {alertSeverityVariant && alertSeverityScreenReaderText && (
          <span className="pf-u-screen-reader">{alertSeverityScreenReaderText}</span>
        )}
        {children}
      </PopoverHeaderText>
    </div>
  </header>
);
PopoverHeader.displayName = 'PopoverHeader';
