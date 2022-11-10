import React from 'react';
import {
  OverflowMenu,
  OverflowMenuControl,
  OverflowMenuContent,
  OverflowMenuGroup,
  OverflowMenuItem,
  OverflowMenuDropdownItem,
  MenuToggle,
  Slider
} from '@patternfly/react-core';
import { Dropdown } from '@patternfly/react-core/next';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';

export const OverflowMenuBreakpointOnContainer: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [containerWidth, setContainerWidth] = React.useState(100);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onToggle = (_event: any) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const onChange = (value: number) => {
    setContainerWidth(value);
  };

  const containerStyles = {
    width: `${containerWidth}%`,
    padding: '1rem',
    borderWidth: '2px',
    borderStyle: 'dashed'
  };

  const dropdownItems = [
    <OverflowMenuDropdownItem itemId={0} key="item1" isShared>
      Item 1
    </OverflowMenuDropdownItem>,
    <OverflowMenuDropdownItem itemId={1} key="item2" isShared>
      Item 2
    </OverflowMenuDropdownItem>,
    <OverflowMenuDropdownItem itemId={2} key="item3" isShared>
      Item 3
    </OverflowMenuDropdownItem>,
    <OverflowMenuDropdownItem itemId={3} key="item4" isShared>
      Item 4
    </OverflowMenuDropdownItem>,
    <OverflowMenuDropdownItem itemId={4} key="item5" isShared>
      Item 5
    </OverflowMenuDropdownItem>
  ];

  return (
    <>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div>
          <span id="overflowMenu-hasBreakpointOnContainer-slider-label">Current container width</span>: {containerWidth}
          %
        </div>
        <Slider
          value={containerWidth}
          onChange={onChange}
          max={100}
          min={20}
          step={20}
          showTicks
          showBoundaries={false}
          aria-labelledby="overflowMenu-hasBreakpointOnContainer-slider-label"
        />
      </div>
      <div ref={containerRef} id="breakpoint-reference-container" style={containerStyles}>
        <OverflowMenu breakpointReference={containerRef} breakpoint="sm">
          <OverflowMenuContent>
            <OverflowMenuItem>Item 1</OverflowMenuItem>
            <OverflowMenuItem>Item 2</OverflowMenuItem>
            <OverflowMenuGroup>
              <OverflowMenuItem>Item 3</OverflowMenuItem>
              <OverflowMenuItem>Item 4</OverflowMenuItem>
              <OverflowMenuItem>Item 5</OverflowMenuItem>
            </OverflowMenuGroup>
          </OverflowMenuContent>
          <OverflowMenuControl>
            <Dropdown
              onSelect={onSelect}
              toggle={toggleRef => (
                <MenuToggle
                  ref={toggleRef}
                  aria-label="kebab dropdown toggle"
                  variant="plain"
                  onClick={onToggle}
                  isExpanded={isOpen}
                >
                  <EllipsisVIcon />
                </MenuToggle>
              )}
              isOpen={isOpen}
            >
              {dropdownItems}
            </Dropdown>
          </OverflowMenuControl>
        </OverflowMenu>
      </div>
    </>
  );
};
