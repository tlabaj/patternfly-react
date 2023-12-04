import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/ModalBox/modal-box';
import { ModalBoxDescription } from './ModalBoxDescription';
import { ModalBoxTitle } from './ModalBoxTitle';

export interface ModalBoxHeaderProps {
  /** Custom content rendered inside the modal box header. If children are supplied then the tile, tileIconVariant and titleLabel props are ignored. */
  children?: React.ReactNode;
  /** Additional classes added to the modal box header. */
  className?: string;
  /** Description of the modal. */
  description?: React.ReactNode;
  /** Id of the modal box description. */
  descriptorId?: string;
  /** Optional help section for the modal box header. */
  help?: React.ReactNode;
  /** Id of the modal box title. */
  labelId?: string;
  /** Content rendered inside the modal box title. */
  title?: React.ReactNode;
  /** Optional alert icon (or other) to show before the title. When the predefined alert types
   * are used the default styling will be automatically applied. */
  titleIconVariant?: 'success' | 'danger' | 'warning' | 'info' | 'custom' | React.ComponentType<any>;
  /** Optional title label text for screen readers. */
  titleLabel?: string;
}

export const ModalBoxHeader: React.FunctionComponent<ModalBoxHeaderProps> = ({
  children,
  className,
  descriptorId,
  description,
  labelId,
  title,
  titleIconVariant,
  titleLabel,
  help,
  ...props
}: ModalBoxHeaderProps) => {
  const headerContent = children ? (
    children
  ) : (
    <>
      <ModalBoxTitle title={title} titleIconVariant={titleIconVariant} titleLabel={titleLabel} id={labelId} />
      {description && <ModalBoxDescription id={descriptorId}>{description}</ModalBoxDescription>}
    </>
  );

  // TODO: apply variant modifier for icon styling.  Core fix needed first.  similar to this:
  // className={css(className, isVariantIcon(titleIconVariant) && modalStyles.modifiers[titleIconVariant])}
  return (
    <header className={css(styles.modalBoxHeader, help && styles.modifiers.help, className)} {...props}>
      {help && (
        <>
          <div className={css(styles.modalBoxHeaderMain)}>{headerContent}</div>
          <div className={`${styles.modalBoxHeader}-help`}>{help}</div>
        </>
      )}
      {!help && headerContent}
    </header>
  );
};
ModalBoxHeader.displayName = 'ModalBoxHeader';
