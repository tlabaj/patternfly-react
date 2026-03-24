import '@testing-library/jest-dom';
import { Fragment } from 'react';
import { render, screen } from '@testing-library/react';

import { Accordion } from '../Accordion';
import { AccordionContext } from '../AccordionContext';
import styles from '@patternfly/react-styles/css/components/Accordion/accordion';

test('Renders without children', () => {
  render(<Accordion data-testid="accordion" />);

  expect(screen.getByTestId('accordion')).toBeVisible();
});

test('Renders children', () => {
  render(<Accordion>Test</Accordion>);

  expect(screen.getByText('Test')).toBeVisible();
});

test('Renders with the passed aria label', () => {
  render(<Accordion aria-label="Accordion test">Test</Accordion>);

  expect(screen.getByText('Test')).toHaveAccessibleName('Accordion test');
});

test('Renders with inherited element props spread to the component', () => {
  render(
    <Fragment>
      <Accordion aria-labelledby="labelling-id">Test</Accordion>
      <p id="labelling-id">Label</p>
    </Fragment>
  );

  expect(screen.getByText('Test')).toHaveAccessibleName('Label');
});

test(`Renders with class ${styles.accordion}`, () => {
  render(<Accordion>Test</Accordion>);

  expect(screen.getByText('Test')).toHaveClass(styles.accordion);
});

test('Renders with custom class names provided via prop', () => {
  render(<Accordion className="test-class">Test</Accordion>);

  expect(screen.getByText('Test')).toHaveClass('test-class');
});

test('Renders Accordion as a "dl" by default', () => {
  render(<Accordion>Test</Accordion>);

  /* these tests asserting a nodeName property aren't my favorite, but dl and div elements don't have implicit aria
  roles for us to select/assert against with something more directly meaningful to user experience */
  expect(screen.getByText('Test')).toHaveProperty('nodeName', 'DL');
});

test('Renders Accordion as a "div" when asDefinitionList is false', () => {
  render(<Accordion asDefinitionList={false}>Test</Accordion>);

  expect(screen.getByText('Test')).toHaveProperty('nodeName', 'DIV');
});

test('Provides a ContentContainer of "dd" in a context by default', () => {
  render(
    <Accordion>
      <AccordionContext.Consumer>{({ ContentContainer }) => String(ContentContainer)}</AccordionContext.Consumer>
    </Accordion>
  );

  expect(screen.getByText('dd')).toBeVisible();
});

test('Provides a ContentContainer of "div" in a context when asDefinitionList is false', () => {
  render(
    <Accordion asDefinitionList={false}>
      <AccordionContext.Consumer>{({ ContentContainer }) => String(ContentContainer)}</AccordionContext.Consumer>
    </Accordion>
  );

  expect(screen.getByText('div')).toBeVisible();
});

test('Provides a ToggleContainer of "dt" in a context by default', () => {
  render(
    <Accordion>
      <AccordionContext.Consumer>{({ ToggleContainer }) => String(ToggleContainer)}</AccordionContext.Consumer>
    </Accordion>
  );

  expect(screen.getByText('dt')).toBeVisible();
});

test('Provides a ToggleContainer of "h3" in a context when asDefinitionList is false', () => {
  render(
    <Accordion asDefinitionList={false}>
      <AccordionContext.Consumer>{({ ToggleContainer }) => String(ToggleContainer)}</AccordionContext.Consumer>
    </Accordion>
  );

  expect(screen.getByText('h3')).toBeVisible();
});

test('Provides a ToggleContainer of "h2" in a context when asDefinitionList is false and headingLevel is "h2"', () => {
  render(
    <Accordion asDefinitionList={false} headingLevel="h2">
      <AccordionContext.Consumer>{({ ToggleContainer }) => String(ToggleContainer)}</AccordionContext.Consumer>
    </Accordion>
  );

  expect(screen.getByText('h2')).toBeVisible();
});

test('Renders without pf-m-bordered by default', () => {
  render(<Accordion>Test</Accordion>);

  expect(screen.getByText('Test')).not.toHaveClass('pf-m-bordered');
});

test('Renders with pf-m-bordered when isBordered=true', () => {
  render(<Accordion isBordered>Test</Accordion>);

  expect(screen.getByText('Test')).toHaveClass('pf-m-bordered');
});

test(`Renders without class ${styles.modifiers.noPlain} by default`, () => {
  render(<Accordion>Test</Accordion>);

  expect(screen.getByText('Test')).not.toHaveClass(styles.modifiers.noPlain);
});

test(`Renders without class ${styles.modifiers.noPlain} when isPlain is undefined`, () => {
  render(<Accordion isPlain={undefined}>Test</Accordion>);

  expect(screen.getByText('Test')).not.toHaveClass(styles.modifiers.noPlain);
});

test(`Renders without class ${styles.modifiers.noPlain} when isPlain=false and glass theme is not applied`, () => {
  render(<Accordion isPlain={false}>Test</Accordion>);

  expect(screen.getByText('Test')).not.toHaveClass(styles.modifiers.noPlain);
});

test(`Renders with class ${styles.modifiers.noPlain} when isPlain=false and glass theme is applied`, () => {
  document.documentElement.classList.add('pf-v6-theme-glass');
  render(<Accordion isPlain={false}>Test</Accordion>);

  expect(screen.getByText('Test')).toHaveClass(styles.modifiers.noPlain);
  document.documentElement.classList.remove('pf-v6-theme-glass');
});

test(`Renders without class ${styles.modifiers.noPlain} when isPlain=true`, () => {
  render(<Accordion isPlain>Test</Accordion>);

  expect(screen.getByText('Test')).not.toHaveClass(styles.modifiers.noPlain);
});

test('Renders without pf-m-display-lg by default', () => {
  render(<Accordion>Test</Accordion>);

  expect(screen.getByText('Test')).not.toHaveClass('pf-m-display-lg');
});

test('Renders with pf-m-display-lg when displaySize="lg"', () => {
  render(<Accordion displaySize="lg">Test</Accordion>);

  expect(screen.getByText('Test')).toHaveClass('pf-m-display-lg');
});

test(`Renders without class ${styles.modifiers.toggleStart} by default`, () => {
  render(<Accordion>Test</Accordion>);

  expect(screen.getByText('Test')).not.toHaveClass(styles.modifiers.toggleStart);
});

test(`Renders with class ${styles.modifiers.toggleStart} when togglePosition='start'`, () => {
  render(<Accordion togglePosition="start">Test</Accordion>);

  expect(screen.getByText('Test')).toHaveClass(styles.modifiers.toggleStart);
});

test('Matches the snapshot', () => {
  const { asFragment } = render(<Accordion aria-label="this is a simple accordion" />);
  expect(asFragment()).toMatchSnapshot();
});
