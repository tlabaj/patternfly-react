import { render, screen } from '@testing-library/react';
import { DrawerSection } from '../DrawerSection';
import styles from '@patternfly/react-styles/css/components/Drawer/drawer';

test(`Renders with only class ${styles.drawerSection} by default`, () => {
  render(<DrawerSection>Section content</DrawerSection>);

  expect(screen.getByText('Section content')).toHaveClass(styles.drawerSection, { exact: true });
});

test(`Renders with class ${styles.modifiers.plain} when isPlain is true`, () => {
  render(<DrawerSection isPlain>Section content</DrawerSection>);

  expect(screen.getByText('Section content')).toHaveClass(styles.modifiers.plain);
});
