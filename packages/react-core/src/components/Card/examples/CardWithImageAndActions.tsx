import React from 'react';
import {
  Brand,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  KebabToggle
} from '@patternfly/react-core';
import pfLogo from './pfLogo.svg';

export const CardWithImageAndActions: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const [hasNoOffset, setHasNoOffset] = React.useState<boolean>(false);

  const onSelect = () => {
    setIsOpen(!isOpen);
  };
  const onClick = (checked: boolean) => {
    setIsChecked(checked);
  };
  const toggleOffset = (checked: boolean) => {
    setHasNoOffset(checked);
  };

  const dropdownItems = [
    <DropdownItem key="link">Link</DropdownItem>,
    <DropdownItem key="action" component="button">
      Action
    </DropdownItem>,
    <DropdownItem key="disabled link" isDisabled>
      Disabled Link
    </DropdownItem>,
    <DropdownItem key="disabled action" isDisabled component="button">
      Disabled Action
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem key="separated link">Separated Link</DropdownItem>,
    <DropdownItem key="separated action" component="button">
      Separated Action
    </DropdownItem>
  ];

  const headerActions = (
    <>
      <Dropdown
        onSelect={onSelect}
        toggle={<KebabToggle onToggle={(_event: any, isOpen: boolean) => setIsOpen(isOpen)} />}
        isOpen={isOpen}
        isPlain
        dropdownItems={dropdownItems}
        position={'right'}
      />
      <Checkbox
        isChecked={isChecked}
        onChange={(_event, checked) => onClick(checked)}
        aria-label="card checkbox example"
        id="check-1"
        name="check1"
      />
    </>
  );

  return (
    <>
      <Card>
        <CardHeader actions={{actions: headerActions, hasNoOffset}}>
          <Brand src={pfLogo} alt="PatternFly logo" style={{ height: '50px' }} />
        </CardHeader>
        <CardTitle>Title</CardTitle>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>
      <div style={{ marginTop: '20px' }}>
        <Checkbox
          label="actions hasNoOffset"
          isChecked={hasNoOffset}
          onChange={(_event, checked) => toggleOffset(checked)}
          aria-label="remove actions offset"
          id="toggle-actions-offset"
          name="toggle-actions-offset"
        />
      </div>
    </>
  );
};
