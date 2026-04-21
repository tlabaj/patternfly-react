import { Fragment } from 'react';
import { Icon } from '@patternfly/react-core';
import LongArrowAltDownIcon from '@patternfly/react-icons/dist/esm/icons/long-arrow-alt-down-icon';
import RhMicronsCaretRightIcon from '@patternfly/react-icons/dist/esm/icons/rh-microns-caret-right-icon';
import RhUiCaretDownIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-caret-down-icon';
import RhUiSettingsFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-settings-fill-icon';

export const IconBasic: React.FunctionComponent = () => (
  <Fragment>
    <Icon>
      <LongArrowAltDownIcon />
    </Icon>{' '}
    <Icon>
      <RhMicronsCaretRightIcon />
    </Icon>{' '}
    <Icon>
      <RhUiCaretDownIcon />
    </Icon>{' '}
    <Icon>
      <RhUiSettingsFillIcon />
    </Icon>
  </Fragment>
);
