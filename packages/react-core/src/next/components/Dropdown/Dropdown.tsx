import React from 'react';
import styles from '@patternfly/react-styles/css/components/Dropdown/dropdown';
import { css } from '@patternfly/react-styles';
import { Menu, MenuContent, MenuProps } from '../../../components/Menu';
import { Popper } from '../../../helpers/Popper/Popper';

export interface DropdownProps extends MenuProps {
  /** Anything which can be rendered in a dropdown. */
  children?: React.ReactNode;
  /** Classes applied to root element of dropdown. */
  className?: string;
  /** Renderer for a custom dropdown toggle. Forwards a ref to the toggle. */
  toggle?: (toggleRef: React.RefObject<any>) => React.ReactNode;
  /** Flag to indicate if menu is opened.*/
  isOpen?: boolean;
  /** Function callback called when user selects item. */
  onSelect?: (event?: React.MouseEvent<Element, MouseEvent>, itemId?: string | number) => void;
  /** Callback for when the component needs to change the open state of the menu.
   * If this is not provided the component will not close the menu when tab or escape are clicked. */
  onIsOpenChange?: (isOpen: boolean) => void;
  /** Indicates if the menu should be without the outer box-shadow. */
  isPlain?: boolean;
  /** Indicates if the menu should be scrollable. */
  isScrollable?: boolean;
  /** Min width of the menu. */
  minWidth?: string;
}

export const Dropdown: React.FunctionComponent<DropdownProps> = ({
  children,
  className,
  onSelect,
  isOpen,
  toggle,
  onIsOpenChange,
  isPlain,
  isScrollable,
  minWidth,
  ...props
}: DropdownProps) => {
  const localMenuRef = React.useRef<HTMLDivElement>();
  const toggleRef = React.useRef<HTMLButtonElement>();
  const containerRef = React.useRef<HTMLDivElement>();

  const menuRef = (props.innerRef as React.RefObject<HTMLDivElement>) || localMenuRef;
  React.useEffect(() => {
    const handleMenuKeys = (event: KeyboardEvent) => {
      if (!isOpen && toggleRef.current?.contains(event.target as Node)) {
        // toggle was clicked open, focus on first menu item
        if (event.key === 'Enter') {
          setTimeout(() => {
            const firstElement = menuRef.current.querySelector('li > button:not(:disabled)');
            firstElement && (firstElement as HTMLElement).focus();
          }, 0);
        }
      }
      // Close the menu on tab or escape if onIsOpenChange is provided
      if (
        (isOpen && onIsOpenChange && menuRef.current?.contains(event.target as Node)) ||
        toggleRef.current?.contains(event.target as Node)
      ) {
        if (event.key === 'Escape' || event.key === 'Tab') {
          onIsOpenChange(!isOpen);
          toggleRef.current?.focus();
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // If the event is not on the toggle and onIsOpenChange callback is provided, close the menu
      if (isOpen && onIsOpenChange && !toggleRef?.current?.contains(event.target as Node)) {
        if (isOpen && !menuRef.current?.contains(event.target as Node)) {
          onIsOpenChange(false);
        }
      }
    };

    window.addEventListener('keydown', handleMenuKeys);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleMenuKeys);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, menuRef, onIsOpenChange]);

  const menu = (
    // eslint-disable-next-line no-console
    <Menu
      className={css(styles.dropdownMenu, className)}
      ref={menuRef}
      onSelect={(event, itemId) => onSelect(event, itemId)}
      isPlain={isPlain}
      isScrollable={isScrollable}
      {...(minWidth && {
        style: {
          '--pf-c-menu--MinWidth': minWidth
        } as React.CSSProperties
      })}
      {...props}
    >
      <MenuContent>{children}</MenuContent>
    </Menu>
  );
  return (
    <div ref={containerRef}>
      <Popper
        trigger={toggle(toggleRef)}
        popper={menu}
        appendTo={containerRef.current || undefined}
        isVisible={isOpen}
      />
    </div>
  );
};
Dropdown.displayName = 'Dropdown';
