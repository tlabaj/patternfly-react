import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/Card/card';
import { css } from '@patternfly/react-styles';
import { useOUIAProps, OUIAProps } from '../../helpers';

export interface CardProps extends React.HTMLProps<HTMLElement>, OUIAProps {
  /** Content rendered inside the Card */
  children?: React.ReactNode;
  /** ID of the Card. Also passed back in the CardHeader onExpand callback. */
  id?: string;
  /** Additional classes added to the Card */
  className?: string;
  /** Sets the base component to render. defaults to div */
  component?: keyof JSX.IntrinsicElements;
  /** Modifies the card to include compact styling. Should not be used with isLarge. */
  isCompact?: boolean;
  /** Modifies the card to include selectable styling */
  isSelectable?: boolean;
  /** Modifies the card to include selected styling */
  isSelected?: boolean;
  /** Modifies the card to include clickable styling */
  isClickable?: boolean;
  /** Modifies a clickable or selectable card to have disabled styling. */
  isDisabled?: boolean;
  /** Modifies the card to be large. Should not be used with isCompact. */
  isLarge?: boolean;
  /** Cause component to consume the available height of its container */
  isFullHeight?: boolean;
  /** Modifies the card to include plain styling; this removes border and background */
  isPlain?: boolean;
  /** Flag indicating if a card is expanded. Modifies the card to be expandable. */
  isExpanded?: boolean;
  /** Card background color variant */
  variant?: 'default' | 'secondary';
  /** Value to overwrite the randomly generated data-ouia-component-id.*/
  ouiaId?: number | string;
  /** Set the value of data-ouia-safe. Only set to true when the component is in a static state, i.e. no animations are occurring. At all other times, this value must be false. */
  ouiaSafe?: boolean;
}

interface CardContextProps {
  cardId: string;
  registerTitleId: (id: string) => void;
  isExpanded: boolean;
  isClickable: boolean;
  isSelectable: boolean;
  isDisabled: boolean;
}

export const CardContext = React.createContext<Partial<CardContextProps>>({
  cardId: '',
  registerTitleId: () => {},
  isExpanded: false,
  isClickable: false,
  isSelectable: false,
  isDisabled: false
});

export const Card: React.FunctionComponent<CardProps> = ({
  children,
  id = '',
  className,
  component = 'div',
  isCompact = false,
  isSelectable = false,
  isClickable = false,
  isDisabled = false,
  isSelected = false,
  isExpanded = false,
  isLarge = false,
  isFullHeight = false,
  isPlain = false,
  variant = 'default',
  ouiaId,
  ouiaSafe = true,

  ...props
}: CardProps) => {
  const Component = component as any;
  const ouiaProps = useOUIAProps(Card.displayName, ouiaId, ouiaSafe);

  if (isCompact && isLarge) {
    // eslint-disable-next-line no-console
    console.warn('Card: Cannot use isCompact with isLarge. Defaulting to isCompact');
    isLarge = false;
  }

  const getSelectableModifiers = () => {
    if (isSelectable && isClickable) {
      return css(styles.modifiers.selectable, styles.modifiers.clickable, isSelected && styles.modifiers.current);
    }

    if (isSelectable) {
      return css(styles.modifiers.selectable, isSelected && styles.modifiers.selected);
    }

    if (isClickable) {
      return css(styles.modifiers.clickable, isSelected && styles.modifiers.selected);
    }

    return '';
  };

  const containsCardTitleChildRef = React.useRef(false);

  const registerTitleId = (id: string) => {
    containsCardTitleChildRef.current = !!id;
  };

  return (
    <CardContext.Provider
      value={{
        cardId: id,
        registerTitleId,
        isExpanded,
        isClickable,
        isSelectable,
        isDisabled
      }}
    >
      <Component
        id={id}
        className={css(
          styles.card,
          isCompact && styles.modifiers.compact,
          isExpanded && styles.modifiers.expanded,
          isLarge && styles.modifiers.displayLg,
          isFullHeight && styles.modifiers.fullHeight,
          isPlain && styles.modifiers.plain,
          variant === 'secondary' && styles.modifiers.secondary,
          getSelectableModifiers(),
          isDisabled && styles.modifiers.disabled,
          className
        )}
        {...props}
        {...ouiaProps}
      >
        {children}
      </Component>
    </CardContext.Provider>
  );
};
Card.displayName = 'Card';
